import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateEmailHTML } from '@/lib/email-template';

const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB
const ADMIN_EMAIL = 'sajumuse@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const birthDate = formData.get('birthDate') as string;
    const readingType = formData.get('readingType') as string;
    const orderId = formData.get('orderId') as string;
    const customMessage = formData.get('customMessage') as string;
    const pdfDownloadLink = (formData.get('pdfDownloadLink') as string) || '';
    const reviewLink = (formData.get('reviewLink') as string) || '';

    // Get all uploaded files
    const uploadedFiles = formData.getAll('files') as File[];

    // Validate required fields
    if (!customerName || !customerEmail || !customMessage) {
      return NextResponse.json(
        { error: 'Customer name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    // Check total file size
    const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: 'Total attachment size exceeds 25MB limit.' },
        { status: 400 }
      );
    }

    // Determine if there are PDF attachments
    const hasPdfAttachment = uploadedFiles.some((f) =>
      f.name.toLowerCase().endsWith('.pdf')
    );

    // Generate HTML email
    const html = generateEmailHTML({
      customerName,
      birthDate: birthDate || 'N/A',
      readingType: readingType || 'Premium Saju Reading',
      orderId: orderId || '-',
      customMessage,
      pdfDownloadLink: pdfDownloadLink || undefined,
      reviewLink: reviewLink || undefined,
      hasAttachment: uploadedFiles.length > 0,
      hasPdfAttachment,
    });

    // Build attachments
    const attachments: Array<{
      filename: string;
      content: Buffer;
      contentType: string;
    }> = [];

    for (const file of uploadedFiles) {
      const arrayBuffer = await file.arrayBuffer();
      attachments.push({
        filename: file.name,
        content: Buffer.from(arrayBuffer),
        contentType: file.type || 'application/octet-stream',
      });
    }

    // Create transporter (Gmail SMTP with App Password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send email with BCC to admin for records
    const info = await transporter.sendMail({
      from: `"Saju Muse" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      bcc: ADMIN_EMAIL,
      subject: `Your Saju Reading is Ready, ${customerName}!`,
      html,
      attachments,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: `Email sent to ${customerEmail}`,
    });
  } catch (error: unknown) {
    console.error('Email send error:', error);
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
