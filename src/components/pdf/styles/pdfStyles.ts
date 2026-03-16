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

  // SpoqaHanSans — 영어/한글 본문용 (백업)
  Font.register({
    family: 'SpoqaHanSans',
    fonts: [
      { src: `${base}/SpoqaHanSansNeo-Regular.ttf`, fontWeight: 'normal' },
      { src: `${base}/SpoqaHanSansNeo-Bold.ttf`, fontWeight: 'bold' },
    ],
  });

  // NotoSansKR — 한자(漢字) 지원 폰트 (메인)
  // subset 버전: PDF에 사용되는 CJK 문자만 포함 (6MB → 116KB)
  Font.register({
    family: 'NotoSansKR',
    fonts: [
      { src: `${base}/fonts/NotoSansKR-Regular-subset.ttf`, fontWeight: 'normal' },
      { src: `${base}/fonts/NotoSansKR-Bold-subset.ttf`, fontWeight: 'bold' },
    ],
  });
} catch {
  // fallback
}

try { Font.registerHyphenationCallback((word) => [word]); } catch {}

// ─── 폰트명 ───
// NotoSansKR 통일 — 한글+한자+영어 모두 지원
// fi/fl 리가처 이슈는 letterSpacing: 0.1 로 해결

export const FONT_BODY = 'NotoSansKR';
export const FONT_TITLE = 'NotoSansKR';
export const FONT_CJK = 'NotoSansKR';

/**
 * fi/fl 리가처 깨짐 방지용 letterSpacing 값.
 * 모든 body 텍스트 스타일에 적용.
 */
export const ANTI_LIGATURE = 0.15;

/**
 * fi/fl/ff 리가처 깨짐 방지 — f + i/l/f 사이에 zero-width space 삽입.
 * @react-pdf/renderer + NotoSansKR에서 리가처가 글자를 삼키는 현상 방지.
 * 모든 텍스트 출력 전에 적용해야 함.
 */
export function fixLigatures(text: string): string {
  // f + i, f + l, f + f 조합에 zero-width space (U+200B) 삽입
  return text.replace(/f([ilf])/g, 'f\u200B$1');
}

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 1.4,
    letterSpacing: ANTI_LIGATURE,
  },
  subtitle: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 1.4,
    letterSpacing: ANTI_LIGATURE,
  },
  body: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 1.8,
    marginBottom: 10,
    letterSpacing: ANTI_LIGATURE,
  },
  caption: {
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 6,
    letterSpacing: ANTI_LIGATURE,
  },
  cjk: {
    fontFamily: FONT_CJK,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderBottomStyle: 'solid',
    marginTop: 14,
    marginBottom: 14,
  },
  section: { marginBottom: 20 },
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
