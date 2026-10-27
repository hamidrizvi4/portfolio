/**
 * HeroSection.tsx
 *
 * Server component. Reads the suggested questions (and their fallback
 * answers) from lib/hamid-knowledge.md on the server and hands only those to
 * the client AskOrb, so the knowledge file never ships to the browser.
 *
 * Desktop: name and one-liner on the left, the cutout portrait (lg+), then
 * AskOrb on the right, inside 100svh. Mobile: name → one-liner → orb →
 * input, with the orb shrinking before the type does.
 */

import Image from 'next/image';
import Link from 'next/link';
import AskOrb from './AskOrb';
import { suggestedQuestions } from '@/lib/knowledge';

export default function HeroSection() {
  const prompts = suggestedQuestions();
  // This page is prerendered, so a knowledge-file edit that breaks the chips fails the build.
  if (prompts.length === 0) {
    throw new Error('lib/hamid-knowledge.md: "## Suggested questions" parsed to zero prompts');
  }

  return (
    <section
      aria-label="Introduction"
      className="container-site relative flex min-h-[100svh] flex-col pb-6 pt-[calc(var(--header-h)+0.75rem)]"
    >
      {/* Desktop only, centered and behind the columns, so the name and one-liner can run
          over it. Three quarters of the hero's height under the header (~66svh), vertically
          centred, capped at 26vw below xl and 34vw above so the arrow clears the orb. On phones
          and tablets the orb needs the room to stay inside 100svh. The webp is keyed (outside the repo) from
          the heroimage.jpeg export so the page black shows through instead of the export's lighter one. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 top-[calc(var(--header-h)+0.75rem)] hidden items-center justify-center lg:flex">
        <Image
          src="/hamid-hero.webp"
          alt=""
          width={1792}
          height={2398}
          sizes="(min-width: 1280px) 34vw, 26vw"
          className="h-[75%] w-auto max-w-[26vw] object-contain xl:max-w-[34vw]"
        />
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="label">[ Portfolio / ©2026 ]</p>
        <p className="label">
          AI Engineer · Forward Deployed<span className="hidden sm:inline"> · New York</span>
        </p>
      </div>

      {/* minmax(0,1fr): without it the single mobile column grows to the input's intrinsic width.
          content-start on phones: the answer card grows downward instead of shifting the name up. */}
      <div className="relative grid flex-1 grid-cols-[minmax(0,1fr)] content-start gap-8 py-6 md:grid-cols-12 md:content-center md:items-center md:gap-10">
        <div className="relative md:col-span-7">
          <h1 className="font-display text-hero font-medium text-beige">Hamid Rizvi</h1>
          <p className="mt-5 max-w-2xl font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15] text-beige">
            I deploy <em className="text-burgundy-bright">AI systems</em> into messy, real-world workflows, and write
            down what broke.
          </p>
        </div>
        <div className="relative md:col-span-5">
          <AskOrb prompts={prompts} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="label" aria-hidden="true">
          [ Scroll ↓ ]
        </span>
        <Link href="#work" className="text-sm text-beige underline-offset-4 hover:underline">
          See the work →
        </Link>
      </div>
    </section>
  );
}
