import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  BorderStyle,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  convertInchesToTwip,
  TableBorders,
  TableLayoutType,
  Footer,
  PageNumber,
  NumberFormat,
  Header,
  Tab,
  TabStopType,
  TabStopPosition,
  ImageRun,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import type { EbookEdition } from '@/lib/types/ebook';
import {
  EDITION_INFO,
  EBOOK_PARTS,
  EBOOK_CHAPTERS,
  getPartForChapter,
  BOOK_META,
} from '@/lib/types/ebook';
import { GLOSSARY, GLOSSARY_CATEGORY_LABELS, type GlossaryEntry } from '@/lib/constants/glossary';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_CYCLES } from '@/lib/constants/appendixTables';

// ─── 디자인 상수 ───
const PURPLE = '7C3AED';
const GOLD = 'F59E0B';
const DARK = '1A1A2E';
const GRAY = '666666';
const LIGHT_GRAY = 'AAAAAA';
const GREEN = '22C55E';
const BLUE = '3B82F6';
const BG_PURPLE = 'FAF5FF';
const BG_GREEN = 'F0FDF4';
const BG_BLUE = 'EFF6FF';
const BG_YELLOW = 'FFFBEB';

// ─── 테이블 공통 스타일 ───
const TABLE_FONT_SIZE = 17;          // 8.5pt — 본문(10.5pt)보다 작지만 가독성 유지
const TABLE_HEADER_FONT_SIZE = 17;
const TABLE_CELL_PADDING = { before: 50, after: 50 };   // 셀 내 상하 여백
const TABLE_HEADER_PADDING = { before: 60, after: 60 };
const TABLE_LINE_SPACING = 276;      // 1.15배 줄간격 (기본 240 = 1배, 360 = 1.5배)
const TABLE_BORDER_COLOR = 'E0E0E0';
const TABLE_BORDER = { style: BorderStyle.SINGLE, size: 1, color: TABLE_BORDER_COLOR };
const TABLE_BORDERS = { top: TABLE_BORDER, bottom: TABLE_BORDER, left: TABLE_BORDER, right: TABLE_BORDER };
const TABLE_ALT_ROW_COLOR = 'F7F7FB'; // 짝수행 배경

/** 챕터 콘텐츠 */
export interface DocxChapterContent {
  content: string;
  takeaways?: string[];
  exercise?: string;
  cta?: string;
}

// ─── 마크다운 파서 ───

/** 사주 차트 기둥 데이터 */
interface ChartPillarData {
  position: string;
  stem: string;
  stemElement: string;
  stemGod: string;
  branch: string;
  branchAnimal: string;
  branchGod: string;
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'saju-chart'; label: string; pillars: ChartPillarData[] }
  | { type: 'image'; alt: string; src: string }
  | { type: 'case-study'; label: string; content: string };

function parseMarkdown(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let buf: string[] = [];

  const flush = () => {
    if (buf.length > 0) {
      blocks.push({ type: 'paragraph', text: buf.join(' ') });
      buf = [];
    }
  };

  const parseTableRow = (line: string): string[] =>
    line.split('|').slice(1, -1).map(c => c.trim());

  const isSeparatorRow = (line: string): boolean =>
    /^\|[\s\-:|]+\|$/.test(line.trim());

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '') { flush(); continue; }
    if (t.startsWith('### ')) { flush(); blocks.push({ type: 'h3', text: t.slice(4) }); continue; }
    if (t.startsWith('## ')) { flush(); blocks.push({ type: 'h2', text: t.slice(3) }); continue; }
    if (t.startsWith('> ')) { flush(); blocks.push({ type: 'quote', text: t.slice(2) }); continue; }
    if (t.startsWith('- ') || t.startsWith('• ')) { flush(); blocks.push({ type: 'bullet', text: t.slice(2) }); continue; }

    // 이미지: ![alt](path)
    const imgMatch = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flush();
      blocks.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] });
      continue;
    }

    // :::saju-chart 커스텀 블록
    if (t === ':::saju-chart' || t.startsWith(':::saju-chart ')) {
      flush();
      const chartLabel = t.slice(':::saju-chart'.length).trim();
      const chartLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        chartLines.push(lines[i]);
        i++;
      }
      // JSON 파싱: pillars 배열
      const jsonText = chartLines.join('\n').trim();
      try {
        const pillars = JSON.parse(jsonText) as ChartPillarData[];
        blocks.push({ type: 'saju-chart', label: chartLabel, pillars });
      } catch {
        // 파싱 실패 시 그냥 텍스트로
        blocks.push({ type: 'paragraph', text: `[Chart: ${chartLabel}]` });
      }
      continue;
    }

    // :::case-study 커스텀 블록
    if (t === ':::case-study' || t.startsWith(':::case-study ')) {
      flush();
      const csLabel = t.slice(':::case-study'.length).trim();
      const csLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        csLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'case-study', label: csLabel, content: csLines.join('\n') });
      continue;
    }

    // 마크다운 테이블 감지: | col | col | 패턴
    if (t.startsWith('|') && t.endsWith('|') && t.includes('|')) {
      flush();
      const headers = parseTableRow(t);
      // 다음 줄이 구분선이면 테이블로 처리
      if (i + 1 < lines.length && isSeparatorRow(lines[i + 1])) {
        i++; // 구분선 스킵
        const rows: string[][] = [];
        while (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.startsWith('|') && nextLine.endsWith('|')) {
            rows.push(parseTableRow(nextLine));
            i++;
          } else {
            break;
          }
        }
        blocks.push({ type: 'table', headers, rows });
      } else {
        // 구분선 없으면 그냥 텍스트로
        buf.push(t);
      }
      continue;
    }

    buf.push(t);
  }
  flush();
  return blocks;
}

