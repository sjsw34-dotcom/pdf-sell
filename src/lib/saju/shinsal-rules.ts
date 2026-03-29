// ═══════════════════════════════════════════════════════════════
// 신살 규칙 — 순수 함수 기반 신살 계산
// ═══════════════════════════════════════════════════════════════

import type { HeavenlyStem, EarthlyBranch } from '@/lib/types/saju';
import { BRANCH_INDEX, STEM_INDEX } from './mappings';

const BRANCHES: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ─── 12신살 (십이신살) ───
// 기준 지지(년지 또는 일지)로부터 대상 지지의 12신살 판정
// 12신살 순서: 겁살, 재살, 천살, 지살, 년살, 월살, 망신살, 장성살, 반안살, 역마살, 육해살, 화개살

const TWELVE_SHINSAL_NAMES = [
  '겁살', '재살', '천살', '지살', '년살', '월살',
  '망신살', '장성살', '반안살', '역마살', '육해살', '화개살',
];

/**
 * 12신살 시작 인덱스 (삼합 기준)
 * 寅午戌(火局): 겁살 at 亥(11)
 * 巳酉丑(金局): 겁살 at 寅(2)
 * 申子辰(水局): 겁살 at 巳(5)
 * 亥卯未(木局): 겁살 at 申(8)
 */
const TWELVE_SHINSAL_BASE: Record<EarthlyBranch, number> = {
  '子': 5,  '丑': 2,  '寅': 11, '卯': 8,
  '辰': 5,  '巳': 2,  '午': 11, '未': 8,
  '申': 5,  '酉': 2,  '戌': 11, '亥': 8,
};

/**
 * 12신살 계산
 * @param baseBranch 기준 지지 (년지 또는 일지)
 * @param targetBranch 대상 지지 (각 주의 지지)
 */
export function getTwelveShinsal(baseBranch: EarthlyBranch, targetBranch: EarthlyBranch): string {
  const base = TWELVE_SHINSAL_BASE[baseBranch];
  const target = BRANCH_INDEX[targetBranch];
  const idx = ((target - base) + 12) % 12;
  return TWELVE_SHINSAL_NAMES[idx];
}

// ─── 천을귀인 (天乙貴人) ───
const CHEON_EUL_GWI_IN: Record<HeavenlyStem, [EarthlyBranch, EarthlyBranch]> = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '戊': ['丑', '未'], '己': ['子', '申'], '庚': ['丑', '未'], '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
};

export function isCheonEulGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  const pair = CHEON_EUL_GWI_IN[dayStem];
  return pair[0] === branch || pair[1] === branch;
}

export function getCheonEulGwiInBranches(dayStem: HeavenlyStem): string {
  return CHEON_EUL_GWI_IN[dayStem].join('');
}

// ─── 도화살 (桃花煞) ───
const DO_HWA_SAL: Record<EarthlyBranch, EarthlyBranch> = {
  '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
  '辰': '酉', '巳': '午', '午': '卯', '未': '子',
  '申': '酉', '酉': '午', '戌': '卯', '亥': '子',
};

export function isDoHwaSal(baseBranch: EarthlyBranch, targetBranch: EarthlyBranch): boolean {
  return DO_HWA_SAL[baseBranch] === targetBranch;
}

// ─── 역마살 (驛馬煞) ───
const YEOK_MA_SAL: Record<EarthlyBranch, EarthlyBranch> = {
  '子': '寅', '丑': '亥', '寅': '申', '卯': '巳',
  '辰': '寅', '巳': '亥', '午': '申', '未': '巳',
  '申': '寅', '酉': '亥', '戌': '申', '亥': '巳',
};

export function isYeokMaSal(baseBranch: EarthlyBranch, targetBranch: EarthlyBranch): boolean {
  return YEOK_MA_SAL[baseBranch] === targetBranch;
}

