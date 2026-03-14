import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';
import { PageFooter } from './PageFooter';

interface PartHeaderProps {
  theme: ThemeCode;
  partNumber: number;
  title: string;
  subtitle?: string;
}

export function PartHeader({ theme, partNumber, title, subtitle }: PartHeaderProps) {
  const colors = THEMES[theme].colors;
  const num = String(partNumber).padStart(2, '0');

  return (
    <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
      <View style={s.content}>
        {/* 상단 여백 — 페이지 중앙보다 약간 위 */}
        <View style={s.topSpace} />

        {/* PART 번호 */}
        <View style={s.partRow}>
          <Text style={[s.partLabel, { color: colors.textSecondary }]}>PART</Text>
          <Text style={[s.partNumber, { color: colors.primary }]}>{num}</Text>
        </View>

        {/* 구분선 */}
        <View style={[s.divider, { backgroundColor: colors.primary }]} />

        {/* 메인 타이틀 */}
        <Text style={[s.title, { color: colors.primary }]}>{title}</Text>

        {/* 서브타이틀 */}
        {subtitle && (
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}

        {/* 하단 구분선 */}
        <View style={[s.dividerThin, { backgroundColor: colors.border }]} />

        {/* 장식: 복 문자 */}
        <Text style={[s.deco, { color: colors.border }]}>福</Text>
      </View>

      <PageFooter color={colors.textSecondary} />
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
  },
  content: {
    flex: 1,
  },
  topSpace: {
    height: 140,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  partLabel: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    letterSpacing: 3,
    marginRight: 8,
  },
  partNumber: {
    fontFamily: FONT_TITLE,
    fontSize: 36,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 2,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 1.4,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  dividerThin: {
    width: '100%',
    height: 0.5,
    marginTop: 20,
  },
  deco: {
    fontFamily: FONT_CJK,
    fontSize: 48,
    textAlign: 'right',
    marginTop: 20,
    opacity: 0.15,
  },
});