/** 인라인 파싱 결과를 plain 옵션 객체로 반환 (스타일 오버라이드에 사용) */
interface InlineRunOpts {
  text: string;
  font: string;
  size: number;
  bold?: boolean;
  italics?: boolean;
}

function parseInlineOpts(text: string): InlineRunOpts[] {
  const runs: InlineRunOpts[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, match.index), font: 'Noto Sans KR', size: 21 });
    }
    if (match[1]) {
      runs.push({ text: match[1], bold: true, font: 'Noto Sans KR', size: 21 });
    } else if (match[2]) {
      runs.push({ text: match[2], italics: true, font: 'Noto Sans KR', size: 21 });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex), font: 'Noto Sans KR', size: 21 });
  }
  if (runs.length === 0) {
    runs.push({ text, font: 'Noto Sans KR', size: 21 });
  }
  return runs;
}

/** **bold** 와 *italic* 파싱 → TextRun[] */
function parseInline(text: string): TextRun[] {
  return parseInlineOpts(text).map(opts => new TextRun(opts));
}

/** 테이블 셀용 인라인 파싱 (TABLE_FONT_SIZE 적용) */
function parseInlineForTable(text: string): TextRun[] {
  return parseInlineOpts(text).map(opts => new TextRun({ ...opts, size: TABLE_FONT_SIZE }));
}

// ─── 페이지/섹션 빌더 ───

function buildCoverPage(edition: EbookEdition): Paragraph[] {
  const info = EDITION_INFO[edition];
  return [
    new Paragraph({ spacing: { before: 3000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '四柱', font: 'Noto Sans KR', size: 56, color: PURPLE })],
    }),
    new Paragraph({ spacing: { before: 400 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: info.title, font: 'Noto Sans KR', size: 40, bold: true, color: DARK })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '━━━━━━━━━━━━', color: GOLD, size: 20 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: info.subtitle, font: 'Noto Sans KR', size: 22, color: GRAY })],
    }),
    new Paragraph({ spacing: { before: 2000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Written by', font: 'Noto Sans KR', size: 16, color: LIGHT_GRAY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Ksaju Kim', font: 'Noto Sans KR', size: 28, bold: true, color: DARK })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Certified Korean Saju Counselor · 15+ Years', font: 'Noto Sans KR', size: 16, color: LIGHT_GRAY })],
    }),
    new Paragraph({ spacing: { before: 400 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'SajuMuse', font: 'Noto Sans KR', size: 18, color: PURPLE })],
    }),
    // 페이지 나누기
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildTocPage(edition: EbookEdition): Paragraph[] {
  const included = EDITION_INFO[edition].chapters;
  const paras: Paragraph[] = [];

  paras.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 300 },
    children: [new TextRun({ text: 'Contents', font: 'Noto Sans KR', size: 36, bold: true, color: DARK })],
  }));
  paras.push(new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
    children: [],
  }));

  // Preface
  paras.push(new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'How to Use This Book', font: 'Noto Sans KR', size: 18, color: '444444' })],
  }));

  for (const part of EBOOK_PARTS) {
    const partChapters = EBOOK_CHAPTERS.filter(
      ch => part.chapters.includes(ch.number) && included.includes(ch.number),
    );
    if (partChapters.length === 0) continue;

    paras.push(new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({ text: `Part ${part.number}  `, font: 'Noto Sans KR', size: 16, color: PURPLE }),
        new TextRun({ text: part.title, font: 'Noto Sans KR', size: 22, bold: true, color: DARK }),
      ],
    }));

    for (const ch of partChapters) {
      paras.push(new Paragraph({
        spacing: { after: 40 },
        indent: { left: convertInchesToTwip(0.3) },
        children: [
          new TextRun({ text: `${ch.number}. `, font: 'Noto Sans KR', size: 18, color: LIGHT_GRAY }),
          new TextRun({ text: ch.title, font: 'Noto Sans KR', size: 18, color: '444444' }),
        ],
      }));
    }
  }

  // KDP: 잠긴 파트
  if (edition === 'kdp') {
    paras.push(new Paragraph({ spacing: { before: 300 }, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' } }, children: [] }));
    paras.push(new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: 'AVAILABLE IN THE FULL EDITION', font: 'Noto Sans KR', size: 14, color: LIGHT_GRAY })],
    }));
    for (const part of EBOOK_PARTS.filter(p => !included.includes(p.chapters[0]))) {
      paras.push(new Paragraph({
        spacing: { after: 40 },
        indent: { left: convertInchesToTwip(0.2) },
        children: [
          new TextRun({ text: '→ ', font: 'Noto Sans KR', size: 18, color: PURPLE }),
          new TextRun({ text: `Part ${part.number}: ${part.title}`, font: 'Noto Sans KR', size: 18, color: LIGHT_GRAY }),
        ],
      }));
    }
    paras.push(new Paragraph({
      spacing: { before: 160 },
      indent: { left: convertInchesToTwip(0.2) },
      children: [new TextRun({ text: '→ sajumuse.com/ebook', font: 'Noto Sans KR', size: 18, color: PURPLE, bold: true })],
    }));
  }

  // Back Matter
  paras.push(new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text: 'Back Matter', font: 'Noto Sans KR', size: 22, bold: true, color: DARK })],
  }));
  paras.push(new Paragraph({
    spacing: { after: 40 },
    indent: { left: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: 'About the Author', font: 'Noto Sans KR', size: 18, color: '444444' })],
  }));
  for (const item of ['A. Quick Reference Tables', 'B. Glossary', 'C. Recommended Resources']) {
    paras.push(new Paragraph({
      spacing: { after: 40 },
      indent: { left: convertInchesToTwip(0.3) },
      children: [new TextRun({ text: item, font: 'Noto Sans KR', size: 18, color: '444444' })],
    }));
  }

  paras.push(new Paragraph({ children: [new PageBreak()] }));
  return paras;
}

