/**
 * Figure.tsx
 *
 * A case study screenshot shown whole, at its natural ratio, with a caption.
 * Unlike ProjectVisual (a cropped slot), nothing here is cut off: these are
 * evidence for a decision, so every axis label has to stay in frame.
 */

import Image from 'next/image';
import type { Figure as FigureData } from '@/lib/deep-dives';

export default function Figure({ fig, className = '' }: { fig: FigureData; className?: string }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden border border-rule bg-ink-2">
        <Image
          src={fig.src}
          alt={fig.alt}
          width={fig.width}
          height={fig.height}
          sizes="(min-width: 768px) 66vw, 100vw"
          className="h-auto w-full"
        />
      </div>
      {fig.caption && <figcaption className="mt-3 max-w-[68ch] text-sm leading-relaxed text-camel">{fig.caption}</figcaption>}
    </figure>
  );
}
