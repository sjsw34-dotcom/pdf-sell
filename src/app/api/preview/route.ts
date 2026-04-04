import { NextRequest, NextResponse } from 'next/server';
import { generateEmailHTML } from '@/lib/email-template';
import { validateApiKey } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    const html = generateEmailHTML({
      customerName: body.customerName || 'Customer Name',
      birthDate: body.birthDate || 'January 1, 2000',
      readingType: body.readingType || 'Premium Saju Reading',
      orderId: body.orderId || 'SM-2026-0001',
      customMessage:
        body.customMessage || 'Your reading has been prepared with care.',
      pdfDownloadLink: body.pdfDownloadLink || undefined,
      reviewLink: body.reviewLink || undefined,
      hasAttachment: true,
      hasPdfAttachment: true,
    });

    return NextResponse.json({ html });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate preview.' },
      { status: 500 }
    );
  }
}
