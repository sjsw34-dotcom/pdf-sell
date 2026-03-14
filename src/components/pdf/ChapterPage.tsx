import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { getThemeStyles } from './styles/themes';

interface ChapterPageProps {
  theme: ThemeCode;
  title: string;
  content: string;
  chapterNumber?: number;
}

export function ChapterPage({ theme, title, content, chapterNumber }: ChapterPageProps) {
  const t = getThemeStyles(theme);

  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim() !== '');

  return (
    <Page size="A4" style={t.page} wrap>
      <View style={s.header}>
        {chapterNumber !== undefined ? (
          <Text style={t.label}>CHAPTER {chapterNumber}</Text>
        ) : null}
        <Text style={t.title}>{title}</Text>
        <View style={t.divider} />
      </View>

      <View style={s.body} wrap>
        {paragraphs.map((paragraph, idx) => (
          <Text key={idx} style={t.body}>
            {paragraph.trim()}
          </Text>
        ))}
      </View>

      <Text
        style={t.pageNumber}
        render={({ pageNumber }) => `${pageNumber}`}
        fixed
      />
    </Page>
  );
}

const s = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  body: {
    flex: 1,
  },
});
