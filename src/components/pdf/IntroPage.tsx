import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { TierCode } from '@/lib/types/tier';
import type { Language } from '@/lib/types/language';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';
import { PageFooter } from './PageFooter';
import { useShowBrand } from './BrandContext';
import { useLang } from './LanguageContext';
import { t } from '@/lib/i18n/pdf-strings';

// ─── 티어별 라벨 키 ───

const TIER_KEY: Record<TierCode, string> = {
  basic: 'intro.tierBasic',
  love: 'intro.tierLove',
  full: 'intro.tierFull',
  premium: 'intro.tierPremium',
  monthly: '',
};

// ─── 티어별 목차 빌더 ───

const TOC_KEYS: Record<TierCode, { part: string; key: string }[]> = {
  basic: [
    { part: '01', key: 'toc.basic.01' },
    { part: '02', key: 'toc.basic.02' },
    { part: '03', key: 'toc.basic.03' },
    { part: '04', key: 'toc.basic.04' },
    { part: '05', key: 'toc.basic.05' },
  ],
  love: [
    { part: 'Ch.1', key: 'toc.love.ch1' },
    { part: 'Ch.2', key: 'toc.love.ch2' },
    { part: 'Ch.3', key: 'toc.love.ch3' },
    { part: '01', key: 'toc.love.01' },
    { part: '02', key: 'toc.love.02' },
    { part: '03', key: 'toc.love.03' },
    { part: '04', key: 'toc.love.04' },
    { part: '05', key: 'toc.love.05' },
    { part: '06', key: 'toc.love.06' },
  ],
  full: [
    { part: '01', key: 'toc.full.01' },
    { part: '02', key: 'toc.full.02' },
    { part: '03', key: 'toc.full.03' },
    { part: '04', key: 'toc.full.04' },
    { part: '05', key: 'toc.full.05' },
    { part: '06', key: 'toc.full.06' },
    { part: '07', key: 'toc.full.07' },
    { part: '08', key: 'toc.full.08' },
  ],
  premium: [
    { part: '01', key: 'toc.full.01' },
    { part: '02', key: 'toc.full.02' },
    { part: '03', key: 'toc.full.03' },
    { part: '04', key: 'toc.full.04' },
    { part: '05', key: 'toc.full.05' },
    { part: '06', key: 'toc.full.06' },
    { part: '07', key: 'toc.full.07' },
    { part: '08', key: 'toc.full.08' },
    { part: '09', key: 'toc.premium.09' },
    { part: '10', key: 'toc.premium.10' },
  ],
  monthly: [],
};

function getToc(tier: TierCode, lang: Language): { part: string; title: string }[] {
  return TOC_KEYS[tier].map(({ part, key }) => ({ part, title: t(key, lang) }));
}

interface IntroPageProps {
  theme: ThemeCode;
  tier: TierCode;
  name: string;
  hasPersonalQuestion?: boolean;
}

export function IntroPage({ theme, tier, name, hasPersonalQuestion }: IntroPageProps) {
  const colors = THEMES[theme].colors;
  const lang = useLang();
  const items = getToc(tier, lang);
  const showBrand = useShowBrand();

  return (
    <>
      {/* ══════ 페이지 1: Overview (인사말) ══════ */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          {/* 상단 라벨 */}
          <Text style={[s.overviewLabel, { color: colors.textSecondary }]}>{t('intro.overview', lang)}</Text>
          <Text style={[s.tierLabel, { color: colors.primary }]}>{t(TIER_KEY[tier], lang)}</Text>

          <View style={s.spacer16} />

          {/* 이름 + 브랜드 */}
          <Text style={[s.clientName, { color: colors.primary }]}>{name || t('cover.valuedGuest', lang)}</Text>
          <Text style={[s.brandLine, { color: colors.textSecondary }]}>{showBrand ? 'SajuMuse — ' + t('intro.brandLine', lang) : t('intro.brandLine', lang)}</Text>

          <View style={[s.dividerFull, { backgroundColor: colors.border }]} />

          {/* 인사말 본문 */}
          <Text style={[s.sectionTag, { color: colors.secondary }]}>{t(TIER_KEY[tier], lang)}</Text>

          <View style={s.spacer12} />

          <Text style={[s.greeting, { color: colors.primary }]}>{t('intro.greeting', lang, { name: name || t('cover.valuedGuest', lang) })}</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {fixLigatures(t('intro.body1', lang))}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {fixLigatures(t('intro.body2', lang))}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {fixLigatures(t('intro.body3', lang))}
          </Text>

          {hasPersonalQuestion && (
            <>
              <View style={s.spacer12} />
              <View style={[s.personalNote, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
                <Text style={[s.personalNoteText, { color: colors.text }]}>
                  {fixLigatures(t('intro.personalNote', lang))}
                </Text>
              </View>
            </>
          )}

          <View style={s.spacer24} />

          <Text style={[s.signoff, { color: colors.text }]}>{t('intro.signoff', lang)}</Text>
          <Text style={[s.signoffBrand, { color: colors.primary }]}>{showBrand ? 'SajuMuse' : t('intro.signoffBrand', lang)}</Text>
        </View>

        <PageFooter color={colors.textSecondary} />
      </Page>

      {/* ══════ 페이지 2: Table of Contents ══════ */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          <Text style={[s.tocTitle, { color: colors.primary }]}>{t('intro.tocTitle', lang)}</Text>

          <View style={[s.dividerFull, { backgroundColor: colors.border }]} />

          {/* 목차 테이블 */}
          <View style={s.tocTable}>
            {/* 헤더 */}
            <View style={[s.tocHeaderRow, { borderBottomColor: colors.primary }]}>
              <Text style={[s.tocHeaderNum, { color: colors.textSecondary }]}>{t('intro.tocNum', lang)}</Text>
              <Text style={[s.tocHeaderSection, { color: colors.textSecondary }]}>{t('intro.tocSection', lang)}</Text>
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
