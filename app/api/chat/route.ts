/**
 * app/api/chat/route.ts
 *
 * Streaming chat for the AI version of Hamid (the hero AskOrb).
 *
 *   POST { messages: { role: 'user' | 'model', text: string }[] }
 *   → 200 text/plain stream of the reply
 *   → 400 { error: 'invalid_request' } · 429 { error: 'rate_limited' }
 *   → 503 { error: 'upstream_busy' }   · 502 { error: 'upstream_error' }
 *   → 504 { error: 'upstream_timeout' }
 *
 * Order: rate limit → validate → open the model stream → pipe plain text.
 * The key is read only here and never reaches the browser. Message contents
 * are never logged; logs carry the model, the prompt path, and status codes.
 */

import { ApiError, GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';
import { buildSystemPrompt } from '@/lib/persona';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Upper bound for the whole function on Vercel; the model call itself is capped lower.
export const maxDuration = 30;

// Measured: a model call once hung for 26s+ before failing, leaving the orb
// "thinking". Cap the upstream call so the client falls back instead.
const UPSTREAM_TIMEOUT_MS = 20_000;

const MAX_MESSAGES = 12;
const MAX_USER_CHARS = 600;
// Replies come back from the client too; cap them so history can't be used to stuff the context.
const MAX_REPLY_CHARS = 4_000;
// Chosen by measurement (Oct 2026, this key): first token in ~0.7s every run,
// passes the persona probes (scope, salary, injection, unknown), and is the
// most honest on unknowns. gemini-3.5-flash swung from 1s to 6s and once hung
// 26s+; gemini-2.5-flash returns 404 for this key.
const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const json = (status: number, error: string) => Response.json({ error }, { status });

function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  const valid = messages.every(
    (m) =>
      m &&
      typeof m.text === 'string' &&
      m.text.trim() !== '' &&
      ((m.role === 'user' && m.text.length <= MAX_USER_CHARS) ||
        (m.role === 'model' && m.text.length <= MAX_REPLY_CHARS)),
  );
  if (!valid || messages[0].role !== 'user' || messages[messages.length - 1].role !== 'user') return null;
  return messages.map(({ role, text }: ChatMessage) => ({ role, text }));
}

function clientIp(req: Request): string {
  // On Vercel the first x-forwarded-for entry is the client address set by the platform.
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

// Models that rejected a system instruction once (some Gemma models do);
// later requests go straight to the persona-as-first-turn path.
const turnPersonaModels = new Set<string>();

async function openStream(ai: GoogleGenAI, model: string, messages: ChatMessage[], signal: AbortSignal) {
  const system = buildSystemPrompt({ firstReply: !messages.some((m) => m.role === 'model') });
  const contents: Content[] = messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  const config = {
    temperature: 0.6,
    maxOutputTokens: 500,
    abortSignal: signal,
    // Gemini 3 models think by default, and thinking tokens count against the
    // 500-token cap: measured, gemini-3.5-flash spent 477 on thinking and cut
    // the answer off at 17 words. MINIMAL fixed that and cut time-to-first-token
    // from 3.3s to 1.1s. Gemma doesn't take this setting.
    ...(model.startsWith('gemini-') && { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } }),
  };

  if (!turnPersonaModels.has(model)) {
    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: { ...config, systemInstruction: system },
      });
      console.info(`[chat] ${model}: system-instruction path`);
      return stream;
    } catch (err) {
      if (!/system.?instruction|developer instruction/i.test((err as Error).message ?? '')) throw err;
      turnPersonaModels.add(model);
    }
  }

  console.info(`[chat] ${model}: persona-as-first-turn path (model rejects system instructions)`);
  return ai.models.generateContentStream({
    model,
    contents: [
      { role: 'user', parts: [{ text: system }] },
      { role: 'model', parts: [{ text: "Understood. I'll answer as the AI version of Hamid and follow those rules." }] },
      ...contents,
    ],
    config,
  });
}

export async function POST(req: Request) {
  // Rate limit first, so malformed requests count too.
  if (!rateLimit(clientIp(req))) return json(429, 'rate_limited');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, 'invalid_request');
  }
  const messages = parseMessages(body);
  if (!messages) return json(400, 'invalid_request');

  // GEMINI_API_KEY is the name the live deployment already uses.
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[chat] no API key configured (GOOGLE_AI_API_KEY)');
    return json(500, 'not_configured');
  }
  const model = process.env.GOOGLE_AI_MODEL || DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey });

  // Abort upstream if the visitor leaves or the call runs past the cap.
  const signal = AbortSignal.any([req.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]);

  let stream: AsyncGenerator<{ text?: string }>;
  try {
    stream = await openStream(ai, model, messages, signal);
  } catch (err) {
    if ((err as Error).name === 'TimeoutError') {
      console.error(`[chat] ${model}: upstream timeout after ${UPSTREAM_TIMEOUT_MS}ms`);
      return json(504, 'upstream_timeout');
    }
    const status = err instanceof ApiError ? err.status : 0;
    console.error(`[chat] ${model}: upstream error ${status || 'network'}`);
    return status === 429 ? json(503, 'upstream_busy') : json(502, 'upstream_error');
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      } catch (err) {
        if (!req.signal.aborted) console.error(`[chat] ${model}: stream interrupted`);
        controller.error(err);
      }
    },
  });

  return new Response(body$, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
