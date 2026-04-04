import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import type { EbookEdition } from '@/lib/types/ebook';
import { EBOOK_EDITIONS, EDITION_INFO } from '@/lib/types/ebook';
import type { EbookChapterContent } from '@/components/ebook/EbookDocument';

export const maxDuration = 120;

interface RequestBody {
  edition: EbookEdition;
  chapters: Record<string, EbookChapterContent>;
}

function validateBody(body: unknown): { valid: true; data: RequestBody } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.edition !== 'string' || !(EBOOK_EDITIONS as readonly string[]).includes(b.edition)) {
    return { valid: false, error: `Invalid edition. Must be one of: ${EBOOK_EDITIONS.join(', ')}` };
  }

  if (typeof b.chapters !== 'object' || b.chapters === null) {
    return { valid: false, error: 'chapters is required and must be an object with chapter_01, chapter_02, ... keys.' };
  }

  // 최소 1개 챕터 필요
  const chapterKeys = Object.keys(b.chapters as Record<string, unknown>);
  if (chapterKeys.length === 0) {
    return { valid: false, error: 'At least one chapter content is required.' };
  }

  return { valid: true, data: b as unknown as RequestBody };
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 },
    );
  }

  const validation = validateBody(rawBody);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 },
    );
  }

  const { edition, chapters } = validation.data;
  const editionInfo = EDITION_INFO[edition];

  try {
    // Dynamic import — Vercel serverless 호환
    const { renderToBuffer } = await import('@react-pdf/renderer');
    // 폰트 등록 (기존 NotoSansKR subset 재사용)
    await import('@/components/pdf/styles/pdfStyles');
    const { EbookDocument } = await import('@/components/ebook/EbookDocument');

    const element = React.createElement(EbookDocument, {
      edition,
      chapters,
    });

    const buffer = await renderToBuffer(
      element as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>,
    );

    const uint8 = new Uint8Array(buffer);
    const slug = edition === 'kdp' ? 'Korean-Saju-Decoded-Kindle-Edition' : 'Korean-Saju-Decoded-Master-Edition';
    const fileName = `${slug}.pdf`;

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
    console.error('[generate-ebook] FAILED:', message);
    console.error('[generate-ebook] Stack:', stack);
    console.error('[generate-ebook] Edition:', edition, '| Chapters:', Object.keys(chapters).length);
    return NextResponse.json(
      { error: `eBook PDF rendering failed: ${message}` },
      { status: 500 },
    );
  }
}