function buildPartHeader(partNum: number, title: string, subtitle: string): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 3000 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: 'PART  ', font: 'Noto Sans KR', size: 20, color: LIGHT_GRAY }),
        new TextRun({ text: String(partNum).padStart(2, '0'), font: 'Noto Sans KR', size: 56, bold: true, color: PURPLE }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
      children: [],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: title, font: 'Noto Sans KR', size: 36, bold: true, color: DARK })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: subtitle, font: 'Noto Sans KR', size: 20, color: GRAY })],
    }),
    new Paragraph({ spacing: { before: 1000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: '道', font: 'Noto Sans KR', size: 72, color: 'E8E0F0' })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildChapter(chNum: number, title: string, partTitle: string | undefined, data: DocxChapterContent): (Paragraph | Table)[] {
  const paras: (Paragraph | Table)[] = [];

  // 챕터 라벨
  paras.push(new Paragraph({
    spacing: { before: 400, after: 80 },
    children: [new TextRun({ text: `CHAPTER ${chNum}`, font: 'Noto Sans KR', size: 16, color: PURPLE })],
  }));

  // 챕터 제목
  paras.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 100 },
    children: [new TextRun({ text: title, font: 'Noto Sans KR', size: 36, bold: true, color: DARK })],
  }));

  // 구분선
  paras.push(new Paragraph({
    spacing: { after: 300 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
    children: [],
  }));

  // 본문 파싱
  const blocks = parseMarkdown(data.content || '');
  for (const block of blocks) {
    switch (block.type) {
      case 'h2':
        paras.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 360, after: 120 },
          keepNext: true,
          keepLines: true,
          children: [new TextRun({ text: block.text.replace(/\*\*/g, ''), font: 'Noto Sans KR', size: 28, bold: true, color: '2D2D4E' })],
        }));
        break;
      case 'h3':
        paras.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 80 },
          keepNext: true,
          keepLines: true,
          children: [new TextRun({ text: block.text.replace(/\*\*/g, ''), font: 'Noto Sans KR', size: 24, bold: true, color: '3D3D5C' })],
        }));
        break;
      case 'quote':
        paras.push(new Paragraph({
          spacing: { before: 120, after: 120 },
          indent: { left: convertInchesToTwip(0.3) },
          border: { left: { style: BorderStyle.SINGLE, size: 8, color: PURPLE } },
          shading: { type: ShadingType.SOLID, color: BG_PURPLE },
          children: parseInlineOpts(block.text).map(opts =>
            new TextRun({ ...opts, font: 'Noto Sans KR', size: 20, color: '4A4A6A', italics: true }),
          ),
        }));
        break;
      case 'bullet':
        paras.push(new Paragraph({
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) },
          children: [
            new TextRun({ text: '•  ', font: 'Noto Sans KR', size: 21, color: PURPLE }),
            ...parseInline(block.text),
          ],
        }));
        break;
      case 'table':
        paras.push(new Paragraph({ spacing: { before: 120 }, children: [] }));
        paras.push(buildMarkdownTable(block.headers, block.rows));
        paras.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
        break;
      case 'saju-chart':
        paras.push(...buildSajuChartTable(block.label, block.pillars));
        break;
      case 'image':
        paras.push(...buildImageBlock(block.alt, block.src));
        break;
      case 'case-study':
        paras.push(...buildCaseStudyBlock(block.label, block.content));
        break;
      case 'paragraph':
        paras.push(new Paragraph({
          spacing: { after: 160 },
          children: parseInline(block.text),
        }));
        break;
    }
  }

  // Key Takeaways
  if (data.takeaways && data.takeaways.length > 0) {
    paras.push(new Paragraph({ spacing: { before: 300 }, children: [] }));
    paras.push(new Paragraph({
      spacing: { after: 100 },
      shading: { type: ShadingType.SOLID, color: BG_GREEN },
      border: { left: { style: BorderStyle.SINGLE, size: 8, color: GREEN } },
      indent: { left: convertInchesToTwip(0.15) },
      children: [new TextRun({ text: '  Key Takeaways', font: 'Noto Sans KR', size: 22, bold: true, color: '16A34A' })],
    }));
    for (const t of data.takeaways) {
      paras.push(new Paragraph({
        spacing: { after: 60 },
        shading: { type: ShadingType.SOLID, color: BG_GREEN },
        border: { left: { style: BorderStyle.SINGLE, size: 8, color: GREEN } },
        indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) },
        children: [
          new TextRun({ text: '✓  ', font: 'Noto Sans KR', size: 20, color: GREEN }),
          new TextRun({ text: t, font: 'Noto Sans KR', size: 20, color: '444444' }),
        ],
      }));
    }
  }

  // Try It Yourself
  if (data.exercise) {
    paras.push(new Paragraph({ spacing: { before: 300 }, children: [] }));
    paras.push(new Paragraph({
      spacing: { after: 100 },
      shading: { type: ShadingType.SOLID, color: BG_BLUE },
      border: { top: { style: BorderStyle.SINGLE, size: 3, color: BLUE }, bottom: { style: BorderStyle.SINGLE, size: 3, color: BLUE } },
      indent: { left: convertInchesToTwip(0.15) },
      children: [new TextRun({ text: '  Try It Yourself', font: 'Noto Sans KR', size: 22, bold: true, color: '2563EB' })],
    }));
    paras.push(new Paragraph({
      spacing: { after: 120 },
      shading: { type: ShadingType.SOLID, color: BG_BLUE },
      indent: { left: convertInchesToTwip(0.15) },
      children: [new TextRun({ text: data.exercise, font: 'Noto Sans KR', size: 20, color: '444444' })],
    }));
  }

  // CTA
  if (data.cta) {
    paras.push(new Paragraph({ spacing: { before: 400 }, children: [] }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      border: {
        top: { style: BorderStyle.SINGLE, size: 3, color: PURPLE },
        bottom: { style: BorderStyle.SINGLE, size: 3, color: PURPLE },
      },
      children: [new TextRun({ text: data.cta, font: 'Noto Sans KR', size: 20, color: PURPLE })],
    }));
  }

  // 챕터 끝 페이지 나누기
  paras.push(new Paragraph({ children: [new PageBreak()] }));

  return paras;
}

