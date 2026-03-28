import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { TierCode } from '@/lib/types/tier';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';
import { PageFooter } from './PageFooter';
import { useShowBrand } from './BrandContext';

// ─── 티어별 목차 ───

const TIER_LABELS: Record<TierCode, string> = {
  basic: 'Basic Saju Analysis Report',
  love: 'Love Edition Analysis Report',
  full: 'Full Saju Analysis Report',
  premium: 'Premium Saju Analysis Report',
};

const TOC: Record<TierCode, { part: string; title: string }[]> = {
  basic: [
    { part: '01', title: 'Your Destiny Chart — The Four Pillars' },
    { part: '02', title: 'Your Elemental Balance (Yongsin)' },
    { part: '03', title: 'Your Destiny Overview' },
    { part: '04', title: 'Personality & Core Strengths' },
    { part: '05', title: 'Fortune & Life Direction' },
  ],
  love: [
    { part: 'Ch.1', title: 'Your Four Pillars & Love' },
    { part: 'Ch.2', title: 'Day Master Romance Personality' },
    { part: 'Ch.3', title: 'Elements & Your Love Language' },
    { part: '01', title: 'Your Romance DNA' },
    { part: '02', title: 'Love Strengths & Dating Style' },
    { part: '03', title: 'Your Destined Match' },
    { part: '04', title: 'Best Timing for Love' },
    { part: '05', title: 'Deep Connection' },
    { part: '06', title: 'Lucky Charms & Strategy' },
  ],
  full: [
    { part: '01', title: 'Detailed Analysis of My Four Pillars' },
    { part: '02', title: "The Golden Peaks of My Life" },
    { part: '03', title: 'Romance Fortune and Partner Destiny' },
    { part: '04', title: 'My Financial Fortune Analysis' },
    { part: '05', title: 'Career and the Destiny of Success' },
    { part: '06', title: 'Health and Constitution Through Saju' },
    { part: '07', title: 'The Destined Benefactors Who Will Help You' },
    { part: '08', title: 'How to Shape Your Destiny' },
  ],
  premium: [
    { part: '01', title: 'Detailed Analysis of My Four Pillars' },
    { part: '02', title: "The Golden Peaks of My Life" },
    { part: '03', title: 'Romance Fortune and Partner Destiny' },
    { part: '04', title: 'My Financial Fortune Analysis' },
    { part: '05', title: 'Career and the Destiny of Success' },
    { part: '06', title: 'Health and Constitution Through Saju' },
    { part: '07', title: 'The Destined Benefactors Who Will Help You' },
    { part: '08', title: 'How to Shape Your Destiny' },
    { part: '09', title: 'Monthly Detailed Fortune' },
    { part: '10', title: 'Destiny Analysis for the Next 10 Years' },
  ],
};

interface IntroPageProps {
  theme: ThemeCode;
  tier: TierCode;
  name: string;
  hasPersonalQuestion?: boolean;
}

