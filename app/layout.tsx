/**
 * app/layout.tsx
 *
 * The root layout. Wraps every page with:
 *   - <html> + <body> shell with the editorial dark theme
 *   - Global CSS (design tokens, typography, base styles)
 *   - SEO metadata (title, description, OG tags for LinkedIn shares)
 *   - Viewport meta for proper mobile rendering
 *
 * Fonts are loaded via Google Fonts CDN in globals.css. To self-host
 * for better performance, swap to next/font/google — see README.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hamid Rizvi — AI Product Manager',
  description:
    'AI Product Manager turning AI capabilities into shipped products. NYU Stern May 2026. Currently building production RAG at LexTrack AI.',
  authors: [{ name: 'Hamid Rizvi' }],
  keywords: [
    'AI Product Manager',
    'Product Manager',
    'NYU',
    'Hamid Rizvi',
    'LexTrack',
    'RAG',
    'LLM',
    'Gemini',
    'Portfolio',
  ],
  openGraph: {
    title: 'Hamid Rizvi — AI Product Manager',
    description:
      'Turning AI capabilities into shipped products. Available May 2026.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hamid Rizvi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamid Rizvi — AI Product Manager',
    description:
      'Turning AI capabilities into shipped products. Available May 2026.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F0E0C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
