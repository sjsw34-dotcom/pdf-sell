import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates API secret key from request header.
 * Returns null if valid, or a 401 NextResponse if invalid.
 *
 * Usage:
 *   const authError = validateApiKey(request);
 *   if (authError) return authError;
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
  const secret = process.env.API_SECRET;
  if (!secret) {
    // If no secret is configured, allow all requests (dev mode)
    return null;
  }

  const provided = request.headers.get('x-api-key');
  if (provided !== secret) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing API key' },
      { status: 401 },
    );
  }

  return null;
}
