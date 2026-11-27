/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  // lib/hamid-knowledge.md is imported as a raw string (lib/knowledge.ts),
  // so the chat route and the hero read it without filesystem access at
  // runtime. Only server code imports it; it never reaches the browser.
  webpack(config) {
    config.module.rules.push({ test: /\.md$/, type: 'asset/source' });
    return config;
  },

  // The previous design lived at /projects/[slug]/(narrative|backlog|timeline),
  // /docs/*, and /teams. Those links went out in job applications, so they
  // land on the matching new page. (The old site's /work/[slug] → /projects
  // redirect was served with max-age=0, so no browser holds it.)
  async redirects() {
    return [
      { source: '/projects/:slug/:tab*', destination: '/work/:slug', permanent: true },
      { source: '/docs/:page*', destination: '/about', permanent: true },
      { source: '/teams', destination: '/about', permanent: true },
    ];
  },
};

export default nextConfig;
