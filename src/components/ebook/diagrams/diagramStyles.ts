/**
 * eBook 다이어그램 공통 스타일 상수
 * 모든 다이어그램에서 동일한 색상/폰트/레이아웃을 사용
 */

import { FONT_BODY, FONT_CJK, ANTI_LIGATURE } from '../styles/ebookStyles';

// 오행 색상 표준
export const ELEMENT_COLORS = {
  Wood:  { bg: '#22C55E', text: '#FFFFFF', light: '#DCFCE7' },
  Fire:  { bg: '#EF4444', text: '#FFFFFF', light: '#FEE2E2' },
  Earth: { bg: '#F59E0B', text: '#1A1A2E', light: '#FEF3C7' },
  Metal: { bg: '#94A3B8', text: '#1A1A2E', light: '#F1F5F9' },
  Water: { bg: '#3B82F6', text: '#FFFFFF', light: '#DBEAFE' },
} as const;

// 십신 쌍 색상
export const TEN_GOD_COLORS = {
  Companion: { bg: '#3B82F6', text: '#FFFFFF' }, // 비겁 — 파랑
  Output:    { bg: '#F97316', text: '#FFFFFF' }, // 식상 — 주황
  Wealth:    { bg: '#EAB308', text: '#1A1A2E' }, // 재성 — 노랑
  Authority: { bg: '#EF4444', text: '#FFFFFF' }, // 관성 — 빨강
  Resource:  { bg: '#22C55E', text: '#FFFFFF' }, // 인성 — 초록
} as const;

// 브랜드 색상
export const BRAND = {
  purple: '#7C3AED',
  purpleLight: '#F8F6FF',
  gold: '#F59E0B',
  textDark: '#1A1A2E',
  textMedium: '#555555',
  textLight: '#888888',
  border: '#E0E0E0',
  bgLight: '#FAFAFA',
} as const;

// 다이어그램 공통 폰트
export { FONT_BODY, FONT_CJK, ANTI_LIGATURE };

// 다이어그램 컨테이너 기본 스타일
export const DIAGRAM_CONTAINER = {
  backgroundColor: '#FAFAFA',
  borderWidth: 1,
  borderColor: '#E0E0E0',
  borderRadius: 4,
  padding: 16,
  marginTop: 12,
  marginBottom: 12,
} as const;

// 다이어그램 제목 스타일
export const DIAGRAM_TITLE = {
  fontFamily: FONT_BODY,
  fontSize: 10,
  fontWeight: 'bold' as const,
  color: '#7C3AED',
  textAlign: 'center' as const,
  marginBottom: 10,
  letterSpacing: ANTI_LIGATURE,
};

// 다이어그램 범례 텍스트
export const DIAGRAM_LEGEND = {
  fontFamily: FONT_BODY,
  fontSize: 8,
  color: '#888888',
  letterSpacing: ANTI_LIGATURE,
};
