/**
 * ArchDiagram.tsx
 *
 * Case study architecture as HTML boxes and connectors, the LexTrack style
 * for every project. Colour is ownership: camel is deterministic code,
 * burgundy is the model, beige is the person. A dashed inset marks whatever
 * the project's legend says it marks. Content is data: `architecture` in
 * lib/deep-dives.ts. A step that is an array forks into two lanes and joins
 * back on the next step. LexTrackDiagram reuses the primitives exported here.
 */

import { Fragment, type ReactNode } from 'react';
import type { Arch, ArchBox, Tone } from '@/lib/deep-dives';

const TONE: Record<Tone, string> = {
  person: 'border-t-beige/60',
  rules: 'border-t-camel',
  model: 'border-t-burgundy-bright',
};

export function DecisionLink({ n }: { n: number }) {
  return (
    <a
      href={`#decision-${n}`}
      className="label shrink-0 text-camel-dim underline-offset-4 transition-colors duration-fast hover:text-beige hover:underline"
    >
      Decision {String(n).padStart(2, '0')} ↓
    </a>
  );
}

export function Node({
  tone,
  label,
  decision,
  children,
}: {
  tone: Tone;
  label: string;
  decision?: number;
  children: ReactNode;
}) {
  return (
    <div className={`border border-t-2 border-rule bg-ink p-5 md:p-6 ${TONE[tone]}`}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="label">{label}</p>
        {decision && <DecisionLink n={decision} />}
      </div>
      {children}
    </div>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-rule px-3 py-1 text-sm text-beige/90">
          {item}
        </li>
      ))}
    </ul>
  );
}

// Connectors. The lanes are a 2-column grid with a 1rem gap, so their centres
// sit 4px inside 25% and 75%; the fork and join legs aim there.
const Head = () => <span className="border-x-[4px] border-t-[6px] border-x-transparent border-t-camel-dim" />;

export function Down({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-8 flex-col items-center ${className}`}>
      <span className="w-px flex-1 bg-camel-dim" />
      <Head />
    </div>
  );
}

const LEG = 'absolute top-1/2 flex h-1/2 w-2 flex-col items-center';

export function Fork() {
  return (
    <div aria-hidden="true" className="relative hidden h-10 lg:block">
      <span className="absolute left-1/2 top-0 h-1/2 w-px bg-camel-dim" />
      <span className="absolute inset-x-[calc(25%-4px)] top-1/2 h-px bg-camel-dim" />
      <span className={`${LEG} left-[calc(25%-8px)]`}>
        <span className="w-px flex-1 bg-camel-dim" />
        <Head />
      </span>
      <span className={`${LEG} right-[calc(25%-8px)]`}>
        <span className="w-px flex-1 bg-camel-dim" />
        <Head />
      </span>
    </div>
  );
}

export function Join() {
  return (
    <div aria-hidden="true" className="relative hidden h-10 lg:block">
      <span className="absolute left-[calc(25%-4px)] top-0 h-1/2 w-px bg-camel-dim" />
      <span className="absolute right-[calc(25%-4px)] top-0 h-1/2 w-px bg-camel-dim" />
      <span className="absolute inset-x-[calc(25%-4px)] top-1/2 h-px bg-camel-dim" />
      <span className={`${LEG} left-[calc(50%-4px)]`}>
        <span className="w-px flex-1 bg-camel-dim" />
        <Head />
      </span>
    </div>
  );
}

const SWATCH: Record<Tone, string> = { rules: 'bg-camel', model: 'bg-burgundy-bright', person: 'bg-beige/60' };

export function Legend({ tones, person, inset }: { tones: Tone[]; person: string; inset?: string }) {
  const names: Record<Tone, string> = { rules: 'Deterministic code', model: 'Model', person };
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {(['rules', 'model', 'person'] as const)
        .filter((t) => tones.includes(t))
        .map((t) => (
          <li key={t} className="label flex items-center gap-2">
            <span aria-hidden="true" className={`h-0.5 w-5 ${SWATCH[t]}`} />
            {names[t]}
          </li>
        ))}
      {inset && (
        <li className="label flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-5 border border-dashed border-burgundy-bright/60" />
          {inset}
        </li>
      )}
    </ul>
  );
}

function Box({ b }: { b: ArchBox }) {
  return (
    <Node tone={b.tone} label={b.label} decision={b.decision}>
      {b.title && (
        <p className="mt-4 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight text-beige lining-nums">{b.title}</p>
      )}
      {b.text && <p className="mt-4 text-beige">{b.text}</p>}
      {b.note && <p className="mt-2 text-sm text-camel">{b.note}</p>}
      {b.chips && <Chips items={b.chips} />}
      {b.meta && <p className="label mt-5">{b.meta}</p>}
      {b.list && (
        <ul className="mt-3 flex flex-col text-sm text-beige/90">
          {b.list.map((item) => (
            <li key={item} className="border-t border-rule py-2.5">
              {item}
            </li>
          ))}
        </ul>
      )}
      {b.inset && (
        <div className="mt-5 border border-dashed border-burgundy-bright/60 p-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="label">{b.inset.label}</p>
            {b.inset.decision && <DecisionLink n={b.inset.decision} />}
          </div>
          {b.inset.steps && (
            <ol className="mt-3 flex flex-col gap-1.5 text-sm">
              {b.inset.steps.map((step, n) => (
                <li key={step} className="flex items-baseline gap-3">
                  <span className="label w-4">{n + 1}</span>
                  <span className="text-beige">{step}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-2 text-sm text-camel">{b.inset.note}</p>
        </div>
      )}
    </Node>
  );
}

export default function ArchDiagram({ arch }: { arch: Arch }) {
  const tones = arch.steps.flat().map((b) => b.tone);
  return (
    <figure>
      {arch.steps.map((step, n) => {
        const prev = arch.steps[n - 1];
        return (
          <Fragment key={n}>
            {n > 0 &&
              (Array.isArray(step) || Array.isArray(prev) ? (
                <>
                  {Array.isArray(step) ? <Fork /> : <Join />}
                  <Down className="lg:hidden" />
                </>
              ) : (
                <Down />
              ))}
            {Array.isArray(step) ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {step.map((b) => (
                  <Box key={b.label} b={b} />
                ))}
              </div>
            ) : (
              <Box b={step} />
            )}
          </Fragment>
        );
      })}

      <figcaption className="mt-6 flex flex-col gap-4">
        <Legend tones={tones} person={arch.person} inset={arch.inset} />
        {arch.caption && <p className="max-w-[68ch] text-sm leading-relaxed text-camel">{arch.caption}</p>}
      </figcaption>
    </figure>
  );
}
