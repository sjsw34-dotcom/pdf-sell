#!/usr/bin/env tsx
/**
 * Kindle Series 빌드 스크립트
 *
 * 사용법:
 *   npx tsx scripts/build-kindle.ts --series a --book wood                # DOCX (기본)
 *   npx tsx scripts/build-kindle.ts --series a --book fire --format pdf   # PDF
 *   npx tsx scripts/build-kindle.ts --series a --book all --format both   # DOCX + PDF
 *   npx tsx scripts/build-kindle.ts --status                              # 챕터 현황
 *
 * 출력:
 *   output/kindle-series/wood-people.docx / .pdf
 *   output/kindle-series/fire-people.docx / .pdf
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  convertInchesToTwip,
  Footer,
  PageNumber,
  Header,
  Packer,
} from 'docx';

// ─── 시리즈 설정 ───

interface KindleBook {
  id: string;
  series: string;
  element?: string;
  title: string;
  subtitle: string;
  price: string;
  chaptersDir: string;
  outputFile: string;
}

const KINDLE_BOOKS: KindleBook[] = [
  // Series A: Element Identity
  {
    id: 'a1-wood', series: 'a', element: 'wood',
    title: 'Wood People',
    subtitle: "The Grower's Guide to Life, Love & Career",
    price: '$4.99',
    chaptersDir: 'chapters-kindle-a/book-a1-wood',
    outputFile: 'wood-people',
  },
  {
    id: 'a2-fire', series: 'a', element: 'fire',
    title: 'Fire People',
    subtitle: 'The Spark That Lights Everything Up',
    price: '$4.99',
    chaptersDir: 'chapters-kindle-a/book-a2-fire',
    outputFile: 'fire-people',
  },
  // 향후 추가:
  // { id: 'a3-earth', series: 'a', element: 'earth', ... },
  // { id: 'a4-metal', series: 'a', element: 'metal', ... },
  // { id: 'a5-water', series: 'a', element: 'water', ... },
];

const BOOK_META = {
  author: 'Ksaju Kim',
  credentials: 'Certified Korean Saju Counselor · 15+ Years',
  website: 'sajumuse.com',
  copyright: '© 2025 Ksaju Kim. All rights reserved.',
  seriesName: 'SajuMuse Element Identity Series',
};

// ─── 디자인 상수 ───
const PURPLE = '7C3AED';
const GOLD = 'F59E0B';
const GRAY = '666666';
const TABLE_BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' };
const TABLE_BORDERS = { top: TABLE_BORDER, bottom: TABLE_BORDER, left: TABLE_BORDER, right: TABLE_BORDER };
const TABLE_ALT_ROW = 'F7F7FB';

// ─── 인자 파싱 ───
const args = process.argv.slice(2);

function getArg(name: string, fallback: string): string {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

function hasFlag(name: string): boolean {
  return args.includes(`--${name}`);
}

const format = getArg('format', 'pdf') as 'pdf' | 'docx' | 'both';

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output', 'kindle-series');

// ─── Frontmatter 파싱 ───
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of fmMatch[1].split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kvMatch) {
      meta[kvMatch[1]] = kvMatch[2];
    }
  }

  return { meta, body: fmMatch[2].trim() };
}

// ─── 마크다운 → DOCX 파라그래프 변환 ───

function parseInlineRuns(text: string, baseSize = 21, baseColor = '333333'): TextRun[] {
  const runs: TextRun[] = [];
  // Handle bold+italic, bold, italic, and plain text
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|([^*]+))/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, font: 'Noto Sans KR', size: baseSize, color: baseColor }));
    } else if (match[3]) {
      runs.push(new TextRun({ text: match[3], bold: true, font: 'Noto Sans KR', size: baseSize, color: baseColor }));
    } else if (match[4]) {
      runs.push(new TextRun({ text: match[4], italics: true, font: 'Noto Sans KR', size: baseSize, color: baseColor }));
    } else if (match[5]) {
      runs.push(new TextRun({ text: match[5], font: 'Noto Sans KR', size: baseSize, color: baseColor }));
    }
  }
  return runs.length ? runs : [new TextRun({ text, font: 'Noto Sans KR', size: baseSize, color: baseColor })];
}

function markdownToDocx(md: string): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(new Paragraph({
        spacing: { before: 200, after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
        children: [],
      }));
      i++;
      continue;
    }

    // H1 - Chapter title (skip - handled separately)
    if (line.startsWith('# ')) {
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      const text = line.replace(/^## /, '');
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text, font: 'Noto Sans KR', size: 28, bold: true, color: PURPLE })],
      }));
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      const text = line.replace(/^### /, '');
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 150 },
        children: [new TextRun({ text, font: 'Noto Sans KR', size: 24, bold: true, color: GOLD })],
      }));
      i++;
      continue;
    }

    // Table
    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1]?.includes('---')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(buildTable(tableLines));
      continue;
    }

    // Bullet list
    if (/^[-*]\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      for (const item of listItems) {
        elements.push(new Paragraph({
          spacing: { before: 60, after: 60 },
          indent: { left: convertInchesToTwip(0.3) },
          bullet: { level: 0 },
          children: parseInlineRuns(item),
        }));
      }
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      for (let j = 0; j < listItems.length; j++) {
        elements.push(new Paragraph({
          spacing: { before: 60, after: 60 },
          indent: { left: convertInchesToTwip(0.3) },
          children: [
            new TextRun({ text: `${j + 1}. `, bold: true, font: 'Noto Sans KR', size: 21, color: PURPLE }),
            ...parseInlineRuns(listItems[j]),
          ],
        }));
      }
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].replace(/^> /, ''));
        i++;
      }
      elements.push(new Paragraph({
        spacing: { before: 200, after: 200 },
        indent: { left: convertInchesToTwip(0.4) },
        border: { left: { style: BorderStyle.SINGLE, size: 4, color: PURPLE } },
        children: parseInlineRuns(quoteLines.join(' '), 20, GRAY),
      }));
      continue;
    }

    // Regular paragraph
    elements.push(new Paragraph({
      spacing: { before: 80, after: 120 },
      children: parseInlineRuns(line),
    }));
    i++;
  }

  return elements;
}

function buildTable(lines: string[]): Table {
  // Parse header and data rows
  const parseRow = (line: string) =>
    line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());

  const headerCells = parseRow(lines[0]);
  const dataRows = lines.slice(2).map(parseRow); // skip separator

  const colCount = headerCells.length;
  const colWidth = Math.floor(9000 / colCount);

  const rows: TableRow[] = [];

  // Header row
  rows.push(new TableRow({
    tableHeader: true,
    children: headerCells.map(cell =>
      new TableCell({
        width: { size: colWidth, type: WidthType.DXA },
        shading: { type: 'solid' as unknown as typeof import('docx').ShadingType.SOLID, color: PURPLE },
        verticalAlign: VerticalAlign.CENTER,
        borders: TABLE_BORDERS,
        children: [new Paragraph({
          spacing: { before: 60, after: 60 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: cell, bold: true, font: 'Noto Sans KR', size: 17, color: 'FFFFFF' })],
        })],
      }),
    ),
  }));

  // Data rows
  for (let r = 0; r < dataRows.length; r++) {
    const row = dataRows[r];
    const bgColor = r % 2 === 1 ? TABLE_ALT_ROW : 'FFFFFF';
    rows.push(new TableRow({
      children: row.map((cell, cIdx) =>
        new TableCell({
          width: { size: colWidth, type: WidthType.DXA },
          shading: { type: 'solid' as unknown as typeof import('docx').ShadingType.SOLID, color: bgColor },
          verticalAlign: VerticalAlign.CENTER,
          borders: TABLE_BORDERS,
          children: [new Paragraph({
            spacing: { before: 50, after: 50 },
            alignment: cIdx === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
            children: parseInlineRuns(cell, 17),
          })],
        }),
      ),
    }));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
}

// ─── 페이지 빌더 ───

function buildCoverPage(book: KindleBook): Paragraph[] {
  return [
    // Spacer
    new Paragraph({ spacing: { before: 2000 }, children: [] }),
    // Series name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: BOOK_META.seriesName, font: 'Noto Sans KR', size: 20, color: GOLD })],
    }),
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: book.title, font: 'Noto Sans KR', size: 48, bold: true, color: PURPLE })],
    }),
    // Subtitle
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: book.subtitle, font: 'Noto Sans KR', size: 24, italics: true, color: GRAY })],
    }),
    // Divider
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: '✦  ✦  ✦', font: 'Noto Sans KR', size: 24, color: GOLD })],
    }),
    // Author
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: BOOK_META.author, font: 'Noto Sans KR', size: 28, bold: true, color: '333333' })],
    }),
    // Credentials
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: BOOK_META.credentials, font: 'Noto Sans KR', size: 18, color: GRAY })],
    }),
    // Website
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: BOOK_META.website, font: 'Noto Sans KR', size: 18, color: PURPLE })],
    }),
    // Page break
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildCopyrightPage(book: KindleBook): Paragraph[] {
  const lines = [
    `${book.title}: ${book.subtitle}`,
    '',
    BOOK_META.copyright,
    '',
    'All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means without prior written permission.',
    '',
    `Part of the ${BOOK_META.seriesName}`,
    '',
    'This book is for educational and entertainment purposes only.',
    'The information provided should not be used as a substitute for professional advice.',
    '',
    `Published by SajuMuse · ${BOOK_META.website}`,
  ];

  const paragraphs: Paragraph[] = [];
  paragraphs.push(new Paragraph({ spacing: { before: 2000 }, children: [] }));
  for (const line of lines) {
    paragraphs.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: line || ' ', font: 'Noto Sans KR', size: 16, color: GRAY })],
    }));
  }
  paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
  return paragraphs;
}

function buildTocPage(chapters: { num: number; title: string }[]): Paragraph[] {
  const paras: Paragraph[] = [];

  paras.push(new Paragraph({
    spacing: { before: 600, after: 400 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Contents', font: 'Noto Sans KR', size: 36, bold: true, color: PURPLE })],
  }));

  for (const ch of chapters) {
    paras.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: `${ch.num}. `, font: 'Noto Sans KR', size: 22, bold: true, color: GOLD }),
        new TextRun({ text: ch.title, font: 'Noto Sans KR', size: 22, color: '333333' }),
      ],
    }));
  }

  paras.push(new Paragraph({ children: [new PageBreak()] }));
  return paras;
}

function buildChapterContent(num: number, title: string, md: string, meta: Record<string, string>): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  // Chapter number
  elements.push(new Paragraph({
    spacing: { before: 600, after: 100 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `Chapter ${num}`, font: 'Noto Sans KR', size: 20, color: GOLD })],
  }));

  // Chapter title
  elements.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: title, font: 'Noto Sans KR', size: 34, bold: true, color: PURPLE })],
  }));

  // Divider
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: '───────', font: 'Noto Sans KR', size: 20, color: GOLD })],
  }));

  // Main content
  elements.push(...markdownToDocx(md));

  // Takeaway box
  if (meta.takeaway) {
    elements.push(new Paragraph({ spacing: { before: 300 }, children: [] }));
    elements.push(new Paragraph({
      spacing: { before: 100, after: 80 },
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: PURPLE } },
      children: [new TextRun({ text: '✦ Key Takeaway', font: 'Noto Sans KR', size: 22, bold: true, color: PURPLE })],
    }));
    elements.push(new Paragraph({
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.2) },
      children: parseInlineRuns(meta.takeaway, 20, GRAY),
    }));
  }

  // Exercise box
  if (meta.exercise) {
    elements.push(new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [new TextRun({ text: '✎ Try This', font: 'Noto Sans KR', size: 22, bold: true, color: GOLD })],
    }));
    elements.push(new Paragraph({
      spacing: { after: 200 },
      indent: { left: convertInchesToTwip(0.2) },
      children: parseInlineRuns(meta.exercise, 20, GRAY),
    }));
  }

  // Page break
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

function buildClosingPage(book: KindleBook): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 2000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Thank You for Reading', font: 'Noto Sans KR', size: 36, bold: true, color: PURPLE })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: '✦  ✦  ✦', font: 'Noto Sans KR', size: 24, color: GOLD })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: parseInlineRuns('Your element is just the beginning. Your full birth chart reveals the complete picture — all five elements, their interactions, and the unique story of your life.', 21, GRAY),
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Get the full picture:', font: 'Noto Sans KR', size: 22, bold: true, color: '333333' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: 'sajumuse.com/ebook', font: 'Noto Sans KR', size: 24, bold: true, color: PURPLE })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Korean Saju Decoded — Master Edition', font: 'Noto Sans KR', size: 20, italics: true, color: GRAY }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: 'The complete guide to the Four Pillars of Destiny', font: 'Noto Sans KR', size: 18, color: GRAY }),
      ],
    }),
    // Free reading CTA
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Want a free mini reading?', font: 'Noto Sans KR', size: 22, bold: true, color: '333333' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'sajumuse.com/free-reading', font: 'Noto Sans KR', size: 22, color: PURPLE })],
    }),
    // About author
    new Paragraph({ spacing: { before: 400 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'About the Author', font: 'Noto Sans KR', size: 24, bold: true, color: PURPLE })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: parseInlineRuns(`${BOOK_META.author} is a certified Korean Saju counselor with over 15 years of experience interpreting Four Pillars birth charts. Through sajumuse.com, she makes Korean astrology accessible to a global audience while maintaining the depth and precision of the traditional practice.`, 19, GRAY),
    }),
  ];
}

// ─── 메인 빌드 ───

async function buildBook(book: KindleBook): Promise<void> {
  const chaptersDir = path.join(ROOT, book.chaptersDir);

  if (!fs.existsSync(chaptersDir)) {
    console.error(`  ❌ 챕터 폴더가 없습니다: ${chaptersDir}`);
    return;
  }

  const files = fs.readdirSync(chaptersDir)
    .filter(f => f.startsWith('chapter-') && f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.error(`  ❌ 챕터 파일이 없습니다: ${chaptersDir}`);
    return;
  }

  console.log(`\n📖 ${book.title}: ${book.subtitle}`);
  console.log(`   ${files.length}개 챕터 발견`);

  // 챕터 로드
  const chapterList: { num: number; title: string; body: string; meta: Record<string, string> }[] = [];

  for (const file of files) {
    const numMatch = file.match(/^chapter-(\d+)/);
    if (!numMatch) continue;

    const num = parseInt(numMatch[1], 10);
    const raw = fs.readFileSync(path.join(chaptersDir, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    const title = meta.title?.replace(/^"|"$/g, '') || `Chapter ${num}`;
    chapterList.push({ num, title, body, meta });
    console.log(`   📄 ${file} → "${title}"`);
  }

  // DOCX 조립
  const allChildren: (Paragraph | Table)[] = [];

  // 커버
  allChildren.push(...buildCoverPage(book));

  // Copyright
  allChildren.push(...buildCopyrightPage(book));

  // 목차
  allChildren.push(...buildTocPage(chapterList.map(ch => ({ num: ch.num, title: ch.title }))));

  // 챕터
  for (const ch of chapterList) {
    allChildren.push(...buildChapterContent(ch.num, ch.title, ch.body, ch.meta));
  }

  // 엔딩
  allChildren.push(...buildClosingPage(book));

  // Document 생성
  const doc = new Document({
    title: `${book.title}: ${book.subtitle}`,
    description: `Part of the ${BOOK_META.seriesName}`,
    creator: BOOK_META.author,
    styles: {
      default: {
        document: {
          run: {
            font: 'Noto Sans KR',
            size: 21,
            color: '333333',
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
    },
    numbering: {
      config: [{
        reference: 'bullet-list',
        levels: [{
          level: 0,
          format: 'bullet' as unknown as import('docx').LevelFormat,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.2) } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: {
            width: convertInchesToTwip(6),
            height: convertInchesToTwip(9),
          },
          margin: {
            top: convertInchesToTwip(0.6),
            bottom: convertInchesToTwip(0.55),
            left: convertInchesToTwip(0.75),
            right: convertInchesToTwip(0.5),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                text: `${book.title} — ${BOOK_META.seriesName}`,
                font: 'Noto Sans KR', size: 14, color: 'CCCCCC',
              })],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({
                children: [PageNumber.CURRENT],
                font: 'Noto Sans KR', size: 16, color: '999999',
              })],
            }),
          ],
        }),
      },
      children: allChildren,
    }],
  });

  // 저장
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (format === 'docx' || format === 'both') {
    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(OUTPUT_DIR, `${book.outputFile}.docx`);
    fs.writeFileSync(outPath, buffer);
    const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`   ✅ ${outPath} (${sizeMB} MB)`);
  }

  if (format === 'pdf' || format === 'both') {
    await generatePdf(book, chapterList);
  }
}

// ─── PDF 생성 ───

async function generatePdf(
  book: KindleBook,
  chapterList: { num: number; title: string; body: string; meta: Record<string, string> }[],
): Promise<void> {
  console.log('   📄 PDF 생성 중...');

  const { Font } = await import('@react-pdf/renderer');
  const fontsDir = path.join(ROOT, 'public', 'fonts');
  const regularPath = path.join(fontsDir, 'NotoSansKR-Regular.ttf');
  const boldPath = path.join(fontsDir, 'NotoSansKR-Bold.ttf');

  if (!fs.existsSync(regularPath) || !fs.existsSync(boldPath)) {
    console.error('   ❌ NotoSansKR 폰트 파일이 없습니다. public/fonts/ 확인');
    return;
  }

  Font.register({
    family: 'NotoSansKR',
    fonts: [
      { src: regularPath, fontWeight: 'normal' },
      { src: boldPath, fontWeight: 'bold' },
    ],
  });
  try { Font.registerHyphenationCallback((word: string) => [word]); } catch {}

  const React = await import('react');
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { KindleDocument } = await import('../src/components/kindle/KindleDocument');
  type KindleChapter = import('../src/components/kindle/KindleDocument').KindleChapter;

  const kindleChapters: KindleChapter[] = chapterList.map(ch => ({
    number: ch.num,
    title: ch.title,
    content: ch.body,
    takeaway: ch.meta.takeaway?.replace(/^"|"$/g, ''),
    exercise: ch.meta.exercise?.replace(/^"|"$/g, ''),
    cta: ch.meta.cta?.replace(/^"|"$/g, ''),
  }));

  const element = React.createElement(KindleDocument, {
    title: book.title,
    subtitle: book.subtitle,
    element: book.element || 'wood',
    seriesName: BOOK_META.seriesName,
    chapters: kindleChapters,
  });

  const buffer = await renderToBuffer(
    element as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>,
  );

  const outPath = path.join(OUTPUT_DIR, `${book.outputFile}.pdf`);
  const uint8 = new Uint8Array(buffer);
  fs.writeFileSync(outPath, uint8);

  const sizeMB = (uint8.byteLength / 1024 / 1024).toFixed(2);
  console.log(`   ✅ ${outPath} (${sizeMB} MB)`);
}

// ─── 상태 표시 ───

function showStatus(): void {
  console.log('\n📊 Kindle Series Status');
  console.log('═══════════════════════════════════');

  for (const book of KINDLE_BOOKS) {
    const chaptersDir = path.join(ROOT, book.chaptersDir);
    const exists = fs.existsSync(chaptersDir);
    const files = exists
      ? fs.readdirSync(chaptersDir).filter(f => f.startsWith('chapter-') && f.endsWith('.md'))
      : [];

    const icon = files.length > 0 ? '✅' : '⬜';
    console.log(`\n  ${icon} ${book.id}: ${book.title}`);
    console.log(`     ${book.subtitle}`);
    console.log(`     Chapters: ${files.length}`);

    if (files.length > 0) {
      for (const f of files.sort()) {
        console.log(`       📄 ${f}`);
      }
    }
  }

  console.log('\n═══════════════════════════════════\n');
}

// ─── 메인 ───

async function main() {
  if (hasFlag('status')) {
    showStatus();
    return;
  }

  const series = getArg('series', 'a');
  const bookId = getArg('book', '');

  if (!bookId) {
    console.error('❌ --book 인자가 필요합니다. 예: --book wood, --book fire, --book all');
    process.exit(1);
  }

  const booksTooBuild = bookId === 'all'
    ? KINDLE_BOOKS.filter(b => b.series === series)
    : KINDLE_BOOKS.filter(b => b.series === series && b.element === bookId);

  if (booksTooBuild.length === 0) {
    console.error(`❌ 해당하는 책을 찾을 수 없습니다: series=${series}, book=${bookId}`);
    console.error('   사용 가능: ' + KINDLE_BOOKS.map(b => `${b.series}/${b.element}`).join(', '));
    process.exit(1);
  }

  console.log(`\n🔮 Kindle Series 빌드 시작\n`);

  for (const book of booksTooBuild) {
    await buildBook(book);
  }

  console.log('\n🎉 완료!\n');
}

main().catch((err) => {
  console.error('\n❌ 빌드 실패:', err.message);
  console.error(err.stack);
  process.exit(1);
});
