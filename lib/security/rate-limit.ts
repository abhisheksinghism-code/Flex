// Simple fixed-window rate limiter, in-memory per server process.
// Enough for a single-instance MVP. If Flex is ever deployed to multi-instance
// serverless, each instance has its own counters — swap this for Upstash
// Redis (free tier) at that point; see docs/ROADMAP.md.

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    windows.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

// Bound memory: an attacker spraying unique keys (e.g. spoofed IPs) can't
// grow this map forever.
const MAX_TRACKED_KEYS = 50_000;
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  if (windows.size > MAX_TRACKED_KEYS) windows.clear();
}, 60_000).unref?.();
