'use client';

/**
 * AskOrb.tsx
 *
 * The hero chatbot: orb, input (with optional voice), suggested-question
 * chips, and a glass answer card that streams the reply.
 *
 * Answers stream from /api/chat as plain text. If the request fails before
 * any text arrives, a clicked chip streams its pre-written answer from the
 * knowledge file instead (so the demo never looks broken); a typed question
 * gets the friendly error line with the email link.
 *
 * Orb state is derived, not stored: error > thinking > speaking > listening
 * (typing or voice) > idle. A dev panel (development, or any URL with
 * ?orb-dev) can force each state for review.
 *
 * Conversation mode: once there are messages, the orb shrinks (a FLIP layout
 * animation, transforms only) and the chips collapse to one scrolling row,
 * so the answer card fits inside the hero instead of pushing it taller.
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUp, Mic } from 'lucide-react';
import Orb, { type OrbState } from './Orb';
import { profile } from '@/lib/personal-data';

interface Prompt {
  question: string;
  fallback: string;
}

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
  kind?: 'error';
}

type Phase = 'idle' | 'thinking' | 'speaking' | 'error';

const VISIBLE_EXCHANGES = 3;
const MAX_CHARS = 600;
// Matches the server's limit; older turns drop off the front.
const MAX_HISTORY = 12;
const ERROR_RECOVERY_MS = 1200;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Streams text out two words at a time with human-ish jitter. */
async function* streamText(text: string, signal: AbortSignal) {
  const words = text.match(/\S+\s*/g) ?? [];
  for (let i = 0; i < words.length; i += 2) {
    if (signal.aborted) return;
    await delay(35 + Math.random() * 70);
    yield words.slice(i, i + 2).join('');
  }
}

