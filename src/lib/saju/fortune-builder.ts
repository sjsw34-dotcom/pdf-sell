// ═══════════════════════════════════════════════════════════════
// fortune 빌더 — 대운/년운/월운 탭 생성
// 한국식 확장 지장간 + 지지 본기 기준 십성
// ═══════════════════════════════════════════════════════════════

import type { EightChar } from 'lunar-typescript';
import type { RawSajuTab, HeavenlyStem, EarthlyBranch, TwelveStage } from '@/lib/types/saju';
import {
  calculateDiShiReverse,
  TWELVE_STAGE_ORDER,
  CHANG_SHENG_OFFSET,
  BRANCH_INDEX,
  STEM_INDEX,
} from './mappings';
import { getShiShenKorean, getKoreanHiddenStemStrings, getBranchShiShen } from './shishen';
import { getTwelveShinsal, collectAuxiliaryShinsals, getSamJae } from './shinsal-rules';

/** 봉법 십이운성 계산 (일간 기준) */
function calculateDiShiBongbeop(dayGan: HeavenlyStem, branch: EarthlyBranch): TwelveStage {
  const offset = CHANG_SHENG_OFFSET[dayGan];
  const zhiIdx = BRANCH_INDEX[branch];
  const stemIdx = STEM_INDEX[dayGan];
  const isYang = stemIdx % 2 === 0;
  let index = isYang ? offset + zhiIdx : offset - zhiIdx;
  index = ((index % 12) + 12) % 12;
  return TWELVE_STAGE_ORDER[index];
}

/** 간지에서 천간/지지 분리 */
function splitGanZhi(ganZhi: string): { gan: HeavenlyStem; zhi: EarthlyBranch } {
  return { gan: ganZhi.charAt(0) as HeavenlyStem, zhi: ganZhi.charAt(1) as EarthlyBranch };
}

/** 공망 판정 */
function isGongmang(targetBranch: EarthlyBranch, dayXunKong: string): boolean {
  // 대운/년운/월운에서는 일공망만 적용 (년공망 제외)
  return dayXunKong.includes(targetBranch);
}

/** 공통: 운세 항목 한 행 생성 */
function buildFortuneRow(
  dayGan: HeavenlyStem,
  gan: HeavenlyStem,
  zhi: EarthlyBranch,
  yearBranch: EarthlyBranch,
  dayBranch: EarthlyBranch,
  monthBranch: EarthlyBranch,
  yearXunKong: string,
  dayXunKong: string,
  samjae?: string | null,
): string[] {
  const stemShiShen = getShiShenKorean(dayGan, gan);
  const branchShiShen = getBranchShiShen(dayGan, zhi);
  const bongbeop = calculateDiShiBongbeop(dayGan, zhi);
  const geobeop = calculateDiShiReverse(gan, zhi);
  const [yeogi, junggi, bongi] = getKoreanHiddenStemStrings(zhi, dayGan);

  const shinsalByYear = getTwelveShinsal(yearBranch, zhi);
  const shinsalByDay = getTwelveShinsal(dayBranch, zhi);

  const auxiliaries = collectAuxiliaryShinsals(
    dayGan, monthBranch, yearBranch, dayBranch, gan, zhi, samjae,
  );
  if (isGongmang(zhi, dayXunKong)) {
    auxiliaries.unshift('공망');
  }

  const auxPadded = [...auxiliaries.slice(0, 6)];
  while (auxPadded.length < 6) auxPadded.push('');

  return [
    stemShiShen, gan, zhi, branchShiShen,
    bongbeop, `(${geobeop})`,
    yeogi, junggi, bongi,
    shinsalByYear, shinsalByDay,
    ...auxPadded,
  ];
}

// ─── 대운 탭 ───

export function buildDaeunTab(
  eightChar: EightChar,
  gender: number,
): RawSajuTab {
  const dayGan = eightChar.getDayGan() as HeavenlyStem;
  const yearBranch = eightChar.getYearZhi() as EarthlyBranch;
  const dayBranch = eightChar.getDayZhi() as EarthlyBranch;
  const monthBranch = eightChar.getMonthZhi() as EarthlyBranch;
  const yearXunKong = eightChar.getYearXunKong();
  const dayXunKong = eightChar.getDayXunKong();

  const yun = eightChar.getYun(gender, 1);
  const daYuns = yun.getDaYun(11);

  // 대운 시작 나이: Yun의 시작년+월 기반 반올림
  const yunStartYear = yun.getStartYear();
  const yunStartMonth = yun.getStartMonth();
  const firstDaeunAge = yunStartYear + (yunStartMonth >= 6 ? 1 : 0);

  const entries: string[][] = [];

  for (let i = 1; i < daYuns.length && entries.length < 10; i++) {
    const dy = daYuns[i];
    const ganZhi = dy.getGanZhi();
    if (!ganZhi) continue;

    const { gan, zhi } = splitGanZhi(ganZhi);
    const startAge = firstDaeunAge + (i - 1) * 10;

    const row = buildFortuneRow(
      dayGan, gan, zhi,
      yearBranch, dayBranch, monthBranch,
      yearXunKong, dayXunKong,
    );

    entries.push([String(startAge), ...row]);
  }

  // 역순 (높은 나이 → 낮은 나이)
  entries.sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

  return {
    tab_name: '대운',
    tab_type: 'daeun',
    column_headers: [],
    row_headers: [
      '대운시작나이', '천간십성', '천간', '지지', '지지십성',
      '십이운성_봉법', '십이운성_거법',
      '지장간(여기)', '지장간(중기)', '지장간(본기)',
      '신살(년지기준)', '신살(일지기준)',
      '보조신살1', '보조신살2', '보조신살3', '보조신살4', '보조신살5', '보조신살6',
    ],
    data: entries,
  };
}

