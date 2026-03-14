import type { TierCode } from '@/lib/types/tier';

/**
 * 티어별 파트 키 목록 — 클라이언트 컴포넌트에서 안전하게 사용 가능.
 * prompts/ 모듈과 동기화 필수.
 */
const PART_KEYS: Record<TierCode, string[]> = {
  basic: ['overview', 'personality', 'fortune'],
  love: [
    'love_ch1', 'love_ch2', 'love_ch3',
    'love_callout_dna', 'love_callout_first', 'love_callout_match',
    'love_callout_timing', 'love_callout_adult', 'love_callout_luck',
    'love_p1', 'love_p2', 'love_p3', 'love_p4', 'love_p5', 'love_p6',
  ],
  full: [
    'part1_ch1', 'part1_ch2', 'part2_ch1', 'part2_ch2',
    'part3_ch1', 'part3_ch2', 'part4_ch1', 'part4_ch2',
    'part5_ch1', 'part5_ch2', 'part6_ch1', 'part6_ch2',
    'part7_ch1', 'part7_ch2', 'part8_ch1', 'part8_ch2',
  ],
  premium: [
    // Part 1~8 (Full과 동일)
    'part1_ch1', 'part1_ch2', 'part2_ch1', 'part2_ch2',
    'part3_ch1', 'part3_ch2', 'part4_ch1', 'part4_ch2',
    'part5_ch1', 'part5_ch2', 'part6_ch1', 'part6_ch2',
    'part7_ch1', 'part7_ch2', 'part8_ch1', 'part8_ch2',
    // Part 9: 올해 운세 (월별 상세)
    'this_year_forecast', 'part10_ch1', 'part10_ch2',
    // Part 10: 10년 운세 (개요 + 년도별 개별)
    'part9_intro',
    'year_2025', 'year_2026', 'year_2027', 'year_2028', 'year_2029',
    'year_2030', 'year_2031', 'year_2032', 'year_2033', 'year_2034', 'year_2035',
  ],
};

export function getPartKeysForTier(tier: TierCode): string[] {
  return PART_KEYS[tier];
}
