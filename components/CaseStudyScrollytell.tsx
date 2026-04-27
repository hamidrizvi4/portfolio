'use client';

/**
 * CaseStudyScrollytell.tsx
 *
 * Section 03 — Pinned-rail scrollytelling for four projects.
 *
 * Architecture:
 * - Each project is its own "chapter" — a flex row with sticky left + scrolling right.
 * - Left rail uses position: sticky, top: top of viewport, pinned while you scroll the right column.
 * - Each right column has 4 cards: Hero, Problem, Build, Impact.
 * - When you scroll past the last card of project N, the next project's chapter starts
 *   and the left rail naturally swaps (because the parent flex item has scrolled past).
 *
 * Motion principles applied (Emil's framework):
 * - Card reveals: opacity + translateY 24px → 0, 420ms, ease-out cubic.
 * - Stagger across cards within a chapter (50ms between siblings if visible together).
 * - Stack chips: scale + accent on hover, 160ms, gated behind hover media query.
 * - Reduced motion: cards just fade, no transform.
 * - All transforms hardware-accelerated.
 */

import { useEffect, useRef, useState } from 'react';
import { caseStudies, type CaseStudy } from '@/lib/personal-data';

// ============================================
// PROJECT NAME — italicizes specific keywords for editorial flair
// ============================================
const ITALIC_KEYWORDS: Record<string, string[]> = {
  lextrack: ['AI'],
  quadtax: ['Tax'],
  analytics: ['Analytics'],
  squirrel: ['AI'],
};

