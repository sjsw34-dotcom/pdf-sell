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

  // 경도 보정: 한국 표준시 -30분 적용 (시주 판정용)
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

  // 경도 보정으로 자정을 넘어가는 경우 (예: 00:17→23:47)
  if (adjustedHour < 0) {
    adjustedHour += 24;
  }

  // ── 子時(23시대) 처리 ──
  // 조자시파: 23시대 출생 → 다음날 일주 사용 (전문가 기준)
  // 경도보정 야자시: 보정으로 23시가 된 경우(원래 0시대) → 당일 일주 유지
  const isJojasi = birthHour >= 23;                              // 원래 23시대 출생
  const isYajasiFromCorrection = !isJojasi && adjustedHour >= 23; // 보정으로 인한 야자시

  // 1단계: 양력 날짜 결정 (시간 무관)
  let solarY: number, solarM: number, solarD: number;
  if (isLunar) {
    const lunarMonth = isLeapMonth ? -birthMonth : birthMonth;
    const tempSolar = Lunar.fromYmdHms(birthYear, lunarMonth, birthDay, 12, 0, 0).getSolar();
    solarY = tempSolar.getYear(); solarM = tempSolar.getMonth(); solarD = tempSolar.getDay();
  } else {
    solarY = birthYear; solarM = birthMonth; solarD = birthDay;
  }

  // 2단계: 조자시면 양력 +1일
  if (isJojasi) {
    const nextDate = new Date(solarY, solarM - 1, solarD + 1);
    solarY = nextDate.getFullYear();
    solarM = nextDate.getMonth() + 1;
    solarD = nextDate.getDate();
  }

  // 3단계: Solar 생성 (子時는 hour=0, 일반은 보정된 시간)
  if (isJojasi || isYajasiFromCorrection) {
    // 子時: hour=0 → 일주/시주 천간 정확도 보장
    solar = Solar.fromYmdHms(solarY, solarM, solarD, 0, 0, 0);
  } else {
    solar = Solar.fromYmdHms(solarY, solarM, solarD, adjustedHour, adjustedMinute, 0);
  }
  lunar = solar.getLunar();

  // 2. 사주팔자 (EightChar) 생성
  const eightChar = lunar.getEightChar();

  // 子時 안전장치: hour=0 전달 시 이미 정확하지만 명시적 보정
  const timeGanOverride = getCorrectTimeGan(
    eightChar.getDayGan() as HeavenlyStem,
    adjustedHour,
  );

  // 3. 성별 코드 (lunar-typescript: 1=남, 0=여)
  const genderCode = gender === '남' ? 1 : 0;

  // 4. 원본 Solar + Lunar (보정 전) — info 탭용
  //    표시 날짜는 항상 입력된 원래 생년월일 사용
  let originalSolar: Solar;
  let originalLunar: Lunar;
  if (isLunar) {
    const lunarMonth = isLeapMonth ? -birthMonth : birthMonth;
    originalLunar = Lunar.fromYmdHms(birthYear, lunarMonth, birthDay, 12, 0, 0);
    originalSolar = originalLunar.getSolar();
  } else {
    originalSolar = Solar.fromYmdHms(birthYear, birthMonth, birthDay, 12, 0, 0);
    originalLunar = originalSolar.getLunar();
  }

  // 5. 각 탭 빌드
  const infoTab = buildInfoTab({
    name,
    gender,
    solar: originalSolar,
    lunar: originalLunar,
  });

  const pillarTab = buildPillarTab(eightChar, timeGanOverride ? { timeGan: timeGanOverride } : undefined);

  // 강약 레벨 추출 (pillar 탭의 시주 row, index 10)
  const strengthLevel = pillarTab.data[0]?.[10] as StrengthLevel ?? '중화';

  // 음양오행 먼저 빌드 → 십신 그룹 카운트 추출
  const yinyangTab = buildYinyangTab(eightChar, timeGanOverride);
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
  const nyununTab = buildNyununTab(eightChar, genderCode, solarY, currentYear);

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