// ─── B1: 사주 차트 → DOCX 테이블 ───

function buildSajuChartTable(label: string, pillars: ChartPillarData[]): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [];
  const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  };
  const thinBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
  };

  // 라벨
  if (label) {
    items.push(new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [new TextRun({ text: label, font: 'Noto Sans KR', size: 18, bold: true, color: PURPLE })],
    }));
  }

  // 헤더 행: 기둥 위치 (Hour, Day, Month, Year)
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: pillars.map(p => new TableCell({
      shading: { type: ShadingType.SOLID, color: PURPLE },
      borders: thinBorders,
      width: { size: 25, type: WidthType.PERCENTAGE },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: p.position, font: 'Noto Sans KR', size: 16, bold: true, color: 'FFFFFF' })],
      })],
    })),
  });

  // 천간 행: 한자 + 오행 + 십신
  const stemRow = new TableRow({
    cantSplit: true,
    children: pillars.map(p => new TableCell({
      shading: { type: ShadingType.SOLID, color: 'FFFFFF' },
      borders: thinBorders,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 20 },
          children: [new TextRun({ text: p.stem, font: 'Noto Sans KR', size: 28, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 10 },
          children: [new TextRun({ text: p.stemElement, font: 'Noto Sans KR', size: 15, color: GRAY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: `(${p.stemGod})`, font: 'Noto Sans KR', size: 14, color: LIGHT_GRAY })],
        }),
      ],
    })),
  });

  // 지지 행: 한자 + 동물 + 십신
  const branchRow = new TableRow({
    cantSplit: true,
    children: pillars.map(p => new TableCell({
      shading: { type: ShadingType.SOLID, color: 'F8F6FF' },
      borders: thinBorders,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 20 },
          children: [new TextRun({ text: p.branch, font: 'Noto Sans KR', size: 28, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 10 },
          children: [new TextRun({ text: p.branchAnimal, font: 'Noto Sans KR', size: 15, color: GRAY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: `(${p.branchGod})`, font: 'Noto Sans KR', size: 14, color: LIGHT_GRAY })],
        }),
      ],
    })),
  });

  items.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, stemRow, branchRow],
  }));

  items.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  return items;
}

// ─── B2: 이미지 삽입 ───

function buildImageBlock(alt: string, src: string): Paragraph[] {
  // public/ 또는 상대 경로에서 이미지 파일 로드
  const possiblePaths = [
    path.resolve(process.cwd(), src),
    path.resolve(process.cwd(), 'public', src),
    path.resolve(process.cwd(), 'public', path.basename(src)),
  ];

  let imgBuffer: Buffer | null = null;
  for (const p of possiblePaths) {
    try {
      imgBuffer = fs.readFileSync(p);
      break;
    } catch {
      // try next
    }
  }

  if (!imgBuffer) {
    // 이미지를 찾을 수 없으면 대체 텍스트 표시
    return [new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: 'F5F5F5' },
      children: [new TextRun({ text: `[Image: ${alt || src}]`, font: 'Noto Sans KR', size: 18, italics: true, color: LIGHT_GRAY })],
    })];
  }

  // KDP 6"×9" 본문 영역 = 약 4.75" (6 - 0.75 - 0.5)
  const maxWidthPx = 456; // ~4.75" at 96dpi
  const maxHeightPx = 600;

  return [
    new Paragraph({
      spacing: { before: 160, after: 80 },
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imgBuffer,
          transformation: { width: maxWidthPx, height: maxHeightPx },
          type: 'png',
        }),
      ],
    }),
    // 캡션
    ...(alt ? [new Paragraph({
      spacing: { after: 160 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: alt, font: 'Noto Sans KR', size: 16, italics: true, color: GRAY })],
    })] : []),
  ];
}

// ─── B4: 케이스 스터디 블록 ───

