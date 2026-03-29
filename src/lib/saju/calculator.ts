// ═══════════════════════════════════════════════════════════════
// 만세력 기반 사주 JSON 자동 생성기
// 생년월일+시간 → RawSajuJson (9탭 완전 생성)
// 결정론적: 같은 입력 → 항상 같은 출력
// ═══════════════════════════════════════════════════════════════

import { Solar, Lunar } from 'lunar-typescript';
import type { RawSajuJson, RawSajuTab, HeavenlyStem, EarthlyBranch, StrengthLevel } from '@/lib/types/saju';
import { STEM_INDEX } from './mappings';
import { buildInfoTab } from './info-builder';
import { buildPillarTab } from './pillar-builder';
import { buildYongsinTab } from './yongsin-builder';
import { buildYinyangTab } from './yinyang-builder';
import { buildShinsalTab } from './shinsal-builder';
import { buildHyungchungTab } from './hyungchung-builder';
import { buildDaeunTab, buildNyununTab, buildWolunTab } from './fortune-builder';

const GAN_LIST: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * 야자시(夜子時) 시주 천간 보정
 * lunar-typescript는 23시에 일진은 맞게 주지만 시주 천간이 다음날 기준으로 나옴
 * 正법: 일간 기준 子時 천간 = (일간인덱스 % 5) * 2
 */
function getCorrectTimeGan(dayGan: HeavenlyStem, adjustedHour: number): HeavenlyStem | undefined {
  // 23시대(야자시)일 때만 보정 필요
  if (adjustedHour < 23) return undefined;
  const dayIdx = STEM_INDEX[dayGan];
  const ziStemIdx = (dayIdx % 5) * 2;
  return GAN_LIST[ziStemIdx];
}

/** 음양오행 탭에서 십신 그룹 카운트 추출 */
function extractTenGodCounts(yinyangTab: RawSajuTab): Record<string, number> {
  const counts: Record<string, number> = {};
  const row = yinyangTab.data[0] ?? [];
  // "비겁 : 2", "식상 : 1" 등에서 추출
  for (const cell of row) {
    const match = cell.match(/^(비겁|식상|재성|관성|인성)\s*:\s*(\d+)$/);
    if (match) {
      counts[match[1]] = parseInt(match[2], 10);
    }
  }
  return counts;
}

export interface SajuInput {
  name: string;
  gender: '남' | '여';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  isLunar?: boolean;
  isLeapMonth?: boolean;
}

/**
 * 생년월일+시간으로 사주 JSON 생성
 * @returns RawSajuJson — parseSajuJson()으로 파싱 가능한 형태
 */
export function calculateSaju(input: SajuInput): RawSajuJson {
  const {
    name, gender,
    birthYear, birthMonth, birthDay,
    birthHour, birthMinute,
    isLunar = false, isLeapMonth = false,
  } = input;

  // 1. 양력/음력 → Solar 객체 생성
  let solar: Solar;
  let lunar: Lunar;

  // 경도 보정: 한국 표준시 -30분 적용
  const correctedMinute = birthMinute - 30;
  let adjustedHour = birthHour;
  let adjustedMinute = correctedMinute;

  if (adjustedMinute < 0) {
    adjustedMinute += 60;
    adjustedHour -= 1;
  }
  if (adjustedMinute >= 60) {
    adjustedMinute -= 60;
    adjustedHour += 1;
  }

  // 시간 조정으로 날짜가 변경될 수 있음
  let adjustedDay = birthDay;
  let adjustedMonth = birthMonth;
  let adjustedYear = birthYear;

  if (adjustedHour < 0) {
    adjustedHour += 24;
    adjustedDay -= 1;
    if (adjustedDay < 1) {
      adjustedMonth -= 1;
      if (adjustedMonth < 1) {
        adjustedMonth = 12;
        adjustedYear -= 1;
      }
      // 간단한 월말 일수 계산
      const daysInMonth = new Date(adjustedYear, adjustedMonth, 0).getDate();
      adjustedDay = daysInMonth;
    }
  }

  if (isLunar) {
    // 음력 입력 → 음력으로 Lunar 생성 → Solar 변환
    const lunarMonth = isLeapMonth ? -birthMonth : birthMonth;
    const lunarObj = Lunar.fromYmdHms(
      adjustedYear, lunarMonth, adjustedDay,
      adjustedHour, adjustedMinute, 0,
    );
    solar = lunarObj.getSolar();
    lunar = lunarObj;
  } else {
    // 양력 입력
    solar = Solar.fromYmdHms(
      adjustedYear, adjustedMonth, adjustedDay,
      adjustedHour, adjustedMinute, 0,
    );
    lunar = solar.getLunar();
  }

  // 2. 사주팔자 (EightChar) 생성
  const eightChar = lunar.getEightChar();

  // 2-1. 야자시(23시대) 시주 천간 보정
  const timeGanOverride = getCorrectTimeGan(
    eightChar.getDayGan() as HeavenlyStem,
    adjustedHour,
  );

  // 3. 성별 코드 (lunar-typescript: 1=남, 0=여)
  const genderCode = gender === '남' ? 1 : 0;

  // 4. 원본 Solar (보정 전) — info 탭용
  let originalSolar: Solar;
  if (isLunar) {
    const lunarMonth = isLeapMonth ? -birthMonth : birthMonth;
    const origLunar = Lunar.fromYmdHms(birthYear, lunarMonth, birthDay, birthHour, birthMinute, 0);
    originalSolar = origLunar.getSolar();
  } else {
    originalSolar = Solar.fromYmdHms(birthYear, birthMonth, birthDay, birthHour, birthMinute, 0);
  }

  // 5. 각 탭 빌드
  const infoTab = buildInfoTab({
    name,
    gender,
    solar: originalSolar,
    lunar,
  });

  const pillarTab = buildPillarTab(eightChar, timeGanOverride ? { timeGan: timeGanOverride } : undefined);

  // 강약 레벨 추출 (pillar 탭의 시주 row, index 10)
  const strengthLevel = pillarTab.data[0]?.[10] as StrengthLevel ?? '중화';

  // 음양오행 먼저 빌드 → 십신 그룹 카운트 추출
  const yinyangTab = buildYinyangTab(eightChar);
  const tenGodCounts = extractTenGodCounts(yinyangTab);

  const yongsinTab = buildYongsinTab(
    eightChar.getDayGan() as HeavenlyStem,
    strengthLevel,
    tenGodCounts,
  );
  const shinsalTab = buildShinsalTab(eightChar);
  const hyungchungTab = buildHyungchungTab();
  const daeunTab = buildDaeunTab(eightChar, genderCode);

  const currentYear = new Date().getFullYear();
  const nyununTab = buildNyununTab(eightChar, genderCode, birthYear, currentYear);

  const wolunTab = buildWolunTab(eightChar, currentYear, birthYear);
  const wolun2Tab = buildWolunTab(eightChar, currentYear + 1, birthYear);

  // 6. 최종 JSON 조립
  const result: RawSajuJson = {
    info: infoTab,
    pillar: pillarTab,
    yongsin: yongsinTab,
    yinyang: yinyangTab,
    shinsal: shinsalTab,
    hyungchung: hyungchungTab,
    daeun: daeunTab,
    nyunun: nyununTab,
    wolun: wolunTab,
    wolun2: wolun2Tab,
  };

  return result;
}
