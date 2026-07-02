import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How I Work — Hamid Rizvi',
  description: 'Four product principles tested in production, not borrowed from a textbook.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
