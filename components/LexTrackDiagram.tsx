'use client';

/**
 * LexTrackDiagram — SVG flowchart of the hybrid AI routing architecture.
 * Replaces the ASCII diagram with a proper vector illustration.
 */
export default function LexTrackDiagram() {
  const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)' };
  const accent = '#0C66E4';
  const border = '#C1C7D0';
  const fill   = '#F7F8F9';
  const text   = '#44546F';
  const dim    = '#8590A2';
  const line   = '#8590A2';

  return (
    <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
      <svg
        viewBox="0 0 560 710"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto' }}
        role="img"
        aria-label="LexTrack hybrid AI architecture diagram"
      >
        <defs>
          <marker id="lx-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={line} />
          </marker>
        </defs>

        {/* ── MERCHANT INPUT ── */}
        <rect x="118" y="12" width="304" height="44" rx="22" fill={fill} stroke={border} strokeWidth="1.5" />
        <text x="270" y="37" textAnchor="middle" fontSize="11" fill={text} style={mono}>
          Merchant:
        </text>
        <text x="270" y="50" textAnchor="middle" fontSize="10" fill={dim}>
          "Describe your restaurant in one sentence"
        </text>

        {/* Arrow: Input → Router */}
        <line x1="270" y1="56" x2="270" y2="90" stroke={line} strokeWidth="1.5" markerEnd="url(#lx-arrow)" />

        {/* ── FIELD ROUTER ── */}
        <rect x="168" y="92" width="204" height="56" rx="4" fill={fill} stroke={border} strokeWidth="1.5" />
        <text x="270" y="116" textAnchor="middle" fontSize="9" fill={text} letterSpacing="1" style={mono}>
          FIELD ROUTER
        </text>
        <text x="270" y="135" textAnchor="middle" fontSize="10" fill={dim}>
          deterministic classifier
        </text>

        {/* Fork: Router → DET (left) */}
        <line x1="220" y1="148" x2="220" y2="163" stroke={line} strokeWidth="1.5" />
        <line x1="110"  y1="163" x2="220" y2="163" stroke={line} strokeWidth="1.5" />
        <line x1="110"  y1="163" x2="110" y2="210" stroke={line} strokeWidth="1.5" markerEnd="url(#lx-arrow)" />

        {/* Fork: Router → GEMINI (right) */}
        <line x1="320" y1="148" x2="320" y2="163" stroke={line} strokeWidth="1.5" />
        <line x1="320" y1="163" x2="430" y2="163" stroke={line} strokeWidth="1.5" />
        <line x1="430" y1="163" x2="430" y2="182" stroke={line} strokeWidth="1.5" markerEnd="url(#lx-arrow)" />

        {/* Fork labels */}
        <text x="155" y="160" textAnchor="middle" fontSize="8.5" fill={dim} style={mono}>
          verifiable
        </text>
        <text x="380" y="160" textAnchor="middle" fontSize="8.5" fill={dim} style={mono}>
          ambiguous
        </text>

        {/* ── DETERMINISTIC ZONE ── */}
        <rect x="12" y="212" width="196" height="140" rx="4" fill={fill} stroke={border} strokeWidth="1.5" />
        <text x="110" y="234" textAnchor="middle" fontSize="8.5" fill={text} letterSpacing="0.8" style={mono}>
          DETERMINISTIC ZONE
        </text>
        <line x1="22" y1="241" x2="198" y2="241" stroke={border} strokeWidth="1" />
        <text x="28" y="261" fontSize="10.5" fill={text}>Table counts</text>
        <text x="28" y="279" fontSize="10.5" fill={text}>Party sizes</text>
        <text x="28" y="297" fontSize="10.5" fill={text}>Booking hours</text>
        <text x="28" y="315" fontSize="10.5" fill={text}>Floor layout</text>
        <text x="28" y="337" fontSize="9.5" fill={dim}>Always returns a value</text>

        {/* ── GEMINI LLM ── */}
        <rect x="332" y="184" width="196" height="148" rx="4" fill={fill} stroke={border} strokeWidth="1.5" />
        <text x="430" y="206" textAnchor="middle" fontSize="8.5" fill={text} letterSpacing="0.8" style={mono}>
          GEMINI LLM
        </text>
        <text x="430" y="222" textAnchor="middle" fontSize="9" fill={dim}>
          Ambiguous only
        </text>
        <line x1="342" y1="228" x2="518" y2="228" stroke={border} strokeWidth="1" />
        <text x="348" y="248" fontSize="10.5" fill={text}>Service style</text>
        <text x="348" y="266" fontSize="10.5" fill={text}>Deposit rules</text>
        <text x="348" y="284" fontSize="10.5" fill={text}>Custom notes</text>
        <text x="348" y="302" fontSize="10.5" fill={text}>Tone &amp; personality</text>
        <text x="348" y="320" fontSize="10.5" fill={text}>~40 fields</text>

        {/* Arrow: Gemini → Fallback */}
        <line x1="430" y1="332" x2="430" y2="370" stroke={line} strokeWidth="1.5" markerEnd="url(#lx-arrow)" />

        {/* ── 3-LAYER FALLBACK ── */}
        <rect x="316" y="372" width="228" height="106" rx="4" fill={fill} stroke={accent} strokeWidth="1.5" />
        <text x="430" y="394" textAnchor="middle" fontSize="8.5" fill={accent} letterSpacing="0.8" style={mono}>
          3-LAYER FALLBACK
        </text>
        <line x1="326" y1="401" x2="534" y2="401" stroke="rgba(12,102,228,0.25)" strokeWidth="1" />
        <text x="332" y="421" fontSize="10.5" fill={text}>1 → Primary LLM call</text>
        <text x="332" y="439" fontSize="10.5" fill={text}>2 → Cached response</text>
        <text x="332" y="457" fontSize="10.5" fill={text}>3 → Deterministic default</text>

        {/* ── Y-MERGE ── */}
        {/* Left arm: DET bottom → down → right to center */}
        <line x1="110" y1="352" x2="110" y2="516" stroke={line} strokeWidth="1.5" />
        <line x1="110" y1="516" x2="270" y2="516" stroke={line} strokeWidth="1.5" />

        {/* Right arm: Fallback bottom → down → left to center */}
        <line x1="430" y1="478" x2="430" y2="516" stroke={line} strokeWidth="1.5" />
        <line x1="270" y1="516" x2="430" y2="516" stroke={line} strokeWidth="1.5" />

        {/* Arrow from merge → Review */}
        <line x1="270" y1="516" x2="270" y2="532" stroke={line} strokeWidth="1.5" markerEnd="url(#lx-arrow)" />

        {/* ── REVIEW SCREEN ── */}
        <rect x="140" y="534" width="260" height="64" rx="4" fill={fill} stroke={border} strokeWidth="1.5" />
        <text x="270" y="558" textAnchor="middle" fontSize="8.5" fill={text} letterSpacing="0.8" style={mono}>
          POST-GENERATION REVIEW
        </text>
        <text x="270" y="578" textAnchor="middle" fontSize="10" fill={dim}>
          flagged fields surfaced first
        </text>

        {/* Arrow: Review → Live App */}
        <line x1="270" y1="598" x2="270" y2="628" stroke={line} strokeWidth="1.5" markerEnd="url(#lx-arrow)" />

        {/* ── LIVE APP READY ── */}
        <rect x="148" y="630" width="244" height="64" rx="4" fill={accent} />
        <text x="270" y="657" textAnchor="middle" fontSize="9" fill="white" letterSpacing="0.8" style={mono}>
          LIVE APP READY
        </text>
        <text x="270" y="678" textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.82)">
          80+ fields · ~5 minutes total
        </text>
      </svg>
    </div>
  );
}
