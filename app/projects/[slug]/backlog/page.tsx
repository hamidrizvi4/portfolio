import { notFound } from 'next/navigation';
import { getProjectSpace, projectSpaces } from '@/lib/jira-data';
import BacklogList from '@/components/project/BacklogList';

export function generateStaticParams() {
  return projectSpaces.map((p) => ({ slug: p.slug }));
}

export default function ProjectBacklogPage({ params }: { params: { slug: string } }) {
  const project = getProjectSpace(params.slug);
  if (!project) notFound();

  return (
    <div className="page-shell">
      <p className="page-shell__intro">
        Every decision behind {project.title} broken into an epic, with the setup, tradeoff,
        call, and result as its own story.
      </p>
      <BacklogList epics={project.epics} />
    </div>
  );
}
