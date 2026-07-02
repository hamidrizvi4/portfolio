'use client';

export default function DocPage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="doc-page">
      <header className="doc-page__header">
        <p className="doc-page__eyebrow">{eyebrow}</p>
        <h1 className="doc-page__title">{title}</h1>
        {subtitle && <p className="doc-page__subtitle">{subtitle}</p>}
      </header>
      <div className="doc-page__body">{children}</div>

      <style jsx>{`
        .doc-page {
          padding: 1.75rem clamp(1.25rem, 3vw, 2.5rem) 4rem;
          max-width: 920px;
          margin: 0 auto;
        }
        .doc-page__header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--chrome-border);
        }
        .doc-page__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--pulp);
          margin: 0 0 0.5rem;
        }
        .doc-page__title {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 3.5vw, 2.6rem);
          font-weight: 800;
          color: var(--paper);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .doc-page__subtitle {
          font-size: 0.98rem;
          color: var(--pulp);
          margin: 0.6rem 0 0;
          max-width: 60ch;
        }
        .doc-page__body {
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }
      `}</style>
    </div>
  );
}
