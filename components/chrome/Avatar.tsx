'use client';

/**
 * Avatar.tsx
 *
 * Hamid's profile photo, used wherever the "HR" initials circle used
 * to render (top bar, dashboard intro, Teams page). Falls back to the
 * initials if the image ever fails to load.
 */

import { useState } from 'react';

export default function Avatar({ size = 32 }: { size?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="avatar-fallback"
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-hidden="true"
      >
        HR
        <style jsx>{`
          .avatar-fallback {
            border-radius: 50%;
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

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/profile.jpg"
      alt="Hamid Rizvi"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        display: 'block',
      }}
    />
  );
}
