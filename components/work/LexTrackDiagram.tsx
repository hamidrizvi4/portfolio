/**
 * LexTrackDiagram.tsx
 *
 * The LexTrack architecture as HTML instead of an ASCII <pre>, so it reflows
 * to one column on phones and reads as text to a screen reader. Colour is
 * ownership: camel is deterministic code, burgundy is the model, beige is
 * the merchant. A dashed border marks what I added in production as an
 * intern. Each "Decision 0n" tag jumps to the decision that explains the
 * box. Facts come from lib/hamid-knowledge.md.
 */

import { Chips, DecisionLink, Down, Fork, Join, Legend, Node } from './ArchDiagram';

const RULE_FIELDS = ['Table counts', 'Party sizes', 'Booking hours'];
const MODEL_FIELDS = ['Service style', 'Deposit rules', 'Custom notes'];
const FALLBACK = ['Primary model', 'Cached response', 'Deterministic default'];
// True of any deterministic code, which is the point of the split.
const GUARANTEES = ['Same input, same output, every time', 'No inference cost, no added latency', 'Nothing to hallucinate'];

export default function LexTrackDiagram() {
  return (
    <figure>
      <Node tone="person" label="Merchant · one sentence" decision={2}>
        <p className="mt-4 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight text-beige">
          &ldquo;Cozy Italian spot in Brooklyn, deposit required.&rdquo;
        </p>
        <p className="mt-2 text-sm text-camel">Replaces a multi-step wizard and 30+ minutes of setup.</p>
      </Node>

      <Down />

      <Node tone="rules" label="Field registry" decision={1}>
        <p className="mt-4 text-beige">
          <span className="font-display text-2xl">80+ fields</span>{' '}
          <span className="text-beige/80">across 11 categories, each with exactly one owner.</span>
        </p>
        <p className="mt-2 text-sm text-camel">
          A verifiable right answer goes to rules. Only the genuinely ambiguous go to the model.
        </p>
      </Node>

      <Fork />
      <Down className="lg:hidden" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Node tone="rules" label="Deterministic rules">
          <p className="mt-4 text-beige">~40 fields with one right answer</p>
          <Chips items={RULE_FIELDS} />
          <p className="label mt-5">No model call</p>
          <ul className="mt-3 flex flex-col text-sm text-beige/90">
            {GUARANTEES.map((g) => (
              <li key={g} className="border-t border-rule py-2.5">
                {g}
              </li>
            ))}
          </ul>
        </Node>

        <Node tone="model" label="Gemini">
          <p className="mt-4 text-beige">~40 ambiguous fields, one narrow prompt</p>
          <Chips items={MODEL_FIELDS} />
          <p className="label mt-5">1–2s · 70% cheaper than all-LLM</p>

          <div className="mt-5 border border-dashed border-burgundy-bright/60 p-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="label">Production · intern</p>
              <DecisionLink n={3} />
            </div>
            <ol className="mt-3 flex flex-col gap-1.5 text-sm">
              {FALLBACK.map((step, n) => (
                <li key={step} className="flex items-baseline gap-3">
                  <span className="label w-4">{n + 1}</span>
                  <span className={n === FALLBACK.length - 1 ? 'text-camel' : 'text-beige'}>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-sm text-camel">
              A timeout or rate limit falls through to the next layer, so the model never blocks a merchant. 99.5%
              uptime.
            </p>
            <p className="mt-3 border-t border-rule pt-3 text-sm text-camel">
              Evals across GPT-4, Claude, and Gemini picked the production model: 40% lower inference cost at sub-2s
              p95.
            </p>
          </div>
        </Node>
      </div>

      <Join />
      <Down className="lg:hidden" />

      <Node tone="person" label="Review screen" decision={2}>
        <p className="mt-4 text-beige">Riskiest fields first. The merchant confirms or edits, say the deposit amount.</p>
        <p className="mt-2 text-sm text-camel">Nothing goes live until a person has looked at it.</p>
      </Node>

      <Down />

      <Node tone="person" label="Live reservation app">
        <p className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-none text-beige lining-nums">
          30 min → 5 min
        </p>
        <p className="mt-3 text-sm text-camel">50+ active users in 8 weeks, 85% weekly retention.</p>
      </Node>

      <figcaption className="mt-6 flex flex-col gap-4">
        <Legend tones={['rules', 'model', 'person']} person="Merchant" inset="Added in production as an intern" />
        <p className="max-w-[68ch] text-sm leading-relaxed text-camel">
          It replaced v0, which sent all 80+ fields to the LLM: 4x slower, and confidently wrong on fields that have
          exactly one right answer.
        </p>
      </figcaption>
    </figure>
  );
}
