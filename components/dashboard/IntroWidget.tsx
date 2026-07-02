'use client';

import { profile } from '@/lib/personal-data';
import Avatar from '@/components/chrome/Avatar';

const LINKS = [
  {
    label: 'Résumé',
    href: profile.resume,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2.5h8L19.5 8v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5z" />
        <path d="M14 2.5V8h5.5" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: profile.github,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.57 21.79 24 17.31 24 12 24 5.37 18.63 0 12 0z" />
      </svg>
    ),
  },
];

export default function IntroWidget() {
  return (
    <section className="widget intro" aria-label="Introduction">
      <header className="widget__header">
        <p className="widget__eyebrow">Introduction</p>
      </header>

      <div className="intro__body">
        <div className="intro__avatar">
          <Avatar size={64} />
        </div>
        <div className="intro__text">
          <h1 className="intro__name">{profile.name}</h1>
          <p className="intro__tagline">AI Product Manager who builds the prototype before the PRD exists, and stays close enough to the code to keep both honest.</p>
          <span className="intro__status">
            <span className="intro__status-dot" aria-hidden="true" />
            {profile.availability}
          </span>
          <p className="intro__bio">{profile.bio.pm}</p>

          <dl className="intro__meta">
            <div className="intro__meta-row">
              <dt>Location</dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>

          <div className="intro__links">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="intro__link"
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
              >
                <span className="intro__link-icon" aria-hidden="true">{l.icon}</span>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .widget {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 1.5rem 1.75rem;
        }
        .widget__header {
          margin-bottom: 1.1rem;
        }
        .widget__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pulp);
          margin: 0;
        }

        .intro__body {
          display: flex;
          gap: 1.5rem;
        }
        .intro__avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid var(--chrome-border);
        }
        .intro__text {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          min-width: 0;
        }
        .intro__name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--paper);
          margin: 0;
        }
        .intro__tagline {
          font-family: var(--font-serif);
          font-size: 1.02rem;
          color: var(--accent-deep);
          margin: 0;
        }
        .intro__status {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          width: fit-content;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--status-done-fg);
          background: var(--status-done-bg);
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          margin-top: 0.3rem;
        }
        .intro__status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--status-done-fg);
          flex-shrink: 0;
        }
        .intro__bio {
          font-size: 0.88rem;
          line-height: 1.62;
          color: var(--paper-dim);
          margin: 0.2rem 0 0;
          max-width: 68ch;
        }

        .intro__meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin: 0.5rem 0 0;
        }
        .intro__meta-row {
          display: flex;
          gap: 0.6rem;
          font-size: 0.82rem;
        }
        .intro__meta-row dt {
          color: var(--pulp);
          width: 62px;
          flex-shrink: 0;
        }
        .intro__meta-row dd {
          color: var(--paper);
          margin: 0;
        }

        .intro__links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }
        .intro__link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          border: 1px solid var(--chrome-border);
          color: var(--paper-dim);
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        .intro__link-icon {
          display: flex;
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .intro__link-icon :global(svg) {
          width: 100%;
          height: 100%;
        }
        .intro__link:hover {
          border-color: var(--accent);
          color: var(--accent-deep);
          background: var(--accent-glow);
          transform: translateY(-1px);
        }

        @media (max-width: 560px) {
          .intro__body {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
