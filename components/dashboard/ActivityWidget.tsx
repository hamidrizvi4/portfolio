'use client';

import { projectSpaces } from '@/lib/jira-data';
import StatusChip from '@/components/chrome/StatusChip';

// Hand-ordered by real-world recency (most recent project work first),
// same window precision as the résumé (no fabricated timestamps).
const RECENCY_ORDER = ['triage', 'quadtax', 'equiply', 'lextrack', 'analytics', 'squirrel'];

interface ActivityEntry {
  key: string;
  projectTitle: string;
  phaseLabel: string;
  window: string;
  status: 'Done' | 'In Progress' | 'To Do';
  phaseCount: number;
}

// One row per project (its current phase), not every phase, so this
// reads as a distinct "what's live right now" cut rather than the
// Timeline tab's full phase-by-phase breakdown repeated on the dashboard.
function buildFeed(): ActivityEntry[] {
  const bySlug = new Map(projectSpaces.map((p) => [p.slug, p]));
  return RECENCY_ORDER.map((slug) => {
    const p = bySlug.get(slug);
    if (!p) return null;
    const current = p.timeline[p.timeline.length - 1];
    if (!current) return null;
    return {
      key: `${p.keyPrefix}-current`,
      projectTitle: p.title,
      phaseLabel: current.label,
      window: current.window,
      status: current.status,
      phaseCount: p.timeline.length,
    };
  }).filter((entry): entry is ActivityEntry => entry !== null);
}

export default function ActivityWidget() {
  const feed = buildFeed();

  return (
    <section className="widget activity" aria-label="Activity stream">
      <header className="widget__header">
        <p className="widget__eyebrow">Activity stream</p>
        <p className="widget__subhead">Where each project stands right now</p>
      </header>

      <ul className="activity__list">
        {feed.map((entry) => (
          <li key={entry.key} className="activity__row">
            <span className="activity__dot" aria-hidden="true" />
            <div className="activity__body">
              <p className="activity__line">
                <span className="activity__project">{entry.projectTitle}</span>
                <span className="activity__sep" aria-hidden="true">&rarr;</span>
                {entry.phaseLabel}
              </p>
              <p className="activity__window">{entry.window} &middot; {entry.phaseCount} phases total</p>
            </div>
            <StatusChip status={entry.status} />
          </li>
        ))}
      </ul>

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

        .activity__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          max-height: 420px;
          overflow-y: auto;
        }
        .activity__row {
          display: grid;
          grid-template-columns: 10px 1fr auto;
          align-items: center;
          gap: 0.85rem;
          padding: 0.65rem 0.5rem;
          margin: 0 -0.5rem;
          border-bottom: 1px solid var(--chrome-border);
          border-radius: 4px;
          transition: background var(--dur-fast) var(--ease-out);
        }
        .activity__row:hover {
          background: var(--chrome-hover);
        }
        .activity__row:last-child {
          border-bottom: none;
        }
        .activity__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .activity__body {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }
        .activity__line {
          font-size: 0.84rem;
          color: var(--paper);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .activity__project {
          font-weight: 600;
          color: var(--accent-deep);
        }
        .activity__sep {
          margin: 0 0.35rem;
          color: var(--pulp-dim);
        }
        .activity__window {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--pulp);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
