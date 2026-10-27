/**
 * EarlierWork.tsx
 *
 * The non-featured projects as a compact list: smaller type, no hover
 * preview. Deliberately quieter than Selected work ("depth over volume").
 */

import Link from 'next/link';
import { byTier } from '@/lib/projects';
import SectionHeader from './SectionHeader';

const EARLIER = byTier('earlier');

export default function EarlierWork({
  label = `[ Earlier work (${String(EARLIER.length).padStart(2, '0')}) ]`,
}: {
  label?: string;
}) {
  return (
    <section aria-labelledby="earlier-label" className="container-site mt-section">
      <SectionHeader id="earlier-label" label={label} aside="[2025]" />
      <ul>
        {EARLIER.map((p, i) => (
          <li key={p.slug} className="border-b border-rule">
            <Link href={`/work/${p.slug}`} data-cursor="View" className="group flex items-baseline gap-4 py-5 md:gap-8">
              <span className="label w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 transition-transform duration-base ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
                <span className="block font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-beige transition-colors duration-base group-hover:text-burgundy-bright group-focus-visible:text-burgundy-bright">
                  {p.title}
                </span>
                <span className="mt-1 block text-sm text-camel md:hidden">{p.category}</span>
              </span>
              <span className="hidden w-72 shrink-0 text-sm text-camel md:block">{p.category}</span>
              <span className="label hidden w-28 shrink-0 md:block">[{p.year}]</span>
              <span className="shrink-0 text-sm text-beige">View →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
