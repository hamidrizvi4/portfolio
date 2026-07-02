'use client';

/**
 * TopBar.tsx
 *
 * Jira's real top bar: sidebar toggle + logo, global search, Create
 * button, notifications/help/settings, avatar. Search is a real
 * client-side filter over lib/search-index.ts; Create opens the
 * mailto-backed contact modal.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchSite, type SearchEntry } from '@/lib/search-index';
import CreateIssueModal from './CreateIssueModal';
import Avatar from './Avatar';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenIntelligence: () => void;
}

export default function TopBar({ onToggleSidebar, onOpenIntelligence }: TopBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setResults(searchSite(query));
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const goTo = (url: string) => {
    setSearchOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <button type="button" className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
            </svg>
          </button>
          <Link href="/" className="logo">
            <span className="logo__mark" aria-hidden="true">HR</span>
            <span className="logo__word">Hamid</span>
          </Link>
        </div>

        <div className="topbar__search" ref={searchRef}>
          <svg className="topbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="topbar__search-input"
            type="text"
            placeholder="Search projects, docs, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && query && (
            <div className="search-results" role="listbox">
              {results.length === 0 ? (
                <p className="search-results__empty">No results for &quot;{query}&quot;</p>
              ) : (
                results.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    className="search-results__item"
                    onClick={() => goTo(r.url)}
                  >
                    <span className="search-results__type">{r.type}</span>
                    <span className="search-results__text">
                      <span className="search-results__title">{r.title}</span>
                      <span className="search-results__subtitle">{r.subtitle}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="topbar__right">
          <button type="button" className="btn-create" onClick={() => setCreateOpen(true)}>
            <span className="btn-create__plus">+</span> Create
          </button>

          <button type="button" className="icon-btn" onClick={onOpenIntelligence} aria-label="Ask Zac">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2 L14.2 9.2 L21 12 L14.2 14.8 L12 22 L9.8 14.8 L3 12 L9.8 9.2 Z" />
            </svg>
          </button>

          <div className="notice-wrap">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setNoticeOpen((v) => !v)}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notice-dot" aria-hidden="true" />
            </button>
            {noticeOpen && (
              <div className="notice-panel">
                <p className="notice-panel__title">1 update</p>
                <p className="notice-panel__body">
                  Open to full-time AI PM roles, available now, based in NYC.
                </p>
              </div>
            )}
          </div>

          <Link href="/docs/how-i-work" className="icon-btn" aria-label="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>

          <Link href="/docs/career-timeline" className="avatar" aria-label="Hamid Rizvi's profile">
            <Avatar size={32} />
          </Link>
        </div>
      </header>

      <CreateIssueModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <style jsx>{`
        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          z-index: 900;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 0.75rem;
          background: var(--chrome-topbar);
          border-bottom: 1px solid var(--chrome-border);
        }

        .topbar__left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        /*
         * :global() is required on selectors targeting className applied
         * directly to next/link's <Link> (settings, logo) — styled-jsx
         * only auto-scopes native DOM tags authored directly in this
         * file, never a child component's own rendered output, so a
         * scoped rule here would silently never match a Link.
         */
        :global(.icon-btn) {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--paper-dim);
          flex-shrink: 0;
          position: relative;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        :global(.icon-btn:hover) {
          background: var(--chrome-hover);
          color: var(--paper);
        }
        :global(.icon-btn:active) {
          transform: scale(0.92);
        }
        :global(.icon-btn) svg {
          width: 19px;
          height: 19px;
        }

        :global(.logo) {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          transition: background var(--dur-fast) var(--ease-out);
        }
        :global(.logo:hover) {
          background: var(--chrome-hover);
        }
        .logo__mark {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: var(--accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
        }
        .logo__word {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--paper);
        }

        .topbar__search {
          position: relative;
          flex: 1;
          min-width: 0;
          max-width: 560px;
        }
        .topbar__search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--pulp-dim);
          pointer-events: none;
        }
        .topbar__search-input {
          width: 100%;
          height: 36px;
          padding: 0 0.75rem 0 2.25rem;
          border-radius: 4px;
          border: 1px solid transparent;
          background: var(--chrome-sidebar);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          color: var(--paper);
        }
        .topbar__search-input:focus {
          outline: none;
          background: var(--ink);
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .search-results {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          box-shadow: 0 12px 32px rgba(23, 43, 77, 0.14);
          max-height: 380px;
          overflow-y: auto;
          padding: 0.4rem;
          animation: dropdown-in var(--dur-fast) var(--ease-out);
        }

        @keyframes dropdown-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .search-results__empty {
          padding: 1rem;
          font-size: 0.82rem;
          color: var(--pulp);
        }
        .search-results__item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
          padding: 0.55rem 0.65rem;
          border-radius: 4px;
          text-align: left;
        }
        .search-results__item:hover {
          background: var(--chrome-hover);
        }
        .search-results__type {
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--pulp);
          background: var(--ink-3);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }
        .search-results__text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .search-results__title {
          font-size: 0.85rem;
          color: var(--paper);
          font-weight: 500;
        }
        .search-results__subtitle {
          font-size: 0.72rem;
          color: var(--pulp);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .topbar__right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
          margin-left: auto;
        }

        .btn-create {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          height: 34px;
          padding: 0 0.9rem;
          border-radius: 4px;
          background: var(--accent);
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          margin-right: 0.35rem;
          transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
        }
        .btn-create:hover {
          background: var(--accent-deep);
          transform: translateY(-1px);
        }
        .btn-create:active {
          transform: translateY(0);
        }
        .btn-create__plus {
          font-size: 1rem;
          line-height: 1;
        }

        .notice-wrap {
          position: relative;
        }
        .notice-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--secondary);
          border: 1.5px solid var(--chrome-topbar);
        }
        .notice-panel {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          width: 260px;
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          box-shadow: 0 12px 32px rgba(23, 43, 77, 0.14);
          padding: 0.9rem 1rem;
          animation: dropdown-in var(--dur-fast) var(--ease-out);
        }
        .notice-panel__title {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--pulp);
          margin: 0 0 0.35rem;
        }
        .notice-panel__body {
          font-size: 0.85rem;
          color: var(--paper);
          margin: 0;
          line-height: 1.45;
        }

        :global(.avatar) {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--secondary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          margin-left: 0.35rem;
          flex-shrink: 0;
          transition: opacity var(--dur-fast) var(--ease-out);
        }
        :global(.avatar:hover) {
          opacity: 0.85;
        }

        @media (max-width: 760px) {
          .btn-create span:not(.btn-create__plus) {
            display: none;
          }
          .btn-create {
            padding: 0 0.6rem;
          }
        }

        @media (max-width: 620px) {
          .topbar__search {
            position: static;
          }
          .search-results {
            left: 0.75rem;
            right: 0.75rem;
          }
        }

        @media (max-width: 460px) {
          .topbar {
            gap: 0.5rem;
            padding: 0 0.5rem;
          }
          .logo__word {
            display: none;
          }
          .topbar__right {
            gap: 0;
          }
        }
      `}</style>
    </>
  );
}
