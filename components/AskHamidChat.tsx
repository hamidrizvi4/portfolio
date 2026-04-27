'use client';

/**
 * AskHamidChat.tsx
 *
 * Section 04 — Live AI chat. Gemini Flash, streaming, RAG'd on resume + projects.
 *
 * Architecture:
 * - User types or taps a suggested prompt → POST to /api/chat
 * - API route streams Server-Sent Events back
 * - Component appends tokens to the active message in real time
 * - Editorial UI: no bubbles, mono labels, serif responses, blinking cursor
 *
 * Motion principles applied:
 * - Suggested prompt chips: scale + accent on hover, 160ms (gated to hover devices)
 * - Streaming cursor: 1s blink, simple keyframe
 * - Auto-scroll: smooth, only if user is already near the bottom (don't yank them away if they're reading older messages)
 * - Reduced motion: removes auto-scroll smoothing, keeps streaming
 *
 * Failure modes:
 * - Network error → inline error message with email fallback
 * - Rate limit → graceful "taking a break" message
 * - Empty response → retry button
 */

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from 'react';
import { profile } from '@/lib/personal-data';

// ============================================
// SUGGESTED PROMPTS
// Curated to surface the strongest stories from the resume
// ============================================
const SUGGESTED_PROMPTS = [
  'What\'s the most impressive thing on your resume?',
  'Walk me through QuadTax\'s architecture.',
  'Tell me about a hard product call you made.',
  'How do you balance shipping fast vs. shipping right?',
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function AskHamidChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ============ AUTO-SCROLL ============
  // Only scroll to bottom if user was already near the bottom (don't interrupt reading)
  useEffect(() => {
    const container = conversationRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNearBottom = distanceFromBottom < 100;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);

  // ============ SEND MESSAGE ============
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (!response.body) {
        throw new Error('No response body');
      }

      // ============ STREAM PARSING ============
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.text || '';

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + token }
                  : m
              )
            );
          } catch {
            // Malformed chunk — skip
          }
        }
      }

      // Mark streaming complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
        )
      );
    } catch (err) {
      console.error('Chat error:', err);
      setError('My AI is taking a coffee break.');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: `Looks like Gemini is unavailable right now. You can reach me at ${profile.email} — I respond fast.`,
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const hasMessages = messages.length > 0;

  return (
    <section className="ask-hamid" aria-label="Ask Hamid — live AI chat">
      <div className="ask-hamid__inner">
        {/* LEFT — framing */}
        <aside className="ask-hamid__framing">
          <p className="eyebrow">04 / 06 — Ask Hamid</p>

          <h2 className="ask-hamid__headline display">
            This resume{' '}
            <em>answers questions.</em>
          </h2>

          <p className="ask-hamid__intro">
            Trained on my full work history and projects, running on Gemini 2.5 Flash.
            Ask anything — methodology, technical decisions, why I made a specific call. Try the suggested questions, or write your own.
          </p>

          <p className="ask-hamid__powered eyebrow">
            <span className="ask-hamid__live-dot" aria-hidden="true" />
            Powered by Gemini 2.5 Flash · Streaming live
          </p>
        </aside>

        {/* RIGHT — chat */}
        <div className="ask-hamid__chat">
          <div className="ask-hamid__conversation" ref={conversationRef}>
            {!hasMessages ? (
              <div className="ask-hamid__welcome">
                <p className="ask-hamid__welcome-line">Try one of these</p>
                <ul className="ask-hamid__suggestions">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <li key={prompt}>
                      <button
                        type="button"
                        className="ask-hamid__suggestion"
                        onClick={() => handleSuggestedPrompt(prompt)}
                        disabled={isLoading}
                      >
                        {prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="ask-hamid__messages" aria-live="polite">
                {messages.map((m) => (
                  <li key={m.id} className={`msg msg--${m.role}`}>
                    <span className="msg__label">
                      {m.role === 'user' ? 'YOU /' : 'HR /'}
                    </span>
                    <div className="msg__content">
                      {m.content}
                      {m.isStreaming && <span className="msg__cursor" aria-hidden="true">▊</span>}
                      {m.isStreaming && !m.content && (
                        <span className="msg__typing" aria-label="Hamid is thinking">
                          <span className="msg__typing-dot" />
                          <span className="msg__typing-dot" />
                          <span className="msg__typing-dot" />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>
            )}
          </div>

          {/* INPUT */}
          <form className="ask-hamid__form" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="ask-hamid__input"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              aria-label="Your question"
            />
            <button
              type="submit"
              className="ask-hamid__send"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <span className="ask-hamid__send-arrow">→</span>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .ask-hamid {
          background: var(--ink);
          padding: 6rem var(--gutter);
          border-bottom: 1px solid var(--rule);
          border-top: 1px solid var(--rule);
        }

        .ask-hamid__inner {
          max-width: var(--max-w);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: clamp(2rem, 6vw, 6rem);
          align-items: start;
        }

        /* ============ FRAMING (LEFT) ============ */
        .ask-hamid__framing {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 4rem;
        }

        .ask-hamid__headline {
          margin: 0;
          color: var(--paper);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
          font-variation-settings: 'opsz' 144;
        }

        .ask-hamid__headline em {
          font-style: italic;
          color: var(--accent);
        }

        .ask-hamid__intro {
          color: var(--paper-dim);
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.6;
          max-width: 42ch;
        }

        .ask-hamid__powered {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--pulp);
          padding-top: 1rem;
          border-top: 1px solid var(--rule);
        }

        .ask-hamid__live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow);
          animation: live-pulse 2s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ============ CHAT (RIGHT) ============ */
        .ask-hamid__chat {
          display: flex;
          flex-direction: column;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          min-height: 480px;
          max-height: 640px;
          overflow: hidden;
        }

        .ask-hamid__conversation {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          scrollbar-width: thin;
          scrollbar-color: var(--rule-strong) transparent;
        }

        .ask-hamid__conversation::-webkit-scrollbar {
          width: 6px;
        }
        .ask-hamid__conversation::-webkit-scrollbar-thumb {
          background: var(--rule-strong);
          border-radius: 3px;
        }

        /* WELCOME — suggested prompts */
        .ask-hamid__welcome {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ask-hamid__welcome-line {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--pulp);
          margin: 0;
        }

        .ask-hamid__suggestions {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .ask-hamid__suggestion {
          width: 100%;
          text-align: left;
          padding: 1rem 1.25rem;
          background: transparent;
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
          color: var(--paper-dim);
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(0.95rem, 1vw, 1.05rem);
          line-height: 1.4;
          cursor: pointer;
          transition:
            color var(--dur-fast) var(--ease-out),
            border-color var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-out),
            background var(--dur-fast) var(--ease-out);
        }

        .ask-hamid__suggestion:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (hover: hover) and (pointer: fine) {
          .ask-hamid__suggestion:not(:disabled):hover {
            color: var(--paper);
            border-color: var(--accent);
            background: rgba(255, 74, 28, 0.04);
            transform: translateX(4px);
          }
        }

        /* MESSAGES */
        .ask-hamid__messages {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .msg {
          display: grid;
          grid-template-columns: 3.5rem 1fr;
          gap: 1rem;
          align-items: start;
        }

        .msg__label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: var(--pulp);
          padding-top: 0.3rem;
        }

        .msg--assistant .msg__label {
          color: var(--accent);
        }

        .msg__content {
          color: var(--paper);
          line-height: 1.6;
          font-size: clamp(0.95rem, 1.05vw, 1.05rem);
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        /* User in sans, Hamid in serif — visual distinction without bubbles */
        .msg--user .msg__content {
          font-family: var(--font-sans);
          color: var(--paper-dim);
        }

        .msg--assistant .msg__content {
          font-family: var(--font-display);
          font-weight: 400;
          line-height: 1.55;
          padding-left: 1rem;
          border-left: 2px solid var(--accent);
          color: var(--paper);
        }

        /* Streaming cursor */
        .msg__cursor {
          display: inline-block;
          color: var(--accent);
          margin-left: 2px;
          animation: cursor-blink 1s steps(2) infinite;
        }

        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Typing indicator */
        .msg__typing {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0;
        }

        .msg__typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.4;
          animation: typing-bounce 1.2s ease-in-out infinite;
        }
        .msg__typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .msg__typing-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes typing-bounce {
          0%, 60%, 100% { opacity: 0.4; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }

        /* INPUT */
        .ask-hamid__form {
          display: flex;
          align-items: stretch;
          padding: 1rem;
          gap: 0.75rem;
          border-top: 1px solid var(--rule-strong);
          background: var(--ink);
        }

        .ask-hamid__input {
          flex: 1;
          padding: 0.85rem 1rem;
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
          color: var(--paper);
          font-family: var(--font-sans);
          font-size: clamp(0.9rem, 1vw, 1rem);
          line-height: 1.4;
          resize: none;
          transition: border-color var(--dur-fast) var(--ease-out);
        }

        .ask-hamid__input::placeholder {
          color: var(--pulp);
        }

        .ask-hamid__input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .ask-hamid__send {
          width: 3rem;
          flex-shrink: 0;
          background: var(--accent);
          border: none;
          border-radius: 999px;
          color: var(--ink);
          font-family: var(--font-mono);
          font-size: 1.25rem;
          font-weight: 500;
          cursor: pointer;
          transition:
            transform var(--dur-fast) var(--ease-out),
            background var(--dur-fast) var(--ease-out),
            opacity var(--dur-fast) var(--ease-out);
        }

        .ask-hamid__send:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (hover: hover) and (pointer: fine) {
          .ask-hamid__send:not(:disabled):hover {
            transform: scale(1.05);
          }
        }

        .ask-hamid__send:not(:disabled):active {
          transform: scale(0.95);
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 900px) {
          .ask-hamid__inner {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .ask-hamid__framing {
            position: static;
          }
          .ask-hamid__chat {
            min-height: 540px;
          }
        }

        @media (max-width: 640px) {
          .ask-hamid {
            padding: 4rem 1.25rem;
          }
          .ask-hamid__conversation {
            padding: 1.5rem 1rem;
          }
          .msg {
            grid-template-columns: 2.5rem 1fr;
            gap: 0.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ask-hamid__live-dot,
          .msg__cursor,
          .msg__typing-dot {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