function buildCaseStudyBlock(label: string, content: string): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [];

  // 케이스 스터디 헤더 (배경색 + 아이콘)
  items.push(new Paragraph({
    spacing: { before: 240, after: 100 },
    shading: { type: ShadingType.SOLID, color: BG_YELLOW },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: GOLD },
      left: { style: BorderStyle.SINGLE, size: 8, color: GOLD },
    },
    indent: { left: convertInchesToTwip(0.15) },
    children: [
      new TextRun({ text: '  ', font: 'Noto Sans KR', size: 22 }),
      new TextRun({ text: label || 'Case Study', font: 'Noto Sans KR', size: 22, bold: true, color: 'B45309' }),
    ],
  }));

  // 케이스 스터디 본문 — 재귀적으로 파싱
  const innerBlocks = parseMarkdown(content);
  for (const block of innerBlocks) {
    switch (block.type) {
      case 'h2':
      case 'h3':
        items.push(new Paragraph({
          spacing: { before: 160, after: 80 },
          shading: { type: ShadingType.SOLID, color: BG_YELLOW },
          border: { left: { style: BorderStyle.SINGLE, size: 8, color: GOLD } },
          indent: { left: convertInchesToTwip(0.15) },
          children: [new TextRun({ text: block.text.replace(/\*\*/g, ''), font: 'Noto Sans KR', size: block.type === 'h2' ? 24 : 21, bold: true, color: '4A3500' })],
        }));
        break;
      case 'bullet':
        items.push(new Paragraph({
          spacing: { after: 60 },
          shading: { type: ShadingType.SOLID, color: BG_YELLOW },
          border: { left: { style: BorderStyle.SINGLE, size: 8, color: GOLD } },
          indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) },
          children: [
            new TextRun({ text: '•  ', font: 'Noto Sans KR', size: 20, color: GOLD }),
            ...parseInline(block.text),
          ],
        }));
        break;
      case 'table':
        items.push(buildMarkdownTable(block.headers, block.rows));
        break;
      case 'saju-chart':
        items.push(...buildSajuChartTable(block.label, block.pillars));
        break;
      default:
        items.push(new Paragraph({
          spacing: { after: 120 },
          shading: { type: ShadingType.SOLID, color: BG_YELLOW },
          border: { left: { style: BorderStyle.SINGLE, size: 8, color: GOLD } },
          indent: { left: convertInchesToTwip(0.15) },
          children: parseInline('text' in block ? block.text : ''),
        }));
        break;
    }
  }

  // 하단 구분선
  items.push(new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
    children: [],
  }));

  return items;
}

// ─── B3: Preface 페이지 ───

