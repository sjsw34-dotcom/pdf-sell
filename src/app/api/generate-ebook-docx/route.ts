import { NextRequest, NextResponse } from 'next/server';
import type { EbookEdition } from '@/lib/types/ebook';
import { EBOOK_EDITIONS } from '@/lib/types/ebook';
import type { DocxChapterContent } from '@/lib/docx/buildEbookDocx';

export const maxDuration = 120;

interface RequestBody {
  edition: EbookEdition;
  chapters: Record<string, DocxChapterContent>;
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

  try {
    const { buildEbookDocx } = await import('@/lib/docx/buildEbookDocx');
    const buffer = await buildEbookDocx(edition, chapters);

    const slug = edition === 'kdp' ? 'korean-saju-decoded' : 'complete-guide-korean-saju';
    const fileName = `${slug}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(buffer.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-ebook-docx] FAILED:', message);
    console.error('[generate-ebook-docx] Stack:', err instanceof Error ? err.stack : '');
    return NextResponse.json(
      { error: `DOCX generation failed: ${message}` },
      { status: 500 },
    );
  }
}
