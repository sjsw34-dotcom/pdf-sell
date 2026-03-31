// ═══════════════════════════════════════════════════════════════
// shinsal 탭 빌더 — 신살 탭 생성 (14행 × 4열)
// ═══════════════════════════════════════════════════════════════

import type { EightChar } from 'lunar-typescript';
import type { RawSajuTab, HeavenlyStem, EarthlyBranch } from '@/lib/types/saju';
import { BRANCH_INDEX, KOREAN_HIDDEN_STEMS } from './mappings';
import {
  getTwelveShinsal,
  getCheonEulGwiInBranches,
  isDoHwaSal,
  isBaekHoSal,
  isMyungYeSal,
  isBokSeongGwiIn,
  isHyunChimSal,
  isEumChakSal,
  isCheonMunSeong,
  isYeokMaSal,
  isHwaGaeSal,
  isCheonEulGwiIn,
  isGeumYeo,
  isHongYeomSal,
  isGeonRok,
  isYangIn,
  isHyeopRok,
  isAmRok,
  isGwaeGangSal,
  isGoRanSal,
  isGwanGwiHakGwan,
  isMunChangGwiIn,
  isTaeGeukGwiIn,
  isCheonJuGwiIn,
  isHakDangGwiIn,
  isCheonBokGwiIn,
  isCheonDeokGwiIn,
  isWolDeokGwiIn,
  isBiInSal,
} from './shinsal-rules';

/** 귀문관살 참조 문자열 (모든 사주에 동일) */
const GWI_MUN_GWAN_SAL = '辰亥 子酉 未寅 巳戌 午丑 卯申';

/** 원진살 참조 문자열 (모든 사주에 동일) */
const WON_JIN_SAL = '子未 丑午 寅酉 卯申 辰亥 巳戌';

