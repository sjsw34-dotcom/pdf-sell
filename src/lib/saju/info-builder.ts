// ═══════════════════════════════════════════════════════════════
// info 탭 빌더 — 사주정보 탭 생성
// ═══════════════════════════════════════════════════════════════

import { Solar, Lunar } from 'lunar-typescript';
import type { RawSajuTab } from '@/lib/types/saju';

export interface InfoInput {
  name: string;
  gender: '남' | '여';
  solar: Solar;
  lunar: ReturnType<Solar['getLunar']>;
  birthHour: number;
}

/**
 * 시(時) 이름 반환: 자시(子時) ~ 해시(亥時)
 */
function getShiName(hour: number): string {
  const shiNames = [
    '子時', '丑時', '寅時', '卯時', '辰時', '巳時',
    '午時', '未時', '申時', '酉時', '戌時', '亥時',
  ];
  // 23-1시: 子, 1-3: 丑, 3-5: 寅, ...
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return shiNames[idx];
}

/**
 * 세는나이 계산 (사주 전통 기준)
 */
function calculateAge(birthYear: number, currentYear: number): number {
  return currentYear - birthYear + 1;
}

/**
 * 절기 시각을 "HH:MM" 형태로 포맷
 */
function formatJieQiTime(jieQi: Solar | null): string {
  if (!jieQi) return '';
  return `${String(jieQi.getHour()).padStart(2, '0')}:${String(jieQi.getMinute()).padStart(2, '0')}`;
}

/**
 * 해당 연도의 특정 절기 양력 날짜를 찾기
 */
function findJieQiSolar(lunar: Lunar, jieQiName: string): string {
  const table = lunar.getJieQiTable();
  const s = table[jieQiName] as Solar | undefined;
  if (!s) return '';
  return formatJieQiTime(s);
}

export function buildInfoTab(input: InfoInput): RawSajuTab {
  const { name, gender, solar, lunar } = input;
  const currentYear = new Date().getFullYear();
  const age = calculateAge(solar.getYear(), currentYear);
  const genderChar = gender === '남' ? '男' : '女';
  const shi = getShiName(input.birthHour);

  // 음력 윤달 여부
  const isLeapMonth = lunar.getMonth() < 0;
  const lunarMonthStr = isLeapMonth ? '윤달' : '평달';
  const lunarMonth = Math.abs(lunar.getMonth());

  // 절기 (입추, 백로는 예시 — 실제 해당 연도 절기)
  const ipchuTime = findJieQiSolar(lunar, '立秋');
  const baengnoTime = findJieQiSolar(lunar, '白露');

  const genderNameStr = `[${genderChar}] ${name} (${age}세)`;
  const solarDateStr = `양력 : ${solar.getYear()}년 ${String(solar.getMonth()).padStart(2, '0')}월 ${String(solar.getDay()).padStart(2, '0')}일 ${shi} (보정 : -30분)`;
  const lunarDateStr = `음력 : ${lunar.getYear()}년 ${String(lunarMonth).padStart(2, '0')}월 ${String(lunar.getDay()).padStart(2, '0')}일 (${lunarMonthStr})`;
  const longitudeStr = '경도보정 : 한국시표준 동경 127˚30＇ 기준 -30분';
  const summerTimeStr = '썸머타임보정 : 해당사항 없음';
  const finalStr = '최종 : 출생시 -30분으로 사주분석';
  const ipchuStr = `양력 : ${ipchuTime}`;
  const baengnoStr = `양력 : ${baengnoTime}`;

  return {
    tab_name: '사주정보',
    tab_type: 'info',
    column_headers: ['항목', '내용'],
    row_headers: [],
    data: [
      ['성별 및 이름', '양력', '음력', '경도보정', '썸머타임보정', '최종', '[입추]', '[백로]'],
      [genderNameStr, solarDateStr, lunarDateStr, longitudeStr, summerTimeStr, finalStr, ipchuStr, baengnoStr],
    ],
  };
}
