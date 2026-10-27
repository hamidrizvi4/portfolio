import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label">[ 404 ]</p>
      <h1 className="mt-6 font-display text-[clamp(3.5rem,12vw,10rem)] font-medium leading-[0.9] tracking-[-0.03em] text-beige">
        Not here.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-camel">
        This page doesn&apos;t exist. Links to the previous version of this site redirect, so this one may be a typo.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
        <Link href="/" className="text-beige underline-offset-4 hover:underline">
          ← Home
        </Link>
        <Link href="/work" className="text-beige underline-offset-4 hover:underline">
          See the work →
        </Link>
      </div>
    </div>
  );
}
