import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';
import { PageFooter } from './PageFooter';
import { useShowBrand } from './BrandContext';

interface WhatIsSajuPageProps {
  theme: ThemeCode;
}

export function WhatIsSajuPage({ theme }: WhatIsSajuPageProps) {
  const colors = THEMES[theme].colors;
  const L = fixLigatures;
  const showBrand = useShowBrand();

  return (
    <>
      {/* 페이지 1 */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          <Text style={s.tagline}>We study destiny.</Text>
          {showBrand && <Text style={[s.author, { color: colors.textSecondary }]}>SajuMuse</Text>}

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>What is Saju?</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L('Saju is an analytical method rooted in traditional Eastern philosophy and statistical principles. It interprets an individual\'s personality and destiny based on the year, month, day, and hour of birth. Saju (四柱) literally means "Four Pillars," each representing the Year (年), Month (月), Day (日), and Hour (時).')}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L('Unlike fortune-telling based on subjective intuition, Saju pursues objective interpretation grounded in statistical data accumulated over centuries and the theory of Yin-Yang and the Five Elements (陰陽五行). Yin and Yang represent the principle of dividing all phenomena into two opposing natures — light and darkness, day and night. The Five Elements consist of Wood (木), Fire (火), Earth (土), Metal (金), and Water (水), and through the way these elements influence one another, our lives are interpreted.')}
          </Text>

          <View style={s.spacer} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>{L('What can Saju reveal?')}</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L('Saju is not simply a tool for predicting the future. Its true significance lies in helping you better understand yourself by analyzing your personality, strengths and weaknesses, and the flow of your life. You can use it as a reference when making important decisions or to find direction for addressing areas where you may be lacking.')}
          </Text>
        </View>

        <PageFooter color={colors.textSecondary} />
      </Page>

      {/* 페이지 2 */}
      <Page size="A4" style={[s.page, { backgroundColor: colors.background }]}>
        <View style={s.content}>
          <Text style={[s.body, { color: colors.text }]}>
            {L(showBrand
              ? 'At SajuMuse, we aim to help you discover your own unique story through Saju and empower you to make better choices. We will walk you through the path of your life in an approachable and friendly way.'
              : 'We aim to help you discover your own unique story through Saju and empower you to make better choices. We will walk you through the path of your life in an approachable and friendly way.')}
          </Text>

          <View style={s.spacer} />

          <View style={[s.callout, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
            <Text style={[s.calloutText, { color: colors.primary }]}>
              Shall we begin your personal Saju story?
            </Text>
          </View>

          <View style={s.spacer} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>How to Read This Report</Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L('Your Saju birth chart is organized into Four Pillars, each derived from your birth year, month, day, and hour. Every pillar contains two elements: a Heavenly Stem (top) and an Earthly Branch (bottom).')}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L('The Day Pillar\'s Heavenly Stem — marked "Day Master" — represents your core self. The surrounding stars describe how different energies interact with your Day Master, shaping your personality, relationships, career, and life flow.')}
          </Text>

          <Text style={[s.body, { color: colors.text }]}>
            {L('Don\'t worry if the terminology feels unfamiliar — the Comprehensive Analysis section that follows translates all of this into plain language about your life.')}
          </Text>

          <View style={s.spacer} />

          <Text style={[s.sectionTitle, { color: colors.primary }]}>Terminology Guide</Text>

          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>Heavenly Stem (천간 · 天干)</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>The top element of each pillar — represents cosmic energy</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>Earthly Branch (지지 · 地支)</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>The bottom element of each pillar — represents earthly energy</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>Ten Gods (십신 · 十神)</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>The relationship between each element and your Day Master</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>Five Elements (오행 · 五行)</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>Wood, Fire, Earth, Metal, Water — the building blocks of energy</Text>
          </View>
          <View style={s.termRow}>
            <Text style={[s.termLabel, { color: colors.primary }]}>Favorable Element (용신 · 用神)</Text>
            <Text style={[s.termDesc, { color: colors.textSecondary }]}>The element that brings balance and harmony to your chart</Text>
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
