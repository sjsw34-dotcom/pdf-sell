import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

interface EndingPageProps {
  theme: ThemeCode;
  name: string;
}

export function EndingPage({ theme, name }: EndingPageProps) {
  const colors = THEMES[theme].colors;

  return (
    <>
      {/* ══════ Closing Thoughts 페이지 ══════ */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.closingContent}>
          <View style={s.closingCenter}>
            <Text style={[s.closingLabel, { color: colors.secondary }]}>Closing Thoughts</Text>

            <View style={[s.line, { backgroundColor: colors.border }]} />

            <Text style={[s.closingMain, { color: colors.primary }]}>
              {name || 'Dear reader'}, your Saju analysis is now complete.
            </Text>

            <View style={s.spacer16} />

            <Text style={[s.closingBody, { color: colors.text }]}>
              May this report serve as a small guiding light on your journey.
            </Text>
            <Text style={[s.closingBody, { color: colors.text }]}>
              Understanding your destiny is the first step to shaping it.
            </Text>

            <View style={[s.line, { backgroundColor: colors.border }]} />

            <Text style={[s.closingBrand, { color: colors.primary }]}>SajuMuse</Text>
          </View>
        </View>

        <View style={[s.footer, { borderTopColor: colors.border }]}>
          <Text style={[s.footerText, { color: colors.textSecondary }]}>SajuMuse</Text>
        </View>
      </Page>

      {/* ══════ 뒷표지 (커버 반복) ══════ */}
      <Page size="A4" style={s.backCoverPage}>
        <View style={[s.backCover, { backgroundColor: colors.primary }]}>
          <View style={s.backCoverCenter}>
            <Text style={s.backBrand}>SajuMuse</Text>

            <View style={s.backLine} />

            <Text style={s.backSubtitle}>사주팔자 · Four Pillars of Destiny</Text>

            <View style={s.spacer24} />

            <Text style={s.backTitle}>DESTINY ANALYSIS</Text>
            <Text style={s.backTitle}>REPORT</Text>

            <View style={s.spacer12} />

            <Text style={s.backSubtitleKo}>운명 분석서</Text>

            <View style={s.backLine} />

            <View style={s.spacer24} />

            <Text style={s.backPrepared}>Prepared for</Text>
            <Text style={s.backName}>{name || 'Valued Guest'}</Text>

            <View style={s.spacer24} />

            <View style={s.backFooterLine} />
            <Text style={s.backFooter}>SajuMuse · SajuMuse</Text>
          </View>
        </View>
      </Page>
    </>
  );
}

const s = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
  },

  // Closing Thoughts
  closingContent: {
    flex: 1,
    justifyContent: 'center',
  },
  closingCenter: {
    alignItems: 'center',
  },
  closingLabel: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  line: {
    width: 50,
    height: 1,
    marginBottom: 24,
  },
  closingMain: {
    fontFamily: FONT_TITLE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  closingBody: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.7,
    marginBottom: 4,
  },
  closingBrand: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  // 뒷표지
  backCoverPage: {
    padding: 0,
  },
  backCover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  backCoverCenter: {
    alignItems: 'center',
  },
  backBrand: {
    fontFamily: FONT_TITLE,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 12,
  },
  backLine: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginTop: 10,
    marginBottom: 10,
  },
  backSubtitle: {
    fontFamily: FONT_CJK,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  backTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  backSubtitleKo: {
    fontFamily: FONT_CJK,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
  },
  backPrepared: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  backName: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backFooterLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
  },
  backFooter: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },

  // 공통
  footer: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopStyle: 'solid',
  },
  footerText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    letterSpacing: 1,
  },
  spacer12: { height: 12 },
  spacer16: { height: 16 },
  spacer24: { height: 24 },
});