export function IntroPage({ theme, tier, name, hasPersonalQuestion }: IntroPageProps) {
  const colors = THEMES[theme].colors;
  const items = TOC[tier];
  const showBrand = useShowBrand();

  return (
    <>
      {/* ══════ 페이지 1: Overview (인사말) ══════ */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          {/* 상단 라벨 */}
          <Text style={[s.overviewLabel, { color: colors.textSecondary }]}>Overview</Text>
          <Text style={[s.tierLabel, { color: colors.primary }]}>{TIER_LABELS[tier]}</Text>

          <View style={s.spacer16} />

          {/* 이름 + 브랜드 */}
          <Text style={[s.clientName, { color: colors.primary }]}>{name || 'Valued Guest'}</Text>
          <Text style={[s.brandLine, { color: colors.textSecondary }]}>{showBrand ? 'SajuMuse — In-Depth Destiny Analysis' : 'In-Depth Destiny Analysis'}</Text>

          <View style={[s.dividerFull, { backgroundColor: colors.border }]} />

          {/* 인사말 본문 */}
          <Text style={[s.sectionTag, { color: colors.secondary }]}>{TIER_LABELS[tier]}</Text>

          <View style={s.spacer12} />

          <Text style={[s.greeting, { color: colors.primary }]}>Dear {name || 'Valued Guest'},</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {fixLigatures('This report is a personalized destiny analysis prepared exclusively based on your 사주팔자 · Four Pillars of Destiny.')}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {fixLigatures('Saju (사주명리학) is a wisdom tradition with thousands of years of history rooted in Eastern philosophy. By interpreting the cosmic energies present at the moment of your birth, it offers deep insight into your innate nature and the natural flow of your life.')}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {fixLigatures('Drawing on years of experience reading the lives of countless individuals, this analysis has been crafted with great care — just for you. May this report serve as a guiding light as you navigate your path forward.')}
          </Text>

          {hasPersonalQuestion && (
            <>
              <View style={s.spacer12} />
              <View style={[s.personalNote, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
                <Text style={[s.personalNoteText, { color: colors.text }]}>
                  {fixLigatures('You also submitted a personal question. After the full analysis, you will find a dedicated section at the end of this report with a personalized answer crafted just for you.')}
                </Text>
              </View>
            </>
          )}

          <View style={s.spacer24} />

          <Text style={[s.signoff, { color: colors.text }]}>With warmth,</Text>
          <Text style={[s.signoffBrand, { color: colors.primary }]}>{showBrand ? 'SajuMuse' : 'Your Saju Consultant'}</Text>
        </View>

        <PageFooter color={colors.textSecondary} />
      </Page>

      {/* ══════ 페이지 2: Table of Contents ══════ */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          <Text style={[s.tocTitle, { color: colors.primary }]}>Table of Contents</Text>

          <View style={[s.dividerFull, { backgroundColor: colors.border }]} />

          {/* 목차 테이블 */}
          <View style={s.tocTable}>
            {/* 헤더 */}
            <View style={[s.tocHeaderRow, { borderBottomColor: colors.primary }]}>
              <Text style={[s.tocHeaderNum, { color: colors.textSecondary }]}>#</Text>
              <Text style={[s.tocHeaderSection, { color: colors.textSecondary }]}>Section</Text>
            </View>

            {/* 항목들 */}
            {items.map((item, idx) => (
              <View key={idx} style={[s.tocRow, { borderBottomColor: colors.border }]}>
                <Text style={[s.tocNum, { color: colors.primary }]}>{item.part}</Text>
                <Text style={[s.tocSection, { color: colors.text }]}>{item.title}</Text>
              </View>
            ))}
          </View>

          <View style={s.spacer24} />

          <View style={[s.tocDividerBottom, { backgroundColor: colors.primary }]} />
        </View>

        <PageFooter color={colors.textSecondary} />
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
  content: {
    flex: 1,
  },

  // Overview 페이지
  overviewLabel: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  tierLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clientName: {
    fontFamily: FONT_TITLE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brandLine: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  dividerFull: {
    width: '100%',
    height: 1,
    marginBottom: 20,
  },
  sectionTag: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  greeting: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  body: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 1.8,
    marginBottom: 12,
    letterSpacing: ANTI_LIGATURE,
  },
  signoff: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    marginBottom: 4,
  },
  signoffBrand: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Table of Contents 페이지
  tocTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tocTable: {
    width: '100%',
  },
  tocHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    marginBottom: 4,
  },
  tocHeaderNum: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    fontWeight: 'bold',
    width: 40,
  },
  tocHeaderSection: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  tocRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  tocNum: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
    width: 44,
  },
  tocSection: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    flex: 1,
    lineHeight: 1.4,
  },
  tocDividerBottom: {
    width: '100%',
    height: 2,
  },

  // 개인 질문 안내
  personalNote: {
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    padding: 14,
    borderRadius: 4,
  },
  personalNoteText: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 1.6,
    letterSpacing: ANTI_LIGATURE,
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
