import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Off Duty — Hamid Rizvi',
  description: 'Photography, chess, and a daily case-study habit.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
