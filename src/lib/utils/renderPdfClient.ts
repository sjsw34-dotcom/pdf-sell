import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { TierCode } from '@/lib/types/tier';
import type { ThemeCode } from '@/lib/types/theme';
import type { SajuData } from '@/lib/types/saju';
import type { Language } from '@/lib/types/language';
import { PdfDocument } from '@/components/pdf/PdfDocument';

interface RenderParams {
  tier: TierCode;
  sajuData: SajuData;
  texts: Record<string, string>;
  coverImage: string | null;
  theme: ThemeCode;
  clientName: string;
  birthInfo: string;
  personalQuestion?: string;
  personalAnswer?: string;
  showBrand?: boolean;
  language?: Language;
}

/**
 * 브라우저에서 직접 PDF를 렌더링하여 Blob으로 반환.
 * 서버 API 호출 없음 — Vercel 호환 문제 없음.
 */
export async function renderPdfOnClient(params: RenderParams): Promise<Blob> {
  const element = React.createElement(PdfDocument, {
    tier: params.tier,
    sajuData: params.sajuData,
    texts: params.texts,
    coverImage: params.coverImage,
    theme: params.theme,
    clientName: params.clientName,
    birthInfo: params.birthInfo,
    personalQuestion: params.personalQuestion,
    personalAnswer: params.personalAnswer,
    showBrand: params.showBrand,
    language: params.language,
  });

  const instance = pdf(
    element as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>
  );
  const blob = await instance.toBlob();
  return blob;
}
