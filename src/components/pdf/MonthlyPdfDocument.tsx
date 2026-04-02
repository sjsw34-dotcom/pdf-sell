import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { SajuData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';

const colors = THEMES.amormuse.colors;

interface Props {
  sajuData: SajuData;
  texts: Record<string, string>;
  clientName: string;
  monthLabel: string; // e.g. "April 2026"
}

const s = StyleSheet.create({
  // ── Cover Page ──
  coverPage: {
    fontFamily: FONT_BODY,
    backgroundColor: colors.background,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  coverBrand: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 3,
    marginBottom: 30,
  },
  coverMonth: {
    fontFamily: FONT_TITLE,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 40,
    letterSpacing: ANTI_LIGATURE,
  },
  coverName: {
    fontFamily: FONT_TITLE,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: ANTI_LIGATURE,
  },
  coverFor: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: ANTI_LIGATURE,
  },
  coverDivider: {
    width: 60,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  coverFooter: {
    fontSize: 9,
    color: colors.border,
    position: 'absolute',
    bottom: 40,
    letterSpacing: ANTI_LIGATURE,
  },

  // ── Content Pages ──
  page: {
    fontFamily: FONT_BODY,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 50,
    paddingRight: 50,
  },
  sectionTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: ANTI_LIGATURE,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 20,
    letterSpacing: ANTI_LIGATURE,
  },
  body: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.9,
    marginBottom: 12,
    letterSpacing: ANTI_LIGATURE,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    marginVertical: 18,
  },

  // ── Highlight Box ──
  highlightBox: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderLeftStyle: 'solid',
    padding: 14,
    marginBottom: 16,
    borderRadius: 4,
  },
  highlightText: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.8,
    letterSpacing: ANTI_LIGATURE,
  },

  // ── Caution Box ──
  cautionBox: {
    backgroundColor: '#1A1520',
    borderLeftWidth: 3,
    borderLeftColor: colors.caution,
    borderLeftStyle: 'solid',
    padding: 14,
    marginBottom: 16,
    borderRadius: 4,
  },
  cautionText: {
    fontSize: 11,
    color: colors.caution,
    lineHeight: 1.8,
    letterSpacing: ANTI_LIGATURE,
  },

  // ── Page Number ──
  pageNumber: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: colors.border,
  },
  brandFooter: {
    position: 'absolute',
    bottom: 24,
    left: 50,
    fontSize: 8,
    color: colors.border,
    letterSpacing: 1,
  },

  // ── Closing Page ──
  closingPage: {
    fontFamily: FONT_BODY,
    backgroundColor: colors.background,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  closingBrand: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 3,
    marginBottom: 16,
  },
  closingMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 1.8,
    maxWidth: 300,
    letterSpacing: ANTI_LIGATURE,
  },
  closingUrl: {
    fontSize: 10,
    color: colors.border,
    marginTop: 30,
    letterSpacing: ANTI_LIGATURE,
  },
});

function fix(text: string | undefined): string {
  return fixLigatures(text || '');
}

function ContentPage({ title, subtitle, text, pageNum }: { title: string; subtitle: string; text: string; pageNum: number }) {
  // Split text into paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim());

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionTitle}>{fix(title)}</Text>
      <Text style={s.sectionSubtitle}>{fix(subtitle)}</Text>
      <View style={s.divider} />
      {paragraphs.map((p, i) => (
        <Text key={i} style={s.body}>{fix(p)}</Text>
      ))}
      <Text style={s.brandFooter}>AmorMuse</Text>
      <Text style={s.pageNumber}>{pageNum}</Text>
    </Page>
  );
}

function HighlightPage({ title, subtitle, text, pageNum }: { title: string; subtitle: string; text: string; pageNum: number }) {
  const paragraphs = text.split('\n').filter(p => p.trim());

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionTitle}>{fix(title)}</Text>
      <Text style={s.sectionSubtitle}>{fix(subtitle)}</Text>
      <View style={s.divider} />
      {paragraphs.map((p, i) => {
        const isCaution = p.startsWith('CAUTION:') || p.startsWith('Warning:') || p.startsWith('Be careful');
        const box = isCaution ? s.cautionBox : s.highlightBox;
        const txt = isCaution ? s.cautionText : s.highlightText;
        return (
          <View key={i} style={box}>
            <Text style={txt}>{fix(p)}</Text>
          </View>
        );
      })}
      <Text style={s.brandFooter}>AmorMuse</Text>
      <Text style={s.pageNumber}>{pageNum}</Text>
    </Page>
  );
}