// ─── 화개살 (華蓋煞) ───
const HWA_GAE_SAL: Record<EarthlyBranch, EarthlyBranch> = {
  '子': '辰', '丑': '丑', '寅': '戌', '卯': '未',
  '辰': '辰', '巳': '丑', '午': '戌', '未': '未',
  '申': '辰', '酉': '丑', '戌': '戌', '亥': '未',
};

export function isHwaGaeSal(baseBranch: EarthlyBranch, targetBranch: EarthlyBranch): boolean {
  return HWA_GAE_SAL[baseBranch] === targetBranch;
}

// ─── 현침살 (懸針煞) ───
// 일간 기준
const HYUN_CHIM_SAL_STEMS: HeavenlyStem[] = ['甲', '辛'];
const HYUN_CHIM_SAL_BRANCHES: EarthlyBranch[] = ['子', '午', '卯', '酉'];

export function isHyunChimSal(stem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return HYUN_CHIM_SAL_STEMS.includes(stem) || HYUN_CHIM_SAL_BRANCHES.includes(branch);
}

// ─── 백호살 (白虎煞) ───
const BAEK_HO_SAL: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '辰', '乙': '巳', '丙': '午', '丁': '未',
  '戊': '申', '己': '酉', '庚': '戌', '辛': '亥',
  '壬': '子', '癸': '丑',
};

export function isBaekHoSal(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return BAEK_HO_SAL[dayStem] === branch;
}

// ─── 복성귀인 (福星貴人) ───
const BOK_SEONG_GWI_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '寅', '乙': '丑', '丙': '子', '丁': '酉',
  '戊': '申', '己': '未', '庚': '午', '辛': '巳',
  '壬': '辰', '癸': '卯',
};

export function isBokSeongGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return BOK_SEONG_GWI_IN[dayStem] === branch;
}

// ─── 명예살 (名譽煞) ───
// 일간 기준으로 특정 지지에 해당
const MYUNG_YE_SAL: Record<HeavenlyStem, EarthlyBranch[]> = {
  '甲': ['午'], '乙': ['巳', '未'], '丙': ['未'], '丁': ['申'],
  '戊': ['未'], '己': ['申'], '庚': ['戌'], '辛': ['丑'],
  '壬': ['丑'], '癸': ['寅'],
};

export function isMyungYeSal(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return MYUNG_YE_SAL[dayStem]?.includes(branch) ?? false;
}

// ─── 음착살 (陰錯煞) ───
const EUM_CHAK_SAL: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '戌', '乙': '酉', '丙': '申', '丁': '未',
  '戊': '午', '己': '巳', '庚': '辰', '辛': '卯',
  '壬': '寅', '癸': '丑',
};

export function isEumChakSal(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return EUM_CHAK_SAL[dayStem] === branch;
}

// ─── 천덕귀인 (天德貴人) ───
const CHEON_DEOK_GWI_IN: Record<EarthlyBranch, HeavenlyStem> = {
  '寅': '丁', '卯': '辛', '辰': '壬', '巳': '辛',
  '午': '甲', '未': '癸', '申': '壬', '酉': '丙',
  '戌': '乙', '亥': '甲', '子': '己', '丑': '庚',
};

export function isCheonDeokGwiIn(monthBranch: EarthlyBranch, targetStem: HeavenlyStem): boolean {
  return CHEON_DEOK_GWI_IN[monthBranch] === targetStem;
}

// ─── 월덕귀인 (月德貴人) ───
const WOL_DEOK_GWI_IN: Record<EarthlyBranch, HeavenlyStem> = {
  '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚',
  '午': '丙', '未': '甲', '申': '壬', '酉': '庚',
  '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚',
};

export function isWolDeokGwiIn(monthBranch: EarthlyBranch, targetStem: HeavenlyStem): boolean {
  return WOL_DEOK_GWI_IN[monthBranch] === targetStem;
}

// ─── 금여 (金輿) ───
const GEUM_YEO: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '辰', '乙': '巳', '丙': '未', '丁': '申',
  '戊': '未', '己': '申', '庚': '戌', '辛': '亥',
  '壬': '丑', '癸': '寅',
};