/** Streams the reply from /api/chat. Throws on any non-200 or an empty reply. */
async function* fetchAnswer(history: Pick<Message, 'role' | 'text'>[], fail: boolean, signal: AbortSignal) {
  if (fail) throw new Error('simulated failure (dev panel)');
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`chat request failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let received = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) {
      received = true;
      yield text;
    }
  }
  if (!received) throw new Error('empty reply');
}

// Minimal Web Speech API types (not in TypeScript's DOM lib).
interface SpeechResultList {
  length: number;
  [index: number]: { 0: { transcript: string } };
}
interface SpeechRec {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: SpeechResultList }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecCtor = new () => SpeechRec;
const speechCtor = (): SpeechRecCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: SpeechRecCtor; webkitSpeechRecognition?: SpeechRecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

const ORB_STATES: OrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'error'];
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function AskOrb({ prompts }: { prompts: Prompt[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [showOlder, setShowOlder] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [devEnabled, setDevEnabled] = useState(false);
  const [forced, setForced] = useState<OrbState | null>(null);
  const [devAmp, setDevAmp] = useState(0.6);
  const [failNext, setFailNext] = useState(false);

  const idRef = useRef(0);
  const busyRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const rateRef = useRef({ last: 0, cps: 0 });
  const voiceRef = useRef<SpeechRec | null>(null);
  const failNextRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<(text: string, prompt?: Prompt) => void>(() => {});
  const lenis = useLenis();

  useEffect(() => {
    setMicSupported(!!speechCtor());
    setDevEnabled(process.env.NODE_ENV === 'development' || new URLSearchParams(window.location.search).has('orb-dev'));
    return () => {
      abortRef.current?.abort();
      voiceRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    failNextRef.current = failNext;
  }, [failNext]);

  // Keep the newest text in view while it streams.
  useEffect(() => {
    const card = cardRef.current;
    if (card) card.scrollTop = card.scrollHeight;
  }, [messages]);

  // When an answer starts (phones), scroll so the card will fit on screen once it
  // reaches its max height, leaving the input above it in view.
  useEffect(() => {
    const card = cardRef.current;
    if (phase !== 'speaking' || !card) return;
    const maxHeight = parseFloat(getComputedStyle(card).maxHeight) || card.offsetHeight;
    const overflow = card.getBoundingClientRect().top + maxHeight + 16 - window.innerHeight;
    if (overflow > 0) {
      if (lenis) lenis.scrollTo(window.scrollY + overflow);
      else window.scrollBy({ top: overflow });
    }
  }, [phase, lenis]);

  const nextId = () => ++idRef.current;

  /** Amplitude from token arrival rate: smoothed characters per second, normalized. */
  const trackRate = (chars: number) => {
    const r = rateRef.current;
    const now = performance.now();
    const dt = Math.max(now - r.last, 16) / 1000;
    r.last = now;
    r.cps = r.cps * 0.6 + (chars / dt) * 0.4;
    setAmplitude(Math.min(r.cps / 140, 1));
  };

  const send = async (text: string, prompt?: Prompt) => {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busyRef.current) return;
    busyRef.current = true;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const fail = failNextRef.current;
    if (fail) setFailNext(false);

    // History for the model: real turns only (no error cards), starting on a user turn.
    const history = [...messages, { id: 0, role: 'user' as const, text: question }]
      .filter((m) => !m.kind && m.text.trim())
      .map(({ role, text }) => ({ role, text }))
      .slice(-MAX_HISTORY);
    while (history.length && history[0].role !== 'user') history.shift();

    setInput('');
    setShowOlder(false);
    setMessages((m) => [...m, { id: nextId(), role: 'user', text: question }]);
    setPhase('thinking');
    rateRef.current = { last: performance.now(), cps: 0 };

    let modelId: number | null = null;
    const onChunk = (chunk: string) => {
      if (modelId === null) {
        const id = nextId();
        modelId = id;
        setPhase('speaking');
        setMessages((m) => [...m, { id, role: 'model', text: chunk }]);
      } else {
        const id = modelId;
        setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: msg.text + chunk } : msg)));
      }
      trackRate(chunk.length);
    };

    try {
      for await (const chunk of fetchAnswer(history, fail, ctrl.signal)) onChunk(chunk);
    } catch {
      if (!ctrl.signal.aborted) {
        if (prompt && modelId === null) {
          // A chip's pre-written answer, so the demo never looks broken.
          for await (const chunk of streamText(prompt.fallback, ctrl.signal)) onChunk(chunk);
        } else {
          setPhase('error');
          setMessages((m) => [...m, { id: nextId(), role: 'model', text: '', kind: 'error' }]);
          await delay(ERROR_RECOVERY_MS);
        }
      }
    } finally {
      busyRef.current = false;
      setPhase('idle');
      setAmplitude(0);
    }
  };
  sendRef.current = send;

  const toggleVoice = () => {
    if (voiceRef.current) {
      voiceRef.current.stop();
      return;
    }
    const Ctor = speechCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    let transcript = '';
    rec.onresult = (e) => {
      transcript = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join('');
      setInput(transcript);
    };
    rec.onerror = () => {};
    rec.onend = () => {
      voiceRef.current = null;
      setVoiceOn(false);
      if (transcript.trim()) sendRef.current(transcript);
    };
    voiceRef.current = rec;
    setVoiceOn(true);
    rec.start();
  };

  const busy = phase !== 'idle';
  const liveState: OrbState =
    phase === 'error'
      ? 'error'
      : phase === 'thinking'
        ? 'thinking'
        : phase === 'speaking'
          ? 'speaking'
          : voiceOn || (focused && input.trim())
            ? 'listening'
            : 'idle';
  const orbState = forced ?? liveState;
  const orbAmplitude = forced === 'speaking' ? devAmp : amplitude;

  // Group into exchanges (a question plus its answer); older ones collapse.
  const exchanges: Message[][] = [];
  for (const m of messages) {
    if (m.role === 'user' || exchanges.length === 0) exchanges.push([m]);
    else exchanges[exchanges.length - 1].push(m);
  }
  const hiddenCount = showOlder ? 0 : Math.max(exchanges.length - VISIBLE_EXCHANGES, 0);
  const lastMessage = messages[messages.length - 1];

  const status =
    phase === 'thinking' ? 'Thinking' : phase === 'error' ? 'Something went wrong' : voiceOn ? 'Listening' : '';
  const conversing = messages.length > 0;

  return (
    <div className="flex flex-col items-stretch">
      <motion.div
        layout
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className={`mx-auto ${
          conversing
            ? 'w-[clamp(96px,min(28vw,14svh),140px)] md:w-[clamp(120px,min(14vw,18svh),200px)]'
            : 'w-[clamp(120px,min(42vw,24svh),200px)] md:w-[clamp(180px,min(26vw,34svh),360px)]'
        }`}
      >
        <Orb state={orbState} amplitude={orbAmplitude} className="w-full" />
      </motion.div>
      <p className="sr-only" role="status">
        {status}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-6 flex items-center gap-1.5 rounded-full border border-rule bg-ink-2/60 py-1.5 pl-5 pr-1.5 transition-colors duration-fast focus-within:border-camel"
      >
        <label htmlFor="ask-orb-input" className="sr-only">
          Ask the AI version of Hamid a question
        </label>
        <input
          id="ask-orb-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={MAX_CHARS}
          autoComplete="off"
          placeholder="Ask me anything — my systems, my process, what broke"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-beige placeholder:text-camel focus:outline-none"
        />
        {micSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            disabled={busy}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? 'Stop voice input' : 'Ask by voice'}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-camel transition-colors duration-fast hover:text-beige disabled:opacity-40 aria-pressed:bg-burgundy aria-pressed:text-beige"
          >
            <Mic size={18} aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          disabled={!input.trim() || busy}
          aria-label="Send question"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-beige text-ink transition-opacity duration-fast disabled:opacity-40"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      </form>

      {/* One scrolling row on phones and during a conversation (saves hero height); wrapped otherwise. */}
      <div
        data-lenis-prevent
        className={`-mx-gutter mt-3 flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] md:mx-0 md:px-0 ${
          conversing ? '' : 'md:flex-wrap md:overflow-visible'
        }`}
      >
        {prompts.map((p) => (
          <button
            key={p.question}
            type="button"
            disabled={busy}
            onClick={() => send(p.question, p)}
            className="shrink-0 rounded-full border border-rule px-3.5 py-1.5 text-sm text-camel transition-colors duration-fast hover:border-camel hover:text-beige disabled:opacity-50"
          >
            {p.question}
          </button>
        ))}
      </div>

      {messages.length > 0 && (
        <div
          ref={cardRef}
          data-lenis-prevent
          aria-live="polite"
          aria-busy={phase === 'thinking' || phase === 'speaking'}
          className="mt-4 max-h-[44svh] overflow-y-auto rounded-2xl border border-rule bg-ink-2/70 p-5 backdrop-blur-[16px] md:max-h-[min(36svh,24rem)]"
        >
          {hiddenCount > 0 && (
            <button type="button" onClick={() => setShowOlder(true)} className="label mb-4 hover:!text-beige">
              [ Show {hiddenCount} earlier {hiddenCount === 1 ? 'question' : 'questions'} ]
            </button>
          )}
          <ol className="flex flex-col gap-5">
            {exchanges.slice(hiddenCount).map((exchange) => (
              <li key={exchange[0].id} className="flex flex-col gap-2">
                {exchange.map((m) =>
                  m.role === 'user' ? (
                    <p key={m.id} className="text-sm italic text-camel">
                      {m.text}
                    </p>
                  ) : m.kind === 'error' ? (
                    <p key={m.id} className="leading-relaxed text-beige">
                      I&apos;m getting a lot of questions right now — try again in a minute, or{' '}
                      <a href={`mailto:${profile.email}`} className="underline decoration-burgundy-bright underline-offset-4">
                        email me
                      </a>
                      .
                    </p>
                  ) : (
                    <p key={m.id} className="whitespace-pre-line leading-relaxed text-beige">
                      {m.text}
                      {phase === 'speaking' && m === lastMessage && (
                        <span
                          aria-hidden="true"
                          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-burgundy-bright"
                        />
                      )}
                    </p>
                  ),
                )}
              </li>
            ))}
          </ol>
          {phase === 'thinking' && (
            <p className="label mt-4" aria-hidden="true">
              [ Thinking ]
            </p>
          )}
        </div>
      )}

      <p className="label mt-3 !text-[0.68rem] normal-case tracking-[0.02em]">
        AI version of Hamid · trained on my work history · may be imperfect
      </p>

      {devEnabled && (
        <div className="fixed bottom-4 right-4 z-[70] w-64 rounded-xl border border-rule bg-ink-2 p-3 font-mono text-xs text-camel">
          <p className="mb-2 uppercase tracking-[0.12em]">[ Orb dev ]</p>
          <div className="flex flex-wrap gap-1">
            {[null, ...ORB_STATES].map((s) => (
              <button
                key={s ?? 'auto'}
                type="button"
                aria-pressed={forced === s}
                onClick={() => setForced(s)}
                className="rounded border border-rule px-2 py-1 hover:text-beige aria-pressed:border-camel aria-pressed:text-beige"
              >
                {s ?? 'auto'}
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2">
            amp
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={devAmp}
              onChange={(e) => setDevAmp(Number(e.target.value))}
              className="flex-1 accent-[var(--burgundy-bright)]"
            />
          </label>
          <label className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} />
            fail next request
          </label>
        </div>
      )}
    </div>
  );
}