export function MonthlyPdfDocument({ sajuData, texts, clientName, monthLabel }: Props) {
  // Extract day master info for the message page
  const dayStem = sajuData?.pillar?.dayPillar?.heavenlyStem || '';

  let pageNum = 0;

  return (
    <Document
      title={`${monthLabel} Fortune Report — ${clientName}`}
      author="AmorMuse"
      subject={`Monthly Fortune Report for ${monthLabel}`}
    >
      {/* 1. Cover Page */}
      <Page size="A4" style={s.coverPage}>
        <Text style={s.coverBrand}>AMORMUSE</Text>
        <Text style={s.coverMonth}>{monthLabel}</Text>
        <Text style={s.coverSubtitle}>Monthly Fortune Report</Text>
        <View style={s.coverDivider} />
        <Text style={s.coverName}>{fix(clientName)}</Text>
        {dayStem && <Text style={s.coverFor}>Day Master: {dayStem}</Text>}
        <Text style={s.coverFooter}>amormuse.com</Text>
      </Page>

      {/* 2. Monthly Message — 이달의 한마디 */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>Your Month at a Glance</Text>
        <Text style={s.sectionSubtitle}>A personal message based on your birth chart</Text>
        <View style={s.divider} />
        <View style={s.highlightBox}>
          <Text style={s.highlightText}>{fix(texts['monthly_message'])}</Text>
        </View>
        <Text style={s.brandFooter}>AmorMuse</Text>
        <Text style={s.pageNumber}>{++pageNum}</Text>
      </Page>

      {/* 3-4. Fortune Overview — 전체 운세 요약 (2-3 pages) */}
      <ContentPage
        title="This Month's Fortune"
        subtitle="Overall energy and direction for the month"
        text={texts['monthly_overview'] || ''}
        pageNum={++pageNum}
      />
      {texts['monthly_overview_2'] && (
        <ContentPage
          title="This Month's Fortune"
          subtitle="Continued"
          text={texts['monthly_overview_2']}
          pageNum={++pageNum}
        />
      )}

      {/* 5-6. Caution Dates — 주의할 시기/일자 (2 pages) */}
      <HighlightPage
        title="Dates to Watch"
        subtitle="Periods that need extra care and attention"
        text={texts['monthly_cautions'] || ''}
        pageNum={++pageNum}
      />
      {texts['monthly_cautions_2'] && (
        <HighlightPage
          title="Dates to Watch"
          subtitle="Continued"
          text={texts['monthly_cautions_2']}
          pageNum={++pageNum}
        />
      )}

      {/* 7-8. Lucky Dates — 행운의 날짜 (2 pages) */}
      <HighlightPage
        title="Lucky Dates"
        subtitle="Best days for important decisions and new beginnings"
        text={texts['monthly_lucky_dates'] || ''}
        pageNum={++pageNum}
      />

      {/* 9-10. Lucky Items — 색상/방향/아이템 (2 pages) */}
      <ContentPage
        title="Lucky Colors, Directions & Items"
        subtitle="Align your environment with your chart energy"
        text={texts['monthly_lucky_items'] || ''}
        pageNum={++pageNum}
      />

      {/* 11-12. Action Tips — 실천 팁 (2-3 pages) */}
      <ContentPage
        title="Action Tips for This Month"
        subtitle="Practical steps to make the most of your energy"
        text={texts['monthly_tips'] || ''}
        pageNum={++pageNum}
      />
      {texts['monthly_tips_2'] && (
        <ContentPage
          title="Action Tips"
          subtitle="Continued"
          text={texts['monthly_tips_2']}
          pageNum={++pageNum}
        />
      )}

      {/* Last. Closing Page */}
      <Page size="A4" style={s.closingPage}>
        <Text style={s.closingBrand}>AMORMUSE</Text>
        <Text style={s.closingMessage}>
          {fix(`Thank you for reading, ${clientName}.\nYour next report will arrive on the 1st.\nWishing you a wonderful month ahead.`)}
        </Text>
        <Text style={s.closingUrl}>amormuse.com</Text>
      </Page>
    </Document>
  );
}
