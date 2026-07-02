/**
 * app/icon.tsx
 *
 * Auto-registered favicon. The site previously shipped no icon at all,
 * so every page load logged a 404 for /favicon.ico. Renders the same
 * HR mark the top bar logo uses, on Jira blue.
 */

import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c66e4',
          borderRadius: 7,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'monospace',
        }}
      >
        HR
      </div>
    ),
    { ...size }
  );
}
