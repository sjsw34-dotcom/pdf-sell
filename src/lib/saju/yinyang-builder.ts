// ═══════════════════════════════════════════════════════════════
// yinyang 탭 빌더 — 음양오행 탭 생성
// 한국식 확장 지장간 기반
// ═══════════════════════════════════════════════════════════════

import type { EightChar } from 'lunar-typescript';
import type { RawSajuTab, HeavenlyStem, EarthlyBranch, FiveElement } from '@/lib/types/saju';
import { STEM_TO_ELEMENT, BRANCH_TO_ELEMENT, STEM_YIN_YANG, BRANCH_YIN_YANG, KOREAN_HIDDEN_STEMS, TENGOD_TO_GROUP } from './mappings';
import { getShiShenKorean } from './shishen';

export function buildYinyangTab(eightChar: EightChar): RawSajuTab {
  const stems: HeavenlyStem[] = [
    eightChar.getTimeGan() as HeavenlyStem,
    eightChar.getDayGan() as HeavenlyStem,
    eightChar.getMonthGan() as HeavenlyStem,
    eightChar.getYearGan() as HeavenlyStem,
  ];
  const branches: EarthlyBranch[] = [
    eightChar.getTimeZhi() as EarthlyBranch,
    eightChar.getDayZhi() as EarthlyBranch,
    eightChar.getMonthZhi() as EarthlyBranch,
    eightChar.getYearZhi() as EarthlyBranch,
  ];
  const dayGan = stems[1];

  // 음양 카운트
  let yinCount = 0;
  let yangCount = 0;
  for (const s of stems) {
    if (STEM_YIN_YANG[s] === '음') yinCount++; else yangCount++;
  }
  for (const b of branches) {
    if (BRANCH_YIN_YANG[b] === '음') yinCount++; else yangCount++;
  }

  // 오행 카운트 (천간 + 지지 8자)
  const elementCounts: Record<FiveElement, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  for (const s of stems) elementCounts[STEM_TO_ELEMENT[s]]++;
  for (const b of branches) elementCounts[BRANCH_TO_ELEMENT[b]]++;

  // 십신 그룹 카운트: 천간 3개(일간 제외) + 지지 본기 4개
  const groupCounts: Record<string, number> = { '비겁': 0, '식상': 0, '재성': 0, '관성': 0, '인성': 0 };

  // 천간 십성 (일간 제외)
  for (let i = 0; i < stems.length; i++) {
    if (i === 1) continue; // 일간 제외
    const korean = getShiShenKorean(dayGan, stems[i]);
    const group = TENGOD_TO_GROUP[korean];
    if (group) groupCounts[group]++;
  }

  // 지지 본기의 십성
  for (const b of branches) {
    const bongi = KOREAN_HIDDEN_STEMS[b][2]; // 본기
    const korean = getShiShenKorean(dayGan, bongi);
    const group = TENGOD_TO_GROUP[korean];
    if (group) groupCounts[group]++;
  }

  const row: string[] = [
    `陰 : ${yinCount}`,
    `陽 : ${yangCount}`,
    `木 : ${elementCounts['木']}`,
    `火 : ${elementCounts['火']}`,
    `土 : ${elementCounts['土']}`,
    `金 : ${elementCounts['金']}`,
    `水 : ${elementCounts['水']}`,
    '일간',
    `비겁 : ${groupCounts['비겁']}`,
    `식상 : ${groupCounts['식상']}`,
    `재성 : ${groupCounts['재성']}`,
    `관성: ${groupCounts['관성']}`,
    `인성 : ${groupCounts['인성']}`,
  ];

  return {
    tab_name: '음양오행',
    tab_type: 'yinyang',
    column_headers: ['음양/오행/십신'],
    row_headers: [],
    data: [row],
  };
}
