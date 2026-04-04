import { NextRequest, NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Rate Limiter (in-memory, per-IP)                                  */
/* ------------------------------------------------------------------ */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;  // 1 minute
const RATE_LIMIT_MAX = 30;            // max requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60_000);

/* ------------------------------------------------------------------ */
/*  Extract client IP from request                                    */
/* ------------------------------------------------------------------ */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/* ------------------------------------------------------------------ */
/*  API Key Validation                                                */
/* ------------------------------------------------------------------ */
/**
 * Validates API secret key from request header.
 * Returns null if valid, or a 401/429 NextResponse if invalid.
 *
 * IMPORTANT: API_SECRET must be set in production.
 * If not set, all requests are BLOCKED (fail-closed).
 *
 * Usage:
 *   const authError = validateApiKey(request);
 *   if (authError) return authError;
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
  // --- Rate limiting ---
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  // --- API key check (fail-closed: no secret = block all) ---
  const secret = process.env.API_SECRET;
  if (!secret) {
    console.error('[api-auth] API_SECRET is not configured — blocking request');
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 },
    );
  }

  const provided = request.headers.get('x-api-key');
  if (!provided || provided !== secret) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing API key' },
      { status: 401 },
    );
  }

  return null;
}
