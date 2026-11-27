/**
 * ResultsTable.tsx
 *
 * One evaluation table: arms down the side, metrics across, numbers right-
 * aligned in lining figures so they compare by column. The accent row is the
 * arm that ships; dim rows are baselines or rejected arms. Phones get one
 * labelled card per row instead; between md and lg a wide table scrolls
 * inside its own frame, never the page.
 */

import type { ResultTable } from '@/lib/deep-dives';

const ROW_TONE = {
  accent: 'text-beige',
  dim: 'text-beige/55',
  none: 'text-beige/85',
} as const;

export default function ResultsTable({ table }: { table: ResultTable }) {
  return (
    <figure className="min-w-0">
      <figcaption className="label">{table.title}</figcaption>
      {/* Phones: one card per row, every value labelled. */}
      <ul className="mt-4 flex flex-col md:hidden">
        {table.rows.map((row) => {
          const [label, ...cells] = row.cells;
          return (
            <li
              key={label}
              className={`border-b border-rule px-3 py-4 ${row.tone === 'accent' ? 'bg-burgundy/10' : ''}`}
            >
              <p className={ROW_TONE[row.tone ?? 'none']}>
                {label}
                {row.tag && (
                  <span
                    className={`label ml-2 inline-block whitespace-nowrap rounded-full border px-2 py-0.5 align-middle ${
                      row.tone === 'accent' ? 'border-burgundy-bright text-beige' : 'border-rule'
                    }`}
                  >
                    {row.tag}
                  </span>
                )}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                {cells.map((c, i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="label flex-1">{table.columns[i + 1]}</dt>
                    <dd className={`mt-1 lining-nums tabular-nums ${ROW_TONE[row.tone ?? 'none']}`}>{c}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label={table.title}>
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm md:text-base">
          <thead>
            <tr>
              {table.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`label border-b border-rule pb-3 align-bottom font-normal ${i === 0 ? 'pr-4' : 'pl-4 text-right'}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              const tone = ROW_TONE[row.tone ?? 'none'];
              const [label, ...cells] = row.cells;
              return (
                <tr key={label} className={`border-b border-rule ${row.tone === 'accent' ? 'bg-burgundy/10' : ''}`}>
                  <th scope="row" className={`py-3.5 pl-3 pr-4 text-left font-normal ${tone}`}>
                    {label}
                    {row.tag && (
                      <span
                        className={`label ml-2 inline-block whitespace-nowrap rounded-full border px-2 py-0.5 align-middle ${
                          row.tone === 'accent' ? 'border-burgundy-bright text-beige' : 'border-rule'
                        }`}
                      >
                        {row.tag}
                      </span>
                    )}
                  </th>
                  {cells.map((c, i) => (
                    <td key={i} className={`whitespace-nowrap py-3.5 pl-4 text-right lining-nums tabular-nums ${tone}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-camel">{table.note}</p>}
    </figure>
  );
}