interface PillarInfo {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

export function buildShinsalTab(eightChar: EightChar): RawSajuTab {
  const dayStem = eightChar.getDayGan() as HeavenlyStem;
  const monthBranch = eightChar.getMonthZhi() as EarthlyBranch;

  const pillars: PillarInfo[] = [
    { stem: eightChar.getTimeGan() as HeavenlyStem, branch: eightChar.getTimeZhi() as EarthlyBranch },
    { stem: eightChar.getDayGan() as HeavenlyStem, branch: eightChar.getDayZhi() as EarthlyBranch },
    { stem: eightChar.getMonthGan() as HeavenlyStem, branch: eightChar.getMonthZhi() as EarthlyBranch },
    { stem: eightChar.getYearGan() as HeavenlyStem, branch: eightChar.getYearZhi() as EarthlyBranch },
  ];

  const yearBranch = pillars[3].branch;
  const dayBranch = pillars[1].branch;

  // 공망 계산
  const yearXunKong = eightChar.getYearXunKong(); // "戌亥" 같은 형태
  const dayXunKong = eightChar.getDayXunKong();

  // 천을귀인 지지
  const cheonEulGwiInStr = getCheonEulGwiInBranches(dayStem);

  // 월령 (한국식: 월주 지지의 본기 천간)
  const koreanMonthHideGan = KOREAN_HIDDEN_STEMS[monthBranch];
  const wolryeong = koreanMonthHideGan[2]; // 본기

  // 첫 행 헤더 문자열
  const headerStr = `空亡:[年]${yearXunKong} [日]${dayXunKong} , 天乙貴人:${cheonEulGwiInStr}, 월령:${wolryeong}`;

  // 공망 위치 판정 (각 주의 지지가 공망에 해당하는지)
  function checkGongmang(branch: EarthlyBranch): string {
    const parts: string[] = [];
    if (yearXunKong.includes(branch)) parts.push('[年]공망');
    if (dayXunKong.includes(branch)) parts.push('[日]공망');
    return parts.join(' ');
  }

  // 각 주별 세부 신살 수집
  function collectDetailedShinsals(p: PillarInfo): string[] {
    const shinsals: string[] = [];
    if (isCheonEulGwiIn(dayStem, p.branch)) shinsals.push('천을귀인');
    if (isDoHwaSal(p.branch)) shinsals.push('도화살');
    if (isBokSeongGwiIn(dayStem, p.branch)) shinsals.push('복성귀인');
    if (isHyunChimSal(p.stem, p.branch)) shinsals.push('현침살');
    if (isBaekHoSal(p.stem, p.branch)) shinsals.push('백호살');
    if (isMyungYeSal(p.branch)) shinsals.push('명예살');
    if (isEumChakSal(dayStem, p.branch)) shinsals.push('음착살');
    if (isCheonMunSeong(p.branch)) shinsals.push('천문성');
    if (isGeumYeo(dayStem, p.branch)) shinsals.push('금여');
    if (isHongYeomSal(dayStem, p.branch)) shinsals.push('홍염살');
    if (isGwaeGangSal(p.stem, p.branch)) shinsals.push('괴강살');
    if (isGeonRok(dayStem, p.branch)) shinsals.push('건록');
    if (isYangIn(dayStem, p.branch)) shinsals.push('양인살');
    if (isHyeopRok(dayStem, p.branch)) shinsals.push('협록');
    if (isAmRok(dayStem, p.branch)) shinsals.push('암록');
    if (isGoRanSal(p.stem, p.branch)) shinsals.push('고란살');
    if (isGwanGwiHakGwan(dayStem, p.branch)) shinsals.push('관귀학관');
    if (isMunChangGwiIn(dayStem, p.branch)) shinsals.push('문창귀인');
    if (isTaeGeukGwiIn(dayStem, p.branch)) shinsals.push('태극귀인');
    if (isCheonJuGwiIn(dayStem, p.branch)) shinsals.push('천주귀인');
    if (isHakDangGwiIn(dayStem, p.branch)) shinsals.push('학당귀인');
    if (isCheonBokGwiIn(dayStem, p.branch)) shinsals.push('천복귀인');
    if (isCheonDeokGwiIn(monthBranch, p.stem)) shinsals.push('천덕귀인');
    if (isWolDeokGwiIn(monthBranch, p.stem)) shinsals.push('월덕귀인');
    if (isBiInSal(dayStem, p.branch)) shinsals.push('비인살');
    return shinsals;
  }

  // 각 주별 14행 데이터 구성
  const data: string[][] = pillars.map((p, idx) => {
    const row: string[] = new Array(14).fill('');

    // row 0: 공망/천을귀인/월령 (시주에만 헤더)
    if (idx === 0) row[0] = headerStr;

    // row 1: 공망위치
    row[1] = checkGongmang(p.branch);

    // row 2: 십이신살(년지기준)
    row[2] = getTwelveShinsal(yearBranch, p.branch);

    // row 3: 십이신살(일지기준)
    row[3] = getTwelveShinsal(dayBranch, p.branch);

    // row 4~11: 신살세부요소 1~8
    const detailed = collectDetailedShinsals(p);
    for (let i = 0; i < 8; i++) {
      row[4 + i] = detailed[i] ?? '';
    }

    // row 12: 귀문관살 (시주에만)
    if (idx === 0) row[12] = GWI_MUN_GWAN_SAL;

    // row 13: 원진살 (시주에만)
    if (idx === 0) row[13] = WON_JIN_SAL;

    return row;
  });

  return {
    tab_name: '신살',
    tab_type: 'shinsal',
    column_headers: ['시주', '일주', '월주', '년주'],
    row_headers: [
      '공망/천을귀인/월령', '공망위치',
      '십이신살년지기준', '십이신살일지기준',
      '신살세부요소1', '신살세부요소2', '신살세부요소3', '신살세부요소4',
      '신살세부요소5', '신살세부요소6', '신살세부요소7', '신살세부요소8',
      '귀문관살', '원진살',
    ],
    data,
  };
}
