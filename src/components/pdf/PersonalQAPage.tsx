import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';
import { PageFooter } from './PageFooter';
import { useLang } from './LanguageContext';
import { t } from '@/lib/i18n/pdf-strings';

interface PersonalQAPageProps {
  theme: ThemeCode;
  question: string;
  answer: string;
}

export function PersonalQAPage({ theme, question, answer }: PersonalQAPageProps) {
  const colors = THEMES[theme].colors;
  const lang = useLang();
  const paragraphs = fixLigatures(answer).split(/\n\n+/).filter((p) => p.trim() !== '');

  return (
    <Page size="A4" style={[s.page, { backgroundColor: colors.background }]} wrap>
      <View style={s.header}>
        <Text style={[s.label, { color: colors.secondary }]}>{t('qa.label', lang)}</Text>
        <Text style={[s.title, { color: colors.primary }]}>{t('qa.title', lang)}</Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{t('qa.subtitle', lang)}</Text>
        <View style={[s.divider, { borderBottomColor: colors.border }]} />
      </View>

      {/* 질문 박스 */}
      <View style={[s.questionBox, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
        <Text style={[s.questionLabel, { color: colors.primary }]}>Q.</Text>
        <Text style={[s.questionText, { color: colors.text }]}>{fixLigatures(question)}</Text>
      </View>

      <View style={s.spacer16} />

      {/* 답변 */}
      <View style={[s.answerHeader]}>
        <Text style={[s.answerLabel, { color: colors.primary }]}>A.</Text>
        <Text style={[s.answerIntro, { color: colors.textSecondary }]}>{t('qa.answerIntro', lang)}</Text>
      </View>

      <View style={s.spacer12} />

      <View style={s.answerBody} wrap>
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, idx) => (
              <Text key={idx} style={[s.body, { color: colors.text }]}>{paragraph.trim()}</Text>
            ))
          : <Text style={[s.body, { color: colors.text }]}>{fixLigatures(answer)}</Text>
        }
      </View>

      <PageFooter color={colors.textSecondary} />
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 45,
    paddingLeft: 50,
    paddingRight: 50,
  },
  header: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: ANTI_LIGATURE,
  },
  subtitle: {
    fontFamily: FONT_CJK,
    fontSize: 12,
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    marginTop: 8,
  },

  // 질문 박스
  questionBox: {
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  questionText: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    flex: 1,
    lineHeight: 1.7,
    letterSpacing: ANTI_LIGATURE,
  },

  // 답변
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  answerLabel: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  answerIntro: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    letterSpacing: ANTI_LIGATURE,
  },
  answerBody: {
    flex: 1,
    paddingBottom: 30,
  },
  body: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 1.8,
    marginBottom: 10,
    letterSpacing: ANTI_LIGATURE,
  },

  spacer12: { height: 12 },
  spacer16: { height: 16 },
});