export function isGeumYeo(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return GEUM_YEO[dayStem] === branch;
}

// ─── 홍염살 (紅艶煞) ───
const HONG_YEOM_SAL: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '午', '乙': '申', '丙': '寅', '丁': '未',
  '戊': '辰', '己': '辰', '庚': '戌', '辛': '酉',
  '壬': '子', '癸': '申',
};

export function isHongYeomSal(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return HONG_YEOM_SAL[dayStem] === branch;
}

// ─── 괴강살 (魁罡煞) ───
const GWAE_GANG_SAL: string[] = ['庚辰', '壬辰', '庚戌', '戊戌'];

export function isGwaeGangSal(stem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return GWAE_GANG_SAL.includes(stem + branch);
}

// ─── 건록 (建祿) ───
const GEON_ROK: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
  '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
  '壬': '亥', '癸': '子',
};

export function isGeonRok(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return GEON_ROK[dayStem] === branch;
}

// ─── 양인살 (羊刃煞) ───
const YANG_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳',
  '戊': '午', '己': '巳', '庚': '酉', '辛': '申',
  '壬': '子', '癸': '亥',
};

export function isYangIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return YANG_IN[dayStem] === branch;
}

// ─── 협록 (夾祿) ───
export function isHyeopRok(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  const rokBranch = GEON_ROK[dayStem];
  const rokIdx = BRANCH_INDEX[rokBranch];
  const branchIdx = BRANCH_INDEX[branch];
  // 건록 양옆
  return branchIdx === (rokIdx + 1) % 12 || branchIdx === (rokIdx + 11) % 12;
}

// ─── 암록 (暗祿) ───
// 일간 건록과 육합하는 지지
const YUK_HAP: Record<EarthlyBranch, EarthlyBranch> = {
  '子': '丑', '丑': '子', '寅': '亥', '卯': '戌',
  '辰': '酉', '巳': '申', '午': '未', '未': '午',
  '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅',
};

export function isAmRok(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  const rokBranch = GEON_ROK[dayStem];
  return YUK_HAP[rokBranch] === branch;
}

// ─── 천문성 (天門星) ───
export function isCheonMunSeong(branch: EarthlyBranch): boolean {
  return branch === '亥' || branch === '戌';
}

// ─── 고란살 (孤鸞煞) ───
const GO_RAN_SAL: string[] = ['甲寅', '乙巳', '丁巳', '辛亥', '戊申', '壬子'];

export function isGoRanSal(stem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return GO_RAN_SAL.includes(stem + branch);
}

// ─── 관귀학관 (官鬼學館) ───
const GWAN_GWI_HAK_GWAN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯',
};

export function isGwanGwiHakGwan(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return GWAN_GWI_HAK_GWAN[dayStem] === branch;
}

// ─── 문창귀인 (文昌貴人) ───
const MUN_CHANG_GWI_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯',
};

export function isMunChangGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return MUN_CHANG_GWI_IN[dayStem] === branch;
}

// ─── 태극귀인 (太極貴人) ───
const TAE_GEUK_GWI_IN: Record<HeavenlyStem, EarthlyBranch[]> = {
  '甲': ['子', '午'], '乙': ['子', '午'], '丙': ['卯', '酉'], '丁': ['卯', '酉'],
  '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
  '庚': ['寅', '亥'], '辛': ['寅', '亥'], '壬': ['巳', '申'], '癸': ['巳', '申'],
};

export function isTaeGeukGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return TAE_GEUK_GWI_IN[dayStem]?.includes(branch) ?? false;
}

// ─── 천주귀인 (天廚貴人) ───
const CHEON_JU_GWI_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '巳', '乙': '午', '丙': '巳', '丁': '午',
  '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
  '壬': '亥', '癸': '子',
};

export function isCheonJuGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return CHEON_JU_GWI_IN[dayStem] === branch;
}

