import { useEffect, useState } from 'react';
import { profile } from './personal-data';

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SOCIALS = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
] as const;

const nycFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * Live NYC wall-clock time, refreshed every 30s. Returns null until mounted
 * so the server render and first client render match (no hydration warning).
 */
export function useNycTime(): string | null {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(nycFormat.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}
