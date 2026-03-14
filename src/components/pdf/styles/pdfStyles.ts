import { Font, StyleSheet } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

// ─── 조건부 폰트 등록 (파일 존재 시에만) ───

const FONTS_DIR = path.join(process.cwd(), 'src', 'fonts');

function fontPath(fileName: string): string {
  return path.join(FONTS_DIR, fileName);
}

function fontExists(fileName: string): boolean {
  try {
    return fs.existsSync(fontPath(fileName));
  } catch {
    return false;
  }
}

// 등록 상태 추적
const hasInter = fontExists('Inter-Regular.ttf');
const hasPlayfair = fontExists('PlayfairDisplay-Regular.ttf');
const hasNotoSansKR = fontExists('NotoSansKR-Regular.ttf');

if (hasInter) {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: fontPath('Inter-Regular.ttf'), fontWeight: 'normal' },
      ...(fontExists('Inter-Bold.ttf')
        ? [{ src: fontPath('Inter-Bold.ttf'), fontWeight: 'bold' as const }]
        : []),
    ],
  });
}

if (hasPlayfair) {
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { src: fontPath('PlayfairDisplay-Regular.ttf'), fontWeight: 'normal' },
      ...(fontExists('PlayfairDisplay-Bold.ttf')
        ? [{ src: fontPath('PlayfairDisplay-Bold.ttf'), fontWeight: 'bold' as const }]
        : []),
    ],
  });
}

if (hasNotoSansKR) {
  Font.register({
    family: 'Noto Sans KR',
    src: fontPath('NotoSansKR-Regular.ttf'),
  });
}

// 하이픈 비활성화
Font.registerHyphenationCallback((word) => [word]);

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
