import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { deepDives, getDeepDive } from '@/lib/deep-dives';
import DeepDiveArticle from '@/components/DeepDiveArticle';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return deepDives.map((dive) => ({ slug: dive.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const dive = getDeepDive(params.slug);
  if (!dive) return {};
  const title = `${dive.title} — Full decision narrative · Hamid Rizvi`;
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

export default function ProjectNarrativePage({ params }: PageProps) {
  const dive = getDeepDive(params.slug);
  if (!dive) notFound();

  return <DeepDiveArticle dive={dive} />;
}
