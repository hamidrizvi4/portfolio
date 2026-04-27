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
};

export default nextConfig;
