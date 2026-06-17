'use client';

import Link from 'next/link';

export default function NotFoundContent() {
  return (
    <main className="nf">
      <header className="nf__masthead">
        <span className="eyebrow">Hamid Rizvi</span>
      </header>

      <div className="nf__body">
        <p className="eyebrow nf__label">404</p>
        <h1 className="nf__display display">
          This page<br />
          <em>doesn&apos;t exist.</em>
        </h1>
        <p className="nf__sub">
          Wrong URL, expired link, or a dead-end I forgot to handle.
        </p>
        <Link href="/" className="nf__back eyebrow">
          ← Back to the portfolio
        </Link>
      </div>

      <style jsx>{`
        .nf {
          min-height: 100vh;
          background: var(--ink);
          padding: 0 var(--gutter);
          display: flex;
          flex-direction: column;
        }

        .nf__masthead {
          padding: 2rem 0;
          border-bottom: 1px solid var(--rule);
        }

        .nf__body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2rem;
          max-width: 640px;
          padding: 6rem 0;
        }

        .nf__label {
          color: var(--accent);
          font-size: 0.8rem;
          letter-spacing: 0.2em;
        }

        .nf__display {
          margin: 0;
          color: var(--paper);
          font-size: clamp(3rem, 10vw, 7rem);
          font-weight: 300;
          font-style: italic;
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-variation-settings: 'opsz' 144;
        }

        .nf__display :global(em) {
          color: var(--accent);
          font-style: italic;
        }

        .nf__sub {
          color: var(--pulp);
          font-size: clamp(1rem, 1.2vw, 1.1rem);
          line-height: 1.55;
          max-width: 42ch;
          margin: 0;
        }

        .nf__back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--pulp);
          text-decoration: none;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          padding-top: 1rem;
          border-top: 1px solid var(--rule);
          transition: color 160ms ease;
          width: fit-content;
        }
        .nf__back:hover {
          color: var(--accent);
        }
      `}</style>
    </main>
  );
}
