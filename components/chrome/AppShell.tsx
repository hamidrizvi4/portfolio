'use client';

/**
 * AppShell.tsx
 *
 * Owns the two pieces of chrome state (sidebar open/collapsed, the
 * Zac AI panel open) and composes TopBar + Sidebar + page content,
 * matching real Jira's fixed-topbar / fixed-sidebar / scrolling-content
 * layout.
 */

import { useEffect, useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import IntelligencePanel from './IntelligencePanel';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 900) setSidebarOpen(false);
  }, []);

  return (
    <div className="app-shell">
      <TopBar
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onOpenIntelligence={() => setIntelligenceOpen(true)}
      />
      <Sidebar open={sidebarOpen} />
      <IntelligencePanel open={intelligenceOpen} onClose={() => setIntelligenceOpen(false)} />

      <main className={`app-shell__content ${sidebarOpen ? '' : 'app-shell__content--rail'}`}>
        {children}
      </main>

      <style jsx>{`
        .app-shell {
          min-height: 100vh;
        }
        .app-shell__content {
          padding-top: 56px;
          padding-left: 260px;
          min-height: 100vh;
          transition: padding-left var(--dur-base) var(--ease-drawer);
        }
        .app-shell__content--rail {
          padding-left: 56px;
        }

        @media (max-width: 900px) {
          .app-shell__content,
          .app-shell__content--rail {
            padding-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
