'use client';

import { experience, education, certifications } from '@/lib/personal-data';

export default function ExperienceTimeline() {
  return (
    <section className="exp" id="experience" aria-label="Experience and Education">
      <div className="exp__inner">
        <header className="exp__header">
          <p className="eyebrow exp__eyebrow">Background</p>
          <h2 className="exp__title display">Where I&apos;ve been.</h2>
        </header>

        <div className="exp__body">
          <div className="exp__col">
            <p className="eyebrow exp__col-label">Work</p>
            <ol className="exp__timeline">
              {experience.map((item) => (
                <li key={`${item.company}-${item.role}`} className="exp__item">
                  <span className="exp__dot" aria-hidden="true" />
                  <div className="exp__item-body">
                    <p className="exp__company">{item.company}</p>
                    <p className="exp__role">{item.role}</p>
                    <p className="eyebrow exp__period">
                      {item.period} &middot; {item.location}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="exp__col">
            <p className="eyebrow exp__col-label">Education</p>
            <ol className="exp__timeline">
              {education.map((item) => (
                <li key={item.school} className="exp__item">
                  <span className="exp__dot" aria-hidden="true" />
                  <div className="exp__item-body">
                    <p className="exp__company">{item.school}</p>
                    <p className="exp__role">{item.degree}</p>
                    <p className="eyebrow exp__period">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="exp__certs">
              <p className="eyebrow exp__col-label exp__col-label--certs">
                Certifications
              </p>
              <ul className="exp__cert-list">
                {certifications.map((cert) => (
                  <li key={cert} className="exp__cert-tag">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .exp {
          padding: 5rem var(--gutter);
          background: var(--ink-2);
          border-top: 1px solid var(--rule);
        }

        .exp__inner {
          max-width: var(--max-w);
          margin: 0 auto;
        }

        .exp__header {
          margin-bottom: 3rem;
        }

        .exp__eyebrow {
          color: var(--accent);
          margin-bottom: 0.75rem;
        }

        .exp__title {
          margin: 0;
          font-size: clamp(2.25rem, 5vw, 4rem);
          font-weight: 300;
          font-style: italic;
          color: var(--paper);
          line-height: 0.95;
          letter-spacing: -0.04em;
        }

        .exp__body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .exp__col-label {
          color: var(--pulp);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .exp__col-label--certs {
          margin-top: 2.5rem;
        }

        .exp__timeline {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .exp__item {
          display: flex;
          gap: 1.25rem;
          padding-bottom: 2rem;
          position: relative;
        }

        .exp__item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 12px;
          bottom: 0;
          width: 1px;
          background: var(--rule-strong);
        }

        .exp__dot {
          display: block;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
          margin-top: 4px;
          position: relative;
          z-index: 1;
        }

        .exp__item-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .exp__company {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--paper);
          line-height: 1.3;
        }

        .exp__role {
          margin: 0;
          font-size: 0.88rem;
          color: var(--paper-dim);
          line-height: 1.4;
        }

        .exp__period {
          color: var(--pulp);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          margin-top: 0.2rem;
        }

        .exp__cert-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .exp__cert-tag {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          padding: 0.4rem 0.75rem;
          color: var(--paper-dim);
          background: var(--ink);
          border: 1px solid var(--rule-strong);
          border-radius: 4px;
          width: fit-content;
        }

        @media (max-width: 720px) {
          .exp {
            padding: 3.5rem var(--gutter);
          }
          .exp__body {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
}
