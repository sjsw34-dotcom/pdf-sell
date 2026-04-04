// ═══════════════════════════════════════════════════════════════
// 십성(十神) 계산 — 공용 유틸리티
// ═══════════════════════════════════════════════════════════════

import type { HeavenlyStem, TenGod, TenGodWithSelf, EarthlyBranch } from '@/lib/types/saju';
import { SHISHEN_TO_KOREAN, KOREAN_HIDDEN_STEMS } from './mappings';

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const WUXING_IDX = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // 木木火火土土金金水水
const YIN_YANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 0=양, 1=음

/** 십성 매핑 테이블 (캐시) */
let _cache: Record<string, string> | null = null;

function getShiShenTable(): Record<string, string> {
  if (_cache) return _cache;

  const map: Record<string, string> = {};
  for (let d = 0; d < 10; d++) {
    for (let t = 0; t < 10; t++) {
      const dayEl = WUXING_IDX[d];
      const targetEl = WUXING_IDX[t];
      const sameYY = YIN_YANG[d] === YIN_YANG[t];

      let shiShen: string;
      if (dayEl === targetEl) {
        shiShen = sameYY ? '比肩' : '劫财';
      } else {
        const generates = (dayEl + 1) % 5;
        const controls = (dayEl + 2) % 5;
        const controlledBy = (dayEl + 3) % 5;
        const generatedBy = (dayEl + 4) % 5;

        if (targetEl === generates) shiShen = sameYY ? '食神' : '伤官';
        else if (targetEl === controls) shiShen = sameYY ? '偏财' : '正财';
        else if (targetEl === controlledBy) shiShen = sameYY ? '七杀' : '正官';
        else if (targetEl === generatedBy) shiShen = sameYY ? '偏印' : '正印';
        else shiShen = '比肩';
      }

      map[GAN[d] + GAN[t]] = shiShen;
    }
  }

  _cache = map;
  return map;
}

/** 중국어 십성 → 한국어 십성 */
export function getShiShenKorean(dayGan: string, targetGan: string): TenGod {
  const table = getShiShenTable();
  const chinese = table[dayGan + targetGan] ?? '比肩';
  return SHISHEN_TO_KOREAN[chinese] ?? '비견';
}

/** 중국어 십성 원본 반환 */
export function getShiShenChinese(dayGan: string, targetGan: string): string {
  const table = getShiShenTable();
  return table[dayGan + targetGan] ?? '比肩';
}

/** 천간 십성 (일간 포함) */
export function getStemShiShen(dayGan: string, targetGan: string): TenGodWithSelf {
  if (dayGan === targetGan && dayGan === targetGan) {
    // 일간 자체는 '일간(나)' — 단, 같은 천간이라도 다른 주이면 비견
  }
  const table = getShiShenTable();
  const chinese = table[dayGan + targetGan] ?? '比肩';
  if (chinese === '日主') return '일간(나)';
  return SHISHEN_TO_KOREAN[chinese] ?? '비견';
}

/**
 * 한국식 지장간으로 "天干 十神" 문자열 생성
 */
export function formatKoreanHiddenStem(
  stem: HeavenlyStem | null,
  dayGan: string,
): string {
  if (!stem) return '-';
  const korean = getShiShenKorean(dayGan, stem);
  return `${stem} ${korean}`;
}

/**
 * 한국식 지장간 3슬롯 반환 [여기, 중기, 본기] 문자열
 */
export function getKoreanHiddenStemStrings(
  branch: EarthlyBranch,
  dayGan: string,
): [string, string, string] {
  const stems = KOREAN_HIDDEN_STEMS[branch];
  return [
    formatKoreanHiddenStem(stems[0], dayGan),
    formatKoreanHiddenStem(stems[1], dayGan),
    formatKoreanHiddenStem(stems[2], dayGan),
  ];
}

/**
 * 지지십성: 지지의 본기(KOREAN_HIDDEN_STEMS[branch][2])를 일간과 비교
 */
export function getBranchShiShen(dayGan: string, branch: EarthlyBranch): TenGod {
  const stems = KOREAN_HIDDEN_STEMS[branch];
  const bongi = stems[2]; // 본기
  return getShiShenKorean(dayGan, bongi);
}
