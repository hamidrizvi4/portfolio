'use client';

/**
 * Sidebar.tsx
 *
 * Jira's real left nav: For you / Starred / Projects (expandable, each
 * with Summary · Backlog · Timeline) / Documentation / Dashboards / Teams.
 * Collapses to an icon-only rail when `open` is false, same as the
 * topbar's sidebar-toggle button in real Jira. Project icons stay real
 * navigation links even when collapsed (only the accordion chevron
 * hides), and collapsed icons show a flyout tooltip on hover so the
 * rail stays usable without expanding it.
 */

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { projectSpaces } from '@/lib/jira-data';
import ProjectIcon from '@/components/project/ProjectIcon';

interface SidebarProps {
  open: boolean;
}

const DOCS = [
  {
    label: 'How I Work',
    url: '/docs/how-i-work',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polygon points="15.5 8.5 13 13 8.5 15.5 11 11 15.5 8.5" />
      </>
    ),
  },
  {
    label: 'Career Timeline',
    url: '/docs/career-timeline',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
      </>
    ),
  },
  {
    label: 'Off Duty',
    url: '/docs/off-duty',
    icon: (
      <>
        <circle cx="12" cy="12" r="4.2" />
        <line x1="12" y1="2.5" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21.5" y2="12" />
        <line x1="5.1" y1="5.1" x2="6.9" y2="6.9" />
        <line x1="17.1" y1="17.1" x2="18.9" y2="18.9" />
        <line x1="5.1" y1="18.9" x2="6.9" y2="17.1" />
        <line x1="17.1" y1="6.9" x2="18.9" y2="5.1" />
      </>
    ),
  },
];

