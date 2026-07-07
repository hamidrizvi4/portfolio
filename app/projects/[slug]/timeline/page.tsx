import { notFound } from 'next/navigation';
import { getProjectSpace, projectSpaces } from '@/lib/jira-data';
import TimelineChart from '@/components/project/TimelineChart';

export function generateStaticParams() {
  return projectSpaces.map((p) => ({ slug: p.slug }));
}

export default function ProjectTimelinePage({ params }: { params: { slug: string } }) {
  const project = getProjectSpace(params.slug);
  if (!project) notFound();

  return (
    <div className="page-shell">
      {/* The chart below runs chronologically; appending project.period here
          printed LexTrack's two stints newest-first, contradicting it. */}
      <p className="page-shell__intro">
        {project.title}'s build, phase by phase, at the month-level precision the dates support.
      </p>
      <TimelineChart timeline={project.timeline} />
    </div>
  );
}
