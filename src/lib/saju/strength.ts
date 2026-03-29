// ═══════════════════════════════════════════════════════════════
// 일간 강약 판단 — 가중치 기반 9단계
// 극신약 < 신약 < 중신약 < 강변약 < 중화 < 약변강 < 신강 < 중신강 < 극신강
// ═══════════════════════════════════════════════════════════════

import type { HeavenlyStem, EarthlyBranch, StrengthLevel, StrengthDetail, FiveElement } from '@/lib/types/saju';
import { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT } from './mappings';

/** 오행 상생 관계: A가 B를 생함 */
const GENERATES: Record<FiveElement, FiveElement> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

/** 주어진 오행이 target을 돕는지 (같거나 생하는 관계) */
function supports(element: FiveElement, target: FiveElement): boolean {
  return element === target || GENERATES[element] === target;
}

// ─── 득지 / 실지 ───

function checkDeukji(dayElement: FiveElement, dayBranch: EarthlyBranch): StrengthDetail {
  return supports(BRANCH_TO_ELEMENT[dayBranch], dayElement) ? '득지' : '실지';
}

// ─── 득령 / 실령 ───

function checkDeukryeong(dayElement: FiveElement, monthBranch: EarthlyBranch): StrengthDetail {
  return supports(BRANCH_TO_ELEMENT[monthBranch], dayElement) ? '득령' : '실령';
}

// ─── 득세 / 실세 (세력 지원 개수 반환) ───

function countSupport(
  dayElement: FiveElement,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  hourStem: HeavenlyStem,
  hourBranch: EarthlyBranch,
): number {
  let count = 0;
  if (supports(STEM_TO_ELEMENT[yearStem], dayElement)) count++;
  if (supports(BRANCH_TO_ELEMENT[yearBranch], dayElement)) count++;
  if (supports(STEM_TO_ELEMENT[hourStem], dayElement)) count++;
  if (supports(BRANCH_TO_ELEMENT[hourBranch], dayElement)) count++;
  return count;
}

function checkDeukse(count: number): StrengthDetail {
  return count >= 2 ? '득세' : '실세';
}

// ─── 가중치 기반 점수 계산 ───

/**
 * 점수 체계:
 * - 월령(득령): +35점 (가장 중요)
 * - 일지(득지): +20점
 * - 세력 지원: 개당 +10점 (최대 4개 = 40점)
 * 총점 범위: 0 ~ 95
 *
 * 월령이 기본 영역을 결정:
 * - 득령 → 강(强) 영역 (35+)
 * - 실령 → 약(弱) 영역 (0~59)
 *
 * 약(弱) 영역 (실령, 0-59):
 *   0-16  → 극신약
 *   17-24 → 신약
 *   25-34 → 중신약
 *   35-44 → 약변강  (득지+득세가 월령 부재를 보완)
 *
 * 강(强) 영역 (득령, 35-95):
 *   35-44 → 강변약
 *   45-54 → 신강
 *   55-64 → 중신강
 *   65+   → 극신강
 *
 * 중화: 득령 + 실지 + 실세(0~1) 일 때 (35~45 부근)
 */
function scoreToLevel(score: number, hasDeukryeong: boolean): StrengthLevel {
  if (hasDeukryeong) {
    // 강 영역
    if (score >= 65) return '극신강';
    if (score >= 55) return '중신강';
    if (score >= 45) return '신강';
    if (score >= 40) return '중화';
    return '강변약';
  } else {
    // 약 영역
    if (score >= 35) return '약변강';
    if (score >= 25) return '중신약';
    if (score >= 17) return '신약';
    return '극신약';
  }
}

// ─── 공개 인터페이스 ───

export interface StrengthResult {
  level: StrengthLevel;
  deukji: StrengthDetail;
  deukryeong: StrengthDetail;
  deukse: StrengthDetail;
  score: number;
}

export function calculateStrength(
  dayStem: HeavenlyStem,
  dayBranch: EarthlyBranch,
  monthBranch: EarthlyBranch,
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  hourStem: HeavenlyStem,
  hourBranch: EarthlyBranch,
): StrengthResult {
  const dayElement = STEM_TO_ELEMENT[dayStem];

  const deukji = checkDeukji(dayElement, dayBranch);
  const deukryeong = checkDeukryeong(dayElement, monthBranch);
  const supportCount = countSupport(dayElement, yearStem, yearBranch, hourStem, hourBranch);
  const deukse = checkDeukse(supportCount);

  // 점수 계산
  let score = 0;
  if (deukryeong === '득령') score += 35;
  if (deukji === '득지') score += 20;
  score += supportCount * 10;

  const level = scoreToLevel(score, deukryeong === '득령');

  return { level, deukji, deukryeong, deukse, score };
}