function buildPrefacePage(): Paragraph[] {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: 'How to Use This Book', font: 'Noto Sans KR', size: 36, bold: true, color: DARK })],
    }),
    new Paragraph({
      spacing: { after: 300 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
      children: [],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'This book is designed to take you from complete beginner to confident Saju chart reader. Whether you picked it up out of curiosity or you are ready to dive deep into Korean metaphysics, here is how to get the most out of it.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    // 순서대로 읽기
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [new TextRun({ text: 'Read in Order (the First Time)', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'Each chapter builds on the previous one. The Five Elements must be understood before the Ten Gods, and the Ten Gods before chart reading. Resist the temptation to skip ahead — the foundation matters.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    // 차트 활용
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [new TextRun({ text: 'Use Your Own Chart', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'Before you begin, visit sajumuse.com/free-reading and generate your free Four Pillars chart. Keep it beside you as you read. Every concept becomes clearer when you can see it in your own chart.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    // 용어 시스템
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [new TextRun({ text: 'The Three-Layer Terminology System', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'Korean Saju uses specialized terms that have no perfect English equivalents. To help you learn naturally, we use a three-layer system: English meaning first, then the Korean romanization in italics, followed by the original Korean and Chinese characters in parentheses. After the first introduction, we use only the English term.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    new Paragraph({
      spacing: { after: 100 },
      indent: { left: convertInchesToTwip(0.3) },
      border: { left: { style: BorderStyle.SINGLE, size: 8, color: PURPLE } },
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      children: [new TextRun({
        text: 'Example: The Eating God — known as Siksin (식신 食神) — represents creative output.',
        font: 'Noto Sans KR', size: 20, italics: true, color: '4A4A6A',
      })],
    }),
    // 특별 섹션
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [new TextRun({ text: 'Special Sections', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) },
      children: [
        new TextRun({ text: '•  ', font: 'Noto Sans KR', size: 21, color: GREEN }),
        new TextRun({ text: 'Key Takeaways', font: 'Noto Sans KR', size: 21, bold: true, color: '16A34A' }),
        new TextRun({ text: ' — a summary of the most important points at the end of each chapter.', font: 'Noto Sans KR', size: 21, color: '444444' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) },
      children: [
        new TextRun({ text: '•  ', font: 'Noto Sans KR', size: 21, color: BLUE }),
        new TextRun({ text: 'Try It Yourself', font: 'Noto Sans KR', size: 21, bold: true, color: '2563EB' }),
        new TextRun({ text: ' — hands-on exercises to apply what you have learned to your own chart.', font: 'Noto Sans KR', size: 21, color: '444444' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) },
      children: [
        new TextRun({ text: '•  ', font: 'Noto Sans KR', size: 21, color: GOLD }),
        new TextRun({ text: 'Case Studies', font: 'Noto Sans KR', size: 21, bold: true, color: 'B45309' }),
        new TextRun({ text: ' — real chart examples showing concepts in practice.', font: 'Noto Sans KR', size: 21, color: '444444' }),
      ],
    }),
    new Paragraph({ spacing: { before: 200 }, children: [] }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'A complete Glossary and Quick Reference Tables are included at the back of the book for easy lookup as you progress.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'Let us begin your journey into the Four Pillars of Destiny.',
        font: 'Noto Sans KR', size: 21, italics: true, color: PURPLE,
      })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── 마크다운 테이블 → Table 위젯 변환 ───

function buildMarkdownTable(headers: string[], rows: string[][]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.SOLID, color: DARK },
      borders: TABLE_BORDERS,
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { ...TABLE_HEADER_PADDING, line: TABLE_LINE_SPACING },
        children: [new TextRun({ text: h, font: 'Noto Sans KR', size: TABLE_HEADER_FONT_SIZE, bold: true, color: 'FFFFFF' })],
      })],
    })),
  });

  const dataRows = rows.map((row, idx) => new TableRow({
    cantSplit: true,
    children: row.map(cell => new TableCell({
      shading: { type: ShadingType.SOLID, color: idx % 2 === 0 ? TABLE_ALT_ROW_COLOR : 'FFFFFF' },
      borders: TABLE_BORDERS,
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { ...TABLE_CELL_PADDING, line: TABLE_LINE_SPACING },
        children: parseInlineForTable(cell),
      })],
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    rows: [headerRow, ...dataRows],
  });
}

// ─── Copyright 페이지 ───

function buildCopyrightPage(edition: EbookEdition): Paragraph[] {
  const info = EDITION_INFO[edition];
  return [
    new Paragraph({ spacing: { before: 6000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: info.title, font: 'Noto Sans KR', size: 18, bold: true, color: GRAY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: info.subtitle, font: 'Noto Sans KR', size: 16, color: LIGHT_GRAY })],
    }),
    new Paragraph({ spacing: { before: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: BOOK_META.copyright, font: 'Noto Sans KR', size: 18, color: GRAY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'All rights reserved. No part of this publication may be reproduced, stored in a retrieval system, or transmitted in any form without the prior written permission of the author.', font: 'Noto Sans KR', size: 16, color: LIGHT_GRAY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: BOOK_META.disclaimer, font: 'Noto Sans KR', size: 16, italics: true, color: LIGHT_GRAY })],
    }),
    new Paragraph({ spacing: { before: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: BOOK_META.publishedBy, font: 'Noto Sans KR', size: 16, color: LIGHT_GRAY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: BOOK_META.website, font: 'Noto Sans KR', size: 16, color: PURPLE })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── About the Author 페이지 ───

function buildAboutAuthorPage(): Paragraph[] {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [new TextRun({ text: 'About the Author', font: 'Noto Sans KR', size: 32, bold: true, color: DARK })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE } },
      children: [],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: `${BOOK_META.author} is a certified Korean Saju counselor with over 15 years of experience in the art and science of Four Pillars of Destiny (사주명리학). Having studied under traditional Korean masters and modern practitioners alike, he bridges the gap between ancient Eastern wisdom and contemporary Western understanding.`,
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'With over 138 verified readings and a passion for making Saju accessible to a global audience, he founded SajuMuse — a platform dedicated to bringing personalized Four Pillars readings to people around the world.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'His mission is simple: to help you understand the cosmic blueprint encoded in your birth moment, so you can make better decisions, build stronger relationships, and live a more aligned life.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }),
    new Paragraph({ spacing: { before: 200 }, children: [] }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'Credentials: ', font: 'Noto Sans KR', size: 20, bold: true, color: PURPLE }),
        new TextRun({ text: BOOK_META.credentials, font: 'Noto Sans KR', size: 20, color: '444444' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'Website: ', font: 'Noto Sans KR', size: 20, bold: true, color: PURPLE }),
        new TextRun({ text: BOOK_META.website, font: 'Noto Sans KR', size: 20, color: PURPLE }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── Glossary 페이지 ───

function buildGlossaryPages(): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [];

  items.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: 'Glossary', font: 'Noto Sans KR', size: 36, bold: true, color: DARK })],
  }));
  items.push(new Paragraph({
    spacing: { after: 300 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
    children: [],
  }));

  const categories = [...new Set(GLOSSARY.map(g => g.category))] as GlossaryEntry['category'][];

  for (const cat of categories) {
    const entries = GLOSSARY.filter(g => g.category === cat);
    const label = GLOSSARY_CATEGORY_LABELS[cat];

    items.push(new Paragraph({
      spacing: { before: 240, after: 120 },
      keepNext: true,
      children: [new TextRun({ text: label, font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
    }));

    const headerRow = new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: ['English', 'Romanization', 'Korean + Hanja'].map(h => new TableCell({
        shading: { type: ShadingType.SOLID, color: DARK },
        borders: TABLE_BORDERS,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { ...TABLE_HEADER_PADDING, line: TABLE_LINE_SPACING },
          children: [new TextRun({ text: h, font: 'Noto Sans KR', size: TABLE_HEADER_FONT_SIZE, bold: true, color: 'FFFFFF' })],
        })],
      })),
    });

    const dataRows = entries.map((entry, idx) => new TableRow({
      cantSplit: true,
      children: [entry.english, entry.romanization, entry.korean].map(cell => new TableCell({
        shading: { type: ShadingType.SOLID, color: idx % 2 === 0 ? TABLE_ALT_ROW_COLOR : 'FFFFFF' },
        borders: TABLE_BORDERS,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { ...TABLE_CELL_PADDING, line: TABLE_LINE_SPACING },
          children: [new TextRun({ text: cell, font: 'Noto Sans KR', size: TABLE_FONT_SIZE, color: '444444' })],
        })],
      })),
    }));

    items.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.AUTOFIT,
      rows: [headerRow, ...dataRows],
    }));
    items.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  }

  items.push(new Paragraph({ children: [new PageBreak()] }));
  return items;
}

// ─── Appendix 페이지 ───

