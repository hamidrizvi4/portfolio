/**
 * PageIntro.tsx
 *
 * The opening block of every inner page (/work, /work/[slug], /about,
 * /contact): bracketed eyebrow row, the page's h1 at display size, and
 * whatever the page puts under it.
 */

export default function PageIntro({
  eyebrow,
  aside,
  title,
  children,
}: {
  eyebrow: string;
  aside?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-site pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4.5rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-4">
        <p className="label">{eyebrow}</p>
        {aside && <div className="label">{aside}</div>}
      </div>
      <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.92] tracking-[-0.03em] text-beige md:mt-12">
        {title}
      </h1>
      {children}
    </div>
  );
}
