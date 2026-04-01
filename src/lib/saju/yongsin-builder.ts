// ═══════════════════════════════════════════════════════════════
// yongsin 탭 빌더 — 용신 탭 생성
// 약(弱) 계열: 비겁(동일 오행) 용신
// 강(强) 계열: 십신그룹 분석 기반 식상/재성/관성 선택
// ═══════════════════════════════════════════════════════════════

import type { RawSajuTab, FiveElement, HeavenlyStem, StrengthLevel } from '@/lib/types/saju';
import {
  STEM_TO_ELEMENT,
  ELEMENT_GENERATES,
  ELEMENT_CONTROLS,
  ELEMENT_GENERATED_BY,
  ELEMENT_CONTROLLED_BY,
} from './mappings';

/** 강(强) 영역 강약 레벨 */
const STRONG_LEVELS: StrengthLevel[] = ['약변강', '신강', '중신강', '극신강'];

/** 십신 그룹별 오행 매핑 (일간 기준) */
function getTenGodGroupElements(dayElement: FiveElement) {
  return {
    비겁: dayElement,                           // 같은 오행
    식상: ELEMENT_GENERATES[dayElement],         // 일간이 생하는 것
    재성: ELEMENT_CONTROLS[dayElement],          // 일간이 극하는 것
    관성: ELEMENT_CONTROLLED_BY[dayElement],     // 나를 극하는 오행
    인성: ELEMENT_GENERATED_BY[dayElement],       // 나를 생하는 것
  };
}

/**
 * 용신 결정
 * @param tenGodCounts 십신 그룹별 개수 { 비겁, 식상, 재성, 관성, 인성 }
 */
export function determineYongsin(
  dayStem: HeavenlyStem,
  strengthLevel: StrengthLevel,
  tenGodCounts?: Record<string, number>,
): {
  yongsin: FiveElement;
  huisin: FiveElement;
  gisin: FiveElement;
  gusin: FiveElement;
  hansin: FiveElement;
} {
  const dayElement = STEM_TO_ELEMENT[dayStem];
  const groups = getTenGodGroupElements(dayElement);
  const isStrong = STRONG_LEVELS.includes(strengthLevel);

  let yongsin: FiveElement;

  if (isStrong) {
    // ── 강(强) 계열: 약화 필요 ──
    // 인성이 지배적이면 재성(인성을 극함)
    // 비겁이 지배적이면 관성(비겁을 극함)
    // 둘 다 높으면 식상(비겁을 설기)
    if (tenGodCounts) {
      const inCount = tenGodCounts['인성'] ?? 0;
      const biCount = tenGodCounts['비겁'] ?? 0;

      if (inCount > biCount) {
        yongsin = groups.재성; // 재성이 인성을 극함
      } else if (biCount > inCount) {
        yongsin = groups.관성; // 관성이 비겁을 극함
      } else {
        yongsin = groups.식상; // 식상이 비겁을 설기
      }
    } else {
      // 십신 그룹 정보 없으면 식상 기본
      yongsin = groups.식상;
    }
  } else {
    // ── 약(弱) 계열 + 중화: 강화 필요 ──
    // 비겁이 원국에 있으면 비겁, 없으면 인성으로 생조
    const biCount = tenGodCounts?.['비겁'] ?? 0;
    if (biCount > 0) {
      yongsin = groups.비겁;
    } else {
      yongsin = groups.인성;
    }
  }

  // ── 나머지 4신 도출 (통일 공식) ──
  // 희신 = 용신을 생하는 오행
  // 구신 = 기신을 생하는 오행
  // 한신 = 나머지
  const huisin = ELEMENT_GENERATED_BY[yongsin];

  // 기신 = 용신을 극하는 오행 (용신 효과를 직접 방해)
  const gisin: FiveElement = ELEMENT_CONTROLLED_BY[yongsin];

  const gusin = ELEMENT_GENERATED_BY[gisin];
  const all: FiveElement[] = ['木', '火', '土', '金', '水'];
  const used = new Set([yongsin, huisin, gisin, gusin]);
  const hansin = all.find(e => !used.has(e)) ?? dayElement;

  return { yongsin, huisin, gisin, gusin, hansin };
}

export function buildYongsinTab(
  dayStem: HeavenlyStem,
  strengthLevel: StrengthLevel,
  tenGodCounts?: Record<string, number>,
): RawSajuTab {
  const result = determineYongsin(dayStem, strengthLevel, tenGodCounts);

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
