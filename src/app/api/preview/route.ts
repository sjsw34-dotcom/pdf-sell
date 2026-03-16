import { NextRequest, NextResponse } from 'next/server';
import { generateEmailHTML } from '@/lib/email-template';

export async function POST(req: NextRequest) {
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
