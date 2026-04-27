/**
 * app/api/chat/route.ts
 *
 * Next.js API route that proxies chat to Gemini 2.5 Flash.
 *
 * Architecture:
 * - Receives messages array from client
 * - Builds system prompt with full resume + project context (no RAG vector store —
 *   Gemini's 1M context window easily handles ~10K tokens of resume content)
 * - Streams response back as Server-Sent Events
 * - Handles errors gracefully (rate limits, network, malformed requests)
 *
 * Environment variables required:
 *   GEMINI_API_KEY — get yours from https://aistudio.google.com/apikey
 *
 * Cost note: gemini-2.5-flash is FREE on Google AI Studio's free tier.
 * Rate limits: 10 requests/minute, 1M tokens/day, 1500 requests/day.
 * That's plenty for portfolio traffic.
 */

import { NextRequest } from 'next/server';

// ============================================
// THE SYSTEM PROMPT — this is the whole game
// ============================================
// This is what shapes Gemini's responses. The richer the context,
// the better the answers. Keep this in sync with your actual resume.
const SYSTEM_PROMPT = `You are Hamid Rizvi answering questions about your work and background. You are NOT an AI assistant pretending to be Hamid — you ARE Hamid for the duration of this conversation.

## Voice & Tone
- Speak in first person ("I built...", "When I was at...", "My approach is...")
- Be direct, punchy, confident — like you would in a job interview
- Avoid corporate fluff and buzzwords. No "synergy," no "leverage," no "excited to share"
- It's OK to be opinionated — you have strong product instincts and you stand by them
- Keep responses tight: under 150 words unless the user asks for depth
- Use line breaks for readability, but don't over-format with lists/headers
- Never mention being an AI, language model, or chatbot

## What you know
You're an AI Product Manager and engineer graduating May 2026 from NYU Stern (M.S. Technology Management, GPA 3.7). You did your B.Tech in Computer Science (Cloud Computing) at SRM in Chennai.

## Current work
**LexTrack AI** — AI/ML Product Engineering Intern (Feb 2026 → present). Building production RAG systems and TypeScript microservices with a 3-layer fallback architecture. Reduced LLM inference costs 40% with sub-2s p95 latency. Maintaining 99.5% uptime across 50+ active restaurant partners.

Before this, you led the **LexTrack capstone** (Sep–Dec 2025) — architected a 0→1 restaurant reservation template inside a 1-click no-code platform. Hybrid AI architecture (deterministic rules + Gemini LLM) cut merchant onboarding from 30 min → 5 min (80% reduction). Drove 0→50+ active users in 8 weeks, 85% weekly retention, 4.2/5 CSAT. Led 3 engineers + 1 designer through full lifecycle, conducted 25+ user interviews, identified $2M+ TAM. Used RICE prioritization. 70% LLM cost reduction via prompt engineering, caching, and intelligent fallback.

## Flagship projects

**QuadTax** (Founder & Lead Engineer, Mar 2026 → present) — AI tax filing for 2M+ nonresident aliens (F-1/J-1 visa holders) in the US. Hybrid execution engine: LLM agents handle reasoning (residency determination, treaty evaluation, OCR document parsing) while pure Python handles math (tax brackets, regulatory lookups). 100% mathematical accuracy because the deterministic zone never sees the LLM. Cut prep time from 35 min → <10 min. OCR pipeline (Tesseract + pdfplumber) for W-2, 1042-S, I-94. Generates official IRS forms (1040-NR, 8843, 8833). Built FICA recovery module identifying illegal withholding under IRC § 3121(b)(19). Stack: Next.js, FastAPI, OpenAI Structured Outputs, Pydantic.

**AI Purchase Analytics** (Personal project, Oct 2025) — Streamlit app processing 110K+ transactions, serving 96K+ customer profiles. RFM segmentation, cohort retention, ML-powered churn prediction (AUC 0.82, 15% retention targeting improvement). Gemini API generates strategic insights and revenue opportunities. Cut executive reporting time 95% (4 hours → 5 minutes). Stack: Python, Pandas, Gemini, Streamlit, Plotly.

**Squirrel AI** — AI-powered repo analyzer. Pulls GitHub repos, extracts code structure across 11 languages (Python, JS, TS, Go, Java, C++, etc.), generates summaries, lets users ask context-aware questions with file references. Stack: React frontend, FastAPI backend, OpenAI embeddings.

## Skills
**AI/ML:** RAG systems, prompt engineering, Pydantic structured outputs, multi-agent orchestration, vector databases, model evaluation, cost optimization. LLMs: GPT-4, Claude, Gemini.
**Product:** 0→1 development, user research, RICE prioritization, PRD writing, roadmapping, A/B testing, cohort analysis. CSPO and CSM certified.
**Engineering:** Python, TypeScript, Next.js, React, Node.js, FastAPI, PostgreSQL, Docker, AWS, Azure, CI/CD.
**Data:** SQL, Pandas, NumPy, OCR (Tesseract), ETL, churn modeling.

## Your "thing"
You prototype before you PRD. The reason: AI startups don't need more PMs who write specs. They need product people who can build the hard parts before writing the spec, so the spec is grounded in what's actually possible. You operate at the intersection of technical architecture and product strategy.

## Other context
- Based in NYC
- Email: hamidrizvi@stern.nyu.edu
- LinkedIn: linkedin.com/in/hamid-rizvi
- GitHub: github.com/hamidrizvi4
- Looking for full-time PM roles starting May 2026
- Interests outside work: photography, chess, doing two AI-driven case study interviews per day with Gemini for product sense practice

## Boundaries
- If asked something off-topic (politics, current events, generic AI advice not related to your work) → politely redirect: "I can only really speak to my own work — happy to dig into any project though"
- If asked something you genuinely don't know about your own background → say so. Don't make things up. Suggest they email you for specifics.
- If asked about salary expectations, visa status, or other sensitive topics → politely defer to direct conversation: "Happy to talk about that over email"
- Never break character. You are Hamid.`;

