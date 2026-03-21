import { StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE } from '../../pdf/styles/pdfStyles';
export { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from '../../pdf/styles/pdfStyles';

// ─── KDP 6"×9" 페이지 설정 ───
// 6 inches = 432pt, 9 inches = 648pt
// KDP 요구 마진: 최소 0.375" (27pt) 안쪽, 0.25" (18pt) 바깥쪽
// 실제 사용: 안쪽 0.75" (54pt), 바깥쪽 0.5" (36pt), 상하 0.6" (43pt)

export const EBOOK_PAGE_SIZE = { width: 432, height: 648 };

export const ebookStyles = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    backgroundColor: '#FFFFFF',
    width: 432,
    height: 648,
    paddingTop: 43,
    paddingBottom: 40,
    paddingLeft: 54,   // 안쪽 마진 (바인딩 여유)
    paddingRight: 36,  // 바깥쪽 마진
  },

  // ─── 제목 계층 ───
  h1: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    lineHeight: 1.3,
    letterSpacing: ANTI_LIGATURE,
    color: '#1A1A2E',
  },
  h2: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    lineHeight: 1.35,
    letterSpacing: ANTI_LIGATURE,
    color: '#2D2D4E',
  },
  h3: {
    fontFamily: FONT_TITLE,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
    lineHeight: 1.35,
    letterSpacing: ANTI_LIGATURE,
    color: '#3D3D5C',
  },

  // ─── 본문 ───
  body: {
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    lineHeight: 1.7,
    marginBottom: 8,
    letterSpacing: ANTI_LIGATURE,
    color: '#333333',
  },
  bodySmall: {
    fontFamily: FONT_BODY,
    fontSize: 9.5,
    lineHeight: 1.6,
    marginBottom: 6,
    letterSpacing: ANTI_LIGATURE,
    color: '#555555',
  },

  // ─── 인용/강조 박스 ───
  callout: {
    backgroundColor: '#F8F6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
    borderLeftStyle: 'solid' as const,
    padding: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  calloutText: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    lineHeight: 1.6,
    color: '#4A4A6A',
    letterSpacing: ANTI_LIGATURE,
  },

  // ─── 팁 박스 ───
  tipBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderStyle: 'solid' as const,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    marginTop: 8,
  },
  tipLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },

  // ─── CJK (한자) ───
  cjk: {
    fontFamily: FONT_CJK,
  },
  cjkInline: {
    fontFamily: FONT_CJK,
    fontSize: 10.5,
    color: '#555555',
  },

  // ─── 테이블 ───
  table: {
    marginBottom: 12,
    marginTop: 8,
  },
  tableHeader: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row' as const,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: ANTI_LIGATURE,
  },
  tableRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    borderBottomStyle: 'solid' as const,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: 'row' as const,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    borderBottomStyle: 'solid' as const,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#333333',
    letterSpacing: ANTI_LIGATURE,
  },
  tableCellCjk: {
    fontFamily: FONT_CJK,
    fontSize: 9,
    color: '#555555',
  },

  // ─── 사주 차트 (인라인 ASCII 스타일) ───
  chartBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid' as const,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    marginTop: 8,
  },

  // ─── 구분선 ───
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0D0D0',
    borderBottomStyle: 'solid' as const,
    marginTop: 12,
    marginBottom: 12,
  },
  dividerThick: {
    borderBottomWidth: 2,
    borderBottomColor: '#7C3AED',
    borderBottomStyle: 'solid' as const,
    marginTop: 16,
    marginBottom: 16,
  },

  // ─── 레이아웃 ───
  section: { marginBottom: 16 },
  row: { flexDirection: 'row' as const, alignItems: 'flex-start' as const },
  col2: { flex: 1, paddingRight: 6 },

  // ─── Key Takeaways ───
  takeawayBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
    borderLeftStyle: 'solid' as const,
    padding: 12,
    marginBottom: 12,
    marginTop: 16,
  },
  takeawayLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 6,
  },

  // ─── Try It Yourself ───
  exerciseBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'solid' as const,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    marginTop: 16,
  },
  exerciseLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 6,
  },

  // ─── CTA ───
  ctaBox: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderStyle: 'solid' as const,
    borderRadius: 4,
    padding: 12,
    marginTop: 20,
    marginBottom: 12,
    alignItems: 'center' as const,
  },
  ctaText: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    color: '#7C3AED',
    textAlign: 'center' as const,
    lineHeight: 1.6,
    letterSpacing: ANTI_LIGATURE,
  },

  // ─── 페이지 번호 ───
  pageNumber: {
    position: 'absolute' as const,
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: 'center' as const,
    fontSize: 8,
    fontFamily: FONT_BODY,
    color: '#999999',
  },

  // ─── 헤더 (running head) ───
  runningHead: {
    position: 'absolute' as const,
    top: 20,
    left: 54,
    right: 36,
    textAlign: 'center' as const,
    fontSize: 7,
    fontFamily: FONT_BODY,
    color: '#BBBBBB',
    letterSpacing: 1,
  },
});
