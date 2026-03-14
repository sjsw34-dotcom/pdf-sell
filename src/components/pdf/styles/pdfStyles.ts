import { Font, StyleSheet } from '@react-pdf/renderer';

// ─── 폰트 등록 ───
// public/ 폴더의 ttf 파일을 절대 URL로 참조.
// 클라이언트 사이드(pdf().toBlob())에서도 동작하도록
// window.location.origin 또는 환경변수로 base URL 결정.

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

try {
  const base = getBaseUrl();

  Font.register({
    family: 'SpoqaHanSans',
    fonts: [
      { src: `${base}/SpoqaHanSansNeo-Regular.ttf`, fontWeight: 'normal' },
      { src: `${base}/SpoqaHanSansNeo-Bold.ttf`, fontWeight: 'bold' },
    ],
  });
} catch {
  // fallback
}

try { Font.registerHyphenationCallback((word) => [word]); } catch {}

// ─── 폰트명 ───

export const FONT_BODY = 'SpoqaHanSans';
export const FONT_TITLE = 'SpoqaHanSans';
export const FONT_CJK = 'SpoqaHanSans';

// ─── 공통 PDF 스타일 ───

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 45,
    paddingLeft: 50,
    paddingRight: 50,
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    lineHeight: 1.4,
  },
  subtitle: {
    fontFamily: FONT_TITLE,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    lineHeight: 1.7,
    marginBottom: 8,
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
  section: { marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  col2: { flex: 1, paddingRight: 8 },
  pageNumber: {
    position: 'absolute',
    bottom: 20, left: 0, right: 0,
    textAlign: 'center',
    fontSize: 9,
    fontFamily: FONT_BODY,
    color: '#999999',
  },
});
