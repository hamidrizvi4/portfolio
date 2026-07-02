import { notFound } from 'next/navigation';
import { getProjectSpace, projectSpaces } from '@/lib/jira-data';
import ProjectSummaryView from '@/components/project/ProjectSummaryView';

export function generateStaticParams() {
  return projectSpaces.map((p) => ({ slug: p.slug }));
}

export default function ProjectSummaryPage({ params }: { params: { slug: string } }) {
  const project = getProjectSpace(params.slug);
  if (!project) notFound();

  return <ProjectSummaryView project={project} />;
}
