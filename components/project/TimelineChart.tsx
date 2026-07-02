'use client';

import type { TimelinePhase } from '@/lib/jira-data';

const STATUS_BAR_CLASS: Record<TimelinePhase['status'], string> = {
  Done: 'bar--done',
  'In Progress': 'bar--progress',
  'To Do': 'bar--todo',
};

export default function TimelineChart({ timeline }: { timeline: TimelinePhase[] }) {
  return (
    <div className="gantt">
      <div className="gantt__axis" aria-hidden="true">
        <span>Start</span>
        <span>Present</span>
      </div>

      <div className="gantt__rows">
        {timeline.map((phase) => (
          <div key={phase.label} className="gantt__row">
            <div className="gantt__label">
              <p className="gantt__label-text">{phase.label}</p>
              <p className="gantt__label-window">{phase.window}</p>
            </div>
            <div className="gantt__track">
              <div
                className={`gantt__bar ${STATUS_BAR_CLASS[phase.status]}`}
                style={{ left: `${phase.startPct * 100}%`, width: `${(phase.endPct - phase.startPct) * 100}%` }}
              >
                <span className="gantt__bar-status">{phase.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .gantt {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 1.5rem 1.75rem 1.75rem;
        }
        .gantt__axis {
          display: flex;
          justify-content: space-between;
          padding-left: clamp(140px, 22%, 220px);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--pulp);
          margin-bottom: 0.75rem;
        }

        .gantt__rows {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .gantt__row {
          display: grid;
          grid-template-columns: clamp(140px, 22%, 220px) 1fr;
          gap: 1rem;
          align-items: center;
        }
        .gantt__label-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
          line-height: 1.3;
        }
        .gantt__label-window {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          color: var(--pulp);
          margin: 0.15rem 0 0;
        }

        .gantt__track {
          position: relative;
          height: 28px;
          background: var(--chrome-sidebar);
          border-radius: 4px;
        }
        .gantt__bar {
          position: absolute;
          top: 0;
          bottom: 0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 0 0.6rem;
          min-width: 32px;
        }
        .gantt__bar-status {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: inherit;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bar--done {
          background: var(--status-done-bg);
          color: var(--status-done-fg);
        }
        .bar--progress {
          background: var(--status-progress-bg);
          color: var(--status-progress-fg);
        }
        .bar--todo {
          background: var(--status-todo-bg);
          color: var(--status-todo-fg);
          border: 1px dashed var(--pulp-dim);
        }

        @media (max-width: 640px) {
          .gantt__row {
            grid-template-columns: 1fr;
            gap: 0.4rem;
          }
          .gantt__axis {
            padding-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
