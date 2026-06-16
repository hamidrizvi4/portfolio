'use client';

import { skills } from '@/lib/personal-data';

const CATEGORIES = [
  { key: 'ai' as const, label: 'AI / LLM' },
  { key: 'product' as const, label: 'Product' },
  { key: 'engineering' as const, label: 'Engineering' },
  { key: 'data' as const, label: 'Data' },
];

export default function SkillsStrip() {
  return (
    <section className="skills" aria-label="Skills">
      <div className="skills__inner">
        <p className="eyebrow skills__eyebrow">What I work with</p>
        <div className="skills__grid">
          {CATEGORIES.map(({ key, label }) => (
            <div key={key} className="skills__col">
              <p className="eyebrow skills__col-label">{label}</p>
              <ul className="skills__chips" aria-label={label}>
                {skills[key].map((skill) => (
                  <li key={skill} className="skills__chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .skills {
          padding: 5rem var(--gutter);
          background: var(--ink);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .skills__inner {
          max-width: var(--max-w);
          margin: 0 auto;
        }

        .skills__eyebrow {
          color: var(--accent);
          margin-bottom: 2.25rem;
        }

        .skills__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }

        .skills__col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skills__col-label {
          color: var(--pulp);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .skills__chips {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .skills__chip {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.04em;
          padding: 0.3rem 0.7rem;
          color: var(--paper-dim);
          background: var(--ink-2);
          border: 1px solid var(--rule-strong);
          border-radius: 999px;
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .skills__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .skills {
            padding: 3.5rem var(--gutter);
          }
          .skills__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
