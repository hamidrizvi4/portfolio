'use client';

import { useState } from 'react';
import type { JiraEpic } from '@/lib/jira-data';

export default function BacklogList({ epics }: { epics: JiraEpic[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(epics.map((e) => [e.key, true]))
  );

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="backlog">
      {epics.map((epic) => {
        const open = !!expanded[epic.key];
        return (
          <div key={epic.key} className="epic">
            <button type="button" className="epic__header" onClick={() => toggle(epic.key)} aria-expanded={open}>
              <svg
                className={`epic__chevron ${open ? 'epic__chevron--open' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
              <span className="epic__key">{epic.key}</span>
              <span className="epic__title">{epic.title}</span>
              <span className="epic__story-count">{epic.stories.length} stories</span>
            </button>

            <div className={`epic__body-wrap ${open ? 'epic__body-wrap--open' : ''}`}>
              <div className="epic__body-clip">
                <div className="epic__body">
                  <p className="epic__summary">{epic.summary}</p>
                  <ul className="epic__stories">
                    {epic.stories.map((story) => (
                      <li key={story.key} className="story">
                        <span className="story__key">{story.key}</span>
                        <div className="story__text">
                          <p className="story__title">{story.title}</p>
                          <p className="story__body">{story.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .backlog {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .epic {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          overflow: hidden;
        }
        .epic__header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1.1rem;
          text-align: left;
          transition: background var(--dur-fast) var(--ease-out);
        }
        .epic__header:hover {
          background: var(--chrome-hover);
        }
        .epic__chevron {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          color: var(--pulp);
          transition: transform var(--dur-fast) var(--ease-out);
        }
        .epic__chevron--open {
          transform: rotate(90deg);
        }
        .epic__key {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--secondary);
          flex-shrink: 0;
        }
        .epic__title {
          flex: 1;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--paper);
          text-align: left;
        }
        .epic__story-count {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--pulp);
          flex-shrink: 0;
        }

        .epic__body-wrap {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--dur-base) var(--ease-drawer);
        }
        .epic__body-wrap--open {
          grid-template-rows: 1fr;
        }
        .epic__body-clip {
          overflow: hidden;
          min-height: 0;
        }
        .epic__body {
          padding: 0 1.1rem 1.1rem calc(1.1rem + 14px + 0.75rem);
          border-top: 1px solid var(--chrome-border);
        }
        .epic__summary {
          font-size: 0.85rem;
          color: var(--paper-dim);
          line-height: 1.55;
          margin: 0.85rem 0 1rem;
        }

        .epic__stories {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .story {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: start;
          gap: 0.75rem;
          padding: 0.7rem 0.85rem;
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 5px;
        }
        .story__key {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          color: var(--pulp);
          padding-top: 0.15rem;
          flex-shrink: 0;
        }
        .story__text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .story__title {
          font-size: 0.83rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
        }
        .story__body {
          font-size: 0.82rem;
          color: var(--paper-dim);
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 640px) {
          .epic__body {
            padding-left: 1.1rem;
          }
          .story {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
