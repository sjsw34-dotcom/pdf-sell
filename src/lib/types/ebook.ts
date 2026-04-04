// ─── eBook 타입 정의 ───

/** KDP 6"×9" 페이지 크기 (포인트 단위) */
export const EBOOK_PAGE = { width: 432, height: 648 } as const;

/** eBook 에디션 */
export type EbookEdition = 'kdp' | 'full' | 'workbook';

export const EBOOK_EDITIONS = ['kdp', 'full', 'workbook'] as const;

/** eBook 에디션 정보 */
export const EDITION_INFO: Record<EbookEdition, {
  label: string;
  title: string;
  subtitle: string;
  chapters: number[];  // 포함되는 챕터 번호
  price: string;
}> = {
  kdp: {
    label: 'Kindle Edition',
    title: 'Korean Saju Decoded',
    subtitle: 'Your First Step into the Four Pillars of Destiny',
    chapters: Array.from({ length: 15 }, (_, i) => i + 1), // Ch 1~15
    price: '$32',
  },
  full: {
    label: 'Master Edition',
    title: 'Korean Saju Decoded',
    subtitle: 'Master the Four Pillars of Destiny',
    chapters: Array.from({ length: 28 }, (_, i) => i + 1), // Ch 1~28
    price: '$99',
  },
  workbook: {
    label: 'Free Workbook',
    title: 'Korean Saju Workbook',
    subtitle: 'Build Your Own Four Pillars Chart',
    chapters: Array.from({ length: 8 }, (_, i) => i + 1), // Ch 1~8
    price: 'FREE',
  },
};

/** Part 정보 */
export interface EbookPart {
  number: number;
  title: string;
  subtitle: string;
  chapters: number[];  // 포함되는 챕터 번호
}

export const EBOOK_PARTS: EbookPart[] = [
  { number: 1, title: 'Foundations of Saju', subtitle: 'Understanding the Four Pillars system', chapters: [1, 2, 3, 4] },
  { number: 2, title: 'The Five Elements', subtitle: 'Wood, Fire, Earth, Metal, Water', chapters: [5, 6, 7, 8] },
  { number: 3, title: 'The Ten Gods', subtitle: 'The cosmic relationships in your chart', chapters: [9, 10, 11, 12, 13, 14, 15] },
  { number: 4, title: 'The Twelve Life Stages', subtitle: 'The cycle of energy from birth to rebirth', chapters: [16, 17, 18] },
  { number: 5, title: 'Fortune Cycles', subtitle: 'Reading the timing of your destiny', chapters: [19, 20, 21] },
  { number: 6, title: 'Reading a Chart', subtitle: 'Putting it all together', chapters: [22, 23, 24, 25, 26] },
  { number: 7, title: 'Advanced Topics', subtitle: 'Special formations and modern applications', chapters: [27, 28] },
];

/** 챕터 메타데이터 */
export interface EbookChapter {
  number: number;
  part: number;
  title: string;
  primaryChart?: string;  // e.g. "A", "B", "B+F"
}

