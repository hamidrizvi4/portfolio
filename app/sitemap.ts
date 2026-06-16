import { MetadataRoute } from 'next';
import { deepDives } from '@/lib/deep-dives';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hamidrizvi.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const workPages: MetadataRoute.Sitemap = deepDives.map((dive) => ({
    url: `${BASE_URL}/work/${dive.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...workPages,
  ];
}
