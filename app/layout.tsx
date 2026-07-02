import type { Metadata, Viewport } from 'next';
import AppShell from '@/components/chrome/AppShell';
import './globals.css';

// Fonts are Jira's own system-font stack, declared directly as CSS
// variables in globals.css — no webfont download, matching what Jira
// Cloud itself renders.

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hamidrizvi.com'),
  title: 'Hamid Rizvi — AI Product Manager',
  description:
    "AI Product Manager who prototypes before writing the spec. NYU '26 — shipped production RAG and 0-to-1 AI products at LexTrack AI. Open to full-time PM roles.",
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
    description: "I prototype before I write the spec. Open to full-time PM roles, available now.",
    type: 'website',
    locale: 'en_US',
    siteName: 'Hamid Rizvi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamid Rizvi — AI Product Manager',
    description: "I prototype before I write the spec. Open to full-time PM roles, available now.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c66e4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