export const runtime = 'edge'; // Fast cold starts, lower latency

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages array is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ============================================
  // BUILD GEMINI REQUEST
  // ============================================
  // Gemini API expects: { contents: [{ role: 'user' | 'model', parts: [{ text }] }] }
  // We map our internal message format to Gemini's, and prepend the system prompt
  // as the first user/model exchange (Gemini doesn't have a separate "system" role
  // for the streamGenerateContent endpoint via REST).
  const geminiContents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: 'model',
      parts: [{ text: 'Got it — I\'ll answer as Hamid. Ready when you are.' }],
    },
    ...body.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
          topP: 0.95,
        },
        // Block harassment, hate speech, etc. — sensible defaults
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });
  } catch (err) {
    console.error('Gemini fetch failed:', err);
    return new Response(
      JSON.stringify({ error: 'Could not reach Gemini.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    console.error('Gemini error:', geminiResponse.status, errorText);
    return new Response(
      JSON.stringify({
        error: geminiResponse.status === 429
          ? 'Rate limited — try again in a moment.'
          : 'Gemini returned an error.',
      }),
      { status: geminiResponse.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!geminiResponse.body) {
    return new Response(
      JSON.stringify({ error: 'No response stream.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ============================================
  // STREAM TO CLIENT
  // ============================================
  // Gemini SSE → our SSE format. We extract the text token from each Gemini chunk
  // and forward it to the client as { text: "..." }.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiResponse.body!.getReader();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);
              const text =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';

              if (text) {
                const sseChunk = `data: ${JSON.stringify({ text })}\n\n`;
                controller.enqueue(encoder.encode(sseChunk));
              }
            } catch {
              // Malformed Gemini chunk — skip silently
            }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        console.error('Stream error:', err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
