import { StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode, ThemeColors } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_TITLE, FONT_BODY, FONT_CJK } from './pdfStyles';

// ─── 테마별 PDF 스타일 타입 ───

export type ThemePdfStyles = ReturnType<typeof buildThemeStyles>;

function buildThemeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    page: {
      fontFamily: FONT_BODY,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingBottom: 45,
      paddingLeft: 50,
      paddingRight: 50,
    },

    title: {
      fontFamily: FONT_TITLE,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 10,
      lineHeight: 1.4,
    },

    subtitle: {
      fontFamily: FONT_TITLE,
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 6,
      lineHeight: 1.4,
    },

    body: {
      fontFamily: FONT_BODY,
      fontSize: 10.5,
      color: colors.text,
      lineHeight: 1.7,
      marginBottom: 8,
    },

    caption: {
      fontFamily: FONT_BODY,
      fontSize: 9,
      color: colors.textSecondary,
      lineHeight: 1.4,
      marginBottom: 4,
    },

    cjk: {
      fontFamily: FONT_CJK,
      color: colors.text,
    },

    // 강조 박스 (CalloutBox)
    callout: {
      backgroundColor: colors.surface,
      borderLeftWidth: 3,
      borderLeftColor: colors.secondary,
      borderLeftStyle: 'solid',
      padding: 12,
      marginBottom: 12,
    },

    // 테이블 헤더
    tableHeader: {
      backgroundColor: colors.primary,
      color: '#FFFFFF',
      fontFamily: FONT_BODY,
      fontSize: 10,
      fontWeight: 'bold',
      padding: 6,
    },

    // 테이블 셀
    tableCell: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderBottomStyle: 'solid',
      fontFamily: FONT_BODY,
      fontSize: 10,
      color: colors.text,
      padding: 6,
    },

    // 테이블 셀 — 짝수 행
    tableCellAlt: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderBottomStyle: 'solid',
      fontFamily: FONT_BODY,
      fontSize: 10,
      color: colors.text,
      padding: 6,
    },

    // 구분선
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderBottomStyle: 'solid',
      marginTop: 12,
      marginBottom: 12,
    },

    // 파트 헤더 페이지
    partHeader: {
      backgroundColor: colors.primary,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },

    partHeaderTitle: {
      fontFamily: FONT_TITLE,
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },

    partHeaderSubtitle: {
      fontFamily: FONT_BODY,
      fontSize: 14,
      color: colors.secondary,
    },

    // 신살 sentiment 컬러
    positive: { color: colors.positive },
    neutral: { color: colors.neutral },
    caution: { color: colors.caution },

    // 페이지 번호
    pageNumber: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 9,
      fontFamily: FONT_BODY,
      color: colors.textSecondary,
    },

    // 액센트 텍스트
    accent: {
      color: colors.accent,
      fontWeight: 'bold',
    },

    // 서브 라벨 (secondary 색상)
    label: {
      fontFamily: FONT_BODY,
      fontSize: 9,
      color: colors.secondary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
  });
}

// ─── 캐시 ───

const styleCache = new Map<ThemeCode, ThemePdfStyles>();

/**
 * 테마 코드에 해당하는 PDF StyleSheet를 반환한다.
 * 동일 테마 재요청 시 캐시에서 반환.
 */
export function getThemeStyles(theme: ThemeCode): ThemePdfStyles {
  const cached = styleCache.get(theme);
  if (cached) return cached;

  const colors = THEMES[theme].colors;
  const styles = buildThemeStyles(colors);
  styleCache.set(theme, styles);
  return styles;
}
