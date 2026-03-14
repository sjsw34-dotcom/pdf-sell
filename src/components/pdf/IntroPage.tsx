import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { TierCode } from '@/lib/types/tier';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE } from './styles/pdfStyles';

// ─── 티어별 목차 ───

const TOC: Record<TierCode, { part: string; title: string }[]> = {
  basic: [
    { part: '1', title: 'Your Destiny Chart — The Four Pillars' },
    { part: '2', title: 'Your Elemental Balance (Yongsin)' },
    { part: '3', title: 'Your Destiny Overview' },
    { part: '4', title: 'Personality & Core Strengths' },
    { part: '5', title: 'Fortune & Life Direction' },
  ],
  love: [
    { part: 'Ch.1', title: 'Your Four Pillars Structure' },
    { part: 'Ch.2', title: 'Day Master Personality' },
    { part: 'Ch.3', title: 'Elements & Love Language' },
    { part: '1', title: 'Your Romance DNA' },
    { part: '2', title: 'First Impressions & Strengths' },
    { part: '3', title: 'Your Destined Match' },
    { part: '4', title: 'Best Timing for Love' },
    { part: '5', title: 'Deep Connection (Adult)' },
    { part: '6', title: 'Lucky Items & Strategy' },
  ],
  full: [
    { part: '01', title: 'My Four Pillars Detailed Analysis' },
    { part: '02', title: "My Life's Golden Period" },
    { part: '03', title: 'Romance Fortune and Spouse Fortune' },
    { part: '04', title: 'My Wealth Fortune Analysis' },
    { part: '05', title: 'Career and Success Destiny' },
    { part: '06', title: 'Health and Constitution from Four Pillars' },
    { part: '07', title: 'Destined Benefactors Who Will Help You' },
    { part: '08', title: 'Methods to Change Destiny' },
  ],
  premium: [
    { part: '01', title: 'My Four Pillars Detailed Analysis' },
    { part: '02', title: "My Life's Golden Period" },
    { part: '03', title: 'Romance Fortune and Spouse Fortune' },
    { part: '04', title: 'My Wealth Fortune Analysis' },
    { part: '05', title: 'Career and Success Destiny' },
    { part: '06', title: 'Health and Constitution from Four Pillars' },
    { part: '07', title: 'Destined Benefactors Who Will Help You' },
    { part: '08', title: 'Methods to Change Destiny' },
    { part: '09', title: 'Monthly Detailed Fortune' },
    { part: '10', title: 'Next 10 Years Destiny Analysis' },
  ],
};

interface IntroPageProps {
  theme: ThemeCode;
  tier: TierCode;
  name: string;
}

export function IntroPage({ theme, tier, name }: IntroPageProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);
  const items = TOC[tier];

  return (
    <Page size="A4" style={s.page}>
      {/* 인사말 */}
      <View style={s.greeting}>
        <Text style={s.greetLabel}>A PERSONAL MESSAGE</Text>
        <View style={s.divider} />
        <Text style={s.greetTitle}>Dear {name},</Text>
        <Text style={s.greetBody}>
          Welcome to your personal Saju reading — a centuries-old Korean
          system that maps the cosmic energies present at the exact moment
          of your birth. The Four Pillars of your destiny reveal patterns
          in your personality, relationships, career, and life timing.
        </Text>
        <Text style={s.greetBody}>
          This report translates those ancient insights into clear,
          actionable guidance for your modern life. Let the stars
          illuminate your path.
        </Text>
      </View>

      {/* 목차 */}
      <View style={s.toc}>
        <Text style={s.tocLabel}>TABLE OF CONTENTS</Text>
        <View style={s.divider} />
        {items.map((item, idx) => (
          <View key={idx} style={s.tocRow}>
            <View style={s.tocPartBox}>
              <Text style={s.tocPart}>{item.part}</Text>
            </View>
            <Text style={s.tocTitle}>{item.title}</Text>
            <View style={s.tocDots} />
          </View>
        ))}
      </View>

      {/* 브랜드 푸터 */}
      <View style={s.footer}>
        <Text style={s.footerBrand}>SajuMuse</Text>
        <Text style={s.footerTag}>sajumuse.com</Text>
      </View>
    </Page>
  );
}

function styles(colors: { primary: string; secondary: string; background: string; surface: string; text: string; textSecondary: string; border: string }) {
  return StyleSheet.create({
    page: {
      fontFamily: FONT_BODY,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingBottom: 40,
      paddingLeft: 50,
      paddingRight: 50,
    },

    // 인사말
    greeting: { marginBottom: 30 },
    greetLabel: {
      fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold',
      color: colors.secondary, letterSpacing: 3, marginBottom: 10,
    },
    divider: {
      width: 40, height: 1, backgroundColor: colors.border, marginBottom: 14,
    },
    greetTitle: {
      fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 'bold',
      color: colors.primary, marginBottom: 12,
    },
    greetBody: {
      fontFamily: FONT_BODY, fontSize: 10, color: colors.text,
      lineHeight: 1.7, marginBottom: 8,
    },

    // 목차
    toc: { flex: 1 },
    tocLabel: {
      fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold',
      color: colors.secondary, letterSpacing: 3, marginBottom: 10,
    },
    tocRow: {
      flexDirection: 'row', alignItems: 'center',
      marginBottom: 10,
    },
    tocPartBox: {
      width: 36, height: 22, borderRadius: 4,
      backgroundColor: colors.primary,
      justifyContent: 'center', alignItems: 'center',
      marginRight: 12,
    },
    tocPart: {
      fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: '#FFFFFF',
    },
    tocTitle: {
      fontFamily: FONT_BODY, fontSize: 10, color: colors.text, flex: 1,
    },
    tocDots: {
      width: 30, height: 1,
      borderBottomWidth: 1, borderBottomColor: colors.border,
      borderBottomStyle: 'dotted',
    },

    // 푸터
    footer: {
      alignItems: 'center', paddingTop: 14,
      borderTopWidth: 1, borderTopColor: colors.border, borderTopStyle: 'solid',
    },
    footerBrand: {
      fontFamily: FONT_TITLE, fontSize: 12, fontWeight: 'bold',
      color: colors.primary, marginBottom: 2,
    },
    footerTag: {
      fontFamily: FONT_BODY, fontSize: 8, color: colors.textSecondary,
    },
  });
}
