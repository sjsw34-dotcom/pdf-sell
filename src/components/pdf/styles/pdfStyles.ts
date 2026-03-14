import { Font, StyleSheet } from '@react-pdf/renderer';

// ─── 폰트 ───
// 커스텀 폰트 없이 Helvetica fallback 사용.
// 추후 Google Fonts URL로 등록 가능.

export const FONT_BODY = 'Helvetica';
export const FONT_TITLE = 'Helvetica-Bold';
export const FONT_CJK = 'Helvetica';

// 하이픈 비활성화
try { Font.registerHyphenationCallback((word) => [word]); } catch { /* ignore */ }

// ─── 공통 PDF 스타일 ───

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 1.4,
  },
  subtitle: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  caption: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  cjk: {
    fontFamily: FONT_CJK,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderBottomStyle: 'solid',
    marginTop: 12,
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  col2: {
    flex: 1,
    paddingRight: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    fontFamily: FONT_BODY,
    color: '#999999',
  },
});
