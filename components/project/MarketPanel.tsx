import type { TamSlide } from '@/lib/deep-dives';

export default function MarketPanel({ tam }: { tam: TamSlide }) {
  return (
    <section className="panel">
      <h2 className="panel__title">Market & business model</h2>
      <div className="market__segments">
        {tam.segments.map((seg) => (
          <div key={seg.label} className="market__segment">
            <p className="market__segment-label">{seg.label}</p>
            <p className="market__segment-size">{seg.size}</p>
            <p className="market__segment-note">{seg.note}</p>
          </div>
        ))}
      </div>

      <p className="market__context">{tam.contextNote}</p>

      <div className="market__pricing">
        {tam.pricing.map((tier) => (
          <div key={tier.tier} className="market__tier">
            <p className="market__tier-name">{tier.tier}</p>
            <p className="market__tier-price">{tier.price}</p>
            <p className="market__tier-note">{tier.note}</p>
          </div>
        ))}
      </div>

      <dl className="market__econ">
        <div className="market__econ-item">
          <dt>ARPU</dt>
          <dd>{tam.unitEconomics.arpu}</dd>
        </div>
        <div className="market__econ-item">
          <dt>CAC</dt>
          <dd>{tam.unitEconomics.cac}</dd>
        </div>
        <div className="market__econ-item">
          <dt>Payback</dt>
          <dd>{tam.unitEconomics.payback}</dd>
        </div>
      </dl>

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

        .market__segments {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.1rem;
        }
        .market__segment {
          padding: 0.85rem 1rem;
          background: var(--chrome-sidebar);
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
        }
        .market__segment-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--pulp);
          margin: 0 0 0.3rem;
        }
        .market__segment-size {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--accent-deep);
          margin: 0 0 0.3rem;
        }
        .market__segment-note {
          font-size: 0.76rem;
          line-height: 1.5;
          color: var(--paper-dim);
          margin: 0;
        }

        .market__context {
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--paper);
          background: var(--accent-glow);
          border-left: 2px solid var(--accent);
          padding: 0.75rem 1rem;
          border-radius: 0 4px 4px 0;
          margin: 0 0 1.1rem;
        }

        .market__pricing {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.1rem;
        }
        .market__tier {
          padding: 0.85rem 1rem;
          border: 1px solid var(--chrome-border);
          border-radius: 6px;
        }
        .market__tier-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0 0 0.3rem;
        }
        .market__tier-price {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--accent-deep);
          margin: 0 0 0.4rem;
        }
        .market__tier-note {
          font-size: 0.74rem;
          line-height: 1.5;
          color: var(--pulp);
          margin: 0;
        }

        .market__econ {
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding-top: 0.9rem;
          border-top: 1px solid var(--chrome-border);
        }
        .market__econ-item dt {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--pulp);
          margin: 0 0 0.2rem;
        }
        .market__econ-item dd {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--paper);
          margin: 0;
        }

        @media (max-width: 640px) {
          .market__segments,
          .market__pricing {
            grid-template-columns: 1fr;
          }
          .market__econ {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
