/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // styled-jsx works out of the box in Next.js — no extra config needed.
  // Server actions / RSC are not used in this project; everything is
  // client components + a single API route at /api/chat.
  reactStrictMode: true,

  // Optional: enable typed routes for better DX
  experimental: {
    typedRoutes: false,
  },

  // The deep-dive narrative pages moved from /work/[slug] to
  // /projects/[slug]/narrative (now a tab inside the project space
  // instead of a disconnected page). Old links — including ones already
  // shared in job applications — keep working.
  async redirects() {
    return [
      {
        source: '/work/:slug',
        destination: '/projects/:slug/narrative',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
