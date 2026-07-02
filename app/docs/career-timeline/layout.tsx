import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Timeline — Hamid Rizvi',
  description: 'Experience, education, certifications, and the skills behind all five projects.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
