import type { Metadata } from 'next';
import NotFoundContent from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: '404 — Page not found · Hamid Rizvi',
};

export default function NotFound() {
  return <NotFoundContent />;
}
