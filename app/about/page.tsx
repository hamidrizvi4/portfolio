/**
 * /about: bio, how I work, experience, education, certifications, skills,
 * and off duty. Copy comes from lib/personal-data.ts and the "How I work"
 * principles below; every claim traces to lib/hamid-knowledge.md.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { certifications, education, experience, profile, skills } from '@/lib/personal-data';
import PageIntro from '@/components/site/PageIntro';
import SectionHeader from '@/components/home/SectionHeader';
import OffDuty from '@/components/home/OffDuty';

export const metadata: Metadata = {
  title: 'About',
  description:
    "AI engineer in New York: how I work, experience, education, and skills. NYU '26, open to Forward Deployed Engineer and AI Engineer roles.",
};

// Carried over from the previous site's "How I work" page.
const PRINCIPLES = [
  {
    title: 'Find the real constraint first.',
    body: 'The request is rarely the problem. At LexTrack the ask was "use AI to generate restaurant config," and the first pure-LLM prototype did exactly that: 4x slower, and hallucinating on the fields that had to be right. 25+ merchant interviews surfaced the actual constraint: merchants would not trust config they could not verify. That one finding set the architecture, deterministic rules for every field with one right answer and Gemini only for the ambiguous rest. The real constraint almost never shows up in conversation one.',
  },
  {
    title: 'Put a hard wall where a wrong answer is expensive.',
    body: 'The model reads and proposes; code and people decide. QuadTax\'s LLM never touches the tax math. ResidenceOS\'s model never sets a legal due date: those come from a versioned TypeScript rule table, and its extraction schema has no field that can express an action, so a prompt injection has nowhere to write "compliant." The triage agent always escalates billing, security, and sales tickets to a human, regardless of how confident the model claims to be. Guardrails are permissions, not prompts.',
  },
  {
    title: 'Measure it instead of assuming it.',
    body: "Every model choice gets a number. ResidenceOS's cheaper extraction model matched the baseline 14/14 on fixtures at about one ninth of the cost. On the triage agent, $0.25 of paid inference across the same 40 tickets cut the incomplete rate from 50% to 7.5%, measured rather than guessed. At LexTrack, model evals across GPT-4, Claude, and Gemini cut inference cost 40% while holding sub-2s p95. And when a number is weaker, I say so: QuadTax's 35-to-10-minute filing time is self-tested, not user-tested yet.",
  },
  {
    title: 'Ship to real conditions, then write down what broke.',
    body: "LexTrack's 3-layer fallback exists because a Gemini timeout during a merchant's setup was downtime, not a degraded answer; it held 99.5% uptime across 50+ partners. On ResidenceOS, a green RLS test suite hid a broken create-building form for six days, because every test checked that the wrong people were blocked and none checked that the right person could act. Stripe webhooks were silently redirected to the login page. Each one is written up with the fix. The habit that catches them: break the protection on purpose and confirm the check goes red.",
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function AboutPage() {
  const [lead, ...rest] = profile.bio;

  return (
    <>
      <PageIntro eyebrow="[ About ]" aside={`[ ${profile.location} ]`} title="About" />

      <section aria-label="Bio" className="container-site mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4">
          <Image
            src="/hamid-about.webp"
            alt="Hamid Rizvi in a graduation gown and tricolour stole, hands folded"
            width={1200}
            height={1607}
            sizes="(min-width: 768px) 24rem, 20rem"
            priority
            className="h-auto w-full max-w-xs md:max-w-sm"
          />
        </div>
        <div className="md:col-span-8">
          <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] text-beige">{lead}</p>
          <div className="mt-8 flex max-w-[68ch] flex-col gap-5 text-lg leading-relaxed text-beige/90">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-beige underline underline-offset-4 hover:text-burgundy-bright">
              Résumé (PDF) ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/contact" className="text-beige underline-offset-4 hover:underline">
              Get in touch →
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-label" className="container-site mt-section">
        <SectionHeader id="principles-label" label="[01] How I work" aside="Four habits, each backed by a project" />
        <ol>
          {PRINCIPLES.map((p, n) => (
            <li
              key={p.title}
              className="grid gap-x-8 gap-y-3 border-b border-rule py-8 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.4fr)] md:py-12"
            >
              <span className="label">{pad(n + 1)}</span>
              <h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] text-beige">{p.title}</h3>
              <p className="max-w-[68ch] leading-relaxed text-beige/90">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="experience-label" className="container-site mt-section">
        <SectionHeader id="experience-label" label="[02] Experience" />
        <ul>
          {experience.map((e) => (
            <li key={e.role} className="grid gap-x-8 gap-y-1 border-b border-rule py-6 md:grid-cols-12 md:items-baseline">
              <h3 className="font-display text-2xl text-beige md:col-span-5">{e.role}</h3>
              <p className="text-camel md:col-span-4">
                {e.company} · {e.location}
              </p>
              <p className="label md:col-span-3 md:text-right">{e.period}</p>
            </li>
          ))}
        </ul>
        <Link href="/work/lextrack" className="mt-6 inline-block text-sm text-beige underline-offset-4 hover:underline">
          Read the LexTrack case study →
        </Link>
      </section>

      <section aria-labelledby="education-label" className="container-site mt-section">
        <SectionHeader id="education-label" label="[03] Education" />
        <ul>
          {education.map((e) => (
            <li key={e.school} className="grid gap-x-8 gap-y-1 border-b border-rule py-6 md:grid-cols-12 md:items-baseline">
              <h3 className="font-display text-2xl text-beige md:col-span-5">{e.degree}</h3>
              <p className="text-camel md:col-span-4">{e.school}</p>
              <p className="label md:col-span-3 md:text-right">{e.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills-label" className="container-site mt-section">
        <SectionHeader id="skills-label" label="[04] Skills and certifications" />
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((s) => (
            <div key={s.group}>
              <h3 className="label">{s.group}</h3>
              <ul className="mt-4 flex flex-col gap-1.5 text-beige/90">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="label">Certifications</h3>
            <ul className="mt-4 flex flex-col gap-1.5 text-beige/90">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <OffDuty />
    </>
  );
}
