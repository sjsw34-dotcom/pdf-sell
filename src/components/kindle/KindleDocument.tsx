import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from '../pdf/styles/pdfStyles';

// ─── 오행별 커버 색상 ───

export interface KindleBookColors {
  /** 커버 배경색 (어두운 톤) */
  coverBg: string;
  /** 커버 배경 보조색 (약간 밝은 톤) */
  coverBgLight: string;
  /** 액센트 색 (장식, 배지) */
  accent: string;
  /** 액센트 텍스트 색 */
  accentText: string;
  /** 오행 한자 */
  cjkChar: string;
  /** 챕터 제목 색 */
  chapterTitle: string;
  /** H2 색 */
  h2Color: string;
  /** H3 색 */
  h3Color: string;
}

export const ELEMENT_COLORS: Record<string, KindleBookColors> = {
  wood: {
    coverBg: '#0B3D2E',
    coverBgLight: '#166534',
    accent: '#22C55E',
    accentText: '#0B3D2E',
    cjkChar: '木',
    chapterTitle: '#166534',
    h2Color: '#166534',
    h3Color: '#15803D',
  },
  fire: {
    coverBg: '#450A0A',
    coverBgLight: '#991B1B',
    accent: '#F59E0B',
    accentText: '#450A0A',
    cjkChar: '火',
    chapterTitle: '#B91C1C',
    h2Color: '#991B1B',
    h3Color: '#DC2626',
  },
  earth: {
    coverBg: '#451A03',
    coverBgLight: '#92400E',
    accent: '#FBBF24',
    accentText: '#451A03',
    cjkChar: '土',
    chapterTitle: '#92400E',
    h2Color: '#92400E',
    h3Color: '#B45309',
  },
  metal: {
    coverBg: '#111827',
    coverBgLight: '#374151',
    accent: '#94A3B8',
    accentText: '#111827',
    cjkChar: '金',
    chapterTitle: '#374151',
    h2Color: '#374151',
    h3Color: '#4B5563',
  },
  water: {
    coverBg: '#0C1E3A',
    coverBgLight: '#1E3A5F',
    accent: '#06B6D4',
    accentText: '#0C1E3A',
    cjkChar: '水',
    chapterTitle: '#1E40AF',
    h2Color: '#1E3A5F',
    h3Color: '#2563EB',
  },
};

// ─── 타입 ───

export interface KindleChapter {
  number: number;
  title: string;
  content: string;
  takeaway?: string;
  exercise?: string;
  cta?: string;
}

export interface KindleDocumentProps {
  title: string;
  subtitle: string;
  element: string;
  seriesName: string;
  chapters: KindleChapter[];
  coverImagePath?: string;
}

// ─── 페이지 설정 ───
const PAGE_SIZE = { width: 432, height: 648 }; // KDP 6"×9"

// ─── 마크다운 파서 ───

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'subheading' | 'bullet' | 'numbered' | 'quote' | 'table' | 'hr';
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

function parseMarkdown(md: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // HR
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++; continue;
    }

    // Skip H1 (chapter title handled separately)
    if (line.startsWith('# ') && !line.startsWith('## ')) { i++; continue; }

    // H2
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', text: line.replace(/^## /, '') });
      i++; continue;
    }

    // H3
    if (line.startsWith('### ')) {
      blocks.push({ type: 'subheading', text: line.replace(/^### /, '') });
      i++; continue;
    }

    // Table
    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1]?.includes('---')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const parseRow = (l: string) => l.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      blocks.push({
        type: 'table',
        headers: parseRow(tableLines[0]),
        rows: tableLines.slice(2).map(parseRow),
      });
      continue;
    }

    // Bullet list
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'bullet', items });
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'numbered', items });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].replace(/^> /, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    // Paragraph
    blocks.push({ type: 'paragraph', text: line });
    i++;
  }

  return blocks;
}

// ─── 인라인 텍스트 렌더러 ───

function renderInlineText(text: string, style: Record<string, unknown>): React.ReactNode[] {
  const fixed = fixLigatures(text);
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|([^*]+))/g;
  let match;
  let key = 0;

  while ((match = regex.exec(fixed)) !== null) {
    if (match[2]) {
      parts.push(<Text key={key++} style={{ ...style, fontWeight: 'bold', color: '#666666' }}>{match[2]}</Text>);
    } else if (match[3]) {
      parts.push(<Text key={key++} style={{ ...style, fontWeight: 'bold' }}>{match[3]}</Text>);
    } else if (match[4]) {
      parts.push(<Text key={key++} style={{ ...style, color: '#666666' }}>{match[4]}</Text>);
    } else if (match[5]) {
      parts.push(<Text key={key++} style={style}>{match[5]}</Text>);
    }
  }

  return parts.length > 0 ? parts : [<Text key={0} style={style}>{fixed}</Text>];
}

