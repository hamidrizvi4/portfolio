'use client';

/**
 * CreateIssueModal.tsx
 *
 * Styled like Jira's real "Create issue" form — but it's the site's
 * actual contact form. Submitting opens a mailto: with the fields
 * pre-filled, so it really sends to hamidrizvi@stern.nyu.edu without
 * needing a backend mail service.
 */

import { useEffect, useState } from 'react';
import { profile } from '@/lib/personal-data';
import Avatar from './Avatar';

const ISSUE_TYPES = ['Job Offer', 'Interview Request', 'Just Saying Hi'] as const;
type IssueType = (typeof ISSUE_TYPES)[number];

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateIssueModal({ open, onClose }: CreateIssueModalProps) {
  const [issueType, setIssueType] = useState<IssueType>('Job Offer');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [sent, setSent] = useState(false);

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

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[${issueType}] ${summary || 'New issue from your portfolio'}`;
    const body = [
      description,
      '',
      '---',
      `Reporter: ${reporterName || 'Not provided'}`,
      `Reply to: ${reporterEmail || 'Not provided'}`,
    ].join('\n');
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Create issue">
      <div className="overlay__scrim" onClick={onClose} />
      <div className="modal">
        <header className="modal__header">
          <h2 className="modal__title">Create issue</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </header>

        {sent ? (
          <div className="modal__sent">
            <p className="modal__sent-title">Your email client should have opened.</p>
            <p className="modal__sent-body">
              If it didn&apos;t, email me directly at{' '}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="modal__form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field__label">Project</label>
              <div className="field__static">
                <span className="project-chip" aria-hidden="true">HR</span>
                Hire Hamid
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="issue-type">Issue Type</label>
              <select
                id="issue-type"
                className="field__select"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
              >
                {ISSUE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="issue-summary">Summary</label>
              <input
                id="issue-summary"
                className="field__input"
                type="text"
                placeholder="e.g. AI PM role at Acme, let's talk"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="issue-description">Description</label>
              <textarea
                id="issue-description"
                className="field__textarea"
                placeholder="What's the role, the team, or what you'd like to chat about?"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field__label" htmlFor="reporter-name">Reporter</label>
                <input
                  id="reporter-name"
                  className="field__input"
                  type="text"
                  placeholder="Your name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="reporter-email">Reply-to email</label>
                <input
                  id="reporter-email"
                  className="field__input"
                  type="email"
                  placeholder="you@company.com"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label">Assignee</label>
              <div className="field__static">
                <Avatar size={24} />
                Hamid Rizvi
              </div>
            </div>

            <footer className="modal__footer">
              <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn--primary">Create</button>
            </footer>
          </form>
        )}
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 5vh 1rem;
          overflow-y: auto;
        }
        .overlay__scrim {
          position: fixed;
          inset: 0;
          background: rgba(23, 43, 77, 0.45);
          backdrop-filter: blur(2px);
          animation: scrim-in var(--dur-base) var(--ease-out);
        }
        .modal {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 560px;
          background: var(--ink);
          border-radius: 6px;
          box-shadow: 0 24px 64px rgba(23, 43, 77, 0.28);
          overflow: hidden;
          animation: modal-in var(--dur-base) var(--ease-drawer);
        }

        @keyframes scrim-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        }
        .modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--chrome-border);
        }
        .modal__title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .modal__close {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pulp);
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .modal__close svg {
          width: 16px;
          height: 16px;
        }
        .modal__close:hover {
          background: var(--chrome-hover);
          color: var(--paper);
        }
        .modal__form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          padding: 1.5rem;
          max-height: 70vh;
          overflow-y: auto;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }
        .field-row {
          display: flex;
          gap: 1rem;
        }
        .field__label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--paper-dim);
        }
        .field__input,
        .field__select,
        .field__textarea {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--paper);
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 4px;
          padding: 0.6rem 0.75rem;
          width: 100%;
          transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
        }
        .field__textarea {
          resize: vertical;
        }
        .field__input:focus,
        .field__select:focus,
        .field__textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .field__static {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: var(--paper);
          padding: 0.4rem 0;
        }
        .project-chip {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          background: var(--accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .modal__footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--chrome-border);
          margin-top: 0.25rem;
        }
        .btn {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.55rem 1.1rem;
          border-radius: 4px;
          transition: background var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        .btn:active {
          transform: scale(0.97);
        }
        .btn--primary {
          background: var(--accent);
          color: #ffffff;
        }
        .btn--primary:hover {
          background: var(--accent-deep);
        }
        .btn--ghost {
          background: transparent;
          color: var(--paper-dim);
        }
        .btn--ghost:hover {
          background: var(--chrome-hover);
        }
        .modal__sent {
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .modal__sent-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .modal__sent-body {
          font-size: 0.9rem;
          color: var(--paper-dim);
          margin: 0 0 0.5rem;
        }
        .modal__sent-body a {
          color: var(--accent);
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .field-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
