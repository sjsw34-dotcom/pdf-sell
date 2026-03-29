// ═══════════════════════════════════════════════════════════════
// pillar 탭 빌더 — 사주팔자 탭 생성
// 한국식 확장 지장간 테이블 사용
// ═══════════════════════════════════════════════════════════════

import type { EightChar } from 'lunar-typescript';
import type { RawSajuTab, HeavenlyStem, EarthlyBranch } from '@/lib/types/saju';
import {
  toKoreanShiShen,
  toKoreanTwelveStage,
  toKoreanNayin,
  calculateDiShiReverse,
} from './mappings';
import { getShiShenKorean, getKoreanHiddenStemStrings, getBranchShiShen } from './shishen';
import { calculateStrength } from './strength';

export interface PillarOverride {
  timeGan?: HeavenlyStem;
}

export function buildPillarTab(eightChar: EightChar, override?: PillarOverride): RawSajuTab {
  const dayGan = eightChar.getDayGan() as HeavenlyStem;
  const actualTimeGan = override?.timeGan ?? eightChar.getTimeGan();

  const pillars = [
    { gan: actualTimeGan, zhi: eightChar.getTimeZhi(), diShi: eightChar.getTimeDiShi(), nayin: eightChar.getTimeNaYin() },
    { gan: eightChar.getDayGan(), zhi: eightChar.getDayZhi(), diShi: eightChar.getDayDiShi(), nayin: eightChar.getDayNaYin() },
    { gan: eightChar.getMonthGan(), zhi: eightChar.getMonthZhi(), diShi: eightChar.getMonthDiShi(), nayin: eightChar.getMonthNaYin() },
    { gan: eightChar.getYearGan(), zhi: eightChar.getYearZhi(), diShi: eightChar.getYearDiShi(), nayin: eightChar.getYearNaYin() },
  ];

  const strength = calculateStrength(
    dayGan,
    eightChar.getDayZhi() as EarthlyBranch,
    eightChar.getMonthZhi() as EarthlyBranch,
    eightChar.getYearGan() as HeavenlyStem,
    eightChar.getYearZhi() as EarthlyBranch,
    actualTimeGan as HeavenlyStem,
    eightChar.getTimeZhi() as EarthlyBranch,
  );

  const strengthMap: Record<number, string> = {
    0: strength.level,
    1: strength.deukji,
    2: strength.deukryeong,
    3: strength.deukse,
  };

  const data: string[][] = pillars.map((p, idx) => {
    const gan = p.gan as HeavenlyStem;
    const zhi = p.zhi as EarthlyBranch;

    // 천간십성
    const stemTenGod = idx === 1 ? '일간(나)' : getShiShenKorean(dayGan, gan);

    // 지지십성 (본기 기준)
    const branchTenGod = getBranchShiShen(dayGan, zhi);

    // 봉법: 일간 기준 DiShi
    const bongbeop = toKoreanTwelveStage(p.diShi);

    // 거법: 각 주 자체 천간 기준 DiShi
    const geobeop = calculateDiShiReverse(gan, zhi);

    // 한국식 지장간
    const [yeogi, junggi, bongi] = getKoreanHiddenStemStrings(zhi, dayGan);

    return [
      stemTenGod,
      gan,
      zhi,
      branchTenGod,
      bongbeop,
      `(${geobeop})`,
      yeogi,
      junggi,
      bongi,
      toKoreanNayin(p.nayin),
      strengthMap[idx],
    ];
  });

  return {
    tab_name: '사주팔자',
    tab_type: 'pillar',
    column_headers: ['시주', '일주', '월주', '년주'],
    row_headers: [
      '천간십성', '천간한자', '지지한자', '지지십성',
      '십이운성_봉법', '십이운성_거법',
      '지장간여기', '지장간중기', '지장간본기',
      '납음오행', '강약',
    ],
    data,
  };
}
