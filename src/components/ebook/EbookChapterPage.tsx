import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { ebookStyles, FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, EBOOK_PAGE_SIZE, fixLigatures } from './styles/ebookStyles';
import { EbookPageFooter } from './EbookPageFooter';
// 다이어그램 컴포넌트 — react-pdf SVG/절대위치 렌더링 한계로 비활성화
// 향후 이미지 기반 다이어그램으로 교체 시 다시 활성화

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

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // 빈 줄 → 단락 구분
    if (trimmed === '') {
      flushParagraph();
      i++;
      continue;
    }

    // 수평선 (---) → 스킵
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushParagraph();
      i++;
      continue;
    }

    // 코드 블록 (```) — 모노스페이스 또는 스킵
    if (trimmed.startsWith('```')) {
      flushParagraph();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // 닫는 ``` 건너뛰기
      if (codeLines.length > 0) {
        blocks.push({ type: 'code', text: codeLines.join('\n') });
      }
      continue;
    }

    // 테이블 파싱: | 로 시작하는 연속 줄
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushParagraph();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseCells = (row: string) => row.split('|').slice(1, -1).map(c => c.trim());
        const headers = parseCells(tableLines[0]);
        // 구분자행(|---|---|) 건너뛰기
        const startRow = tableLines[1].includes('---') ? 2 : 1;
        const rows = tableLines.slice(startRow).map(parseCells);
        blocks.push({ type: 'table', headers, rows });
      }
      continue;
    }

    // :::diagram 블록
    if (trimmed.startsWith(':::diagram ')) {
      flushParagraph();
      blocks.push({ type: 'diagram', text: trimmed.slice(11).trim() });
      i++;
      continue;
    }

    // ## 소제목
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      blocks.push({ type: 'heading', text: trimmed.slice(3) });
      i++; continue;
    }

    // ### 소소제목
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      blocks.push({ type: 'subheading', text: trimmed.slice(4) });
      i++; continue;
    }

    // > 인용
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      blocks.push({ type: 'quote', text: trimmed.slice(2) });
      i++; continue;
    }

    // - 또는 • 불릿
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: trimmed.slice(2) });
      i++; continue;
    }

    // :::saju-chart 및 ::: 블록 건너뛰기
    if (trimmed.startsWith(':::')) {
      flushParagraph();
      i++;
      // ::: 닫는 태그까지 건너뛰기
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        i++;
      }
      if (i < lines.length) i++; // 닫는 ::: 건너뛰기
      continue;
    }

    // # 제목 (본문 제목 — PDF에서는 컴포넌트가 자동 생성하므로 건너뛰기)
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      flushParagraph();
      i++; continue;
    }

    // 일반 텍스트
    currentParagraph.push(trimmed);
    i++;
  }
  flushParagraph();

  return blocks;
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'diagram'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'code'; text: string };

/** 다이어그램 렌더링 — react-pdf SVG/절대위치 렌더링 한계로 비활성화 */
function renderDiagram(_type: string, _key: number) {
  return null;
}

/** 마크다운 서식 제거 (bold/italic) */
function stripInline(text: string): string {
  return fixLigatures(
    text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
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
        <Text style={ebookStyles.h1}>{stripInline(title)}</Text>
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
                <View key={idx} style={s.bulletRow} wrap={false}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={[ebookStyles.body, s.bulletText]}>{stripInline(block.text)}</Text>
                </View>
              );
            case 'table': {
              // 컬럼 수에 따라 폰트/패딩 자동 스케일링
              const colCount = block.headers.length;
              const cellFs = colCount <= 4 ? 8 : colCount <= 5 ? 7 : colCount <= 7 ? 6.5 : 6;
              const headerFs = colCount <= 4 ? 8 : colCount <= 5 ? 7.5 : colCount <= 7 ? 7 : 6.5;
              const padH = colCount <= 4 ? 4 : colCount <= 5 ? 3 : colCount <= 7 ? 2 : 1.5;
              const padV = colCount <= 4 ? 4 : colCount <= 5 ? 3 : 2.5;
              const lh = colCount <= 4 ? 1.3 : 1.2;
              const allowWrap = block.rows.length >= 7;

              // 컬럼별 평균 텍스트 길이 계산 → flex 비율 & 정렬 결정
              const colAvgLen = block.headers.map((h, ci) => {
                const lengths = block.rows.map(r => (r[ci] || '').length);
                return lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
              });
              const colMaxLen = block.headers.map((h, ci) => {
                const lengths = block.rows.map(r => (r[ci] || '').length);
                return Math.max(h.length, ...lengths);
              });
              // flex 비율: maxLen 기반, 최소 1 최대 4
              const totalMax = colMaxLen.reduce((a, b) => a + b, 0) || 1;
              const colFlex = colMaxLen.map(m => Math.max(1, Math.min(4, (m / totalMax) * colCount * 1.5)));
              // 정렬: 평균 길이 20자 이하면 center, 그 이상이면 left
              const colAlign = colAvgLen.map(avg => avg <= 20 ? 'center' as const : 'left' as const);

              return (
                <View key={idx} style={s.tableWrap} wrap={allowWrap}>
                  {/* 헤더 행 */}
                  <View style={[s.tableHeaderRow, { paddingHorizontal: padH }]}>
                    {block.headers.map((h, hi) => (
                      <View key={hi} style={[s.tableHeaderCell, { flex: colFlex[hi], paddingHorizontal: padH }]}>
                        <Text style={[s.tableHeaderText, { fontSize: headerFs }]}>{stripInline(h)}</Text>
                      </View>
                    ))}
                  </View>
                  {/* 데이터 행 */}
                  {block.rows.map((row, ri) => (
                    <View key={ri} style={[s.tableRow, ri % 2 === 1 ? s.tableRowAlt : {}, { paddingVertical: padV, paddingHorizontal: padH }]}>
                      {row.map((cell, ci) => (
                        <View key={ci} style={[s.tableCell, { flex: colFlex[ci], paddingHorizontal: padH, overflow: 'hidden' }]}>
                          <Text style={[s.tableCellText, { fontSize: cellFs, lineHeight: lh, textAlign: colAlign[ci] }]}>{stripInline(cell)}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              );
            }
            case 'code':
              return (
                <View key={idx} style={s.codeBlock} wrap={false}>
                  <Text style={s.codeText}>{block.text}</Text>
                </View>
              );
            case 'diagram':
              return renderDiagram(block.text, idx);
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
                <Text style={[ebookStyles.body, s.bulletText]}>{stripInline(t)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Try It Yourself */}
        {exercise && (
          <View style={ebookStyles.exerciseBox} wrap={false}>
            <Text style={ebookStyles.exerciseLabel}>Try It Yourself</Text>
            <Text style={ebookStyles.body}>{stripInline(exercise)}</Text>
          </View>
        )}

        {/* CTA */}
        {cta && (
          <View style={ebookStyles.ctaBox} wrap={false}>
            <Text style={ebookStyles.ctaText}>{stripInline(cta)}</Text>
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
    fontSize: 11,
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
  // 테이블 스타일
  tableWrap: {
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    paddingHorizontal: 4,
  },
  tableHeaderText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
  },
  tableRowAlt: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    paddingHorizontal: 4,
  },
  tableCellText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#1A1A2E',
    lineHeight: 1.3,
    letterSpacing: ANTI_LIGATURE,
  },
  // 코드 블록
  codeBlock: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 2,
    padding: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  codeText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: '#333333',
    lineHeight: 1.5,
  },
});