function buildAppendixPages(): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = [];

  /** Appendix용 테이블 헤더 행 생성 */
  const makeHeaderRow = (headers: string[]) => new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.SOLID, color: DARK },
      borders: TABLE_BORDERS,
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { ...TABLE_HEADER_PADDING, line: TABLE_LINE_SPACING }, children: [new TextRun({ text: h, font: 'Noto Sans KR', size: TABLE_HEADER_FONT_SIZE, bold: true, color: 'FFFFFF' })] })],
    })),
  });

  /** Appendix용 데이터 행 생성 */
  const makeDataRow = (cells: string[], idx: number, altColor = TABLE_ALT_ROW_COLOR) => new TableRow({
    cantSplit: true,
    children: cells.map(cell => new TableCell({
      shading: { type: ShadingType.SOLID, color: idx % 2 === 0 ? altColor : 'FFFFFF' },
      borders: TABLE_BORDERS,
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { ...TABLE_CELL_PADDING, line: TABLE_LINE_SPACING }, children: [new TextRun({ text: cell, font: 'Noto Sans KR', size: TABLE_FONT_SIZE, color: '444444' })] })],
    })),
  });

  /** Appendix용 테이블 생성 */
  const makeTable = (headerRow: TableRow, dataRows: TableRow[]) => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.AUTOFIT,
    rows: [headerRow, ...dataRows],
  });

  items.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: 'Appendix A: Quick Reference Tables', font: 'Noto Sans KR', size: 36, bold: true, color: DARK })],
  }));
  items.push(new Paragraph({
    spacing: { after: 300 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
    children: [],
  }));

  // ── 천간 (Heavenly Stems) ──
  items.push(new Paragraph({
    spacing: { before: 240, after: 120 },
    keepNext: true,
    children: [new TextRun({ text: 'The Ten Heavenly Stems (天干)', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
  }));
  items.push(makeTable(
    makeHeaderRow(['Hanja', 'Romanization', 'Element', 'Polarity']),
    HEAVENLY_STEMS.map((s, idx) => makeDataRow([s.hanja, s.romanization, s.element, s.polarity], idx)),
  ));
  items.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 지지 (Earthly Branches) ──
  items.push(new Paragraph({
    spacing: { before: 360, after: 120 },
    keepNext: true,
    children: [new TextRun({ text: 'The Twelve Earthly Branches (地支)', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
  }));
  items.push(makeTable(
    makeHeaderRow(['Hanja', 'Romanization', 'Element', 'Animal', 'Polarity']),
    EARTHLY_BRANCHES.map((b, idx) => makeDataRow([b.hanja, b.romanization, b.element, b.animal, b.polarity], idx)),
  ));
  items.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ── 오행 상호작용 (Element Interactions) ──
  items.push(new Paragraph({
    spacing: { before: 360, after: 120 },
    keepNext: true,
    children: [new TextRun({ text: 'Five Element Interactions (五行 相生相剋)', font: 'Noto Sans KR', size: 24, bold: true, color: '2D2D4E' })],
  }));

  // Productive cycle
  items.push(new Paragraph({
    spacing: { before: 160, after: 80 },
    keepNext: true,
    children: [new TextRun({ text: 'Productive Cycle (相生)', font: 'Noto Sans KR', size: 20, bold: true, color: PURPLE })],
  }));
  items.push(makeTable(
    makeHeaderRow(['From', 'To', 'Description']),
    ELEMENT_CYCLES.productive.map((c, idx) => makeDataRow([c.from, c.to, c.description], idx, 'F0FDF4')),
  ));
  items.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // Controlling cycle
  items.push(new Paragraph({
    spacing: { before: 200, after: 80 },
    keepNext: true,
    children: [new TextRun({ text: 'Controlling Cycle (相剋)', font: 'Noto Sans KR', size: 20, bold: true, color: PURPLE })],
  }));
  items.push(makeTable(
    makeHeaderRow(['From', 'To', 'Description']),
    ELEMENT_CYCLES.controlling.map((c, idx) => makeDataRow([c.from, c.to, c.description], idx, 'FEF2F2')),
  ));

  items.push(new Paragraph({ children: [new PageBreak()] }));
  return items;
}

function buildEndingPage(edition: EbookEdition): Paragraph[] {
  const paras: Paragraph[] = [];
  const isKdp = edition === 'kdp';

  paras.push(new Paragraph({ spacing: { before: 2000 }, children: [] }));

  if (isKdp) {
    paras.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: "What's Next?", font: 'Noto Sans KR', size: 40, bold: true, color: DARK })],
    }));
    paras.push(new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Your Journey Has Just Begun', font: 'Noto Sans KR', size: 22, color: GRAY })],
    }));
    paras.push(new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE } }, children: [] }));

    // 배운 것
    paras.push(new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "WHAT YOU'VE LEARNED", font: 'Noto Sans KR', size: 14, color: LIGHT_GRAY })],
    }));
    for (const item of [
      'The foundations and history of Saju',
      'The Five Elements and their interactions',
      'How to find your Useful God (用神)',
      'All 10 Ten Gods — complete profiles',
    ]) {
      paras.push(new Paragraph({
        spacing: { after: 60 },
        indent: { left: convertInchesToTwip(0.2) },
        children: [
          new TextRun({ text: '✓  ', font: 'Noto Sans KR', size: 20, color: GREEN }),
          new TextRun({ text: item, font: 'Noto Sans KR', size: 20, color: '444444' }),
        ],
      }));
    }

    // 아직 안 배운 것
    paras.push(new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [new TextRun({ text: 'WHAT AWAITS IN THE FULL EDITION', font: 'Noto Sans KR', size: 14, color: LIGHT_GRAY })],
    }));
    for (const item of [
      'Twelve Life Stages — your energy cycle',
      'Grand Fortune, Annual & Monthly Fortune — timing your life',
      'Complete chart reading — start to finish',
      'Love compatibility analysis',
      '3 Full Case Studies with real charts',
    ]) {
      paras.push(new Paragraph({
        spacing: { after: 60 },
        indent: { left: convertInchesToTwip(0.2) },
        children: [
          new TextRun({ text: '→  ', font: 'Noto Sans KR', size: 20, color: PURPLE }),
          new TextRun({ text: item, font: 'Noto Sans KR', size: 20, color: '555555' }),
        ],
      }));
    }

    // CTA
    paras.push(new Paragraph({ spacing: { before: 400 }, children: [] }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      spacing: { after: 80 },
      children: [new TextRun({ text: 'Get the Full Edition', font: 'Noto Sans KR', size: 28, bold: true, color: PURPLE })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      spacing: { after: 80 },
      children: [new TextRun({ text: 'sajumuse.com/ebook', font: 'Noto Sans KR', size: 22, bold: true, color: PURPLE })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      spacing: { after: 80 },
      children: [
        new TextRun({ text: '━━━━━━', color: 'D0D0E0', size: 16 }),
      ],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      spacing: { after: 80 },
      children: [new TextRun({ text: 'Or get YOUR chart read by a certified master', font: 'Noto Sans KR', size: 18, color: GRAY })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      children: [new TextRun({ text: 'sajumuse.com/order', font: 'Noto Sans KR', size: 22, bold: true, color: PURPLE })],
    }));
  } else {
    // Full Edition ending
    paras.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: 'Thank You', font: 'Noto Sans KR', size: 40, bold: true, color: DARK })],
    }));
    paras.push(new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: 'for reading The Complete Guide to Korean Saju', font: 'Noto Sans KR', size: 22, color: GRAY })],
    }));
    paras.push(new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE } }, children: [] }));

    paras.push(new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({
        text: 'You now have the knowledge to read and interpret any Saju chart. The Four Pillars hold centuries of Korean wisdom — a system that has guided millions of lives.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }));
    paras.push(new Paragraph({
      spacing: { after: 300 },
      children: [new TextRun({
        text: 'Remember: Saju does not dictate your fate. It illuminates your tendencies, timing, and potential. What you do with that knowledge is entirely up to you.',
        font: 'Noto Sans KR', size: 21, color: '444444',
      })],
    }));

    // CTA
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      spacing: { after: 80 },
      children: [new TextRun({ text: 'Want an Expert to Read YOUR Chart?', font: 'Noto Sans KR', size: 26, bold: true, color: PURPLE })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      spacing: { after: 80 },
      children: [new TextRun({ text: 'Get a personalized 60+ page Premium Report', font: 'Noto Sans KR', size: 18, color: GRAY })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { type: ShadingType.SOLID, color: BG_PURPLE },
      children: [new TextRun({ text: 'sajumuse.com/order', font: 'Noto Sans KR', size: 22, bold: true, color: PURPLE })],
    }));

    // 저자
    paras.push(new Paragraph({ spacing: { before: 600 }, children: [] }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Ksaju Kim', font: 'Noto Sans KR', size: 24, bold: true, color: DARK })],
    }));
    paras.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Certified Korean Saju Counselor · 138+ verified readings', font: 'Noto Sans KR', size: 16, color: LIGHT_GRAY })],
    }));
  }

  return paras;
}

