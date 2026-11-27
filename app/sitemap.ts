import type { MetadataRoute } from 'next';
import { projects } from '@/lib/projects';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hamidrizvi.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/work', ...projects.map((p) => `/work/${p.slug}`), '/about', '/contact'].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));
}
