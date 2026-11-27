/**
 * rate-limit.ts
 *
 * Per-IP limit for /api/chat: 8 requests per minute and 60 per day, as a
 * sliding log of request timestamps.
 *
 * ponytail: in-memory, so each serverless instance keeps its own counts and
 * a cold start resets them; a determined visitor spread across instances
 * gets more than the limit. Upgrade path: an Upstash Redis limiter
 * (@upstash/ratelimit) shared by every instance.
 */

const LIMITS = [
  { windowMs: 60_000, max: 8 },
  { windowMs: 86_400_000, max: 60 },
];
const DAY_MS = 86_400_000;
const SWEEP_AT = 5_000;

const hits = new Map<string, number[]>();

/** Records the request and returns true if it is allowed. Rejected requests are not recorded. */
export function rateLimit(ip: string, now: number = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < DAY_MS);
  const allowed = LIMITS.every(({ windowMs, max }) => recent.filter((t) => now - t < windowMs).length < max);
  if (allowed) recent.push(now);
  hits.set(ip, recent);

  // Keep memory bounded: drop visitors with nothing in the last day.
  if (hits.size > SWEEP_AT) {
    hits.forEach((times, key) => {
      if (!times.some((t) => now - t < DAY_MS)) hits.delete(key);
    });
  }
  return allowed;
}
