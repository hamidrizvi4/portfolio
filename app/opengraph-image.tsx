/**
 * app/opengraph-image.tsx
 *
 * Auto-registered by Next.js as the root OG image at /opengraph-image.
 * Rendered server-side via Satori (no CSS variables — inline styles only).
 * LinkedIn + Twitter both crawl this URL from the <meta og:image> tag
 * that Next.js injects automatically when this file is present.
 */

import { ImageResponse } from 'next/og';

export const alt = 'Hamid Rizvi — AI Product Manager';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* ── TOP STRIP ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#0c66e4' }} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 13,
                letterSpacing: '0.18em',
                color: '#737373',
                textTransform: 'uppercase',
              }}
            >
              AI PRODUCT MANAGER
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: '0.12em',
              color: '#a3a3a3',
              textTransform: 'uppercase',
            }}
          >
            NYU ′26
          </span>
        </div>

        {/* ── NAME + TAGLINE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              color: '#172b4d',
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
            }}
          >
            Hamid Rizvi
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#737373',
              letterSpacing: '-0.01em',
            }}
          >
            I prototype before I write the spec.
          </div>
        </div>

        {/* ── BOTTOM — METRIC + RULE ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                letterSpacing: '0.16em',
                color: '#a3a3a3',
                textTransform: 'uppercase',
              }}
            >
              Headline result
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 80,
                  fontWeight: 700,
                  color: '#0c66e4',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                80%
              </span>
              <span
                style={{
                  fontSize: 22,
                  color: '#404040',
                  letterSpacing: '-0.01em',
                }}
              >
                onboarding time cut
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ width: 40, height: 2, background: '#0c66e4' }} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                letterSpacing: '0.14em',
                color: '#a3a3a3',
                textTransform: 'uppercase',
              }}
            >
              LexTrack AI · QuadTax · NYC
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