// ─── 년운 탭 ───

export function buildNyununTab(
  eightChar: EightChar,
  gender: number,
  birthYear: number,
  currentYear?: number,
): RawSajuTab {
  const dayGan = eightChar.getDayGan() as HeavenlyStem;
  const yearBranch = eightChar.getYearZhi() as EarthlyBranch;
  const dayBranch = eightChar.getDayZhi() as EarthlyBranch;
  const monthBranch = eightChar.getMonthZhi() as EarthlyBranch;
  const yearXunKong = eightChar.getYearXunKong();
  const dayXunKong = eightChar.getDayXunKong();

  const baseYear = currentYear ?? new Date().getFullYear();
  const startYear = baseYear - 1;
  const endYear = baseYear + 9;

  const GAN: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ZHI: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const entries: string[][] = [];

  for (let yr = endYear; yr >= startYear; yr--) {
    const ganIdx = ((yr - 4) % 10 + 10) % 10;
    const zhiIdx = ((yr - 4) % 12 + 12) % 12;
    const gan = GAN[ganIdx];
    const zhi = ZHI[zhiIdx];
    const age = yr - birthYear + 1;

    // 삼재 체크 (일지 기준) — buildFortuneRow에 전달하여 우선순위 내 배치
    const samJae = getSamJae(dayBranch, zhi);

    const row = buildFortuneRow(
      dayGan, gan, zhi,
      yearBranch, dayBranch, monthBranch,
      yearXunKong, dayXunKong,
      samJae,
    );

    entries.push([String(yr), `${age} 세`, ...row]);
  }

  return {
    tab_name: '년운',
    tab_type: 'nyunun',
    column_headers: [],
    row_headers: [
      '년도', '나이', '천간십성', '천간', '지지', '지지십성',
      '십이운성_봉법', '십이운성_거법',
      '지장간(여기)', '지장간(중기)', '지장간(본기)',
      '신살(년지기준)', '신살(일지기준)',
      '보조신살1', '보조신살2', '보조신살3', '보조신살4', '보조신살5', '보조신살6',
    ],
    data: entries,
  };
}

// ─── 월운 탭 ───

export function buildWolunTab(
  eightChar: EightChar,
  targetYear: number,
  birthYear: number,
): RawSajuTab {
  const dayGan = eightChar.getDayGan() as HeavenlyStem;
  const yearBranch = eightChar.getYearZhi() as EarthlyBranch;
  const dayBranch = eightChar.getDayZhi() as EarthlyBranch;
  const monthBranch = eightChar.getMonthZhi() as EarthlyBranch;
  const yearXunKong = eightChar.getYearXunKong();
  const dayXunKong = eightChar.getDayXunKong();

  const GAN: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ZHI: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const yearGanIdx = ((targetYear - 4) % 10 + 10) % 10;
  const monthGanOffset = [2, 4, 6, 8, 0][yearGanIdx % 5];

  const entries: string[][] = [];

  // 1월(丑月)~12월(子月) 양력 기준 매핑
  for (let m = 1; m <= 12; m++) {
    const monthZhiIdx = m % 12;
    const monthGanIdxCalc = (monthGanOffset + m - 2 + 10) % 10;
    const gan = GAN[monthGanIdxCalc];
    const zhi = ZHI[monthZhiIdx];

    const row = buildFortuneRow(
      dayGan, gan, zhi,
      yearBranch, dayBranch, monthBranch,
      yearXunKong, dayXunKong,
    );

    entries.push([`${m}월`, ...row]);
  }

  return {
    tab_name: '월운',
    tab_type: 'wolun',
    column_headers: [],
    row_headers: [
      `${targetYear}년월운(양력)`,
      '천간십성', '천간', '지지', '지지십성',
      '십이운성_봉법', '십이운성_거법',
      '지장간(여기)', '지장간(중기)', '지장간(본기)',
      '신살(년지기준)', '신살(일지기준)',
      '보조신살1', '보조신살2', '보조신살3', '보조신살4', '보조신살5', '보조신살6',
    ],
    data: entries,
  };
}
