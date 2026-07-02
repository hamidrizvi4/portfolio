/**
 * search-index.ts
 *
 * Static, build-time search index over projects, docs, and skills.
 * Client-side substring match — small enough (dozens of entries) that
 * a real search service would be overkill.
 */

import { projectSpaces } from './jira-data';
import { skills, experience, education } from './personal-data';

export interface SearchEntry {
  id: string;
  type: 'Project' | 'Doc' | 'Skill' | 'Team';
  title: string;
  subtitle: string;
  url: string;
}

const docs: SearchEntry[] = [
  { id: 'doc-how-i-work', type: 'Doc', title: 'How I Work', subtitle: 'PM philosophy: 4 principles tested in production', url: '/docs/how-i-work' },
  { id: 'doc-career', type: 'Doc', title: 'Career Timeline', subtitle: 'Experience, education, certifications', url: '/docs/career-timeline' },
  { id: 'doc-off-duty', type: 'Doc', title: 'Off Duty', subtitle: 'Photography, chess, case study practice', url: '/docs/off-duty' },
];

const projectEntries: SearchEntry[] = projectSpaces.map((p) => ({
  id: `project-${p.slug}`,
  type: 'Project',
  title: p.title,
  subtitle: p.hero,
  url: `/projects/${p.slug}`,
}));

const skillEntries: SearchEntry[] = Object.entries(skills).flatMap(([category, list]) =>
  (list as readonly string[]).map((skill) => ({
    id: `skill-${category}-${skill}`,
    type: 'Skill' as const,
    title: skill,
    subtitle: `Skill · ${category === 'ai' ? 'AI / LLM' : category[0].toUpperCase() + category.slice(1)}`,
    url: '/docs/career-timeline',
  }))
);

const teamEntries: SearchEntry[] = [
  ...experience.map((e, i) => ({
    id: `exp-${i}`,
    type: 'Team' as const,
    title: e.company,
    subtitle: `${e.role} · ${e.period}`,
    url: '/docs/career-timeline',
  })),
  ...education.map((e, i) => ({
    id: `edu-${i}`,
    type: 'Team' as const,
    title: e.school,
    subtitle: e.degree,
    url: '/docs/career-timeline',
  })),
  { id: 'team-testimonial', type: 'Team' as const, title: 'Santrupth Vedanthi', subtitle: 'Reference, CEO at LexTrack AI', url: '/teams' },
];

export const searchIndex: SearchEntry[] = [...projectEntries, ...docs, ...teamEntries, ...skillEntries];

export function searchSite(query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .filter((e) => e.title.toLowerCase().includes(q) || e.subtitle.toLowerCase().includes(q))
    .slice(0, limit);
}