// ─── 메인 빌더 ───

export async function buildEbookDocx(
  edition: EbookEdition,
  chapters: Record<string, DocxChapterContent>,
  options?: { preview?: boolean },
): Promise<Buffer> {
  const editionInfo = EDITION_INFO[edition];
  const included = editionInfo.chapters;
  const preview = options?.preview ?? false;

  // 문서에 포함할 챕터 (콘텐츠가 있는 것만)
  const chaptersToRender = EBOOK_CHAPTERS.filter(
    ch => included.includes(ch.number) && chapters[`chapter_${String(ch.number).padStart(2, '0')}`],
  );

  // 모든 paragraphs 조립 (Table도 포함 가능)
  const allChildren: (Paragraph | Table)[] = [];

  if (!preview) {
    // 1. 커버
    allChildren.push(...buildCoverPage(edition));

    // 2. Copyright
    allChildren.push(...buildCopyrightPage(edition));

    // 3. Preface — How to Use This Book
    allChildren.push(...buildPrefacePage());

    // 4. 목차
    allChildren.push(...buildTocPage(edition));
  }

  // 5. 챕터 (파트 헤더 포함)
  let lastPartNum = 0;
  for (const ch of chaptersToRender) {
    const part = getPartForChapter(ch.number);
    if (part && part.number !== lastPartNum && !preview) {
      lastPartNum = part.number;
      allChildren.push(...buildPartHeader(part.number, part.title, part.subtitle));
    }
    const key = `chapter_${String(ch.number).padStart(2, '0')}`;
    allChildren.push(...buildChapter(ch.number, ch.title, part?.title, chapters[key]));
  }

  if (!preview) {
    // 6. About the Author
    allChildren.push(...buildAboutAuthorPage());

    // 7. Glossary
    allChildren.push(...buildGlossaryPages());

    // 8. Appendix
    allChildren.push(...buildAppendixPages());

    // 9. 엔딩
    allChildren.push(...buildEndingPage(edition));
  }

  // Document 생성 — KDP 6"×9"
  const doc = new Document({
    title: editionInfo.title,
    description: editionInfo.subtitle,
    creator: 'Ksaju Kim',
    styles: {
      default: {
        document: {
          run: {
            font: 'Noto Sans KR',
            size: 21, // 10.5pt
            color: '333333',
          },
          paragraph: {
            spacing: { line: 360 }, // 1.5 line spacing
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertInchesToTwip(6),
              height: convertInchesToTwip(9),
            },
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.55),
              left: convertInchesToTwip(0.75),   // 안쪽 (바인딩)
              right: convertInchesToTwip(0.5),    // 바깥쪽
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: editionInfo.title, font: 'Noto Sans KR', size: 14, color: 'CCCCCC' })],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ children: [PageNumber.CURRENT], font: 'Noto Sans KR', size: 16, color: '999999' }),
                ],
              }),
            ],
          }),
        },
        children: allChildren,
      },
    ],
  });

  const { Packer } = await import('docx');
  const buffer = await Packer.toBuffer(doc);
  return buffer as Buffer;
}