// ─── 커버 페이지 ───

function CoverPage({ title, subtitle, seriesName, colors, coverImagePath }: {
  title: string; subtitle: string; seriesName: string; colors: KindleBookColors; coverImagePath?: string;
}) {
  // If cover image exists, use it as full-page image
  if (coverImagePath) {
    return (
      <Page size={PAGE_SIZE} style={{ padding: 0 }}>
        <Image src={coverImagePath} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Page>
    );
  }

  // Fallback: text-based cover
  return (
    <Page size={PAGE_SIZE} style={{ padding: 0, backgroundColor: colors.coverBg }}>
      <View style={{ flex: 1, paddingTop: 60, paddingBottom: 40, paddingHorizontal: 40, justifyContent: 'space-between' }}>
        {/* Top decoration */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: FONT_CJK, fontSize: 48, color: `${colors.accent}40`, letterSpacing: 4, marginBottom: 12 }}>
            {colors.cjkChar}
          </Text>
          <View style={{ width: 60, height: 1, backgroundColor: `${colors.accent}66` }} />
        </View>

        {/* Center: Title */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.accent, borderRadius: 3, paddingVertical: 4, paddingHorizontal: 14, marginBottom: 16 }}>
            <Text style={{ fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: colors.accentText, letterSpacing: 2 }}>
              ELEMENT IDENTITY SERIES
            </Text>
          </View>
          <Text style={{
            fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 'bold', color: '#FFFFFF',
            textAlign: 'center', lineHeight: 1.3, letterSpacing: 0.5, marginBottom: 16,
          }}>
            {title}
          </Text>
          <View style={{ width: 80, height: 2, backgroundColor: colors.accent, marginBottom: 16 }} />
          <Text style={{
            fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(255,255,255,0.75)',
            textAlign: 'center', lineHeight: 1.5, color: '#666666',
          }}>
            {subtitle}
          </Text>
        </View>

        {/* Bottom: Author */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 14 }} />
          <Text style={{ fontFamily: FONT_BODY, fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 6 }}>
            WRITTEN BY
          </Text>
          <Text style={{ fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
            Ksaju Kim
          </Text>
          <Text style={{ fontFamily: FONT_BODY, fontSize: 8, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
            Certified Korean Saju Counselor · 15+ Years
          </Text>
          <View style={{ height: 20 }} />
          <Text style={{ fontFamily: FONT_BODY, fontSize: 9, color: `${colors.accent}99`, letterSpacing: 3 }}>
            SajuMuse
          </Text>
        </View>
      </View>
    </Page>
  );
}

// ─── 저작권 페이지 ───

function CopyrightPage({ title, subtitle, seriesName }: { title: string; subtitle: string; seriesName: string }) {
  const lines = [
    `${title}: ${subtitle}`,
    '',
    '© 2025 Ksaju Kim. All rights reserved.',
    '',
    'All rights reserved. No part of this publication may be reproduced,',
    'distributed, or transmitted in any form or by any means without',
    'prior written permission.',
    '',
    `Part of the ${seriesName}`,
    '',
    'This book is for educational and entertainment purposes only.',
    '',
    'Published by SajuMuse · sajumuse.com',
  ];

  return (
    <Page size={PAGE_SIZE} style={s.page}>
      <View style={{ marginTop: 200 }}>
        {lines.map((line, i) => (
          <Text key={i} style={{ fontFamily: FONT_BODY, fontSize: 8, color: '#999999', marginBottom: 3, letterSpacing: ANTI_LIGATURE }}>
            {line || ' '}
          </Text>
        ))}
      </View>
    </Page>
  );
}

// ─── 목차 페이지 ───

function TocPage({ chapters, colors }: { chapters: KindleChapter[]; colors: KindleBookColors }) {
  return (
    <Page size={PAGE_SIZE} style={s.page}>
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 'bold', color: colors.chapterTitle, marginBottom: 8, letterSpacing: ANTI_LIGATURE }}>
          Contents
        </Text>
        <View style={{ width: 60, height: 2, backgroundColor: colors.accent, marginBottom: 24 }} />

        {chapters.map(ch => (
          <View key={ch.number} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'baseline' }}>
            <Text style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 'bold', color: colors.accent, width: 24, letterSpacing: ANTI_LIGATURE }}>
              {ch.number}.
            </Text>
            <Text style={{ fontFamily: FONT_BODY, fontSize: 11, color: '#333333', flex: 1, letterSpacing: ANTI_LIGATURE }}>
              {fixLigatures(ch.title)}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

// ─── 챕터 페이지 ───

function ChapterPages({ chapter, colors, bookTitle }: {
  chapter: KindleChapter; colors: KindleBookColors; bookTitle: string;
}) {
  const blocks = parseMarkdown(chapter.content);
  const bodyStyle = { fontFamily: FONT_BODY, fontSize: 11, lineHeight: 1.7, color: '#333333', letterSpacing: ANTI_LIGATURE };

  return (
    <Page size={PAGE_SIZE} style={s.page} wrap>
      {/* Running header */}
      <Text style={s.runningHead} fixed>
        {fixLigatures(bookTitle)}
      </Text>

      {/* Chapter header */}
      <View style={{ marginBottom: 20, marginTop: 20 }}>
        <Text style={{ fontFamily: FONT_BODY, fontSize: 10, color: colors.accent, textAlign: 'center', letterSpacing: 2, marginBottom: 8 }}>
          CHAPTER {chapter.number}
        </Text>
        <Text style={{
          fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 'bold', color: colors.chapterTitle,
          textAlign: 'center', marginBottom: 8, letterSpacing: ANTI_LIGATURE,
        }}>
          {fixLigatures(chapter.title)}
        </Text>
        <View style={{ width: 40, height: 1.5, backgroundColor: colors.accent, alignSelf: 'center' }} />
      </View>

      {/* Content blocks */}
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <Text key={idx} style={{
                fontFamily: FONT_TITLE, fontSize: 15, fontWeight: 'bold', color: colors.h2Color,
                marginTop: 16, marginBottom: 8, letterSpacing: ANTI_LIGATURE,
              }}>
                {fixLigatures(block.text || '')}
              </Text>
            );

          case 'subheading':
            return (
              <Text key={idx} style={{
                fontFamily: FONT_TITLE, fontSize: 13, fontWeight: 'bold', color: colors.h3Color,
                marginTop: 12, marginBottom: 6, letterSpacing: ANTI_LIGATURE,
              }}>
                {fixLigatures(block.text || '')}
              </Text>
            );

          case 'paragraph':
            return (
              <Text key={idx} style={{ ...bodyStyle, marginBottom: 8 }} wrap>
                {renderInlineText(block.text || '', bodyStyle)}
              </Text>
            );

          case 'bullet':
            return (
              <View key={idx} style={{ marginBottom: 4 }}>
                {(block.items || []).map((item, j) => (
                  <View key={j} style={{ flexDirection: 'row', marginBottom: 3, paddingLeft: 12 }}>
                    <Text style={{ ...bodyStyle, width: 12, color: colors.accent }}>•</Text>
                    <Text style={{ ...bodyStyle, flex: 1 }} wrap>{renderInlineText(item, bodyStyle)}</Text>
                  </View>
                ))}
              </View>
            );

          case 'numbered':
            return (
              <View key={idx} style={{ marginBottom: 4 }}>
                {(block.items || []).map((item, j) => (
                  <View key={j} style={{ flexDirection: 'row', marginBottom: 3, paddingLeft: 12 }}>
                    <Text style={{ ...bodyStyle, width: 18, fontWeight: 'bold', color: colors.accent }}>{j + 1}.</Text>
                    <Text style={{ ...bodyStyle, flex: 1 }} wrap>{renderInlineText(item, bodyStyle)}</Text>
                  </View>
                ))}
              </View>
            );

          case 'quote':
            return (
              <View key={idx} style={{
                borderLeftWidth: 3, borderLeftColor: colors.accent, borderLeftStyle: 'solid',
                backgroundColor: '#F8F8FC', padding: 10, marginVertical: 8,
              }}>
                <Text style={{ ...bodyStyle, fontSize: 10.5, color: '#555555', color: '#666666' }} wrap>
                  {renderInlineText(block.text || '', { ...bodyStyle, fontSize: 10.5, color: '#555555', color: '#666666' })}
                </Text>
              </View>
            );

          case 'table':
            return <TableBlock key={idx} headers={block.headers || []} rows={block.rows || []} colors={colors} />;

          case 'hr':
            return <View key={idx} style={{ borderBottomWidth: 0.5, borderBottomColor: '#D0D0D0', marginVertical: 12 }} />;

          default:
            return null;
        }
      })}

      {/* Takeaway box */}
      {chapter.takeaway && (
        <View style={{
          backgroundColor: '#F0FDF4', borderLeftWidth: 3, borderLeftColor: '#22C55E',
          borderLeftStyle: 'solid', padding: 12, marginTop: 16, marginBottom: 8,
        }}>
          <Text style={{ fontFamily: FONT_TITLE, fontSize: 11, fontWeight: 'bold', color: '#16A34A', marginBottom: 6, letterSpacing: ANTI_LIGATURE }}>
            ✦ Key Takeaway
          </Text>
          <Text style={{ ...bodyStyle, fontSize: 10, color: '#555555' }} wrap>
            {renderInlineText(chapter.takeaway, { ...bodyStyle, fontSize: 10, color: '#555555' })}
          </Text>
        </View>
      )}

      {/* Exercise box */}
      {chapter.exercise && (
        <View style={{
          backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#3B82F6',
          borderStyle: 'solid', borderRadius: 4, padding: 12, marginTop: 8, marginBottom: 8,
        }}>
          <Text style={{ fontFamily: FONT_TITLE, fontSize: 11, fontWeight: 'bold', color: '#2563EB', marginBottom: 6, letterSpacing: ANTI_LIGATURE }}>
            ✎ Try This
          </Text>
          <Text style={{ ...bodyStyle, fontSize: 10, color: '#555555' }} wrap>
            {renderInlineText(chapter.exercise, { ...bodyStyle, fontSize: 10, color: '#555555' })}
          </Text>
        </View>
      )}

      {/* Page number */}
      <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
    </Page>
  );
}

