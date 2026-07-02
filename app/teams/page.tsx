'use client';

import Link from 'next/link';
import { profile, testimonials } from '@/lib/personal-data';
import Avatar from '@/components/chrome/Avatar';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const TEAMS = [
  {
    name: 'LexTrack AI reservation template',
    size: '3 engineers, 1 designer, led as capstone PM',
    note: 'Managed the team while writing code alongside them. When engineering pushed back on the hybrid architecture’s extra surface area, the interview data settled the argument.',
    url: '/projects/lextrack',
  },
  {
    name: 'QuadTax',
    size: '3-person team, product lead',
    note: 'No external boss means you are your own stakeholders. We killed scope creep in standing reviews, caught each other gold plating, and settled architecture arguments with prototypes rather than compromise.',
    url: '/projects/quadtax',
  },
  {
    name: 'Squirrel AI',
    size: '2-person team, product lead',
    note: 'The extraction-depth versus shipping-speed argument got settled by running the naive approach against a real 50K-line codebase and watching it collapse. Evidence over whoever talked longer.',
    url: '/projects/squirrel',
  },
];

export default function TeamsPage() {
  return (
    <div className="teams-page">
      <header className="teams-page__header">
        <p className="teams-page__eyebrow">Teams / Hire Hamid</p>
        <h1 className="teams-page__title">Hire Hamid</h1>
        <p className="teams-page__subtitle">Three shipped teams, and a reference from the person who assigned the work and watched it ship.</p>
      </header>

      <section className="panel">
        <h2 className="panel__title">Team member</h2>
        <div className="member">
          <span className="member__avatar">
            <Avatar size={48} />
          </span>
          <div>
            <p className="member__name">{profile.name}</p>
            <p className="member__role">Product Manager &middot; {profile.location}</p>
            <p className="member__status">{profile.availability}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__title">Teams I&apos;ve worked on</h2>
        <div className="teams-list">
          {TEAMS.map((t) => (
            <Link key={t.name} href={t.url} className="team-row">
              <span className="team-row__head">
                <span className="team-row__name">{t.name}</span>
                <span className="team-row__size">{t.size}</span>
              </span>
              <span className="team-row__note">{t.note}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__title">References</h2>
        <div className="references">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="reference">
              <span className="reference__avatar" aria-hidden="true">{getInitials(t.name)}</span>
              <div className="reference__body">
                <p className="reference__quote">&ldquo;{t.quote}&rdquo;</p>
                <p className="reference__name">{t.name}</p>
                <p className="reference__title">{t.title}</p>
              </div>
            </blockquote>
          ))}
        </div>
      </section>

      <style jsx>{`
        .teams-page {
          padding: 1.75rem clamp(1.25rem, 3vw, 2.5rem) 4rem;
          max-width: 920px;
          margin: 0 auto;
        }
        .teams-page__header {
          margin-bottom: 1.75rem;
        }
        .teams-page__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--pulp);
          margin: 0 0 0.5rem;
        }
        .teams-page__title {
          font-family: var(--font-display);
          font-size: clamp(1.9rem, 3.5vw, 2.6rem);
          font-weight: 800;
          color: var(--paper);
          margin: 0;
        }
        .teams-page__subtitle {
          font-size: 0.95rem;
          color: var(--pulp);
          margin: 0.6rem 0 0;
        }

        .panel {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 1.5rem 1.75rem;
          margin-bottom: 1.25rem;
        }
        .panel__title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 1rem;
        }

        .member {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .member__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid var(--chrome-border);
        }
        .member__name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .member__role {
          font-size: 0.85rem;
          color: var(--paper-dim);
          margin: 0.15rem 0 0;
        }
        .member__status {
          font-size: 0.78rem;
          color: var(--accent-deep);
          margin: 0.3rem 0 0;
        }

        .teams-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        /* :global() required — .team-row is next/link's <Link>, which styled-jsx cannot auto-scope. */
        :global(.team-row) {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 0.95rem 1.1rem;
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
        }
        :global(.team-row:hover) {
          border-color: var(--accent);
          background: var(--accent-glow);
        }
        .team-row__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .team-row__name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--paper);
        }
        .team-row__size {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--pulp);
        }
        .team-row__note {
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--paper-dim);
        }

        .references {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .reference {
          display: flex;
          gap: 1rem;
          margin: 0;
        }
        .reference__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--secondary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .reference__quote {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--paper);
          margin: 0 0 0.6rem;
        }
        .reference__name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .reference__title {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--pulp);
          margin: 0.15rem 0 0;
        }
      `}</style>
    </div>
  );
}
