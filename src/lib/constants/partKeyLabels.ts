import type { TierCode } from '@/lib/types/tier';

export interface PartKeyMeta {
  key: string;
  label: string;
  title: string;
  group: string;
  groupLabel: string;
  type: 'chapter' | 'callout';
}

const BASIC_KEYS: PartKeyMeta[] = [
  { key: 'overview', label: 'Chapter 1', title: 'Your Destiny Overview', group: 'basic', groupLabel: 'Basic Analysis', type: 'chapter' },
  { key: 'personality', label: 'Chapter 2', title: 'Personality & Core Strengths', group: 'basic', groupLabel: 'Basic Analysis', type: 'chapter' },
  { key: 'fortune', label: 'Chapter 3', title: 'Fortune & Life Direction', group: 'basic', groupLabel: 'Basic Analysis', type: 'chapter' },
];

const LOVE_KEYS: PartKeyMeta[] = [
  // Chapters
  { key: 'love_ch1', label: 'Ch.1', title: 'Your Four Pillars & Love', group: 'love_ch', groupLabel: 'Chapters: Saju & Love Foundations', type: 'chapter' },
  { key: 'love_ch2', label: 'Ch.2', title: 'Your Day Master in Romance', group: 'love_ch', groupLabel: 'Chapters: Saju & Love Foundations', type: 'chapter' },
  { key: 'love_ch3', label: 'Ch.3', title: 'Elements & Your Love Language', group: 'love_ch', groupLabel: 'Chapters: Saju & Love Foundations', type: 'chapter' },
  // Callouts
  { key: 'love_callout_dna', label: 'Callout', title: 'Romance DNA in One Phrase', group: 'love_callout', groupLabel: 'Callout Boxes (짧은 한줄 문구)', type: 'callout' },
  { key: 'love_callout_first', label: 'Callout', title: 'Secret First-Impression Weapon', group: 'love_callout', groupLabel: 'Callout Boxes (짧은 한줄 문구)', type: 'callout' },
  { key: 'love_callout_match', label: 'Callout', title: 'Cosmic Match Blueprint', group: 'love_callout', groupLabel: 'Callout Boxes (짧은 한줄 문구)', type: 'callout' },
  { key: 'love_callout_timing', label: 'Callout', title: 'Your Love Calendar', group: 'love_callout', groupLabel: 'Callout Boxes (짧은 한줄 문구)', type: 'callout' },
  { key: 'love_callout_adult', label: 'Callout', title: 'Intimate Connection Style', group: 'love_callout', groupLabel: 'Callout Boxes (짧은 한줄 문구)', type: 'callout' },
  { key: 'love_callout_luck', label: 'Callout', title: 'Love Luck Amplifiers', group: 'love_callout', groupLabel: 'Callout Boxes (짧은 한줄 문구)', type: 'callout' },
  // Parts
  { key: 'love_p1', label: 'Part 1', title: 'Your Romantic Blueprint', group: 'love_parts', groupLabel: 'Parts: Detailed Love Analysis', type: 'chapter' },
  { key: 'love_p2', label: 'Part 2', title: 'Strengths & Dating Style', group: 'love_parts', groupLabel: 'Parts: Detailed Love Analysis', type: 'chapter' },
  { key: 'love_p3', label: 'Part 3', title: 'Compatibility & Dealbreakers', group: 'love_parts', groupLabel: 'Parts: Detailed Love Analysis', type: 'chapter' },
  { key: 'love_p4', label: 'Part 4', title: 'Romantic Timing & Lucky Places', group: 'love_parts', groupLabel: 'Parts: Detailed Love Analysis', type: 'chapter' },
  { key: 'love_p5', label: 'Part 5', title: 'Physical & Emotional Intimacy', group: 'love_parts', groupLabel: 'Parts: Detailed Love Analysis', type: 'chapter' },
  { key: 'love_p6', label: 'Part 6', title: 'Colors, Numbers & Strategic Tips', group: 'love_parts', groupLabel: 'Parts: Detailed Love Analysis', type: 'chapter' },
];

