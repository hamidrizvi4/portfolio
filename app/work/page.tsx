import type { Metadata } from 'next';
import { byTier, projects } from '@/lib/projects';
import PageIntro from '@/components/site/PageIntro';
import SelectedWork from '@/components/home/SelectedWork';
import EarlierWork from '@/components/home/EarlierWork';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Case studies: LexTrack AI in production, then ResidenceOS, the Claude Support Triage Agent, and QuadTax. Each covers the constraint, the calls I made, and what broke.',
};

const MAIN = projects.filter((p) => p.tier !== 'earlier');
const pad = (n: number) => String(n).padStart(2, '0');

export default function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="[ Work ]" aside={`[ ${pad(projects.length)} case studies ]`} title="Work">
        <p className="mt-8 max-w-3xl font-display text-[clamp(1.35rem,2.4vw,2.2rem)] leading-[1.2] text-beige">
          LexTrack AI is the production deployment. ResidenceOS, the support triage agent, and QuadTax are the three
          I&apos;d walk you through first. Each case study covers the constraint, the calls I made, and what broke.
        </p>
      </PageIntro>
      <SelectedWork
        id="index"
        items={MAIN}
        label={`[01] Experience and selected work (${pad(MAIN.length)})`}
        aside="[2025 — 2026]"
      />
      <EarlierWork label={`[02] Earlier work (${pad(byTier('earlier').length)})`} />
    </>
  );
}
