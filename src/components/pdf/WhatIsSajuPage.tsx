import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';
import { PageFooter } from './PageFooter';
import { useShowBrand } from './BrandContext';
import { useLang } from './LanguageContext';
import { t } from '@/lib/i18n/pdf-strings';

interface WhatIsSajuPageProps {
  theme: ThemeCode;
}

export function WhatIsSajuPage({ theme }: WhatIsSajuPageProps) {
  const colors = THEMES[theme].colors;
  const L = fixLigatures;
  const showBrand = useShowBrand();
  const lang = useLang();

  return (
    <>
      {/* 페이지 1 */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          <Text style={s.tagline}>{t('saju.tagline', lang)}</Text>
          {showBrand && <Text style={[s.author, { color: colors.textSecondary }]}>SajuMuse</Text>}

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>{t('saju.whatIsSaju', lang)}</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L(t('saju.body1', lang))}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L(t('saju.body2', lang))}
          </Text>

          <View style={s.spacer} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>{L(t('saju.whatCanReveal', lang))}</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L(t('saju.body3', lang))}
          </Text>
        </View>

        <PageFooter color={colors.textSecondary} />
      </Page>

      {/* 페이지 2 */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          <Text style={[s.body, { color: colors.text }]}>
            {L(t(showBrand ? 'saju.body4brand' : 'saju.body4nobrand', lang))}
          </Text>

          <View style={s.spacer} />

          <View style={[s.callout, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
            <Text style={[s.calloutText, { color: colors.primary }]}>
              {t('saju.callout', lang)}
            </Text>
          </View>

          <View style={s.spacer} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>{t('saju.howToRead', lang)}</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L(t('saju.howBody1', lang))}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L(t('saju.howBody2', lang))}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L(t('saju.howBody3', lang))}
          </Text>

          <View style={s.spacer} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>{t('saju.termGuide', lang)}</Text>

          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>{t('saju.termStem', lang)}</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>{t('saju.termStemDesc', lang)}</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>{t('saju.termBranch', lang)}</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>{t('saju.termBranchDesc', lang)}</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>{t('saju.termTenGods', lang)}</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>{t('saju.termTenGodsDesc', lang)}</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>{t('saju.termFiveEl', lang)}</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>{t('saju.termFiveElDesc', lang)}</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>{t('saju.termYongsin', lang)}</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>{t('saju.termYongsinDesc', lang)}</Text>
          </View>
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

  tagline: {
    fontFamily: FONT_TITLE,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  author: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    marginBottom: 20,
  },

  divider: {
    width: '100%',
    height: 1,
    marginBottom: 24,
  },

  sectionTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  body: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 1.8,
    marginBottom: 12,
    letterSpacing: ANTI_LIGATURE,
  },

  spacer: {
    height: 20,
  },

  callout: {
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    padding: 16,
    borderRadius: 4,
  },
  calloutText: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 1.5,
  },

  termRow: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
    borderBottomStyle: 'solid',
  },
  termLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  termDesc: {
    fontFamily: FONT_BODY,
    fontSize: 13,
    lineHeight: 1.5,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    borderTopStyle: 'solid',
  },
  footerText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    letterSpacing: 1,
  },
});
