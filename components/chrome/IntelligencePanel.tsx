'use client';

/**
 * IntelligencePanel.tsx
 *
 * "Ask Hamid" reskinned as Zac, an AI assistant panel styled after
 * Jira's real Atlassian Intelligence surface — a right-docked
 * slide-over instead of a homepage section. Same Gemini-backed
 * /api/chat streaming logic as the original AskHamidChat.
 */

import { useEffect, useRef, useState, FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { profile } from '@/lib/personal-data';

const SUGGESTED_PROMPTS = [
  "What's the most impressive thing on your resume?",
  "Walk me through QuadTax's architecture.",
  'Tell me about a hard product call you made.',
  'How do you balance shipping fast vs. shipping right?',
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface IntelligencePanelProps {
  open: boolean;
  onClose: () => void;
}

let msgCounter = 0;

export default function IntelligencePanel({ open, onClose }: IntelligencePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLLIElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    const container = conversationRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 100) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    msgCounter += 1;
    const userMessage: Message = { id: `user-${msgCounter}`, role: 'user', content: text.trim() };
    msgCounter += 1;
    const assistantMessage: Message = { id: `assistant-${msgCounter}`, role: 'assistant', content: '', isStreaming: true };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

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
              prev.map((m) => (m.id === assistantMessage.id ? { ...m, content: m.content + token } : m))
            );
          } catch {
            // malformed chunk, skip
          }
        }
      }

      setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, isStreaming: false } : m)));
    } catch (err) {
      console.error('Chat error:', err);
      setError('My AI is taking a coffee break.');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: `Gemini is unavailable right now. Reach me directly at ${profile.email}.`, isStreaming: false }
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

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!open) return null;

  const hasMessages = messages.length > 0;

  return (
    <div className="ai-panel" role="dialog" aria-modal="true" aria-label="Ask Zac">
      <div className="ai-panel__scrim" onClick={onClose} />
      <div className="ai-panel__surface">
        <header className="ai-panel__header">
          <div className="ai-panel__title-group">
            <svg className="ai-panel__spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 2 L14.2 9.2 L21 12 L14.2 14.8 L12 22 L9.8 14.8 L3 12 L9.8 9.2 Z" />
            </svg>
            <div>
              <p className="ai-panel__title">Zac</p>
              <p className="ai-panel__subtitle">Knows every project, decision, and number on this site. Gemini 2.5 Flash.</p>
            </div>
          </div>
          <button type="button" className="ai-panel__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </header>

        <div className="ai-panel__conversation" ref={conversationRef}>
          {!hasMessages ? (
            <div className="ai-panel__welcome">
              <p className="ai-panel__welcome-line">Ask about methodology, technical decisions, or a specific call I made. Try one of these:</p>
              <ul className="ai-panel__suggestions">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <li key={prompt}>
                    <button type="button" className="ai-panel__suggestion" onClick={() => sendMessage(prompt)} disabled={isLoading}>
                      {prompt}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="ai-panel__messages" aria-live="polite">
              {messages.map((m) => (
                <li key={m.id} className={`msg msg--${m.role}`}>
                  <span className="msg__label">{m.role === 'user' ? 'YOU' : 'AI'}</span>
                  <div className="msg__content">
                    {m.content}
                    {m.isStreaming && <span className="msg__cursor" aria-hidden="true">▊</span>}
                    {m.isStreaming && !m.content && (
                      <span className="msg__typing" aria-label="thinking">
                        <span className="msg__typing-dot" />
                        <span className="msg__typing-dot" />
                        <span className="msg__typing-dot" />
                      </span>
                    )}
                  </div>
                </li>
              ))}
              <li ref={messagesEndRef} aria-hidden="true" />
            </ul>
          )}
        </div>

        {error && <p className="ai-panel__error">{error}</p>}

        <form className="ai-panel__form" onSubmit={handleSubmit}>
          <textarea
            className="ai-panel__input"
            placeholder="Ask Zac anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            aria-label="Your question"
          />
          <button type="submit" className="ai-panel__send" disabled={isLoading || !input.trim()} aria-label="Send">→</button>
        </form>
      </div>

      <style jsx>{`
        .ai-panel {
          position: fixed;
          inset: 0;
          z-index: 950;
          display: flex;
        }
        .ai-panel__scrim {
          position: fixed;
          inset: 0;
          background: rgba(23, 43, 77, 0.28);
          animation: scrim-in var(--dur-base) var(--ease-out);
        }

        @keyframes scrim-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ai-panel__surface {
          position: relative;
          margin-left: auto;
          width: min(440px, 100vw);
          height: 100%;
          background: var(--ink);
          border-left: 1px solid var(--chrome-border);
          box-shadow: -24px 0 64px rgba(23, 43, 77, 0.16);
          display: flex;
          flex-direction: column;
          animation: slide-in var(--dur-base) var(--ease-drawer);
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .ai-panel__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--chrome-border);
        }
        .ai-panel__title-group {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
        }
        .ai-panel__spark {
          width: 20px;
          height: 20px;
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .ai-panel__title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .ai-panel__subtitle {
          font-size: 0.72rem;
          color: var(--pulp);
          margin: 0.15rem 0 0;
        }
        .ai-panel__close {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pulp);
          flex-shrink: 0;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .ai-panel__close svg {
          width: 16px;
          height: 16px;
        }
        .ai-panel__close:hover {
          background: var(--chrome-hover);
          color: var(--paper);
        }

        .ai-panel__conversation {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
        }

        .ai-panel__welcome-line {
          font-size: 0.85rem;
          color: var(--paper-dim);
          line-height: 1.5;
          margin: 0 0 1rem;
        }
        .ai-panel__suggestions {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ai-panel__suggestion {
          width: 100%;
          text-align: left;
          padding: 0.65rem 0.85rem;
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          color: var(--paper-dim);
          font-size: 0.82rem;
          line-height: 1.4;
        }
        .ai-panel__suggestion:hover {
          border-color: var(--accent);
          color: var(--paper);
          background: var(--accent-glow);
        }
        .ai-panel__suggestion:disabled {
          opacity: 0.5;
        }

        .ai-panel__messages {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .msg {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .msg__label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--pulp);
        }
        .msg--assistant .msg__label {
          color: var(--accent);
        }
        .msg__content {
          color: var(--paper);
          font-size: 0.87rem;
          line-height: 1.55;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .msg--assistant .msg__content {
          padding-left: 0.75rem;
          border-left: 2px solid var(--accent);
        }
        .msg--user .msg__content {
          color: var(--paper-dim);
        }
        .msg__cursor {
          display: inline-block;
          color: var(--accent);
          animation: blink 1s steps(2) infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .msg__typing {
          display: inline-flex;
          gap: 4px;
          padding: 0.3rem 0;
        }
        .msg__typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.4;
          animation: bounce 1.2s ease-in-out infinite;
        }
        .msg__typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .msg__typing-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 60%, 100% { opacity: 0.4; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }

        .ai-panel__error {
          margin: 0;
          padding: 0.6rem 1.25rem;
          font-size: 0.78rem;
          color: var(--accent-deep);
          background: var(--accent-glow);
          border-top: 1px solid var(--chrome-border);
        }

        .ai-panel__form {
          display: flex;
          gap: 0.6rem;
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--chrome-border);
        }
        .ai-panel__input {
          flex: 1;
          padding: 0.65rem 0.85rem;
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          color: var(--paper);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          resize: none;
          transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
        }
        .ai-panel__input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .ai-panel__send {
          width: 38px;
          flex-shrink: 0;
          border-radius: 6px;
          background: var(--accent);
          color: #ffffff;
          font-size: 1.05rem;
        }
        .ai-panel__send:hover {
          background: var(--accent-deep);
        }
        .ai-panel__send:disabled {
          opacity: 0.35;
        }

        @media (max-width: 520px) {
          .ai-panel__surface {
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
