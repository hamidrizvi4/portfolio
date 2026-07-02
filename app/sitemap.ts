import { MetadataRoute } from 'next';
import { projectSpaces } from '@/lib/jira-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hamidrizvi.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const projectPages: MetadataRoute.Sitemap = projectSpaces.flatMap((p) => [
    { url: `${BASE_URL}/projects/${p.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/projects/${p.slug}/backlog`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/projects/${p.slug}/timeline`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/projects/${p.slug}/narrative`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
  ]);

  const docPages: MetadataRoute.Sitemap = [
    '/docs/how-i-work',
    '/docs/career-timeline',
    '/docs/off-duty',
    '/teams',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectPages,
    ...docPages,
  ];
}
