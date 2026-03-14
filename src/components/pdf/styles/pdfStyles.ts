import { Font, StyleSheet } from '@react-pdf/renderer';

// ─── 폰트 등록 ───
// Vercel serverless에서는 로컬 폰트 파일이 없으므로 Helvetica fallback.
// 로컬 개발 시 src/fonts/에 ttf 파일이 있으면 등록 시도.

let hasInter = false;
let hasPlayfair = false;
let hasNotoSansKR = false;

try {
  // Dynamic require로 서버 환경에서만 fs/path 사용
  const fs = require('fs');
  const path = require('path');
  const FONTS_DIR = path.join(process.cwd(), 'src', 'fonts');

  function fontPath(f: string) { return path.join(FONTS_DIR, f); }
  function exists(f: string) { try { return fs.existsSync(fontPath(f)); } catch { return false; } }

  if (exists('Inter-Regular.ttf')) {
    const fonts: { src: string; fontWeight: 'normal' | 'bold' }[] = [
      { src: fontPath('Inter-Regular.ttf'), fontWeight: 'normal' },
    ];
    if (exists('Inter-Bold.ttf')) {
      fonts.push({ src: fontPath('Inter-Bold.ttf'), fontWeight: 'bold' });
    }
    Font.register({ family: 'Inter', fonts });
    hasInter = true;
  }

  if (exists('PlayfairDisplay-Regular.ttf')) {
    const fonts: { src: string; fontWeight: 'normal' | 'bold' }[] = [
      { src: fontPath('PlayfairDisplay-Regular.ttf'), fontWeight: 'normal' },
    ];
    if (exists('PlayfairDisplay-Bold.ttf')) {
      fonts.push({ src: fontPath('PlayfairDisplay-Bold.ttf'), fontWeight: 'bold' });
    }
    Font.register({ family: 'Playfair Display', fonts });
    hasPlayfair = true;
  }

  if (exists('NotoSansKR-Regular.ttf')) {
    Font.register({ family: 'Noto Sans KR', src: fontPath('NotoSansKR-Regular.ttf') });
    hasNotoSansKR = true;
  }
} catch {
  // Vercel / edge 환경: fs 사용 불가 → Helvetica fallback
}

// 하이픈 비활성화
try {
  Font.registerHyphenationCallback((word) => [word]);
} catch {
  // ignore
}

// ─── 실제 사용할 폰트명 (없으면 Helvetica fallback) ───

export const FONT_BODY = hasInter ? 'Inter' : 'Helvetica';
export const FONT_TITLE = hasPlayfair ? 'Playfair Display' : 'Helvetica-Bold';
export const FONT_CJK = hasNotoSansKR ? 'Noto Sans KR' : 'Helvetica';

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