export const EBOOK_CHAPTERS: EbookChapter[] = [
  // Part 1
  { number: 1, part: 1, title: 'What Is Saju?' },
  { number: 2, part: 1, title: 'The History of Four Pillars' },
  { number: 3, part: 1, title: 'The Four Pillars — Your Birth Chart Explained', primaryChart: 'A' },
  { number: 4, part: 1, title: 'The Day Master — The Core of Your Identity', primaryChart: 'A' },
  // Part 2
  { number: 5, part: 2, title: 'Understanding the Five Elements', primaryChart: 'E' },
  { number: 6, part: 2, title: 'Element Interactions', primaryChart: 'C' },
  { number: 7, part: 2, title: 'The Useful God (用神)', primaryChart: 'D' },
  { number: 8, part: 2, title: 'Element Balance and Your Life', primaryChart: 'C' },
  // Part 3
  { number: 9, part: 3, title: 'Introduction to the Ten Gods', primaryChart: 'B' },
  { number: 10, part: 3, title: 'The Output Stars', primaryChart: 'B' },
  { number: 11, part: 3, title: 'The Wealth Stars', primaryChart: 'C' },
  { number: 12, part: 3, title: 'The Authority Stars', primaryChart: 'F' },
  { number: 13, part: 3, title: 'The Resource Stars', primaryChart: 'A' },
  { number: 14, part: 3, title: 'The Companion Stars', primaryChart: 'B' },
  { number: 15, part: 3, title: 'Ten Gods in Combination' },
  // Part 4
  { number: 16, part: 4, title: 'The Cycle of Energy', primaryChart: 'D' },
  { number: 17, part: 4, title: 'Each Stage Explained', primaryChart: 'D' },
  { number: 18, part: 4, title: 'Life Stages in Practice', primaryChart: 'A' },
  // Part 5
  { number: 19, part: 5, title: 'Grand Fortune (大運)', primaryChart: 'A' },
  { number: 20, part: 5, title: 'Annual Fortune (年運)', primaryChart: 'B' },
  { number: 21, part: 5, title: 'Monthly Fortune (月運)', primaryChart: 'E' },
  // Part 6
  { number: 22, part: 6, title: 'The Art of Saju Interpretation' },
  { number: 23, part: 6, title: 'Love & Relationship Reading', primaryChart: 'B+F' },
  { number: 24, part: 6, title: 'Career & Wealth Reading', primaryChart: 'E' },
  { number: 25, part: 6, title: 'Health Reading', primaryChart: 'C' },
  { number: 26, part: 6, title: 'Comprehensive Reading — Full Chart Analysis' },
  // Part 7
  { number: 27, part: 7, title: 'Special Formations (格局 & 神殺)' },
  { number: 28, part: 7, title: 'Saju in the Modern World' },
];

/** 책 메타데이터 상수 */
export const BOOK_META = {
  author: 'Ksaju Kim',
  credentials: 'Certified Korean Saju Counselor · 15+ Years',
  website: 'sajumuse.com',
  copyright: '© 2025 Ksaju Kim. All rights reserved.',
  disclaimer: 'This book is for educational and entertainment purposes only. The information provided should not be used as a substitute for professional advice in legal, medical, financial, or other matters.',
  publishedBy: 'Published by SajuMuse · sajumuse.com',
};

// ─── 워크북 에디션 전용 파트/챕터 ───

export const WORKBOOK_PARTS: EbookPart[] = [
  { number: 1, title: 'Find Your Four Pillars', subtitle: 'Look up and build your birth chart', chapters: [1, 2, 3] },
  { number: 2, title: 'Know Your Day Master', subtitle: 'Discover who you really are', chapters: [4, 5] },
  { number: 3, title: 'Your 2026 Forecast', subtitle: 'What the Year of the Fire Horse means for you', chapters: [6] },
  { number: 4, title: 'Compatibility & Useful God', subtitle: 'Relationships and your secret advantage', chapters: [7, 8] },
];

export const WORKBOOK_CHAPTERS: EbookChapter[] = [
  { number: 1, part: 1, title: 'How Saju Works — A One-Page Primer' },
  { number: 2, part: 1, title: 'Year & Month Pillar Lookup Tables' },
  { number: 3, part: 1, title: 'Day & Hour Pillar — Complete Your Chart' },
  { number: 4, part: 2, title: 'The 10 Day Master Profiles' },
  { number: 5, part: 2, title: 'Day Master Self-Discovery Worksheet' },
  { number: 6, part: 3, title: '2026 Forecast by Day Master' },
  { number: 7, part: 4, title: 'Compatibility Quick-Check' },
  { number: 8, part: 4, title: 'Find Your Useful God (用神)' },
];

/** 챕터가 어느 파트에 속하는지 반환 */
export function getPartForChapter(chapterNum: number, edition?: EbookEdition): EbookPart | undefined {
  const parts = edition === 'workbook' ? WORKBOOK_PARTS : EBOOK_PARTS;
  return parts.find(p => p.chapters.includes(chapterNum));
}
