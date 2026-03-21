#!/usr/bin/env tsx
/**
 * eBook 빌드 스크립트
 *
 * 사용법:
 *   npx tsx scripts/build-ebook.ts                          # DOCX (기본)
 *   npx tsx scripts/build-ebook.ts --format pdf             # PDF
 *   npx tsx scripts/build-ebook.ts --format both            # PDF + DOCX 동시
 *   npx tsx scripts/build-ebook.ts --edition full            # Full Edition (기본: kdp)
 *   npx tsx scripts/build-ebook.ts --edition kdp --format docx
 *   npx tsx scripts/build-ebook.ts --status                 # 챕터 작성 현황
 *   npx tsx scripts/build-ebook.ts --chapter 3              # 챕터 3만 미리보기 빌드
 *
 * 챕터 원고:
 *   chapters/chapter-01-what-is-saju.md
 *   chapters/chapter-02-history.md
 *   ...
 *
 * 출력:
 *   output/korean-saju-decoded.docx
 *   output/korean-saju-decoded.pdf
 *   output/preview-chapter-03.docx   (미리보기)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  EBOOK_CHAPTERS,
  EBOOK_PARTS,
  EDITION_INFO,
} from '../src/lib/types/ebook';

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

const statusMode = hasFlag('status');
const chapterArg = getArg('chapter', '');
const edition = getArg('edition', 'kdp') as 'kdp' | 'full';
const format = getArg('format', 'docx') as 'pdf' | 'docx' | 'both';

if (!statusMode && !chapterArg) {
  if (!['kdp', 'full'].includes(edition)) {
    console.error('❌ --edition must be "kdp" or "full"');
    process.exit(1);
  }
  if (!['pdf', 'docx', 'both'].includes(format)) {
    console.error('❌ --format must be "pdf", "docx", or "both"');
    process.exit(1);
  }
}

// ─── 경로 ───

const ROOT = path.resolve(__dirname, '..');
const CHAPTERS_DIR = path.join(ROOT, 'chapters');
const OUTPUT_DIR = path.join(ROOT, 'output');

// output 폴더 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ─── 챕터 마크다운 읽기 ───

interface ChapterData {
  content: string;
  takeaways?: string[];
  exercise?: string;
  cta?: string;
}

/**
 * YAML frontmatter 파싱 (간단 버전)
 * --- 와 --- 사이의 내용을 파싱
 */
function parseFrontmatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { meta: {}, body: raw };

  const meta: Record<string, unknown> = {};
  const fmLines = fmMatch[1].split('\n');
  let currentKey = '';
  let currentList: string[] | null = null;

  for (const line of fmLines) {
    // 리스트 아이템: "  - value"
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!currentList) currentList = [];
      currentList.push(listMatch[1].trim());
      continue;
    }

    // 이전 리스트 저장
    if (currentList && currentKey) {
      meta[currentKey] = currentList;
      currentList = null;
    }

    // key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val) {
        meta[currentKey] = val;
      }
      // val이 비어있으면 다음 줄에 리스트가 올 수 있음
    }
  }

  // 마지막 리스트 저장
  if (currentList && currentKey) {
    meta[currentKey] = currentList;
  }

  return { meta, body: fmMatch[2].trim() };
}

function loadChapters(): Record<string, ChapterData> {
  if (!fs.existsSync(CHAPTERS_DIR)) {
    console.error(`❌ chapters/ 폴더가 없습니다: ${CHAPTERS_DIR}`);
    console.error('   chapters/chapter-01-what-is-saju.md 같은 파일을 만들어주세요.');
    process.exit(1);
  }

  const files = fs.readdirSync(CHAPTERS_DIR)
    .filter(f => f.startsWith('chapter-') && f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.error('❌ chapters/ 폴더에 chapter-*.md 파일이 없습니다.');
    process.exit(1);
  }

  const chapters: Record<string, ChapterData> = {};

  for (const file of files) {
    // chapter-01-what-is-saju.md → 01 추출
    const numMatch = file.match(/^chapter-(\d+)/);
    if (!numMatch) continue;

    const num = numMatch[1]; // "01", "02", ...
    const raw = fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    const key = `chapter_${num}`;
    chapters[key] = {
      content: body,
      takeaways: Array.isArray(meta.takeaways) ? meta.takeaways as string[] : undefined,
      exercise: typeof meta.exercise === 'string' ? meta.exercise : undefined,
      cta: typeof meta.cta === 'string' ? meta.cta : undefined,
    };

    console.log(`  📖 ${file} → ${key}`);
  }

  return chapters;
}

// ─── 챕터 상태 표시 ───

function findChapterFile(chapterNum: number): string | null {
  if (!fs.existsSync(CHAPTERS_DIR)) return null;
  const padded = String(chapterNum).padStart(2, '0');
  const files = fs.readdirSync(CHAPTERS_DIR);
  const match = files.find(f => f.startsWith(`chapter-${padded}`) && f.endsWith('.md'));
  return match ?? null;
}

