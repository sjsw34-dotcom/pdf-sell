import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { getThemeStyles } from './styles/themes';
import { PageFooter } from './PageFooter';
import { FONT_BODY } from './styles/pdfStyles';
import { THEMES } from '@/lib/constants/themes';

interface ChapterPageProps {
  theme: ThemeCode;
  title: string;
  content: string;
  chapterNumber?: number;
  /** "Chapter 1-1" 같은 커스텀 라벨. chapterNumber보다 우선 */
  chapterLabel?: string;
  /** Part 소속 제목 (예: "My Four Pillars — Detailed Analysis") */
  sectionTitle?: string;
}

/** AI 텍스트에서 마크다운 서식을 제거 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .trim();
}

export function ChapterPage({ theme, title, content, chapterNumber, chapterLabel, sectionTitle }: ChapterPageProps) {
  const t = getThemeStyles(theme);
  const colors = THEMES[theme].colors;
  const safeContent = stripMarkdown(content || '');
  const paragraphs = safeContent.split(/\n\n+/).filter((p) => p.trim() !== '');

  const label = chapterLabel || (chapterNumber !== undefined ? `CHAPTER ${chapterNumber}` : undefined);

  return (
    <Page size="A4" style={t.page} wrap>
      <View style={s.header}>
        {label && (
          <Text style={t.label}>{label}</Text>
        )}
        <Text style={t.title}>{title || ''}</Text>
        {sectionTitle && (
          <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>{sectionTitle}</Text>
        )}
        <View style={t.divider} />
      </View>

      <View style={s.body} wrap>
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, idx) => (
              <Text key={idx} style={t.body}>{paragraph.trim()}</Text>
            ))
          : <Text style={t.body}> </Text>
        }
      </View>

      <PageFooter color={colors.textSecondary} />
    </Page>
  );
}

const s = StyleSheet.create({
  header: { marginBottom: 16 },
  sectionTitle: { fontFamily: FONT_BODY, fontSize: 13, marginTop: 4, marginBottom: 6 },
  body: { flex: 1, paddingBottom: 30 },
});
