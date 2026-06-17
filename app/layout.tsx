import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hamidrizvi.com'),
  title: 'Hamid Rizvi — AI Product Manager',
  description:
    "AI Product Manager turning AI capabilities into shipped products. NYU Stern '26. Currently building production RAG at LexTrack AI.",
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
    description: 'Turning AI capabilities into shipped products. Available now.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hamid Rizvi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamid Rizvi — AI Product Manager',
    description: 'Turning AI capabilities into shipped products. Available now.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8F5EF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