// ─── 학당귀인 (學堂貴人) ───
const HAK_DANG_GWI_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '亥', '乙': '午', '丙': '寅', '丁': ['酉'] as unknown as EarthlyBranch,
  '戊': '寅', '己': '酉', '庚': '巳', '辛': '子',
  '壬': '申', '癸': '卯',
};

export function isHakDangGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  const val = HAK_DANG_GWI_IN[dayStem];
  if (Array.isArray(val)) return val.includes(branch);
  return val === branch;
}

// ─── 천복귀인 (天福貴人) ───
const CHEON_BOK_GWI_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '亥', '乙': ['子'] as unknown as EarthlyBranch,
  '丙': '丑', '丁': '寅',
  '戊': '卯', '己': '辰',
  '庚': '巳', '辛': '午',
  '壬': '未', '癸': '申',
};

export function isCheonBokGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  const val = CHEON_BOK_GWI_IN[dayStem];
  if (Array.isArray(val)) return val.includes(branch);
  return val === branch;
}

// ─── 비인살 (飛刃煞) ───
const BI_IN_SAL: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '酉', '乙': '申', '丙': '子', '丁': '亥',
  '戊': '子', '己': '亥', '庚': '卯', '辛': '寅',
  '壬': '午', '癸': '巳',
};

export function isBiInSal(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return BI_IN_SAL[dayStem] === branch;
}

// ─── 낙정관살 (落井關煞) ───
const NAK_JEONG_GWAN_SAL: Record<HeavenlyStem, EarthlyBranch[]> = {
  '甲': ['巳', '酉'], '乙': ['午', '戌'], '丙': ['亥', '卯'], '丁': ['子', '辰'],
  '戊': ['巳', '酉'], '己': ['午', '戌'], '庚': ['亥', '卯'], '辛': ['子', '辰'],
  '壬': ['巳', '酉'], '癸': ['午', '戌'],
};

export function isNakJeongGwanSal(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  return NAK_JEONG_GWAN_SAL[dayStem]?.includes(branch) ?? false;
}

// ─── 문곡귀인 (文曲貴人) ───
const MUN_GOK_GWI_IN: Record<HeavenlyStem, EarthlyBranch> = {
  '甲': '亥', '乙': ['子'] as unknown as EarthlyBranch,
  '丙': '寅', '丁': '卯',
  '戊': '寅', '己': '卯',
  '庚': '巳', '辛': '午',
  '壬': ['申'] as unknown as EarthlyBranch, '癸': '酉',
};

export function isMunGokGwiIn(dayStem: HeavenlyStem, branch: EarthlyBranch): boolean {
  const val = MUN_GOK_GWI_IN[dayStem];
  if (Array.isArray(val)) return val.includes(branch);
  return val === branch;
}

// ─── 원진살 (怨嗔煞) ───
const WON_JIN_SAL: Record<EarthlyBranch, EarthlyBranch> = {
  '子': '未', '丑': '午', '寅': '酉', '卯': '申',
  '辰': '亥', '巳': '戌', '午': '丑', '未': '子',
  '申': '卯', '酉': '寅', '戌': '巳', '亥': '辰',
};

export function isWonJinSal(baseBranch: EarthlyBranch, targetBranch: EarthlyBranch): boolean {
  return WON_JIN_SAL[baseBranch] === targetBranch;
}

// ─── 삼재 (三災) ───
const SAM_JAE: Record<EarthlyBranch, [EarthlyBranch, EarthlyBranch, EarthlyBranch]> = {
  '寅': ['申', '酉', '戌'], '午': ['申', '酉', '戌'], '戌': ['申', '酉', '戌'],
  '巳': ['寅', '卯', '辰'], '酉': ['寅', '卯', '辰'], '丑': ['寅', '卯', '辰'],
  '申': ['亥', '子', '丑'], '子': ['亥', '子', '丑'], '辰': ['亥', '子', '丑'],
  '亥': ['巳', '午', '未'], '卯': ['巳', '午', '未'], '未': ['巳', '午', '未'],
};

