import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teams — Hamid Rizvi',
  description: 'Three shipped teams and a reference from the person who assigned the work.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
