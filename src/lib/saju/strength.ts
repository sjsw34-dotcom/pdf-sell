// ═══════════════════════════════════════════════════════════════
// 일간 강약 판단 (극신약 ~ 극신강)
// ═══════════════════════════════════════════════════════════════

import type { HeavenlyStem, EarthlyBranch, StrengthLevel, StrengthDetail, FiveElement } from '@/lib/types/saju';
import { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT } from './mappings';

/**
 * 월지(월주 지지)가 일간의 오행을 돕는지 판단 (득령/실령)
 * 득령: 월지 오행이 일간 오행을 생하거나 같은 오행
 */
function checkDeukryeong(dayElement: FiveElement, monthBranch: EarthlyBranch): StrengthDetail {
  const monthElement = BRANCH_TO_ELEMENT[monthBranch];
  // 득령: 같은 오행이거나 월지가 일간을 생함
  if (monthElement === dayElement) return '득령';
  // 생하는 관계: 水→木, 木→火, 火→土, 土→金, 金→水
  const generates: Record<FiveElement, FiveElement> = {
    '水': '木', '木': '火', '火': '土', '土': '金', '金': '水',
  };
  if (generates[monthElement] === dayElement) return '득령';
  return '실령';
}

/**
 * 일지(일주 지지)가 일간을 돕는지 판단 (득지/실지)
 */
function checkDeukji(dayElement: FiveElement, dayBranch: EarthlyBranch): StrengthDetail {
  const branchElement = BRANCH_TO_ELEMENT[dayBranch];
  if (branchElement === dayElement) return '득지';
  const generates: Record<FiveElement, FiveElement> = {
    '水': '木', '木': '火', '火': '土', '土': '金', '金': '水',
  };
  if (generates[branchElement] === dayElement) return '득지';
  return '실지';
}

/**
 * 년지+시지가 일간을 돕는지 판단 (득세/실세)
 */
function checkDeukse(
  dayElement: FiveElement,
  yearBranch: EarthlyBranch,
  hourBranch: EarthlyBranch,
  yearStem: HeavenlyStem,
  hourStem: HeavenlyStem,
): StrengthDetail {
  let support = 0;
  const generates: Record<FiveElement, FiveElement> = {
    '水': '木', '木': '火', '火': '土', '土': '金', '金': '水',
  };

  // 년지 체크
  const yearBrElement = BRANCH_TO_ELEMENT[yearBranch];
  if (yearBrElement === dayElement || generates[yearBrElement] === dayElement) support++;

  // 시지 체크
  const hourBrElement = BRANCH_TO_ELEMENT[hourBranch];
  if (hourBrElement === dayElement || generates[hourBrElement] === dayElement) support++;

  // 년간 체크
  const yearStElement = STEM_TO_ELEMENT[yearStem];
  if (yearStElement === dayElement || generates[yearStElement] === dayElement) support++;

  // 시간 체크
  const hourStElement = STEM_TO_ELEMENT[hourStem];
  if (hourStElement === dayElement || generates[hourStElement] === dayElement) support++;

  return support >= 2 ? '득세' : '실세';
}

export interface StrengthResult {
  level: StrengthLevel;
  deukji: StrengthDetail;
  deukryeong: StrengthDetail;
  deukse: StrengthDetail;
}

/**
 * 일간 강약 종합 판단
 */
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
  const deukse = checkDeukse(dayElement, yearBranch, hourBranch, yearStem, hourStem);

  // 득점 계산: 각 요소별 1점
  let score = 0;
  if (deukji === '득지') score++;
  if (deukryeong === '득령') score++;
  if (deukse === '득세') score++;

  let level: StrengthLevel;
  if (score === 0) level = '극신약';
  else if (score === 1) level = '신약';
  else if (score === 2) level = '신강';
  else level = '극신강';

  // 중화 판단: 득령 + 하나만 더 있으면서 세력이 균형일 때
  // (간단한 휴리스틱 — 정확한 판단은 지장간 분석이 필요하지만 기본 3요소로 판단)
  if (score === 1 && deukryeong === '득령') level = '중화';

  return { level, deukji, deukryeong, deukse };
}