function showChapterStatus(): void {
  console.log('\n📊 Chapter Status (28 total)');
  console.log('═══════════════════════════════════');

  let written = 0;

  for (const part of EBOOK_PARTS) {
    console.log(`\n  Part ${part.number}: ${part.title}`);
    for (const chNum of part.chapters) {
      const ch = EBOOK_CHAPTERS.find(c => c.number === chNum)!;
      const file = findChapterFile(chNum);
      const padded = String(chNum).padStart(2, '0');
      const icon = file ? '✅' : '⬜';
      const fileLabel = file ? `(${file})` : '(missing)';
      if (file) written++;
      console.log(`    ${icon} ${padded}. ${ch.title.padEnd(45)} ${fileLabel}`);
    }
  }

  const kdpChapters = EDITION_INFO.kdp.chapters;
  const kdpWritten = kdpChapters.filter(n => findChapterFile(n) !== null).length;
  const fullWritten = written;

  console.log('\n═══════════════════════════════════');
  console.log(`  KDP Edition:  ${kdpWritten}/${kdpChapters.length} written (${(kdpWritten / kdpChapters.length * 100).toFixed(1)}%)`);
  console.log(`  Full Edition: ${fullWritten}/28 written (${(fullWritten / 28 * 100).toFixed(1)}%)`);
  console.log('');
}

// ─── DOCX 생성 ───

async function generateDocx(chapters: Record<string, ChapterData>, outputName: string): Promise<void> {
  console.log('\n📝 DOCX 생성 중...');

  const { buildEbookDocx } = await import('../src/lib/docx/buildEbookDocx');
  const buffer = await buildEbookDocx(edition, chapters);

  const outPath = path.join(OUTPUT_DIR, `${outputName}.docx`);
  fs.writeFileSync(outPath, buffer);

  const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
  console.log(`  ✅ ${outPath} (${sizeMB} MB)`);
}

// ─── PDF 생성 ───

async function generatePdf(chapters: Record<string, ChapterData>, outputName: string): Promise<void> {
  console.log('\n📄 PDF 생성 중...');

  // 폰트를 로컬 파일 경로로 등록
  const { Font } = await import('@react-pdf/renderer');
  const fontsDir = path.join(ROOT, 'public', 'fonts');

  const regularPath = path.join(fontsDir, 'NotoSansKR-Regular-subset.ttf');
  const boldPath = path.join(fontsDir, 'NotoSansKR-Bold-subset.ttf');

  if (!fs.existsSync(regularPath) || !fs.existsSync(boldPath)) {
    console.error('❌ 서브셋 폰트가 없습니다. 먼저 python scripts/build-font-subset.py 를 실행하세요.');
    process.exit(1);
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
  const { EbookDocument } = await import('../src/components/ebook/EbookDocument');

  const element = React.createElement(EbookDocument, { edition, chapters });
  const buffer = await renderToBuffer(
    element as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>,
  );

  const outPath = path.join(OUTPUT_DIR, `${outputName}.pdf`);
  const uint8 = new Uint8Array(buffer);
  fs.writeFileSync(outPath, uint8);

  const sizeMB = (uint8.byteLength / 1024 / 1024).toFixed(2);
  console.log(`  ✅ ${outPath} (${sizeMB} MB)`);
}

// ─── 메인 ───

async function main() {
  // --status 모드
  if (statusMode) {
    showChapterStatus();
    return;
  }

  // --chapter N 미리보기 모드
  if (chapterArg) {
    const chNum = parseInt(chapterArg, 10);
    if (isNaN(chNum) || chNum < 1 || chNum > 28) {
      console.error(`❌ Invalid chapter number: ${chapterArg} (must be 1–28)`);
      process.exit(1);
    }

    const chMeta = EBOOK_CHAPTERS.find(c => c.number === chNum);
    if (!chMeta) {
      console.error(`❌ Chapter ${chNum} is not defined in EBOOK_CHAPTERS`);
      process.exit(1);
    }

    const file = findChapterFile(chNum);
    if (!file) {
      console.error(`❌ Chapter ${chNum} file not found in chapters/`);
      console.error(`   Expected: chapters/chapter-${String(chNum).padStart(2, '0')}-*.md`);
      process.exit(1);
    }

    console.log(`\n🔮 미리보기: Chapter ${chNum} — ${chMeta.title}`);

    const raw = fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);
    const padded = String(chNum).padStart(2, '0');
    const key = `chapter_${padded}`;

    const chapters: Record<string, ChapterData> = {
      [key]: {
        content: body,
        takeaways: Array.isArray(meta.takeaways) ? meta.takeaways as string[] : undefined,
        exercise: typeof meta.exercise === 'string' ? meta.exercise : undefined,
        cta: typeof meta.cta === 'string' ? meta.cta : undefined,
      },
    };

    const outputName = `preview-chapter-${padded}`;

    if (format === 'docx' || format === 'both') {
      await generateDocx(chapters, outputName);
    }
    if (format === 'pdf' || format === 'both') {
      await generatePdf(chapters, outputName);
    }

    console.log('\n🎉 미리보기 완료!\n');
    return;
  }

  // 전체 빌드
  console.log(`\n🔮 eBook 빌드 시작`);
  console.log(`   에디션: ${edition}`);
  console.log(`   포맷:   ${format}`);
  console.log(`   챕터 폴더: ${CHAPTERS_DIR}\n`);

  const chapters = loadChapters();
  const count = Object.keys(chapters).length;
  console.log(`\n  총 ${count}개 챕터 로드 완료`);

  const slug = edition === 'kdp' ? 'korean-saju-decoded' : 'complete-guide-korean-saju';

  if (format === 'docx' || format === 'both') {
    await generateDocx(chapters, slug);
  }

  if (format === 'pdf' || format === 'both') {
    await generatePdf(chapters, slug);
  }

  console.log('\n🎉 완료!\n');
}

main().catch((err) => {
  console.error('\n❌ 빌드 실패:', err.message);
  console.error(err.stack);
  process.exit(1);
});