function ProjectName({ name, projectId }: { name: string; projectId: string }) {
  const keywords = ITALIC_KEYWORDS[projectId] || [];
  if (keywords.length === 0) {
    return <span>{name}</span>;
  }

  // Build regex that matches any of the keywords as whole words
  const pattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const parts = name.split(pattern);

  return (
    <span>
      {parts.map((part, i) =>
        keywords.includes(part) ? (
          <em key={i} className="project-name__italic">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
      <style jsx>{`
        .project-name__italic {
          font-style: italic;
          font-weight: 400;
          color: var(--accent);
        }
      `}</style>
    </span>
  );
}

// ============================================
// REVEAL ON ENTER — IntersectionObserver utility hook
// ============================================
function useRevealOnEnter<T extends HTMLElement = HTMLDivElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect(); // One-shot
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}

// ============================================
// CHAPTER — one project's full layout
// ============================================
interface ChapterProps {
  project: CaseStudy;
  isLast: boolean;
}

function Chapter({ project, isLast }: ChapterProps) {
  return (
    <section className="chapter" aria-label={`Case study: ${project.title}`}>
      {/* LEFT RAIL — pinned via sticky */}
      <aside className="chapter__rail">
        <div className="chapter__rail-inner">
          <p className="eyebrow chapter__index">{project.index} / {String(caseStudies.length).padStart(2, '0')}</p>

          <h3 className="chapter__title display">
            <ProjectName name={project.title} projectId={project.id} />
          </h3>

          <div className="chapter__meta">
            <p className="eyebrow chapter__role">{project.role}</p>
            <p className="eyebrow chapter__period">{project.period}</p>
          </div>

          <ul className="chapter__stack" aria-label="Tech stack">
            {project.stack.map((tech) => (
              <li key={tech} className="chapter__chip">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* RIGHT COLUMN — scrolling cards */}
      <div className="chapter__cards">
        <RevealCard delay={0}>
          <p className="card__eyebrow eyebrow">The headline</p>
          <h4 className="card__hero display">{project.hero}</h4>
        </RevealCard>

        <RevealCard delay={50}>
          <p className="card__eyebrow eyebrow">The problem</p>
          <p className="card__body">{project.problem}</p>
        </RevealCard>

        <RevealCard delay={100}>
          <p className="card__eyebrow eyebrow">The build</p>
          <p className="card__body">{project.build}</p>
        </RevealCard>

        <RevealCard delay={150}>
          <p className="card__eyebrow eyebrow">The impact</p>
          <ul className="card__impact">
            {project.impact.map((line, i) => (
              <li key={i} className="card__impact-item">
                <span className="card__impact-bullet" aria-hidden="true">→</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </RevealCard>

        {project.cta && (
          <RevealCard delay={200}>
            <a
              className="card--cta"
              href={project.cta.href}
              target={project.cta.placeholder ? undefined : '_blank'}
              rel={project.cta.placeholder ? undefined : 'noopener noreferrer'}
              onClick={(e) => {
                if (project.cta?.placeholder) {
                  e.preventDefault();
                  showCtaToast('Demo video coming soon — bookmark this page.');
                }
              }}
            >
              <span className="card__eyebrow eyebrow">
                {project.cta.type === 'github' ? 'Source code' : 'Product demo'}
                {project.cta.placeholder ? ' · coming soon' : ''}
              </span>
              <span className="card__cta-row">
                <span className="card__cta-icon" aria-hidden="true">
                  {project.cta.type === 'github' ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.57 21.79 24 17.31 24 12 24 5.37 18.63 0 12 0z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  )}
                </span>
                <span className="card__cta-label">{project.cta.label}</span>
                <span className="card__cta-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          </RevealCard>
        )}
      </div>

      <style jsx>{`
        .chapter {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: clamp(2rem, 6vw, 6rem);
          padding: 8rem var(--gutter) 8rem;
          position: relative;
          ${!isLast ? 'border-bottom: 1px solid var(--rule);' : ''}
        }

        /* LEFT RAIL */
        .chapter__rail {
          position: sticky;
          top: 0;
          height: fit-content;
          align-self: start;
          /* Sticky offset accounts for top padding of section */
          padding-top: 8rem;
          margin-top: -8rem;
        }

        .chapter__rail-inner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 4rem 0;
        }

        .chapter__index {
          color: var(--pulp);
        }

        .chapter__title {
          margin: 0;
          color: var(--paper);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
          font-variation-settings: 'opsz' 144;
        }

        .chapter__meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 1rem;
          border-top: 1px solid var(--rule);
        }

        .chapter__role,
        .chapter__period {
          color: var(--paper-dim);
          font-size: 0.7rem;
        }

        .chapter__period {
          color: var(--pulp);
        }

        .chapter__stack {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .chapter__chip {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.4rem 0.7rem;
          color: var(--paper-dim);
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
          transition:
            color var(--dur-fast) var(--ease-out),
            border-color var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-out);
          cursor: default;
        }

        @media (hover: hover) and (pointer: fine) {
          .chapter__chip:hover {
            color: var(--accent);
            border-color: var(--accent);
            transform: scale(1.05);
          }
        }

        /* RIGHT COLUMN */
        .chapter__cards {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .chapter {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 5rem var(--gutter);
          }

          .chapter__rail {
            position: static;
            padding-top: 0;
            margin-top: 0;
          }

          .chapter__rail-inner {
            padding: 0;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================
// REVEAL CARD — fades in on enter
// ============================================
interface RevealCardProps {
  children: React.ReactNode;
  delay?: number;
}

function RevealCard({ children, delay = 0 }: RevealCardProps) {
  const { ref, revealed } = useRevealOnEnter<HTMLDivElement>(0.3);

  return (
    <div
      ref={ref}
      className={`card ${revealed ? 'is-revealed' : ''}`}
      style={{ transitionDelay: revealed ? `${delay}ms` : '0ms' }}
    >
      {children}

      <style jsx>{`
        .card {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 420ms var(--ease-out),
            transform 420ms var(--ease-out);
          will-change: opacity, transform;
        }

        .card.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .card {
            transform: none;
            transition: opacity 200ms linear;
          }
        }

        .card :global(.card__eyebrow) {
          color: var(--pulp);
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--rule);
        }

        .card :global(.card__hero) {
          margin: 0;
          color: var(--paper);
          font-size: clamp(1.75rem, 3.5vw, 3rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-variation-settings: 'opsz' 144;
        }

        .card :global(.card__body) {
          margin: 0;
          color: var(--paper-dim);
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          line-height: 1.65;
          max-width: 56ch;
        }

        .card :global(.card__impact) {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .card :global(.card__impact-item) {
          display: grid;
          grid-template-columns: 1.5rem 1fr;
          align-items: baseline;
          gap: 0.5rem;
          font-size: clamp(1rem, 1.15vw, 1.1rem);
          line-height: 1.55;
          color: var(--paper-dim);
        }

        .card :global(.card__impact-bullet) {
          color: var(--accent);
          font-family: var(--font-mono);
          font-weight: 500;
        }

        /* CTA card — bordered link to GitHub repo or demo video */
        :global(.card--cta) {
          display: block;
          text-decoration: none;
          color: var(--paper);
          padding: 1.25rem 1.5rem;
          margin-top: 1rem;
          cursor: pointer;
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 74, 28, 0.02) 100%);
          transition:
            border-color var(--dur-fast) var(--ease-out),
            background var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-out);
        }
        :global(.card--cta .card__eyebrow) {
          display: block;
          border-bottom: 1px solid var(--rule);
          color: var(--pulp);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        :global(.card__cta-row) {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1rem;
          padding: 0.25rem 0;
        }
        :global(.card__cta-icon) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--rule-strong);
          color: var(--paper-dim);
          flex-shrink: 0;
          transition:
            border-color var(--dur-fast) var(--ease-out),
            color var(--dur-fast) var(--ease-out),
            background var(--dur-fast) var(--ease-out);
        }
        :global(.card__cta-label) {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.05rem, 1.4vw, 1.3rem);
          color: var(--paper);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        :global(.card__cta-arrow) {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          color: var(--paper-dim);
          flex-shrink: 0;
          transition:
            transform 220ms var(--ease-out),
            color 220ms var(--ease-out);
        }
        @media (hover: hover) and (pointer: fine) {
          :global(.card--cta:hover) {
            border-color: var(--accent);
            background: linear-gradient(135deg, transparent 0%, rgba(255, 74, 28, 0.08) 100%);
            transform: translateY(-2px);
          }
          :global(.card--cta:hover .card__cta-icon) {
            border-color: var(--accent);
            color: var(--accent);
            background: rgba(255, 74, 28, 0.06);
          }
          :global(.card--cta:hover .card__cta-arrow) {
            transform: translate(2px, -2px);
            color: var(--accent);
          }
          :global(.card--cta:hover .card__cta-label) {
            color: var(--accent);
          }
        }
        :global(.card--cta[data-placeholder="true"] .card__cta-icon) { opacity: 0.7; }
        :global(.card--cta[data-placeholder="true"] .card__cta-label) { opacity: 0.85; }
      `}</style>
    </div>
  );
}

// ============================================
// MAIN — the section masthead + chapters
// ============================================
export default function CaseStudyScrollytell() {
  return (
    <section className="case-studies" aria-label="Case studies">
      <header className="case-studies__masthead">
        <span className="eyebrow">03 / 06 — Case studies</span>
        <p className="case-studies__intro display">
          Four projects.{' '}
          <em>Each one ships.</em>
        </p>
      </header>

      <div className="case-studies__chapters">
        {caseStudies.map((project, i) => (
          <Chapter key={project.id} project={project} isLast={i === caseStudies.length - 1} />
        ))}
      </div>

      <style jsx>{`
        .case-studies {
          background: var(--ink);
          position: relative;
        }

        .case-studies__masthead {
          padding: 6rem var(--gutter) 2rem;
          border-bottom: 1px solid var(--rule);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .case-studies__intro {
          margin: 0;
          color: var(--paper);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
          font-variation-settings: 'opsz' 144;
        }

        .case-studies__intro :global(em) {
          font-style: italic;
          color: var(--accent);
        }
      `}</style>
    </section>
  );
}
