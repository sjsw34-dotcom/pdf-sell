import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_TITLE, FONT_CJK, EBOOK_PAGE_SIZE } from './styles/ebookStyles';
import { EbookPageFooter } from './EbookPageFooter';

interface EbookPartHeaderProps {
  partNumber: number;
  title: string;
  subtitle?: string;
}

/** 파트 사이의 구분 페이지 — 교재 스타일 */
export function EbookPartHeader({ partNumber, title, subtitle }: EbookPartHeaderProps) {
  const num = String(partNumber).padStart(2, '0');

  return (
    <Page size={EBOOK_PAGE_SIZE} style={s.page}>
      <View style={s.content}>
        {/* 상단 여백 */}
        <View style={s.topSpace} />

        {/* PART 번호 */}
        <View style={s.partRow}>
          <Text style={s.partLabel}>PART</Text>
          <Text style={s.partNumber}>{num}</Text>
        </View>

        {/* 구분선 */}
        <View style={s.divider} />

        {/* 타이틀 */}
        <Text style={s.title}>{title}</Text>

        {/* 서브타이틀 */}
        {subtitle && (
          <Text style={s.subtitle}>{subtitle}</Text>
        )}

        {/* 하단 장식 */}
        <View style={s.dividerThin} />
        <Text style={s.deco}>道</Text>
      </View>

      <EbookPageFooter />
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: '#FAFAFA',
    paddingTop: 43,
    paddingBottom: 40,
    paddingLeft: 54,
    paddingRight: 36,
  },
  content: {
    flex: 1,
  },
  topSpace: {
    height: 120,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  partLabel: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    letterSpacing: 3,
    marginRight: 8,
    color: '#999999',
  },
  partNumber: {
    fontFamily: FONT_TITLE,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#7C3AED',
    marginBottom: 14,
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.3,
    marginBottom: 6,
    color: '#1A1A2E',
  },
  subtitle: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 14,
    color: '#777777',
  },
  dividerThin: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginTop: 20,
  },
  deco: {
    fontFamily: FONT_CJK,
    fontSize: 40,
    textAlign: 'right',
    marginTop: 16,
    opacity: 0.08,
    color: '#7C3AED',
  },
});
