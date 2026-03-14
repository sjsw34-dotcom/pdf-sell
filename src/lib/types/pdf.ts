import type { TierCode } from './tier';
import type { ThemeCode } from './theme';

// ─── Claude API 번역/분석 결과 텍스트 ───

export interface TranslatedSection {
  partNumber: number;
  title: string;
  content: string;
  wordCount: number;
}

export interface GeneratedTexts {
  tier: TierCode;
  sections: TranslatedSection[];
  totalWordCount: number;
  generatedAt: string;   // ISO date string
}

// ─── PDF 생성 옵션 ───

export interface PdfOptions {
  tier: TierCode;
  theme: ThemeCode;
  coverImageBase64: string | null;
  additionalRequest: string;
}

// ─── PDF 생성 요청/응답 ───

export interface PdfGenerateRequest {
  tier: TierCode;
  theme: ThemeCode;
  sajuJson: string;
  coverImageBase64: string | null;
  generatedTexts: GeneratedTexts;
}

export interface PdfGenerateResponse {
  success: boolean;
  pdfBase64?: string;
  fileName?: string;
  error?: string;
}

// ─── 번역 API 요청/응답 ───

export interface TranslateRequest {
  tier: TierCode;
  partNumber: number;
  sajuJson: string;
  additionalRequest: string;
}

export interface TranslateResponse {
  success: boolean;
  section?: TranslatedSection;
  error?: string;
}

// ─── 생성 진행 상태 ───

export const PART_STATUSES = ['idle', 'translating', 'completed', 'failed'] as const;
export type PartStatus = (typeof PART_STATUSES)[number];

export interface PartProgress {
  partNumber: number;
  title: string;
  status: PartStatus;
  error?: string;
}

export interface GenerationProgress {
  tier: TierCode;
  totalParts: number;
  completedParts: number;
  parts: PartProgress[];
  overallStatus: 'idle' | 'generating' | 'rendering' | 'completed' | 'failed';
}