/**
 * 삼재 판정: 들삼재/눌삼재/날삼재
 * @param yearBranch 태어난 해의 지지
 * @param targetBranch 대상 연도의 지지
 */
export function getSamJae(yearBranch: EarthlyBranch, targetBranch: EarthlyBranch): string | null {
  const trio = SAM_JAE[yearBranch];
  if (!trio) return null;
  const idx = trio.indexOf(targetBranch);
  if (idx === 0) return '들삼재';
  if (idx === 1) return '눌삼재';
  if (idx === 2) return '날삼재';
  return null;
}

/**
 * 보조신살 수집: 대운/년운/월운에서 사용
 */
export function collectAuxiliaryShinsals(
  dayStem: HeavenlyStem,
  monthBranch: EarthlyBranch,
  yearBranch: EarthlyBranch,
  dayBranch: EarthlyBranch,
  targetStem: HeavenlyStem,
  targetBranch: EarthlyBranch,
): string[] {
  const shinsals: string[] = [];

  if (isCheonEulGwiIn(dayStem, targetBranch)) shinsals.push('천을귀인');
  if (isDoHwaSal(yearBranch, targetBranch) || isDoHwaSal(dayBranch, targetBranch)) shinsals.push('도화살');
  if (isGeonRok(dayStem, targetBranch)) shinsals.push('건록');
  if (isYangIn(dayStem, targetBranch)) shinsals.push('양인살');
  if (isHyeopRok(dayStem, targetBranch)) shinsals.push('협록');
  if (isAmRok(dayStem, targetBranch)) shinsals.push('암록');
  if (isHyunChimSal(targetStem, targetBranch)) shinsals.push('현침살');
  if (isBaekHoSal(dayStem, targetBranch)) shinsals.push('백호살');
  if (isMyungYeSal(dayStem, targetBranch)) shinsals.push('명예살');
  if (isBokSeongGwiIn(dayStem, targetBranch)) shinsals.push('복성귀인');
  if (isGeumYeo(dayStem, targetBranch)) shinsals.push('금여');
  if (isHongYeomSal(dayStem, targetBranch)) shinsals.push('홍염살');
  if (isGwaeGangSal(targetStem, targetBranch)) shinsals.push('괴강살');
  if (isGoRanSal(targetStem, targetBranch)) shinsals.push('고란살');
  if (isYeokMaSal(yearBranch, targetBranch) || isYeokMaSal(dayBranch, targetBranch)) shinsals.push('역마살');
  if (isCheonMunSeong(targetBranch)) shinsals.push('천문성');
  if (isGwanGwiHakGwan(dayStem, targetBranch)) shinsals.push('관귀학관');
  if (isMunChangGwiIn(dayStem, targetBranch)) shinsals.push('문창귀인');
  if (isTaeGeukGwiIn(dayStem, targetBranch)) shinsals.push('태극귀인');
  if (isCheonJuGwiIn(dayStem, targetBranch)) shinsals.push('천주귀인');
  if (isHakDangGwiIn(dayStem, targetBranch)) shinsals.push('학당귀인');
  if (isCheonBokGwiIn(dayStem, targetBranch)) shinsals.push('천복귀인');
  if (isCheonDeokGwiIn(monthBranch, targetStem)) shinsals.push('천덕귀인');
  if (isWolDeokGwiIn(monthBranch, targetStem)) shinsals.push('월덕귀인');
  if (isBiInSal(dayStem, targetBranch)) shinsals.push('비인살');
  if (isEumChakSal(dayStem, targetBranch)) shinsals.push('음착살');
  if (isNakJeongGwanSal(dayStem, targetBranch)) shinsals.push('낙정관살');
  if (isMunGokGwiIn(dayStem, targetBranch)) shinsals.push('문곡귀인');

  // 원진살 (년지/일지 기준)
  if (isWonJinSal(yearBranch, targetBranch)) shinsals.push('원진(年)');
  if (isWonJinSal(dayBranch, targetBranch)) shinsals.push('원진(日)');

  return shinsals;
}
