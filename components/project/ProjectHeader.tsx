'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ProjectSpace } from '@/lib/jira-data';
import ProjectIcon from './ProjectIcon';

const TABS = [
  { label: 'Summary', suffix: '' },
  { label: 'Backlog', suffix: '/backlog' },
  { label: 'Timeline', suffix: '/timeline' },
  { label: 'Narrative', suffix: '/narrative' },
];

export default function ProjectHeader({ project }: { project: ProjectSpace }) {
  const pathname = usePathname();
  const base = `/projects/${project.slug}`;

  return (
    <header className="project-header">
      <div className="project-header__top">
        <span className="project-header__mark" aria-hidden="true">
          <ProjectIcon slug={project.slug} keyPrefix={project.keyPrefix} size={40} />
        </span>
        <div>
          <p className="project-header__eyebrow">Projects / {project.title}</p>
          <h1 className="project-header__title">{project.title}</h1>
        </div>
      </div>

      <nav className="project-header__tabs" aria-label="Project views">
        {TABS.map((t) => {
          const href = `${base}${t.suffix}`;
          const active = pathname === href;
          return (
            <Link key={t.label} href={href} className={`project-header__tab ${active ? 'project-header__tab--active' : ''}`}>
              {t.label}
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .project-header {
          padding: 1.5rem clamp(1.25rem, 3vw, 2.5rem) 0;
          max-width: 1320px;
          margin: 0 auto;
        }
        .project-header__top {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.25rem;
        }
        .project-header__mark {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .project-header__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--pulp);
          margin: 0 0 0.2rem;
        }
        .project-header__title {
          font-family: var(--font-display);
          font-size: 1.55rem;
          font-weight: 800;
          color: var(--paper);
          margin: 0;
        }

        .project-header__tabs {
          display: flex;
          gap: 1.75rem;
          border-bottom: 1px solid var(--chrome-border);
        }
        /*
         * :global() is required — these tabs are next/link's <Link>,
         * which styled-jsx cannot auto-scope, so a scoped rule here
         * would silently never match (no hover color, no active
         * underline).
         */
        :global(.project-header__tab) {
          padding: 0.7rem 0.1rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--pulp);
          border-bottom: 2px solid transparent;
          transition: color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
        }
        :global(.project-header__tab:hover) {
          color: var(--paper);
        }
        :global(.project-header__tab--active) {
          color: var(--accent-deep);
          border-bottom-color: var(--accent);
        }
      `}</style>
    </header>
  );
}