// ─── 테이블 블록 ───

function TableBlock({ headers, rows, colors }: { headers: string[]; rows: string[][]; colors: KindleBookColors }) {
  const colCount = headers.length;
  const cellFs = colCount <= 3 ? 9 : colCount <= 5 ? 8 : 7;
  const padH = colCount <= 4 ? 6 : 4;
  const padV = 5;

  // Calculate column flex ratios
  const colMaxLen = headers.map((h, ci) => {
    const dataLens = rows.map(r => (r[ci] || '').length);
    return Math.max(h.length, ...dataLens);
  });
  const totalLen = colMaxLen.reduce((a, b) => a + b, 1);
  const colFlex = colMaxLen.map(m => Math.max(1, Math.round((m / totalLen) * colCount * 2)));

  return (
    <View style={{ marginVertical: 8 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', backgroundColor: colors.h2Color }}>
        {headers.map((h, ci) => (
          <View key={ci} style={{ flex: colFlex[ci], paddingVertical: padV + 1, paddingHorizontal: padH }}>
            <Text style={{ fontFamily: FONT_BODY, fontSize: cellFs, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: ANTI_LIGATURE }}>
              {fixLigatures(h)}
            </Text>
          </View>
        ))}
      </View>
      {/* Rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={{
          flexDirection: 'row',
          backgroundColor: ri % 2 === 1 ? '#FAFAFA' : '#FFFFFF',
          borderBottomWidth: 0.5, borderBottomColor: '#E5E5E5',
        }}>
          {row.map((cell, ci) => (
            <View key={ci} style={{ flex: colFlex[ci] || 1, paddingVertical: padV, paddingHorizontal: padH }}>
              <Text style={{ fontFamily: FONT_BODY, fontSize: cellFs, color: '#333333', letterSpacing: ANTI_LIGATURE }} wrap>
                {renderInlineText(cell, { fontFamily: FONT_BODY, fontSize: cellFs, color: '#333333', letterSpacing: ANTI_LIGATURE })}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── 엔딩 페이지 ───

function EndingPage({ colors }: { colors: KindleBookColors }) {
  return (
    <Page size={PAGE_SIZE} style={s.page}>
      <View style={{ marginTop: 80, alignItems: 'center' }}>
        <Text style={{ fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 'bold', color: colors.chapterTitle, marginBottom: 8, letterSpacing: ANTI_LIGATURE }}>
          Thank You for Reading
        </Text>
        <View style={{ width: 40, height: 1.5, backgroundColor: colors.accent, marginBottom: 24 }} />

        <Text style={{
          fontFamily: FONT_BODY, fontSize: 11, color: '#555555', textAlign: 'center',
          lineHeight: 1.7, marginBottom: 24, paddingHorizontal: 20, letterSpacing: ANTI_LIGATURE,
        }}>
          {fixLigatures('Your element is just the beginning. Your full birth chart reveals the complete picture — all five elements, their interactions, and the unique story of your life.')}
        </Text>

        {/* Master Edition CTA */}
        <View style={{
          backgroundColor: '#FAF5FF', borderWidth: 1, borderColor: '#7C3AED',
          borderStyle: 'solid', borderRadius: 4, padding: 16, marginBottom: 20, width: '85%', alignItems: 'center',
        }}>
          <Text style={{ fontFamily: FONT_TITLE, fontSize: 12, fontWeight: 'bold', color: '#7C3AED', marginBottom: 6, letterSpacing: ANTI_LIGATURE }}>
            Get the Full Picture
          </Text>
          <Text style={{ fontFamily: FONT_BODY, fontSize: 10, color: '#7C3AED', textAlign: 'center', letterSpacing: ANTI_LIGATURE }}>
            sajumuse.com/ebook
          </Text>
          <Text style={{ fontFamily: FONT_BODY, fontSize: 9, color: '#999999', textAlign: 'center', marginTop: 4, letterSpacing: ANTI_LIGATURE }}>
            {fixLigatures('Korean Saju Decoded — Master Edition')}
          </Text>
        </View>

        {/* Free reading CTA */}
        <View style={{
          backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#22C55E',
          borderStyle: 'solid', borderRadius: 4, padding: 16, width: '85%', alignItems: 'center',
        }}>
          <Text style={{ fontFamily: FONT_TITLE, fontSize: 12, fontWeight: 'bold', color: '#16A34A', marginBottom: 6, letterSpacing: ANTI_LIGATURE }}>
            Want a Free Mini Reading?
          </Text>
          <Text style={{ fontFamily: FONT_BODY, fontSize: 10, color: '#16A34A', textAlign: 'center', letterSpacing: ANTI_LIGATURE }}>
            sajumuse.com/free-reading
          </Text>
        </View>

        {/* Author bio */}
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <View style={{ width: 30, height: 1, backgroundColor: '#E0E0E0', marginBottom: 16 }} />
          <Text style={{ fontFamily: FONT_TITLE, fontSize: 12, fontWeight: 'bold', color: '#333333', marginBottom: 8, letterSpacing: ANTI_LIGATURE }}>
            About the Author
          </Text>
          <Text style={{
            fontFamily: FONT_BODY, fontSize: 9, color: '#777777', textAlign: 'center',
            lineHeight: 1.6, paddingHorizontal: 30, letterSpacing: ANTI_LIGATURE,
          }}>
            {fixLigatures('Ksaju Kim is a certified Korean Saju counselor with over 15 years of experience interpreting Four Pillars birth charts. Through sajumuse.com, she makes Korean astrology accessible to a global audience while maintaining the depth and precision of the traditional practice.')}
          </Text>
        </View>
      </View>
    </Page>
  );
}

// ─── 메인 Document ───

export function KindleDocument({ title, subtitle, element, seriesName, chapters, coverImagePath }: KindleDocumentProps) {
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.wood;

  return (
    <Document title={`${title}: ${subtitle}`} author="Ksaju Kim">
      <CoverPage title={title} subtitle={subtitle} seriesName={seriesName} colors={colors} coverImagePath={coverImagePath} />
      <CopyrightPage title={title} subtitle={subtitle} seriesName={seriesName} />
      <TocPage chapters={chapters} colors={colors} />
      {chapters.map(ch => (
        <ChapterPages key={ch.number} chapter={ch} colors={colors} bookTitle={title} />
      ))}
      <EndingPage colors={colors} />
    </Document>
  );
}

// ─── 공통 스타일 ───

const s = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    backgroundColor: '#FFFFFF',
    paddingTop: 43,
    paddingBottom: 40,
    paddingLeft: 54,
    paddingRight: 36,
  },
  runningHead: {
    position: 'absolute',
    top: 20,
    left: 54,
    right: 36,
    textAlign: 'center',
    fontSize: 7,
    fontFamily: FONT_BODY,
    color: '#BBBBBB',
    letterSpacing: ANTI_LIGATURE,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: FONT_BODY,
    color: '#999999',
  },
});
