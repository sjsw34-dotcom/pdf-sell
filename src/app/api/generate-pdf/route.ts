import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import type { TierCode } from '@/lib/types/tier';
import type { ThemeCode } from '@/lib/types/theme';
import type { SajuData } from '@/lib/types/saju';
import { TIER_CODES } from '@/lib/types/tier';
import { THEME_CODES } from '@/lib/types/theme';
import { extractInfo } from '@/lib/utils/extractInfo';
import { PdfDocument } from '@/components/pdf/PdfDocument';

// 폰트 등록을 위해 pdfStyles를 import (side-effect)
import '@/components/pdf/styles/pdfStyles';

export const maxDuration = 120;

interface RequestBody {
  tier: string;
  sajuData: SajuData;
  texts: Record<string, string>;
  coverImage: string | null;
  theme: string;
}

function validateBody(body: unknown): { valid: true; data: RequestBody } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const b = body as Record<string, unknown>;

  // tier
  if (typeof b.tier !== 'string' || !(TIER_CODES as readonly string[]).includes(b.tier)) {
    return { valid: false, error: `Invalid tier. Must be one of: ${TIER_CODES.join(', ')}` };
  }

  // sajuData — 파싱된 SajuData 형태인지 확인 (raw JSON이 아닌)
  if (typeof b.sajuData !== 'object' || b.sajuData === null) {
    return { valid: false, error: 'sajuData is required and must be an object.' };
  }
  const saju = b.sajuData as Record<string, unknown>;
  if (!saju.info || !saju.pillar || !saju.yongsin || !saju.yinyang) {
    return { valid: false, error: 'sajuData must contain info, pillar, yongsin, and yinyang.' };
  }
  // 파싱된 형태 검증: pillar.hourPillar가 있어야 함 (raw JSON은 pillar.data 배열)
  const pillar = saju.pillar as Record<string, unknown>;
  if (!pillar.hourPillar || !pillar.dayPillar) {
    return { valid: false, error: 'sajuData must be parsed (not raw JSON). Use parseSajuJson() first.' };
  }

  // texts
  if (typeof b.texts !== 'object' || b.texts === null) {
    return { valid: false, error: 'texts is required and must be an object.' };
  }

  // theme
  if (typeof b.theme !== 'string' || !(THEME_CODES as readonly string[]).includes(b.theme)) {
    return { valid: false, error: `Invalid theme. Must be one of: ${THEME_CODES.join(', ')}` };
  }

  // coverImage
  if (b.coverImage !== null && typeof b.coverImage !== 'string') {
    return { valid: false, error: 'coverImage must be a base64 string or null.' };
  }

  return { valid: true, data: b as unknown as RequestBody };
}

export async function POST(request: NextRequest) {
  // 1. body 파싱
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 },
    );
  }

  // 2. 검증
  const validation = validateBody(rawBody);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 },
    );
  }

  const { tier, sajuData, texts, theme } = validation.data;
  // 빈 문자열 coverImage를 null로 정규화
  const coverImage = validation.data.coverImage || null;

  // 3. 이름/생년월일 추출
  const clientInfo = extractInfo(sajuData);
  const clientName = clientInfo.name || 'Valued Guest';
  const birthInfo = `${clientInfo.birthDate} ${clientInfo.birthTime}`.trim();

  // 4. PDF 렌더링
  try {
    const element = React.createElement(PdfDocument, {
      tier: tier as TierCode,
      sajuData,
      texts: texts as Record<string, string>,
      coverImage,
      theme: theme as ThemeCode,
      clientName,
      birthInfo,
    });

    // renderToBuffer expects ReactElement — cast to satisfy @react-pdf/renderer types
    const buffer = await renderToBuffer(
      element as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>,
    );

    const uint8 = new Uint8Array(buffer);
    const fileName = `${clientName.replace(/\s+/g, '_')}_saju_report.pdf`;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(uint8.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown rendering error';
    const stack = err instanceof Error ? err.stack : '';
    console.error('[generate-pdf] Rendering failed:', message);
    console.error('[generate-pdf] Stack:', stack);
    console.error('[generate-pdf] Tier:', tier, '| Theme:', theme, '| Has coverImage:', !!coverImage);
    console.error('[generate-pdf] SajuData keys:', Object.keys(sajuData));
    console.error('[generate-pdf] Texts keys:', Object.keys(texts));
    return NextResponse.json(
      { error: `PDF rendering failed: ${message}` },
      { status: 500 },
    );
  }
}
