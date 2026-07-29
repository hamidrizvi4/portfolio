'use client';

import DocPage from '@/components/docs/DocPage';
import { experience, education, certifications, skills } from '@/lib/personal-data';

const SKILL_CATEGORIES: { key: keyof typeof skills; label: string }[] = [
  { key: 'ai', label: 'AI / LLM' },
  { key: 'product', label: 'Product' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'data', label: 'Data' },
];

export default function CareerTimelinePage() {
  return (
    <DocPage
      eyebrow="Documentation / Career Timeline"
      title="Where I've been"
      subtitle="Experience, education, certifications, and the skills behind all six projects."
    >
      <section className="block">
        <h2 className="block__title">Work</h2>
        <p className="block__note">
          One employer to date, LexTrack AI, intern then capstone PM. The other five projects on this
          site were self-directed: QuadTax shipped with a 3-person team I led, Squirrel AI with a
          2-person team, AI Purchase Analytics and the Claude Support Triage Agent solo, and Equiply
          Asset Intelligence as a hiring tournament submission.
        </p>
        <ol className="timeline">
          {experience.map((item) => (
            <li key={`${item.company}-${item.role}`} className="timeline__item">
              <span className="timeline__dot" aria-hidden="true" />
              <div>
                <p className="timeline__primary">{item.company}</p>
                <p className="timeline__secondary">{item.role}</p>
                <p className="timeline__meta">{item.period} &middot; {item.location}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h2 className="block__title">Education</h2>
        <ol className="timeline">
          {education.map((item) => (
            <li key={item.school} className="timeline__item">
              <span className="timeline__dot" aria-hidden="true" />
              <div>
                <p className="timeline__primary">{item.school}</p>
                <p className="timeline__secondary">{item.degree}</p>
                <p className="timeline__meta">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h2 className="block__title">Certifications</h2>
        <div className="certs">
          {certifications.map((cert) => (
            <span key={cert} className="certs__tag">{cert}</span>
          ))}
        </div>
      </section>

      <section className="block">
        <h2 className="block__title">Skills</h2>
        <div className="skills">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.key} className="skills__group">
              <p className="skills__label">{cat.label}</p>
              <div className="skills__tags">
                {skills[cat.key].map((s) => (
                  <span key={s} className="skills__tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .block__title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 1.1rem;
        }
        .block__note {
          font-size: 0.85rem;
          color: var(--pulp);
          line-height: 1.55;
          margin: -0.4rem 0 1.25rem;
          max-width: 62ch;
        }

        .timeline {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .timeline__item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1.5rem;
          position: relative;
        }
        .timeline__item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 12px;
          bottom: 0;
          width: 1px;
          background: var(--chrome-border);
        }
        .timeline__dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 5px;
          position: relative;
          z-index: 1;
        }
        .timeline__primary {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0;
        }
        .timeline__secondary {
          font-size: 0.87rem;
          color: var(--paper-dim);
          margin: 0.15rem 0 0;
        }
        .timeline__meta {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--pulp);
          margin: 0.3rem 0 0;
        }

        .certs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .certs__tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.45rem 0.8rem;
          color: var(--paper-dim);
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 4px;
        }

        .skills {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .skills__label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pulp);
          margin: 0 0 0.5rem;
        }
        .skills__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .skills__tag {
          font-size: 0.78rem;
          color: var(--paper-dim);
          background: var(--ink-2);
          border: 1px solid var(--chrome-border);
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
        }
      `}</style>
    </DocPage>
  );
}