const FULL_KEYS: PartKeyMeta[] = [
  { key: 'part1_ch1', label: 'Ch 1-1', title: 'Exploring Your Four Pillars Composition', group: 'part1', groupLabel: 'Part 1: Detailed Analysis of My Four Pillars', type: 'chapter' },
  { key: 'part1_ch2', label: 'Ch 1-2', title: 'What Your Four Pillars Reveal About Your Destiny', group: 'part1', groupLabel: 'Part 1: Detailed Analysis of My Four Pillars', type: 'chapter' },
  { key: 'part2_ch1', label: 'Ch 2-1', title: 'Analyzing the Golden Peaks of Your Life', group: 'part2', groupLabel: 'Part 2: The Golden Peaks of My Life', type: 'chapter' },
  { key: 'part2_ch2', label: 'Ch 2-2', title: 'Seasonal and Daily Timing', group: 'part2', groupLabel: 'Part 2: The Golden Peaks of My Life', type: 'chapter' },
  { key: 'part3_ch1', label: 'Ch 3-1', title: 'Romance Tendencies and Romance Fortune', group: 'part3', groupLabel: 'Part 3: Romance Fortune and Partner Destiny', type: 'chapter' },
  { key: 'part3_ch2', label: 'Ch 3-2', title: 'Marriage Fortune and Timing', group: 'part3', groupLabel: 'Part 3: Romance Fortune and Partner Destiny', type: 'chapter' },
  { key: 'part4_ch1', label: 'Ch 4-1', title: 'Innate Financial Fortune', group: 'part4', groupLabel: 'Part 4: My Financial Fortune Analysis', type: 'chapter' },
  { key: 'part4_ch2', label: 'Ch 4-2', title: 'Wealth Accumulation Style and Investment Tendencies', group: 'part4', groupLabel: 'Part 4: My Financial Fortune Analysis', type: 'chapter' },
  { key: 'part5_ch1', label: 'Ch 5-1', title: 'Natural Aptitudes and Career Fields', group: 'part5', groupLabel: 'Part 5: Career and the Destiny of Success', type: 'chapter' },
  { key: 'part5_ch2', label: 'Ch 5-2', title: 'Career Fortune and Business Fortune', group: 'part5', groupLabel: 'Part 5: Career and the Destiny of Success', type: 'chapter' },
  { key: 'part6_ch1', label: 'Ch 6-1', title: 'Innate Constitution and Health Characteristics', group: 'part6', groupLabel: 'Part 6: Health and Constitution Through Saju', type: 'chapter' },
  { key: 'part6_ch2', label: 'Ch 6-2', title: 'Health Issues to Watch', group: 'part6', groupLabel: 'Part 6: Health and Constitution Through Saju', type: 'chapter' },
  { key: 'part7_ch1', label: 'Ch 7-1', title: 'Characteristics of Your Benefactors', group: 'part7', groupLabel: 'Part 7: The Destined Benefactors Who Will Help You', type: 'chapter' },
  { key: 'part7_ch2', label: 'Ch 7-2', title: 'How to Meet Your Benefactors', group: 'part7', groupLabel: 'Part 7: The Destined Benefactors Who Will Help You', type: 'chapter' },
  { key: 'part8_ch1', label: 'Ch 8-1', title: 'Advice for Improving Your Destiny', group: 'part8', groupLabel: 'Part 8: How to Shape Your Destiny', type: 'chapter' },
  { key: 'part8_ch2', label: 'Ch 8-2', title: 'Habits That Invite Good Fortune', group: 'part8', groupLabel: 'Part 8: How to Shape Your Destiny', type: 'chapter' },
];

const PREMIUM_EXTRA_KEYS: PartKeyMeta[] = [
  { key: 'this_year_forecast', label: 'Overview', title: '2026 — Your Year in Focus', group: 'part9', groupLabel: "Part 9: This Year's Fortune", type: 'chapter' },
  { key: 'part10_ch1', label: 'Ch 1', title: 'January – June: First Half Guide', group: 'part9', groupLabel: "Part 9: This Year's Fortune", type: 'chapter' },
  { key: 'part10_ch2', label: 'Ch 2', title: 'July – December: Second Half Guide', group: 'part9', groupLabel: "Part 9: This Year's Fortune", type: 'chapter' },
  { key: 'part9_intro', label: 'Overview', title: 'Decade Overview', group: 'part10', groupLabel: 'Part 10: 10-Year Fortune Cycle', type: 'chapter' },
  { key: 'year_2025', label: '2025', title: '2025 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2026', label: '2026', title: '2026 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2027', label: '2027', title: '2027 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2028', label: '2028', title: '2028 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2029', label: '2029', title: '2029 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2030', label: '2030', title: '2030 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2031', label: '2031', title: '2031 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2032', label: '2032', title: '2032 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2033', label: '2033', title: '2033 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2034', label: '2034', title: '2034 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
  { key: 'year_2035', label: '2035', title: '2035 — Annual Fortune', group: 'part10_years', groupLabel: 'Part 10: Year-by-Year Analysis', type: 'chapter' },
];

const TIER_KEY_METAS: Record<TierCode, PartKeyMeta[]> = {
  basic: BASIC_KEYS,
  love: LOVE_KEYS,
  full: FULL_KEYS,
  premium: [...FULL_KEYS, ...PREMIUM_EXTRA_KEYS],
};

export function getPartKeyMetas(tier: TierCode): PartKeyMeta[] {
  return TIER_KEY_METAS[tier];
}

/** 그룹별로 묶어서 반환 */
export function getGroupedPartKeys(tier: TierCode): { group: string; groupLabel: string; keys: PartKeyMeta[] }[] {
  const metas = getPartKeyMetas(tier);
  const groups: { group: string; groupLabel: string; keys: PartKeyMeta[] }[] = [];
  const seen = new Map<string, number>();

  for (const meta of metas) {
    const idx = seen.get(meta.group);
    if (idx !== undefined) {
      groups[idx].keys.push(meta);
    } else {
      seen.set(meta.group, groups.length);
      groups.push({ group: meta.group, groupLabel: meta.groupLabel, keys: [meta] });
    }
  }

  return groups;
}
