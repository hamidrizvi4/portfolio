/**
 * /work/[slug]: one case study.
 *
 * Skim layer first (brief §6): title and meta, 16:9 hero, Problem / What I
 * built / Impact, outcome numbers and stack, gallery. Then the depth an FDE
 * reviewer reads for: my role, architecture, each decision as situation →
 * tradeoff → call → result, what broke, and the retro. Then the CTA and the
 * next project.
 *
 * Content, keyed by slug: lib/projects.ts (meta, images), caseStudies in
 * lib/personal-data.ts (the summary), lib/deep-dives.ts (the long form).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/projects';
import { caseStudies } from '@/lib/personal-data';
import { getDeepDive, type Decision } from '@/lib/deep-dives';
import PageIntro from '@/components/site/PageIntro';
import ProjectVisual from '@/components/home/ProjectVisual';
import SectionHeader from '@/components/home/SectionHeader';
import LexTrackDiagram from '@/components/work/LexTrackDiagram';

type Params = { params: { slug: string } };

// Only the known slugs exist; anything else is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

function load(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const study = caseStudies.find((c) => c.id === slug);
  const dive = getDeepDive(slug);
  if (i === -1 || !study || !dive) return null;
  return { i, project: projects[i], study, dive, next: projects[(i + 1) % projects.length] };
}

export function generateMetadata({ params }: Params): Metadata {
  const data = load(params.slug);
  return data ? { title: data.project.title, description: data.dive.subtitle } : {};
}

const pad = (n: number) => String(n).padStart(2, '0');

const DECISION_PARTS: [Exclude<keyof Decision, 'title'>, string][] = [
  ['setup', 'The situation'],
  ['tradeoff', 'The tradeoff'],
  ['call', 'The call'],
  ['result', 'What happened'],
];

const GALLERY = ['aspect-[4/5]', 'aspect-[9/16]', 'aspect-[4/5]'];

// Long-form copy: one readable column, offset right on desktop.
const PROSE = 'md:col-span-8 md:col-start-5';

interface StorySection {
  id: string;
  label: string;
  body: JSX.Element;
}

export default function CaseStudyPage({ params }: Params) {
  const data = load(params.slug);
  if (!data) notFound();
  const { i, project, study, dive, next } = data;
  // LexTrack has a real diagram; the others still render their ASCII one.
  const Diagram = project.slug === 'lextrack' ? LexTrackDiagram : null;

  const story = [
    {
      id: 'role',
      label: 'My role',
      body: (
        <div className={`flex flex-col gap-5 ${PROSE}`}>
          {dive.myRole.map((p) => (
            <p key={p} className="max-w-[68ch] text-lg leading-relaxed text-beige/90">
              {p}
            </p>
          ))}
        </div>
      ),
    },
    (Diagram || dive.architectureDiagram) && {
      id: 'architecture',
      label: 'Architecture',
      body: Diagram ? (
        <div className={`min-w-0 ${PROSE}`}>
          <Diagram />
        </div>
      ) : (
        <div className={`min-w-0 ${PROSE}`}>
          <p className="label mb-3 md:hidden" aria-hidden="true">
            Scroll sideways →
          </p>
          {/* Focusable so keyboard users can scroll it sideways on phones; the
              decisions below describe the same system in prose. */}
          <div
            role="img"
            aria-label={`${project.title} architecture diagram. The decisions below describe it in words.`}
            tabIndex={0}
            className="overflow-x-auto border border-rule bg-ink-2 p-5 md:p-8"
          >
            <pre className="w-max font-mono text-[0.7rem] leading-snug text-camel md:text-sm">{dive.architectureDiagram}</pre>
          </div>
        </div>
      ),
    },
    {
      id: 'decisions',
      label: `Decisions (${pad(dive.decisions.length)})`,
      body: (
        <ol className="md:col-span-12">
          {dive.decisions.map((d, n) => (
            <li
              key={d.title}
              id={`decision-${n + 1}`}
              className="scroll-mt-28 grid gap-6 border-b border-rule py-10 first:pt-0 last:border-b-0 md:grid-cols-12 md:gap-0 md:py-14"
            >
              {/* No column gap: the answers line up with the PROSE column above. */}
              <div className="md:col-span-4 md:pr-10">
                <span className="label">{pad(n + 1)}</span>
                <h3 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] text-beige">{d.title}</h3>
              </div>
              <dl className="flex flex-col gap-6 md:col-span-8">
                {DECISION_PARTS.map(([key, name]) => (
                  <div key={key}>
                    <dt className="label">{name}</dt>
                    <dd className={`mt-2 max-w-[68ch] leading-relaxed ${key === 'call' ? 'text-beige' : 'text-beige/85'}`}>
                      {d[key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      ),
    },
    dive.lessons?.length && {
      id: 'broke',
      label: 'What broke',
      body: (
        <ol className="grid gap-x-10 gap-y-12 md:col-span-12 md:grid-cols-2">
          {dive.lessons.map((l, n) => (
            <li key={l.title} className="border-t border-rule pt-6">
              <span className="label">{pad(n + 1)}</span>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-tight text-beige">{l.title}</h3>
              <p className="mt-3 max-w-[60ch] leading-relaxed text-beige/85">{l.body}</p>
            </li>
          ))}
        </ol>
      ),
    },
    ...(dive.checklists ?? []).map((c, n) => ({
      id: `list-${n}`,
      label: c.title,
      body: (
        <ul className={`flex flex-col ${PROSE}`}>
          {c.items.map((item) => (
            <li key={item} className="border-b border-rule py-4 leading-relaxed text-beige/90 first:pt-0">
              {item}
            </li>
          ))}
        </ul>
      ),
    })),
    dive.retro.length > 0 && {
      id: 'retro',
      label: "What I'd do differently",
      body: (
        <ol className={`flex flex-col ${PROSE}`}>
          {dive.retro.map((r, n) => (
            <li key={r} className="flex gap-6 border-b border-rule py-6 first:pt-0">
              <span className="label pt-1">{pad(n + 1)}</span>
              <p className="max-w-[64ch] leading-relaxed text-beige/90">{r}</p>
            </li>
          ))}
        </ol>
      ),
    },
    study.links?.length && {
      id: 'writing',
      label: 'Writing',
      body: (
        <ul className={`flex flex-col ${PROSE}`}>
          {study.links.map((l) => (
            <li key={l.url} className="border-b border-rule">
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-6 py-5"
              >
                <span className="font-display text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight text-beige transition-colors duration-base group-hover:text-burgundy-bright">
                  {l.label}
                </span>
                <span className="label shrink-0">
                  Read ↗<span className="sr-only"> (opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ),
    },
  ].filter((s): s is StorySection => Boolean(s));

  return (
    <article>
      <PageIntro
        eyebrow={`[ Case study ${pad(i + 1)} / ${pad(projects.length)} ]`}
        aside={
          <Link href="/work" className="hover:text-beige">
            ← All work
          </Link>
        }
        title={project.title}
      >
        <p className="label mt-6">
          [{project.year}] · {project.role} · {project.category}
        </p>
        <p className="mt-8 max-w-4xl font-display text-[clamp(1.35rem,2.4vw,2.2rem)] leading-[1.2] text-beige">
          {dive.subtitle}
        </p>
        {project.note && (
          <p className="mt-6 max-w-3xl border-l-2 border-burgundy-bright pl-4 text-camel">{project.note}</p>
        )}
      </PageIntro>

      <ProjectVisual
        title={project.title}
        shot={project.hero}
        tag="Hero"
        variant={i}
        sizes="100vw"
        priority
        className="mt-12 aspect-video w-full md:mt-16"
      />

      <section aria-labelledby="summary-label" className="container-site mt-section">
        <SectionHeader id="summary-label" label="[ Summary ]" />
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="label">Problem</h3>
            <p className="mt-4 leading-relaxed text-beige/90">{study.problem}</p>
          </div>
          <div>
            <h3 className="label">What I built</h3>
            <p className="mt-4 leading-relaxed text-beige/90">{study.build}</p>
          </div>
          <div>
            <h3 className="label">Impact</h3>
            <ul className="mt-4 flex flex-col">
              {study.impact.map((line) => (
                <li key={line} className="border-b border-rule py-3 leading-relaxed text-beige/90 first:pt-0">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="outcomes-label" className="container-site mt-section">
        <SectionHeader id="outcomes-label" label="[ Outcomes ]" />
        <dl className="grid grid-cols-2 lg:grid-cols-3">
          {dive.outcomes.map((o) => (
            <div key={o.label} className="flex flex-col gap-2 border-b border-rule py-8 pr-4">
              <dt className="order-2 max-w-xs text-beige/90">{o.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-beige lining-nums">
                {o.stat}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <h3 className="label">Stack</h3>
          <ul className="flex flex-wrap gap-2">
            {dive.stack.map((s) => (
              <li key={s} className="rounded-full border border-rule px-4 py-1.5 text-sm text-beige">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {project.details?.length ? (
        <div className="container-site mt-section">
          {/* Desktop: one row, each shot growing by its aspect ratio, so all share a height at their
              natural shape (capped at 560px tall). Four or more would shrink past legible in one row,
              so they go two across instead. Phones: stacked full width. */}
          <div
            className={`flex flex-col gap-3 md:gap-6 ${project.details.length > 3 ? 'md:grid md:grid-cols-2' : 'md:flex-row'}`}
            style={
              project.details.length > 3
                ? undefined
                : { maxWidth: project.details.reduce((sum, s) => sum + (s.ratio ?? 1), 0) * 560 }
            }
          >
            {project.details.map((shot) => (
              <div
                key={shot.src}
                style={{ '--r': shot.ratio ?? 1 } as React.CSSProperties}
                className="md:flex-[var(--r)_1_0%]"
              >
                <ProjectVisual
                  title={project.title}
                  shot={shot}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[var(--r)] w-full"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container-site mt-section grid grid-cols-2 items-end gap-3 md:grid-cols-3 md:gap-6">
          {GALLERY.map((aspect, n) => (
            <ProjectVisual
              key={n}
              title={project.title}
              tag="Detail"
              variant={i + n + 1}
              sizes="(min-width: 768px) 30vw, 45vw"
              className={`w-full ${aspect} ${n === 2 ? 'hidden md:block' : ''}`}
            />
          ))}
        </div>
      )}

      {story.map((s, n) => (
        <section key={s.id} aria-labelledby={`${s.id}-label`} className="container-site mt-section">
          <SectionHeader id={`${s.id}-label`} label={`[${pad(n + 1)}] ${s.label}`} />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] md:mt-14 md:grid-cols-12">{s.body}</div>
        </section>
      ))}

      <section aria-labelledby="cta-label" className="container-site mt-section">
        <SectionHeader id="cta-label" label={dive.cta?.type === 'github' ? '[ The code ]' : '[ See it ]'} />
        {dive.cta ? (
          <a
            href={dive.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-baseline gap-4 font-display text-[clamp(2rem,5vw,4.5rem)] leading-tight text-beige"
          >
            <span className="underline decoration-camel-dim decoration-1 underline-offset-[0.18em] transition-colors duration-base group-hover:text-burgundy-bright group-hover:decoration-burgundy-bright">
              {dive.cta.label}
            </span>
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <p className="label mt-8">Demo coming soon</p>
        )}
      </section>

      <nav aria-label="Next project" className="container-site mt-section">
        <Link href={`/work/${next.slug}`} data-cursor="View" className="group block border-t border-rule pt-8">
          <span className="label">Next project →</span>
          <span className="mt-4 block font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95] text-beige transition-colors duration-base group-hover:text-burgundy-bright group-focus-visible:text-burgundy-bright">
            {next.title}
          </span>
          <span className="label mt-6 block">{next.category}</span>
        </Link>
      </nav>
    </article>
  );
}
