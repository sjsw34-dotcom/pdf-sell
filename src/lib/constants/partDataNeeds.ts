import type { SajuData } from '@/lib/types/saju';

/**
 * 파트별 필요 데이터 키 매핑.
 * 명시되지 않은 키는 제외하여 토큰 절감.
 */

type SajuKey = keyof SajuData;

const BASE_KEYS: SajuKey[] = ['info', 'pillar', 'yongsin', 'yinyang'];

const PART_DATA_MAP: Record<string, SajuKey[]> = {
  // Part 1~8: 기본 4개 탭만
  part1_ch1: BASE_KEYS,
  part1_ch2: BASE_KEYS,
  part2_ch1: BASE_KEYS,
  part2_ch2: BASE_KEYS,
  part3_ch1: [...BASE_KEYS, 'shinsal', 'hyungchung'],
  part3_ch2: [...BASE_KEYS, 'shinsal', 'hyungchung'],
  part4_ch1: BASE_KEYS,
  part4_ch2: BASE_KEYS,
  part5_ch1: BASE_KEYS,
  part5_ch2: BASE_KEYS,
  part6_ch1: BASE_KEYS,
  part6_ch2: BASE_KEYS,
  part7_ch1: [...BASE_KEYS, 'shinsal'],
  part7_ch2: [...BASE_KEYS, 'shinsal'],
  part8_ch1: [...BASE_KEYS, 'daeun'],
  part8_ch2: [...BASE_KEYS, 'daeun'],

  // Part 9 intro: 대운 개요
  part9_intro: [...BASE_KEYS, 'daeun', 'nyunun'],

  // 올해 운세 + 월별 상세: wolun 필요, nyunun 불필요
  this_year_forecast: [...BASE_KEYS, 'daeun', 'nyunun', 'wolun'],
  part10_ch1: [...BASE_KEYS, 'daeun', 'wolun'],
  part10_ch2: [...BASE_KEYS, 'daeun', 'wolun'],

  // 10년 개별 년운: nyunun만, wolun 제외
  year_2025: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2026: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2027: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2028: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2029: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2030: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2031: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2032: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2033: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2034: [...BASE_KEYS, 'daeun', 'nyunun'],
  year_2035: [...BASE_KEYS, 'daeun', 'nyunun'],
};

/**
 * partKey에 필요한 데이터만 필터링하여 반환.
 * 매핑이 없는 partKey는 전체 데이터를 반환.
 */
export function filterSajuDataForPart(partKey: string, sajuData: SajuData): Partial<SajuData> {
  const neededKeys = PART_DATA_MAP[partKey];
  if (!neededKeys) return sajuData; // 매핑 없으면 전체 반환

  const filtered: Partial<SajuData> = {};
  for (const key of neededKeys) {
    if (sajuData[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filtered as any)[key] = sajuData[key];
    }
  }
  return filtered;
}
