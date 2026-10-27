import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import Providers from '@/components/site/Providers';
import Preloader, { PRELOADER_GATE } from '@/components/site/Preloader';
import Header from '@/components/site/Header';
import FooterCTA from '@/components/site/FooterCTA';
import Cursor from '@/components/site/Cursor';
import 'lenis/dist/lenis.css';
import './globals.css';

// Self-hosted at build time by next/font, with size-adjusted fallbacks so
// the swap causes no layout shift (next/font has fallback metrics for all
// three; it has none for Newsreader, which is why it isn't used). All-serif
// system: Cormorant Garamond for display (its italic carries the accent
// words), Source Serif 4 for reading text (optical sizing keeps small text
// sturdy on the dark background), and JetBrains Mono only for the bracketed
// labels.
const display = Cormorant_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});
const body = Source_Serif_4({
  style: ['normal', 'italic'],
  axes: ['opsz'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hamidrizvi.vercel.app'),
  title: { default: 'Hamid Rizvi — AI Engineer, Forward Deployed', template: '%s · Hamid Rizvi' },
  description:
    "AI engineer who deploys LLM systems into real workflows: hybrid rules-plus-LLM architectures, evals, guardrails, and honest write-ups of what broke. Shipped production AI at LexTrack AI. NYU '26, open to Forward Deployed Engineer and AI Engineer roles.",
  authors: [{ name: 'Hamid Rizvi' }],
  keywords: [
    'Forward Deployed Engineer',
    'AI Engineer',
    'LLM Evals',
    'NYU',
    'Hamid Rizvi',
    'LexTrack',
    'RAG',
    'LLM',
    'Gemini',
    'Portfolio',
  ],
  openGraph: {
    title: 'Hamid Rizvi — AI Engineer, Forward Deployed',
    description: "I deploy AI into messy real-world workflows, and write down what broke. Open to FDE and AI Engineer roles.",
    type: 'website',
    locale: 'en_US',
    siteName: 'Hamid Rizvi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamid Rizvi — AI Engineer, Forward Deployed',
    description: "I deploy AI into messy real-world workflows, and write down what broke. Open to FDE and AI Engineer roles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0908',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: PRELOADER_GATE and the motion toggle set
    // data-* attributes on <html> before React hydrates.
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE }} />
      </head>
      <body className="bg-ink text-beige">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Preloader />
          <Header />
          <main id="main">{children}</main>
          <FooterCTA />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
