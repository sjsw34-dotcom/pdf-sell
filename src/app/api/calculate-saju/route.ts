import { NextResponse } from 'next/server';
import { calculateSajuWithAI, type AiSajuInput } from '@/lib/saju/ai-calculator';

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json() as AiSajuInput;

    // 기본 검증
    if (!body.birthYear || !body.birthMonth || !body.birthDay) {
      return NextResponse.json(
        { error: '생년월일은 필수입니다' },
        { status: 400 },
      );
    }

    if (!body.gender || !['남', '여'].includes(body.gender)) {
      return NextResponse.json(
        { error: '성별(남/여)은 필수입니다' },
        { status: 400 },
      );
    }

    const result = await calculateSajuWithAI({
      name: body.name || 'Valued Guest',
      gender: body.gender,
      birthYear: body.birthYear,
      birthMonth: body.birthMonth,
      birthDay: body.birthDay,
      birthHour: body.birthHour ?? 12,
      birthMinute: body.birthMinute ?? 0,
      isLunar: body.isLunar ?? false,
      isLeapMonth: body.isLeapMonth ?? false,
    });

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'AI 사주 계산 실패';
    console.error('[calculate-saju] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
