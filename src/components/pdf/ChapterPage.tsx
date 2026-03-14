import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { getThemeStyles } from './styles/themes';
import { PageFooter } from './PageFooter';
import { THEMES } from '@/lib/constants/themes';

interface ChapterPageProps {
  theme: ThemeCode;
  title: string;
  content: string;
  chapterNumber?: number;
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

export function ChapterPage({ theme, title, content, chapterNumber }: ChapterPageProps) {
  const t = getThemeStyles(theme);
  const colors = THEMES[theme].colors;
  const safeContent = stripMarkdown(content || '');
  const paragraphs = safeContent.split(/\n\n+/).filter((p) => p.trim() !== '');

  return (
    <Page size="A4" style={t.page} wrap>
      <View style={s.header}>
        {chapterNumber !== undefined && (
          <Text style={t.label}>CHAPTER {chapterNumber}</Text>
        )}
        <Text style={t.title}>{title || ''}</Text>
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
  body: { flex: 1, paddingBottom: 30 },
});
