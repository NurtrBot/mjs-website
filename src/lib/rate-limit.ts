// Simple in-memory rate limiter
// Tracks requests per IP with a sliding window

const requests = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requests) {
    if (now > data.resetAt) requests.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const existing = requests.get(key);

  if (!existing || now > existing.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count++;
  return { allowed: true, remaining: maxRequests - existing.count, retryAfterMs: 0 };
}
