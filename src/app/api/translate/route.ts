import { NextRequest, NextResponse } from 'next/server';
import type { TierCode } from '@/lib/types/tier';
import type { SajuData } from '@/lib/types/saju';
import { TIER_CODES } from '@/lib/types/tier';
import { filterByTier } from '@/lib/utils/filterByTier';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  // 1. body 파싱
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { text: null, error: 'Invalid JSON in request body.' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { text: null, error: 'Request body must be a JSON object.' },
      { status: 400 },
    );
  }

  const b = body as Record<string, unknown>;

  // 2. 필수 필드 검증
  if (typeof b.tier !== 'string' || !(TIER_CODES as readonly string[]).includes(b.tier)) {
    return NextResponse.json(
      { text: null, error: `Invalid tier. Must be one of: ${TIER_CODES.join(', ')}` },
      { status: 400 },
    );
  }

  if (typeof b.partKey !== 'string' || b.partKey.trim() === '') {
    return NextResponse.json(
      { text: null, error: 'partKey is required.' },
      { status: 400 },
    );
  }

  if (typeof b.sajuData !== 'object' || b.sajuData === null) {
    return NextResponse.json(
      { text: null, error: 'sajuData is required.' },
      { status: 400 },
    );
  }

  const sajuData = b.sajuData as SajuData;
  if (!sajuData.info || !sajuData.pillar || !sajuData.yongsin || !sajuData.yinyang) {
    return NextResponse.json(
      { text: null, error: 'sajuData must contain info, pillar, yongsin, and yinyang.' },
      { status: 400 },
    );
  }

  if (b.additionalRequest !== null && typeof b.additionalRequest !== 'string') {
    return NextResponse.json(
      { text: null, error: 'additionalRequest must be a string or null.' },
      { status: 400 },
    );
  }

  const clientName = typeof b.clientName === 'string' && b.clientName.trim() !== ''
    ? b.clientName
    : 'Valued Guest';

  const tier = b.tier as TierCode;
  const partKey = b.partKey as string;
  const additionalRequest = (b.additionalRequest as string | null) ?? null;

  // 3. 티어별 데이터 필터링
  const filtered = filterByTier(tier, sajuData);

  // 4. Claude API 호출 (dynamic import로 Turbopack 호환)
  try {
    const { translateAndAnalyze } = await import('@/lib/translate/client');

    const text = await translateAndAnalyze({
      tier,
      partKey,
      sajuData: filtered,
      additionalRequest,
      clientName,
    });

    if (text === null) {
      return NextResponse.json(
        { text: null, error: 'Translation returned empty result.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[api/translate] Error for partKey="${partKey}":`, message);
    return NextResponse.json(
      { text: null, error: `Translation failed: ${message}` },
      { status: 500 },
    );
  }
}
