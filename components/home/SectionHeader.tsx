/**
 * SectionHeader.tsx
 *
 * The signature eyebrow row: bracketed mono label on the left, optional
 * metadata or control on the right, hairline rule below. The label doubles
 * as the section's heading (referenced by aria-labelledby).
 */

export default function SectionHeader({ id, label, aside }: { id: string; label: string; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-4">
      <h2 id={id} className="label">
        {label}
      </h2>
      {aside && <div className="label flex items-baseline gap-4">{aside}</div>}
    </div>
  );
}
