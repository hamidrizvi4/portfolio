import type { Outcome } from '@/lib/deep-dives';

export default function OutcomesGrid({ outcomes }: { outcomes: Outcome[] }) {
  if (outcomes.length === 0) return null;

  return (
    <section className="panel">
      <h2 className="panel__title">Outcomes</h2>
      <div className="outcomes__grid">
        {outcomes.map((o) => (
          <div key={o.label} className="outcome">
            <p className="outcome__stat">{o.stat}</p>
            <p className="outcome__label">{o.label}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .panel {
          background: var(--ink);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
          padding: 1.5rem 1.75rem;
        }
        .panel__title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 0.85rem;
        }

        .outcomes__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .outcome {
          padding: 1rem 1.1rem;
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
        }
        .outcome__stat {
          font-family: var(--font-mono);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--accent-deep);
          font-feature-settings: 'tnum' 1;
          margin: 0 0 0.35rem;
          line-height: 1.1;
        }
        .outcome__label {
          font-size: 0.78rem;
          line-height: 1.45;
          color: var(--paper-dim);
          margin: 0;
        }

        @media (max-width: 720px) {
          .outcomes__grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 440px) {
          .outcomes__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
