import React from 'react';
import { Document } from '@react-pdf/renderer';
import type { EbookEdition } from '@/lib/types/ebook';
import { EBOOK_PARTS, EBOOK_CHAPTERS, EDITION_INFO, getPartForChapter } from '@/lib/types/ebook';
import { EbookCoverPage } from './EbookCoverPage';
import { EbookTocPage } from './EbookTocPage';
import { EbookPartHeader } from './EbookPartHeader';
import { EbookChapterPage } from './EbookChapterPage';
import { EbookEndingPage } from './EbookEndingPage';

/**
 * 챕터별 콘텐츠 데이터
 * key: "chapter_01", "chapter_02", ...
 */
export interface EbookChapterContent {
  content: string;
  takeaways?: string[];
  exercise?: string;
  cta?: string;
}

interface EbookDocumentProps {
  edition: EbookEdition;
  /** 챕터별 텍스트 콘텐츠 */
  chapters: Record<string, EbookChapterContent>;
}

export function EbookDocument({ edition, chapters }: EbookDocumentProps) {
  const editionInfo = EDITION_INFO[edition];
  const includedChapters = editionInfo.chapters;

  // 실제 콘텐츠가 있는 챕터만 렌더링
  const chaptersToRender = EBOOK_CHAPTERS.filter(
    (ch) => includedChapters.includes(ch.number) && chapters[`chapter_${String(ch.number).padStart(2, '0')}`],
  );

  // 파트별로 그룹화
  let lastPartNumber = 0;

  return (
    <Document
      title={editionInfo.title}
      author="Ksaju Kim"
      subject="Korean Saju Four Pillars of Destiny"
      creator="SajuMuse"
    >
      {/* 1. 커버 */}
      <EbookCoverPage edition={edition} />

      {/* 2. 목차 */}
      <EbookTocPage edition={edition} />

      {/* 3. 챕터들 (파트 헤더 포함) */}
      {chaptersToRender.map((ch) => {
        const key = `chapter_${String(ch.number).padStart(2, '0')}`;
        const chapterData = chapters[key];
        const part = getPartForChapter(ch.number);
        const pages: React.ReactElement[] = [];

        // 새 파트 시작 시 파트 헤더 삽입
        if (part && part.number !== lastPartNumber) {
          lastPartNumber = part.number;
          pages.push(
            <EbookPartHeader
              key={`part_${part.number}`}
              partNumber={part.number}
              title={part.title}
              subtitle={part.subtitle}
            />,
          );
        }

        // 챕터 페이지
        pages.push(
          <EbookChapterPage
            key={key}
            chapterNumber={ch.number}
            title={ch.title}
            partTitle={part?.title}
            content={chapterData.content}
            takeaways={chapterData.takeaways}
            exercise={chapterData.exercise}
            cta={chapterData.cta}
          />,
        );

        return pages;
      })}

      {/* 4. 엔딩 */}
      <EbookEndingPage edition={edition} />
    </Document>
  );
}
