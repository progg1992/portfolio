import "server-only";

/**
 * Sliding-window limit: 5 submissions per IP per hour (PTR-27).
 *
 * This counter lives in one server instance's memory. On a single long-lived
 * server it is exact; on serverless it is per instance, so it slows a casual
 * flood but is not a hard guarantee. The edge layer is a Vercel Firewall rate
 * rule on POST /contact (5 per 10 minutes, the longest window Vercel allows
 * below Enterprise), set when the project is imported (PTR-13, runbook).
 * Only IPs and timestamps are held, and entries expire after an hour.
 */

export const WINDOW_MS = 60 * 60 * 1000;
export const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function allow(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep memory bounded: drop expired entries occasionally.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return true;
}

/** Test helper. */
export function reset() {
  hits.clear();
}
