// Rate Limiter for API Endpoints
// Prevents abuse and ensures fair usage

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limit store (per edge function instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations by endpoint type
export const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  // Authentication endpoints - stricter limits
  auth: { windowMs: 60000, maxRequests: 10 }, // 10 per minute
  
  // Financial endpoints - moderate limits
  wallet: { windowMs: 60000, maxRequests: 30 }, // 30 per minute
  payment: { windowMs: 60000, maxRequests: 20 }, // 20 per minute
  
  // Lead and task endpoints - higher limits
  leads: { windowMs: 60000, maxRequests: 100 }, // 100 per minute
  tasks: { windowMs: 60000, maxRequests: 100 },
  
  // Alert/buzzer endpoints - higher limits for real-time
  alerts: { windowMs: 60000, maxRequests: 200 }, // 200 per minute
  
  // Default for other endpoints
  default: { windowMs: 60000, maxRequests: 60 }, // 60 per minute
};

// Generate rate limit key from IP and endpoint
export function getRateLimitKey(clientIP: string, endpoint: string): string {
  return `${clientIP}:${endpoint}`;
}

// Check if request should be rate limited
export function checkRateLimit(
  clientIP: string,
  endpoint: string,
  limitType: keyof typeof RATE_LIMITS = 'default'
): { allowed: boolean; remaining: number; resetIn: number } {
  const key = getRateLimitKey(clientIP, endpoint);
  const config = RATE_LIMITS[limitType] || RATE_LIMITS.default;
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(key);
  
  // Reset if window has passed
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  // Clean up old entries periodically (every 100 requests)
  if (rateLimitStore.size > 1000) {
    cleanupExpiredEntries();
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = Math.max(0, entry.resetAt - now);

  return {
    allowed: entry.count <= config.maxRequests,
    remaining,
    resetIn,
  };
}

// Clean up expired entries
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Add rate limit headers to response
export function addRateLimitHeaders(
  headers: Record<string, string>,
  result: { remaining: number; resetIn: number }
): Record<string, string> {
  return {
    ...headers,
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString(),
  };
}

// Rate limit error response
export function rateLimitExceededResponse(resetIn: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      retry_after: Math.ceil(resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(resetIn / 1000).toString(),
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