interface TooltipState {
  label: string;
  top: number;
  left: number;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ lextrack: true });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const isActive = (url: string) => pathname === url || (url !== '/' && pathname?.startsWith(url));

  const toggleProject = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const showTooltip = (label: string) => (e: React.MouseEvent<HTMLElement>) => {
    if (open || window.innerWidth < 900) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2, left: rect.right + 10 });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <nav className={`sidebar ${open ? '' : 'sidebar--collapsed'}`} aria-label="Primary">
      <div className="sidebar__scroll">
        <Link
          href="/"
          className={`sidebar__item ${pathname === '/' ? 'sidebar__item--active' : ''}`}
          onMouseEnter={showTooltip('For you')}
          onMouseLeave={hideTooltip}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 11 L12 3 L21 11" />
            <path d="M5 10 V21 H19 V10" />
          </svg>
          <span className="sidebar__label">For you</span>
        </Link>

        <Link
          href="/projects/lextrack"
          className={`sidebar__item ${pathname === '/projects/lextrack' ? 'sidebar__item--active' : ''}`}
          onMouseEnter={showTooltip('Starred')}
          onMouseLeave={hideTooltip}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 2 L14.6 9 L22 9.4 L16.3 14.2 L18.2 21.5 L12 17.3 L5.8 21.5 L7.7 14.2 L2 9.4 L9.4 9 Z" />
          </svg>
          <span className="sidebar__label">Starred</span>
        </Link>

        <div className="sidebar__heading">
          <span className="sidebar__label">Projects</span>
        </div>
        <div className="sidebar__group">
          {projectSpaces.map((p) => {
            const isOpen = !!expanded[p.slug];
            return (
              <div key={p.slug} className="sidebar__project">
                <div className="sidebar__project-row">
                  <Link
                    href={`/projects/${p.slug}`}
                    className={`sidebar__item sidebar__project-link ${isActive(`/projects/${p.slug}`) ? 'sidebar__item--active' : ''}`}
                    onMouseEnter={showTooltip(p.title)}
                    onMouseLeave={hideTooltip}
                  >
                    <span className="sidebar__project-mark" aria-hidden="true">
                      <ProjectIcon slug={p.slug} keyPrefix={p.keyPrefix} size={20} />
                    </span>
                    <span className="sidebar__label sidebar__project-title">{p.title}</span>
                  </Link>
                  <button
                    type="button"
                    className="sidebar__project-expand"
                    onClick={() => toggleProject(p.slug)}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${p.title}`}
                  >
                    <svg
                      className={`sidebar__chevron ${isOpen ? 'sidebar__chevron--open' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
                </div>
                <div className={`sidebar__subitems-wrap ${isOpen ? 'sidebar__subitems-wrap--open' : ''}`}>
                  <div className="sidebar__subitems">
                    <Link
                      href={`/projects/${p.slug}`}
                      className={`sidebar__subitem ${pathname === `/projects/${p.slug}` ? 'sidebar__subitem--active' : ''}`}
                    >
                      Summary
                    </Link>
                    <Link
                      href={`/projects/${p.slug}/backlog`}
                      className={`sidebar__subitem ${pathname === `/projects/${p.slug}/backlog` ? 'sidebar__subitem--active' : ''}`}
                    >
                      Backlog
                    </Link>
                    <Link
                      href={`/projects/${p.slug}/timeline`}
                      className={`sidebar__subitem ${pathname === `/projects/${p.slug}/timeline` ? 'sidebar__subitem--active' : ''}`}
                    >
                      Timeline
                    </Link>
                    <Link
                      href={`/projects/${p.slug}/narrative`}
                      className={`sidebar__subitem ${pathname === `/projects/${p.slug}/narrative` ? 'sidebar__subitem--active' : ''}`}
                    >
                      Narrative
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sidebar__heading">
          <span className="sidebar__label">Documentation</span>
        </div>
        <div className="sidebar__group">
          {DOCS.map((d) => (
            <Link
              key={d.url}
              href={d.url}
              className={`sidebar__item ${pathname === d.url ? 'sidebar__item--active' : ''}`}
              onMouseEnter={showTooltip(d.label)}
              onMouseLeave={hideTooltip}
            >
              <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                {d.icon}
              </svg>
              <span className="sidebar__label">{d.label}</span>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className={`sidebar__item ${pathname === '/#dashboard' ? 'sidebar__item--active' : ''}`}
          onMouseEnter={showTooltip('Dashboards')}
          onMouseLeave={hideTooltip}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span className="sidebar__label">Dashboards</span>
        </Link>

        <Link
          href="/teams"
          className={`sidebar__item ${pathname === '/teams' ? 'sidebar__item--active' : ''}`}
          onMouseEnter={showTooltip('Teams')}
          onMouseLeave={hideTooltip}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="9" cy="8" r="3.2" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            <circle cx="17.5" cy="8.5" r="2.6" />
            <path d="M15.5 13.2a5.4 5.4 0 0 1 5.7 5.4" />
          </svg>
          <span className="sidebar__label">Teams</span>
        </Link>
      </div>

      {tooltip &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="sidebar-tooltip" style={{ top: tooltip.top, left: tooltip.left }}>
            {tooltip.label}
          </div>,
          document.body
        )}

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          width: 260px;
          background: var(--chrome-sidebar);
          border-right: 1px solid var(--chrome-border);
          z-index: 800;
          overflow: hidden;
          transition: width var(--dur-base) var(--ease-drawer);
        }
        .sidebar--collapsed {
          width: 56px;
        }
        .sidebar__scroll {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0.9rem 0.6rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        /*
         * :global() is required here because these classes are applied to
         * next/link's <Link>, a custom component — styled-jsx can only
         * auto-scope native DOM tags it sees written directly in this
         * file's JSX (div, nav, span, svg, button), never a child
         * component's own rendered output. Without :global(), these
         * rules silently never match and the Link falls back to
         * default browser layout (e.g. display: block instead of flex).
         */
        :global(.sidebar__item) {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          width: 100%;
          padding: 0.5rem 0.6rem;
          border-radius: 5px;
          color: var(--paper-dim);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          position: relative;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        :global(.sidebar__item:hover) {
          background: var(--chrome-hover);
          color: var(--paper);
        }
        :global(.sidebar__item--active) {
          background: var(--accent-glow);
          color: var(--accent-deep);
        }
        .sidebar__icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .sidebar__heading {
          padding: 0.9rem 0.6rem 0.3rem;
          max-height: 32px;
          overflow: hidden;
          opacity: 1;
          transition: max-height var(--dur-base) var(--ease-out), padding var(--dur-base) var(--ease-out), opacity var(--dur-fast) var(--ease-out);
        }
        .sidebar__heading .sidebar__label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pulp);
          max-width: none;
        }

        .sidebar__group {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .sidebar__project-row {
          display: flex;
          align-items: center;
          gap: 0.1rem;
        }
        :global(.sidebar__project-link) {
          flex: 1;
          min-width: 0;
        }
        .sidebar__project-mark {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sidebar__project-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar__project-expand {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          color: var(--pulp);
          opacity: 1;
          overflow: hidden;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out), width var(--dur-base) var(--ease-out);
        }
        .sidebar__project-expand:hover {
          background: var(--chrome-hover);
          color: var(--paper);
        }
        .sidebar__chevron {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          transition: transform var(--dur-fast) var(--ease-out);
        }
        .sidebar__chevron--open {
          transform: rotate(90deg);
        }

        .sidebar__subitems-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--dur-base) var(--ease-drawer);
        }
        .sidebar__subitems-wrap--open {
          grid-template-rows: 1fr;
        }
        .sidebar__subitems {
          display: flex;
          flex-direction: column;
          padding-left: 2.05rem;
          overflow: hidden;
          min-height: 0;
        }
        :global(.sidebar__subitem) {
          padding: 0.4rem 0.6rem;
          border-radius: 5px;
          font-size: 0.8rem;
          color: var(--pulp);
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        :global(.sidebar__subitem:hover) {
          background: var(--chrome-hover);
          color: var(--paper);
        }
        :global(.sidebar__subitem--active) {
          color: var(--accent-deep);
          font-weight: 600;
        }

        .sidebar__label {
          opacity: 1;
          max-width: 180px;
          overflow: hidden;
          transition: opacity var(--dur-fast) var(--ease-out), max-width var(--dur-base) var(--ease-out);
        }

        .sidebar--collapsed .sidebar__label {
          opacity: 0;
          max-width: 0;
        }
        .sidebar--collapsed .sidebar__heading {
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
          opacity: 0;
        }
        .sidebar--collapsed .sidebar__subitems {
          display: none;
        }
        .sidebar--collapsed .sidebar__project-expand {
          opacity: 0;
          width: 0;
          pointer-events: none;
        }
        .sidebar--collapsed :global(.sidebar__item),
        .sidebar--collapsed :global(.sidebar__project-link) {
          justify-content: center;
        }
        .sidebar--collapsed .sidebar__project-row {
          gap: 0;
        }

        @media (max-width: 900px) {
          .sidebar {
            transform: translateX(-100%);
            width: 260px;
            box-shadow: 0 0 0 2000px rgba(23, 43, 77, 0);
            transition: transform var(--dur-base) var(--ease-drawer);
          }
          .sidebar:not(.sidebar--collapsed) {
            transform: translateX(0);
            box-shadow: 12px 0 32px rgba(23, 43, 77, 0.14);
          }
          .sidebar--collapsed {
            width: 260px;
          }
        }
      `}</style>

      <style jsx global>{`
        .sidebar-tooltip {
          position: fixed;
          transform: translateY(-50%);
          background: var(--paper);
          color: #ffffff;
          padding: 0.4rem 0.7rem;
          border-radius: 4px;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(23, 43, 77, 0.22);
          z-index: 1000;
          pointer-events: none;
          animation: sidebar-tooltip-in 120ms ease-out;
        }
        @keyframes sidebar-tooltip-in {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}
