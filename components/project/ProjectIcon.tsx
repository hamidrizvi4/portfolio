'use client';

/**
 * ProjectIcon.tsx
 *
 * Per-project brand marks, recreated as inline SVG from the reference
 * icons: LexTrack's red mic badge, Squirrel AI's white-squirrel-on-dark
 * mark, QuadTax's ghost-with-percent, and a flat-illustration-palette
 * donut chart for AI Purchase Analytics. The Triage Agent mark is an
 * original design, not a reference icon: a routing fork, standing in for
 * the rules engine that decides auto-resolve versus human escalation.
 * Unknown slugs fall back to the two-letter key chip so future projects
 * render sensibly before they get a mark.
 */

const RADIUS_RATIO = 0.22;

function LexTrackMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#F51D1D" />
      {/* Classic mic tilted toward 10 o'clock: head + tapered stem */}
      <circle cx="30" cy="18" r="7.5" fill="#ffffff" />
      <path
        d="M25.4 24.8 L14.6 35.4 C13.2 36.8 11 36.8 9.8 35.5 C8.6 34.2 8.7 32.1 10 30.8 L21 20.2 C22 22.2 23.5 23.8 25.4 24.8 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function SquirrelMark({ size }: { size: number }) {
  const r = size * RADIUS_RATIO;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx={r * (48 / size)} fill="#333333" />
      {/* Squirrel silhouette: fluffy tail sweeping up-left, body, head with ear */}
      <path
        d="M20.5 12.5
           C15.5 10.5 11 13.5 10.5 17.5
           C13 16 16 16.5 17.5 19
           C19 21.5 18.5 24.5 16.5 27.5
           C14.8 30 14.5 33 16.5 35.2
           C17.8 36.6 19.8 37.4 22 37.5
           L34 37.5
           C34.6 37.5 35 37.1 35 36.6
           C35 36.1 34.6 35.8 34 35.7
           L30 35.3
           C32.6 34 34.2 31.6 33.9 29
           C33.6 26.6 31.7 24.9 29.2 24.5
           C28.7 24.4 28.4 24 28.5 23.5
           C29.6 23.6 30.9 23.4 31.9 22.8
           C32.9 22.2 33.5 21.4 33.7 20.8
           C32.6 20.4 31.5 19.8 30.7 19
           C29.9 18.2 29.3 17.2 29.1 16.2
           C28.9 15.6 28.5 15.1 27.9 14.9
           C28.2 14.2 28.3 13.4 28.1 12.7
           C27.5 13 27 13.6 26.7 14.3
           C26.4 13.6 25.9 13 25.2 12.6
           C25.1 13.4 25.2 14.3 25.6 15
           C23.5 15.6 22 17.3 21.8 19.5
           C21.6 21.5 22.5 23.4 24.1 24.5
           C22.5 21 22.7 16.2 20.5 12.5 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function QuadTaxMark({ size }: { size: number }) {
  const r = size * RADIUS_RATIO;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx={r * (48 / size)} fill="#ffffff" stroke="#E4E6EA" strokeWidth="1.5" />
      {/* Ghost: rounded top, three-scallop wavy bottom */}
      <path
        d="M24 8
           C15 8 11 12 11 21
           L11 35.5
           C11 38.5 13 39.5 15 37.5
           L17.2 35.3
           C18.4 34.1 20.2 34.1 21.4 35.5
           L23 37.6
           C23.6 38.3 24.4 38.3 25 37.6
           L26.6 35.5
           C27.8 34.1 29.6 34.1 30.8 35.3
           L33 37.5
           C35 39.5 37 38.5 37 35.5
           L37 21
           C37 12 33 8 24 8 Z"
        fill="#0B0B0B"
      />
      <circle cx="19" cy="19" r="2.6" fill="#ffffff" />
      <circle cx="29" cy="27" r="2.6" fill="#ffffff" />
      <line x1="29.5" y1="16" x2="18.5" y2="30" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AnalyticsMark({ size }: { size: number }) {
  const r = size * RADIUS_RATIO;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx={r * (48 / size)} fill="#F2E5DC" />
      {/* Donut chart in the flat-illustration palette */}
      <g transform="translate(24 21)">
        <circle r="10" fill="none" stroke="#D97E5A" strokeWidth="6" strokeDasharray="40.8 62.8" transform="rotate(90)" />
        <circle r="10" fill="none" stroke="#8A8B5C" strokeWidth="6" strokeDasharray="15.7 62.8" transform="rotate(-40)" />
        <circle r="10" fill="none" stroke="#E8B64C" strokeWidth="6" strokeDasharray="9.4 62.8" transform="rotate(-95)" />
        <circle r="10" fill="none" stroke="#D9A38F" strokeWidth="6" strokeDasharray="7 62.8" transform="rotate(-150)" />
      </g>
      {/* Bars underneath */}
      <rect x="12" y="37" width="4" height="5" rx="1" fill="#8A8B5C" />
      <rect x="19" y="35" width="4" height="7" rx="1" fill="#D97E5A" />
      <rect x="26" y="38" width="4" height="4" rx="1" fill="#E8B64C" />
      <rect x="33" y="36" width="4" height="6" rx="1" fill="#8A8B5C" />
    </svg>
  );
}

function TriageMark({ size }: { size: number }) {
  const r = size * RADIUS_RATIO;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx={r * (48 / size)} fill="#4338CA" />
      {/* Routing fork: one line in, decision node, two lines out */}
      <line x1="24" y1="9" x2="24" y2="20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="4" fill="#ffffff" />
      <line x1="21" y1="27" x2="13" y2="36" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="27" y1="27" x2="35" y2="36" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="13" cy="38.5" r="2.6" fill="#ffffff" />
      <path d="M31.5 36.5 L34.3 39.3 L39 33.5" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProjectIcon({
  slug,
  keyPrefix,
  size = 20,
}: {
  slug: string;
  keyPrefix?: string;
  size?: number;
}) {
  switch (slug) {
    case 'lextrack':
      return <LexTrackMark size={size} />;
    case 'squirrel':
      return <SquirrelMark size={size} />;
    case 'quadtax':
      return <QuadTaxMark size={size} />;
    case 'analytics':
      return <AnalyticsMark size={size} />;
    case 'triage':
      return <TriageMark size={size} />;
    default:
      return (
        <span
          className="project-icon-fallback"
          style={{ width: size, height: size, fontSize: size * 0.32, borderRadius: size * RADIUS_RATIO }}
          aria-hidden="true"
        >
          {(keyPrefix ?? slug).slice(0, 2).toUpperCase()}
          <style jsx>{`
            .project-icon-fallback {
              background: var(--secondary);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: var(--font-mono);
              font-weight: 700;
              flex-shrink: 0;
            }
          `}</style>
        </span>
      );
  }
}
