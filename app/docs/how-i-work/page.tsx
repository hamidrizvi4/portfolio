'use client';

import DocPage from '@/components/docs/DocPage';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Prototype before spec.',
    body: "I've never written a PRD I didn't first try to build. Attempting the hard part in code forces precision: vague requirements collapse immediately when you implement them. LexTrack's hybrid AI architecture came from a failing first prototype. Pure-LLM was 4x slower and hallucinated on exactly the fields that needed to be right. The code taught me the constraint, the spec documented it.",
  },
  {
    number: '02',
    title: 'AI earns its place.',
    body: "Deterministic rules own every decision that has one right answer. LLMs handle the genuinely ambiguous residue. QuadTax's tax engine never lets the model touch math, and LexTrack's onboarding template never lets a Gemini timeout block a merchant's setup. Both are product trust decisions, not technical limitations: the systems where a wrong answer is costly get a hard wall or an explicit fallback the model can't cross.",
  },
  {
    number: '03',
    title: 'Interviews before features.',
    body: "25+ user interviews on LexTrack and a 5-person behavioral beta on QuadTax, watching where testers hesitated rather than asking what they thought. The point is not to validate ideas but to kill them: most features on my initial roadmap were wrong, and I'd rather learn that in a 45-minute conversation than in a two-sprint build. The real constraint almost never surfaces in interview number one. Interview fifteen is where the spec actually starts.",
  },
  {
    number: '04',
    title: 'Ship the version that exists.',
    body: "Three forms that file correctly beat twelve in a Figma doc. QuadTax ships 1040-NR, 8843, and 8833 as real IRS-ready PDFs, not a mocked-up form library, because a narrower scope with 100% math accuracy beats broad coverage with guesses. I scope to the highest-value narrow slice, ship to real users, and let usage data re-order the backlog. The version I ship is always smaller than the version I imagined.",
  },
];

export default function HowIWorkPage() {
  return (
    <DocPage
      eyebrow="Documentation / How I Work"
      title="How I work"
      subtitle="Four principles tested in production, not frameworks borrowed from a textbook."
    >
      <div className="principles">
        {PRINCIPLES.map((p) => (
          <article key={p.number} className="principle">
            <span className="principle__num">{p.number}</span>
            <div>
              <h2 className="principle__title">{p.title}</h2>
              <p className="principle__body">{p.body}</p>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .principles {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .principle {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 1.1rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid var(--chrome-border);
        }
        .principle:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .principle__num {
          font-family: var(--font-mono);
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent);
        }
        .principle__title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--paper);
          margin: 0 0 0.6rem;
        }
        .principle__body {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          line-height: 1.72;
          color: var(--paper-dim);
          margin: 0;
          max-width: 68ch;
        }
      `}</style>
    </DocPage>
  );
}
