/**
 * Experience.tsx
 *
 * LexTrack AI, presented as work experience rather than a project: it is the
 * one deployment with real users and an uptime bar, so it leads the page.
 * Two roles, each with the outcome Hamid owned, plus the CEO's reference.
 * Copy is sourced from lib/hamid-knowledge.md.
 */

import Link from 'next/link';
import { testimonials } from '@/lib/personal-data';
import SectionHeader from './SectionHeader';

const ROLES = [
  {
    title: 'AI/ML Product Engineering Intern',
    period: 'Feb — May 2026',
    body: 'Owned production for the template I had designed: a 3-layer fallback (primary model, cached response, deterministic default) held 99.5% uptime across 50+ live restaurant partners, and model evals across GPT-4, Claude, and Gemini cut inference cost 40% at sub-2s p95.',
  },
  {
    title: '[Capstone Project] Lead AI Developer & Product Manager',
    period: 'Sep — Dec 2025',
    body: "Led 3 engineers and a designer. 25+ merchant interviews showed they wouldn't trust config they couldn't verify, so I went hybrid: deterministic rules for every field with one right answer, Gemini only for the ambiguous rest. Onboarding fell from 30 minutes to 5.",
  },
];

export default function Experience() {
  const reference = testimonials[0];

  return (
    <section aria-labelledby="experience-label" className="container-site mt-section">
      <SectionHeader id="experience-label" label="[02] Experience" aside="[2025 — 2026]" />

      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link
            href="/work/lextrack"
            data-cursor="View"
            className="group inline-block font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-beige"
          >
            <span className="transition-colors duration-base group-hover:text-burgundy-bright">LexTrack AI</span>
          </Link>
          <p className="mt-4 max-w-sm text-camel">
            A 1-click, no-code app builder. I worked on the restaurant reservation template SMB restaurants use instead
            of SevenRooms or OpenTable. New York.
          </p>
          <Link href="/work/lextrack" className="mt-6 inline-block text-sm text-beige underline-offset-4 hover:underline">
            Read the case study →
          </Link>
        </div>

        <ol className="flex flex-col md:col-span-7">
          {ROLES.map((role) => (
            <li key={role.title} className="border-t border-rule py-6 first:border-t-0 first:pt-0 md:first:pt-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl text-beige">{role.title}</h3>
                <span className="label">[{role.period}]</span>
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-beige/90">{role.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <figure className="mt-12 border-t border-rule pt-10 md:ml-[41.666%] md:pl-0">
        <blockquote className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] italic leading-snug text-beige">
          “{reference.quote}”
        </blockquote>
        <figcaption className="label mt-5">
          {reference.name} · {reference.title}
        </figcaption>
      </figure>
    </section>
  );
}
