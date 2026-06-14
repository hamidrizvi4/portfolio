'use client';

/**
 * TestimonialStrip.tsx
 *
 * A single attributed quote between Off-duty and Contact.
 * Pure typography — no card, no box. The restraint is the design.
 *
 * To update: edit `testimonials` in lib/personal-data.ts.
 * Shows only the first testimonial entry.
 */

import { testimonials } from '@/lib/personal-data';

export default function TestimonialStrip() {
  const t = testimonials[0];

  return (
    <section className="testimonial" aria-label="Testimonial">
      <div className="testimonial__inner">
        <span className="testimonial__mark" aria-hidden="true">"</span>
        <blockquote className="testimonial__quote">
          {t.quote}
        </blockquote>
        <p className="testimonial__attribution">
          <span className="testimonial__dash" aria-hidden="true">—</span>
          <span className="testimonial__name">{t.name}</span>
          <span className="testimonial__sep" aria-hidden="true"> · </span>
          <span className="testimonial__title">{t.title}</span>
        </p>
      </div>

      <style jsx>{`
        .testimonial {
          padding: 5rem var(--gutter);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .testimonial__inner {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .testimonial__mark {
          font-family: var(--font-display);
          font-size: clamp(4rem, 8vw, 7rem);
          font-weight: 300;
          font-style: italic;
          color: var(--accent);
          line-height: 0.7;
          letter-spacing: -0.04em;
          user-select: none;
        }

        .testimonial__quote {
          margin: 0;
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.3rem, 2.4vw, 2rem);
          line-height: 1.45;
          color: var(--paper);
          letter-spacing: -0.02em;
        }

        .testimonial__attribution {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin: 0;
          padding-top: 1.5rem;
          border-top: 1px solid var(--rule);
        }

        .testimonial__dash {
          font-family: var(--font-mono);
          color: var(--accent);
          font-size: 0.9rem;
        }

        .testimonial__name {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--paper);
          letter-spacing: -0.01em;
        }

        .testimonial__sep {
          font-family: var(--font-mono);
          color: var(--pulp-dim);
          font-size: 0.75rem;
        }

        .testimonial__title {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--pulp);
        }

        @media (max-width: 640px) {
          .testimonial {
            padding: 4rem var(--gutter);
          }
          .testimonial__quote {
            font-size: 1.2rem;
            line-height: 1.5;
          }
        }
      `}</style>
    </section>
  );
}
