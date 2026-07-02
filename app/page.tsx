'use client';

/**
 * app/page.tsx
 *
 * The home dashboard — styled after Jira's Default Dashboard: a grid of
 * widgets (Introduction, Assigned to me, Projects, Activity stream)
 * instead of a single scrolling page. Chrome (TopBar/Sidebar) is
 * supplied globally by AppShell in app/layout.tsx.
 */

import IntroWidget from '@/components/dashboard/IntroWidget';
import StatsWidget from '@/components/dashboard/StatsWidget';
import ProjectsWidget from '@/components/dashboard/ProjectsWidget';
import ActivityWidget from '@/components/dashboard/ActivityWidget';

export default function HomePage() {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <p className="dashboard__eyebrow">Dashboards / Default dashboard</p>
        <h1 className="dashboard__title">Hamid Rizvi's overview</h1>
      </header>

      <div className="dashboard__grid">
        <div className="dashboard__col dashboard__col--main">
          <div className="stagger-in"><IntroWidget /></div>
          <div className="stagger-in"><ProjectsWidget /></div>
        </div>
        <div className="dashboard__col dashboard__col--side">
          <div className="stagger-in"><StatsWidget /></div>
          <div className="stagger-in"><ActivityWidget /></div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 1.75rem clamp(1.25rem, 3vw, 2.5rem) 4rem;
          max-width: 1320px;
          margin: 0 auto;
        }
        .dashboard__header {
          margin-bottom: 1.5rem;
        }
        .dashboard__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--pulp);
          margin: 0 0 0.4rem;
        }
        .dashboard__title {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--paper);
          margin: 0;
        }

        .dashboard__grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.25rem;
          align-items: start;
        }
        .dashboard__col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .dashboard__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
