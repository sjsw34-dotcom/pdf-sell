import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { ebookStyles, FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, EBOOK_PAGE_SIZE, fixLigatures } from './styles/ebookStyles';
import { EbookPageFooter } from './EbookPageFooter';

interface EbookChapterPageProps {
  chapterNumber: number;
  title: string;
  partTitle?: string;
  content: string;
  /** Key Takeaways (bullet points) */
  takeaways?: string[];
  /** Try It Yourself 과제 */
  exercise?: string;
  /** CTA 텍스트 (챕터 끝) */
  cta?: string;
}

/**
 * 마크다운 라이트 파서 — eBook 본문용
 * 지원: **bold**, *italic*, ## headings, bullet lists, > blockquotes
 */
function parseContent(text: string): ContentBlock[] {
  const lines = text.split('\n');
  const blocks: ContentBlock[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join(' ') });
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // 빈 줄 → 단락 구분
    if (trimmed === '') {
      flushParagraph();
      continue;
    }

    // ## 소제목
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      blocks.push({ type: 'heading', text: trimmed.slice(3) });
      continue;
    }

    // ### 소소제목
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      blocks.push({ type: 'subheading', text: trimmed.slice(4) });
      continue;
    }

    // > 인용
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      blocks.push({ type: 'quote', text: trimmed.slice(2) });
      continue;
    }

    // - 또는 • 불릿
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: trimmed.slice(2) });
      continue;
    }

    // 일반 텍스트
    currentParagraph.push(trimmed);
  }
  flushParagraph();

  return blocks;
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'bullet'; text: string };

/** 마크다운 서식 제거 (bold/italic) */
function stripInline(text: string): string {
  return fixLigatures(
    text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
  );
}

export function EbookChapterPage({
  chapterNumber,
  title,
  partTitle,
  content,
  takeaways,
  exercise,
  cta,
}: EbookChapterPageProps) {
  const blocks = parseContent(content || '');

  return (
    <Page size={EBOOK_PAGE_SIZE} style={ebookStyles.page} wrap>
      {/* Running head */}
      <Text style={ebookStyles.runningHead} fixed>
        {partTitle ? `${partTitle}` : 'KOREAN SAJU DECODED'}
      </Text>

      {/* 챕터 헤더 */}
      <View style={s.chapterHeader}>
        <Text style={s.chapterLabel}>CHAPTER {chapterNumber}</Text>
        <Text style={ebookStyles.h1}>{fixLigatures(title)}</Text>
        <View style={ebookStyles.dividerThick} />
      </View>

      {/* 본문 */}
      <View style={s.body} wrap>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case 'heading':
              return <Text key={idx} style={ebookStyles.h2}>{stripInline(block.text)}</Text>;
            case 'subheading':
              return <Text key={idx} style={ebookStyles.h3}>{stripInline(block.text)}</Text>;
            case 'paragraph':
              return <Text key={idx} style={ebookStyles.body}>{stripInline(block.text)}</Text>;
            case 'quote':
              return (
                <View key={idx} style={ebookStyles.callout}>
                  <Text style={ebookStyles.calloutText}>{stripInline(block.text)}</Text>
                </View>
              );
            case 'bullet':
              return (
                <View key={idx} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={[ebookStyles.body, s.bulletText]}>{stripInline(block.text)}</Text>
                </View>
              );
            default:
              return null;
          }
        })}

        {/* Key Takeaways */}
        {takeaways && takeaways.length > 0 && (
          <View style={ebookStyles.takeawayBox} wrap={false}>
            <Text style={ebookStyles.takeawayLabel}>Key Takeaways</Text>
            {takeaways.map((t, i) => (
              <View key={i} style={s.bulletRow}>
                <Text style={s.takeawayDot}>✓</Text>
                <Text style={[ebookStyles.body, s.bulletText]}>{fixLigatures(t)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Try It Yourself */}
        {exercise && (
          <View style={ebookStyles.exerciseBox} wrap={false}>
            <Text style={ebookStyles.exerciseLabel}>Try It Yourself</Text>
            <Text style={ebookStyles.body}>{fixLigatures(exercise)}</Text>
          </View>
        )}

        {/* CTA */}
        {cta && (
          <View style={ebookStyles.ctaBox} wrap={false}>
            <Text style={ebookStyles.ctaText}>{fixLigatures(cta)}</Text>
          </View>
        )}
      </View>

      <EbookPageFooter />
    </Page>
  );
}

const s = StyleSheet.create({
  chapterHeader: {
    marginBottom: 16,
  },
  chapterLabel: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#7C3AED',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  body: {
    flex: 1,
    paddingBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 4,
  },
  bulletDot: {
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    color: '#7C3AED',
    width: 14,
    marginTop: 1,
  },
  takeawayDot: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    color: '#16A34A',
    width: 14,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    marginBottom: 2,
  },
});
