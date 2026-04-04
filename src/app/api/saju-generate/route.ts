import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import type { SajuInput } from '@/lib/saju/calculator';
import { parseSajuJson } from '@/lib/utils/parseJson';
import { validateApiKey } from '@/lib/api-auth';

/**
 * POST /api/saju-generate
 *
 * 생년월일+성별 → 전체 사주 JSON 반환.
 * 외부 사이트(챗봇 등)에서 호출하여 사주 데이터를 확보하는 공개 API.
 *
 * Request Body:
 * {
 *   name?: string;           // 이름 (기본: "Guest")
 *   gender: "남" | "여";     // 성별
 *   birthYear: number;       // 생년 (양력 또는 음력)
 *   birthMonth: number;      // 생월
 *   birthDay: number;        // 생일
 *   birthHour?: number;      // 생시 (0-23, 기본: 12)
 *   birthMinute?: number;    // 생분 (0-59, 기본: 0)
 *   isLunar?: boolean;       // 음력 여부 (기본: false)
 *   isLeapMonth?: boolean;   // 윤달 여부 (기본: false)
 * }
 *
 * Response: SajuData JSON (info, pillar, yongsin, yinyang, shinsal, daeun, nyunun, wolun, ...)
 */
export async function POST(request: NextRequest) {
  // ─── API key 검증 ───
  const authError = validateApiKey(request);
  if (authError) return authError;

  // ─── CORS 헤더 (외부 사이트 호출 허용) ───
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
  };

  // ─── Body 파싱 ───
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON in request body.' },
      { status: 400, headers },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { success: false, error: 'Request body must be a JSON object.' },
      { status: 400, headers },
    );
  }

  const b = body as Record<string, unknown>;

  // ─── 필수 필드 검증 ───
  if (b.gender !== '남' && b.gender !== '여') {
    return NextResponse.json(
      { success: false, error: 'gender is required: "남" or "여"' },
      { status: 400, headers },
    );
  }

  const birthYear = Number(b.birthYear);
  const birthMonth = Number(b.birthMonth);
  const birthDay = Number(b.birthDay);

  if (!birthYear || !birthMonth || !birthDay) {
    return NextResponse.json(
      { success: false, error: 'birthYear, birthMonth, birthDay are required (numbers).' },
      { status: 400, headers },
    );
  }

  if (birthYear < 1900 || birthYear > 2100) {
    return NextResponse.json(
      { success: false, error: 'birthYear must be between 1900 and 2100.' },
      { status: 400, headers },
    );
  }

  if (birthMonth < 1 || birthMonth > 12) {
    return NextResponse.json(
      { success: false, error: 'birthMonth must be between 1 and 12.' },
      { status: 400, headers },
    );
  }

  if (birthDay < 1 || birthDay > 31) {
    return NextResponse.json(
      { success: false, error: 'birthDay must be between 1 and 31.' },
      { status: 400, headers },
    );
  }

  // ─── 선택 필드 ───
  const name = typeof b.name === 'string' && b.name.trim() ? b.name.trim() : 'Guest';
  const birthHour = typeof b.birthHour === 'number' ? b.birthHour : 12;
  const birthMinute = typeof b.birthMinute === 'number' ? b.birthMinute : 0;
  const isLunar = b.isLunar === true;
  const isLeapMonth = b.isLeapMonth === true;

  // ─── 사주 계산 ───
  try {
    const input: SajuInput = {
      name,
      gender: b.gender as '남' | '여',
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      birthMinute,
      isLunar,
      isLeapMonth,
    };

    const rawJson = calculateSaju(input);
    const result = parseSajuJson(JSON.stringify(rawJson));

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: `Calculation error: ${result.error}` },
        { status: 500, headers },
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200, headers },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/saju-generate] Error:', message);
    return NextResponse.json(
      { success: false, error: `Calculation failed: ${message}` },
      { status: 500, headers },
    );
  }
}

/**
 * OPTIONS — CORS preflight 처리
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}
