'use client';

import Link from 'next/link';
import { projectSpaces } from '@/lib/jira-data';
import StatusChip from '@/components/chrome/StatusChip';
import ProjectIcon from '@/components/project/ProjectIcon';

export default function ProjectsWidget() {
  return (
    <section className="widget projects" aria-label="Projects">
      <header className="widget__header">
        <p className="widget__eyebrow">Projects</p>
        <p className="widget__subhead">Five shipped products, each with a Summary, Backlog, Timeline, and full decision narrative</p>
      </header>

      <div className="projects__grid">
        {projectSpaces.map((p) => {
          const storyCount = p.epics.reduce((n, e) => n + e.stories.length, 0);
          const lastPhase = p.timeline[p.timeline.length - 1];
          return (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="project-card">
              <div className="project-card__top">
                <span className="project-card__mark" aria-hidden="true">
                  <ProjectIcon slug={p.slug} keyPrefix={p.keyPrefix} size={26} />
                </span>
                {lastPhase && <StatusChip status={lastPhase.status} />}
              </div>
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__hero">{p.hero}</p>
              <div className="project-card__meta">
                <span>{p.epics.length} epics</span>
                <span aria-hidden="true">&middot;</span>
                <span>{storyCount} stories</span>
              </div>
              <div className="project-card__stack">
                {p.stack.slice(0, 4).map((s) => (
                  <span key={s} className="project-card__tag">{s}</span>
                ))}
              </div>
            </Link>
          );
        })}
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
        .widget__subhead {
          font-size: 0.8rem;
          color: var(--pulp);
          margin: 0.3rem 0 0;
        }

        .projects__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        /*
         * :global() is required — .project-card is applied to next/link's
         * <Link>, which styled-jsx cannot auto-scope (it only scopes
         * native DOM tags authored directly in this file). Without it,
         * this rule silently never matches and the card falls back to
         * an unstyled block-level anchor.
         */
        :global(.project-card) {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding: 1.1rem 1.2rem;
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          color: inherit;
          transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        :global(.project-card:hover) {
          border-color: var(--accent);
          background: var(--accent-glow);
          box-shadow: 0 6px 16px rgba(23, 43, 77, 0.08);
          transform: translateY(-2px);
        }

        .project-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .project-card__mark {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-card__title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .project-card__hero {
          font-size: 0.83rem;
          color: var(--paper-dim);
          line-height: 1.45;
          margin: 0;
        }
        .project-card__meta {
          display: flex;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--pulp);
        }
        .project-card__stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.2rem;
        }
        .project-card__tag {
          font-size: 0.68rem;
          color: var(--pulp);
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
        }

        @media (max-width: 720px) {
          .projects__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
