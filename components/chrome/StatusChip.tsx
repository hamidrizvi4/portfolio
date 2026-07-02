'use client';

import type { IssueStatus } from '@/lib/jira-data';

const STATUS_CLASS: Record<IssueStatus, string> = {
  Done: 'chip--done',
  'In Progress': 'chip--progress',
  'To Do': 'chip--todo',
};

export default function StatusChip({ status }: { status: IssueStatus }) {
  return (
    <span className={`chip ${STATUS_CLASS[status]}`}>
      {status.toUpperCase()}
      <style jsx>{`
        .chip {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.55rem;
          border-radius: 3px;
          white-space: nowrap;
        }
        .chip--done {
          background: var(--status-done-bg);
          color: var(--status-done-fg);
        }
        .chip--progress {
          background: var(--status-progress-bg);
          color: var(--status-progress-fg);
        }
        .chip--todo {
          background: var(--status-todo-bg);
          color: var(--status-todo-fg);
        }
      `}</style>
    </span>
  );
}
