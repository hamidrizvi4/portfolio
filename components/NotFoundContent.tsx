'use client';

import Link from 'next/link';

export default function NotFoundContent() {
  return (
    <div className="nf">
      <div className="nf__panel">
        <p className="nf__code">404</p>
        <h1 className="nf__title">This page doesn&apos;t exist</h1>
        <p className="nf__sub">
          Wrong URL, expired link, or a dead-end I forgot to handle.
        </p>
        <div className="nf__actions">
          <Link href="/" className="nf__btn nf__btn--primary">
            Back to dashboard
          </Link>
          <Link href="/projects/lextrack" className="nf__btn nf__btn--ghost">
            View projects
          </Link>
        </div>
      </div>

      <style jsx>{`
        .nf {
          min-height: calc(100vh - 56px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem clamp(1.25rem, 3vw, 2.5rem);
        }
        .nf__panel {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 2.5rem 2.75rem;
          max-width: 440px;
          text-align: center;
        }
        .nf__code {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent);
          margin: 0 0 0.5rem;
        }
        .nf__title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 0.6rem;
        }
        .nf__sub {
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--paper-dim);
          margin: 0 0 1.5rem;
        }
        .nf__actions {
          display: flex;
          justify-content: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        /* :global() required — .nf__btn is next/link's <Link>, which styled-jsx cannot auto-scope. */
        :global(.nf__btn) {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.55rem 1.1rem;
          border-radius: 4px;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        :global(.nf__btn--primary) {
          background: var(--accent);
          color: #ffffff;
        }
        :global(.nf__btn--primary:hover) {
          background: var(--accent-deep);
          color: #ffffff;
        }
        :global(.nf__btn--ghost) {
          color: var(--paper-dim);
          border: 1px solid var(--chrome-border);
        }
        :global(.nf__btn--ghost:hover) {
          background: var(--chrome-hover);
          color: var(--paper);
        }
      `}</style>
    </div>
  );
}
