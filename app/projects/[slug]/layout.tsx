import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectSpace, projectSpaces } from '@/lib/jira-data';
import ProjectHeader from '@/components/project/ProjectHeader';

export function generateStaticParams() {
  return projectSpaces.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectSpace(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Hamid Rizvi`,
    description: project.hero,
  };
}

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const project = getProjectSpace(params.slug);
  if (!project) notFound();

  return (
    <div className="project-shell">
      <ProjectHeader project={project} />
      {children}
    </div>
  );
}
