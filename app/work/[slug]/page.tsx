/**
 * app/work/[slug]/page.tsx
 *
 * Deep case study pages — /work/lextrack, /work/quadtax.
 *
 * Statically generated from lib/deep-dives.ts. Each page is a long-form
 * decision narrative (context → role → hard decisions → outcomes → retro)
 * that the homepage chapters link to and that can be shared directly in
 * job applications.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DeepDiveArticle from '@/components/DeepDiveArticle';
import { deepDives, getDeepDive } from '@/lib/deep-dives';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return deepDives.map((dive) => ({ slug: dive.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const dive = getDeepDive(params.slug);
  if (!dive) return {};
  const title = `${dive.title} — Deep case study · Hamid Rizvi`;
  return {
    title,
    description: dive.subtitle,
    openGraph: {
      title,
      description: dive.subtitle,
      type: 'article',
    },
  };
}

export default function DeepDivePage({ params }: PageProps) {
  const dive = getDeepDive(params.slug);
  if (!dive) notFound();

  return (
    <main>
      <DeepDiveArticle dive={dive} />
    </main>
  );
}
