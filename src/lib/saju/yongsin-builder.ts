// ═══════════════════════════════════════════════════════════════
// yongsin 탭 빌더 — 용신 탭 생성 (억부용신법)
// ═══════════════════════════════════════════════════════════════

import type { RawSajuTab, FiveElement, HeavenlyStem, StrengthLevel } from '@/lib/types/saju';
import {
  STEM_TO_ELEMENT,
  ELEMENT_GENERATES,
  ELEMENT_CONTROLS,
  ELEMENT_GENERATED_BY,
  ELEMENT_CONTROLLED_BY,
} from './mappings';

/**
 * 억부용신법 (抑扶用神法):
 * - 신강(강한 일간): 설기/극기하는 오행이 용신
 * - 신약(약한 일간): 생조/부조하는 오행이 용신
 */
export function determineYongsin(
  dayStem: HeavenlyStem,
  strengthLevel: StrengthLevel,
): {
  yongsin: FiveElement;
  huisin: FiveElement;
  gisin: FiveElement;
  gusin: FiveElement;
  hansin: FiveElement;
} {
  const dayElement = STEM_TO_ELEMENT[dayStem];
  const isStrong = strengthLevel === '신강' || strengthLevel === '극신강';
  const isWeak = strengthLevel === '신약' || strengthLevel === '극신약';

  let yongsin: FiveElement;

  if (isStrong) {
    // 신강: 일간을 약화시키는 오행이 필요
    // 우선순위: 식상(설기) > 재성(극기) > 관성
    yongsin = ELEMENT_GENERATES[dayElement]; // 일간이 생하는 것 = 식상의 오행
  } else if (isWeak) {
    // 신약: 일간을 강화시키는 오행이 필요
    // 우선순위: 인성(생조) > 비겁(부조)
    yongsin = ELEMENT_GENERATED_BY[dayElement]; // 일간을 생하는 것 = 인성의 오행
  } else {
    // 중화: 가장 부족한 오행을 용신으로
    // 기본적으로 인성 오행을 용신으로 설정
    yongsin = ELEMENT_GENERATED_BY[dayElement];
  }

  // 용신 기준으로 나머지 4신 도출
  // 희신: 용신을 생하는 오행
  const huisin = ELEMENT_GENERATED_BY[yongsin];
  // 기신: 용신을 극하는 오행
  const gisin = ELEMENT_CONTROLLED_BY[yongsin];
  // 구신: 기신을 생하는 오행 (기신을 돕는 것)
  const gusin = ELEMENT_GENERATED_BY[gisin];
  // 한신: 나머지 오행
  const allElements: FiveElement[] = ['木', '火', '土', '金', '水'];
  const used = new Set([yongsin, huisin, gisin, gusin]);
  const hansin = allElements.find(e => !used.has(e)) ?? dayElement;

  return { yongsin, huisin, gisin, gusin, hansin };
}

export function buildYongsinTab(
  dayStem: HeavenlyStem,
  strengthLevel: StrengthLevel,
): RawSajuTab {
  const result = determineYongsin(dayStem, strengthLevel);

  return {
    tab_name: '용신',
    tab_type: 'yongsin',
    column_headers: ['用神(용신)', '喜神(희신)', '忌神(기신)', '仇神(구신)', '閑神(한신)'],
    row_headers: [],
    data: [
      [result.yongsin],
      [result.huisin],
      [result.gisin],
      [result.gusin],
      [result.hansin],
    ],
  };
}
