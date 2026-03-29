// ═══════════════════════════════════════════════════════════════
// 중국어 → 한국어 매핑 테이블
// lunar-typescript 출력을 한국 사주 용어로 변환
// ═══════════════════════════════════════════════════════════════

import type { TenGod, TenGodWithSelf, TwelveStage, FiveElement, HeavenlyStem, EarthlyBranch } from '@/lib/types/saju';

/** 십성 (十神) 중국어 → 한국어 */
export const SHISHEN_TO_KOREAN: Record<string, TenGod> = {
  '比肩': '비견',
  '劫财': '겁재',
  '食神': '식신',
  '伤官': '상관',
  '偏财': '편재',
  '正财': '정재',
  '七杀': '편관',   // 七杀 = 편관 (한국 사주 용어)
  '正官': '정관',
  '偏印': '편인',
  '正印': '정인',
};

/** 일간(나) 포함 십성 변환 */
export function toKoreanShiShen(chinese: string): TenGodWithSelf {
  if (chinese === '日主') return '일간(나)';
  return SHISHEN_TO_KOREAN[chinese] ?? '비견';
}

/** 십이운성 중국어 → 한국어 */
export const TWELVE_STAGE_TO_KOREAN: Record<string, TwelveStage> = {
  '长生': '장생',
  '沐浴': '목욕',
  '冠带': '관대',
  '临官': '건록',
  '帝旺': '제왕',
  '衰': '쇠',
  '病': '병',
  '死': '사',
  '墓': '묘',
  '绝': '절',
  '胎': '태',
  '养': '양',
};

export function toKoreanTwelveStage(chinese: string): TwelveStage {
  return TWELVE_STAGE_TO_KOREAN[chinese] ?? '장생';
}

/** 오행 중국어 → 한국어 (동일 한자이므로 identity) */
export const WUXING_TO_ELEMENT: Record<string, FiveElement> = {
  '木': '木',
  '火': '火',
  '土': '土',
  '金': '金',
  '水': '水',
};

/** 천간 → 오행 매핑 */
export const STEM_TO_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/** 지지 → 오행 매핑 */
export const BRANCH_TO_ELEMENT: Record<EarthlyBranch, FiveElement> = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
};

/** 천간 음양 (짝수 index = 양, 홀수 index = 음) */
export const STEM_YIN_YANG: Record<HeavenlyStem, '양' | '음'> = {
  '甲': '양', '乙': '음',
  '丙': '양', '丁': '음',
  '戊': '양', '己': '음',
  '庚': '양', '辛': '음',
  '壬': '양', '癸': '음',
};

/** 지지 음양 */
export const BRANCH_YIN_YANG: Record<EarthlyBranch, '양' | '음'> = {
  '子': '양', '丑': '음',
  '寅': '양', '卯': '음',
  '辰': '양', '巳': '음',
  '午': '양', '未': '음',
  '申': '양', '酉': '음',
  '戌': '양', '亥': '음',
};

/** 납음오행 중국어 → 한국어 매핑 */
export const NAYIN_TO_KOREAN: Record<string, string> = {
  '海中金': '해중금',
  '炉中火': '노중화',
  '大林木': '대림목',
  '路旁土': '노방토',
  '剑锋金': '검봉금',
  '山头火': '산두화',
  '涧下水': '간하수',
  '城头土': '성두토',
  '白蜡金': '백랍금',
  '杨柳木': '양류목',
  '泉中水': '천중수',
  '屋上土': '옥상토',
  '霹雳火': '벽력화',
  '松柏木': '송백목',
  '长流水': '장류수',
  '沙中金': '사중금',
  '山下火': '산하화',
  '平地木': '평지목',
  '壁上土': '벽상토',
  '金箔金': '금박금',
  '覆灯火': '복등화',
  '天河水': '천하수',
  '大驿土': '대역토',
  '钗钏金': '채천금',
  '桑柘木': '상자목',
  '大溪水': '대계수',
  '沙中土': '사중토',
  '天上火': '천상화',
  '石榴木': '석류목',
  '大海水': '대해수',
};

/** 납음 변환: "路旁土" 또는 "路旁土(土)" → "노방토" */
export function toKoreanNayin(chinese: string): string {
  // 괄호 제거: "路旁土(土)" → "路旁土"
  const name = chinese.replace(/\(.+\)/, '').trim();
  return NAYIN_TO_KOREAN[name] ?? name;
}

/** 십성 → 십신 5그룹 매핑 */
export const TENGOD_TO_GROUP: Record<TenGod, string> = {
  '비견': '비겁', '겁재': '비겁',
  '식신': '식상', '상관': '식상',
  '편재': '재성', '정재': '재성',
  '편관': '관성', '정관': '관성',
  '편인': '인성', '정인': '인성',
};

/** 오행 상생 관계: A가 B를 생함 */
export const ELEMENT_GENERATES: Record<FiveElement, FiveElement> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

/** 오행 상극 관계: A가 B를 극함 */
export const ELEMENT_CONTROLS: Record<FiveElement, FiveElement> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

/** 오행 피생 관계: A를 생하는 것 */
export const ELEMENT_GENERATED_BY: Record<FiveElement, FiveElement> = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金',
};

/** 오행 피극 관계: A를 극하는 것 */
export const ELEMENT_CONTROLLED_BY: Record<FiveElement, FiveElement> = {
  '木': '金', '火': '水', '土': '木', '金': '火', '水': '土',
};

/** 십이운성 인덱스 배열 (CHANG_SHENG 순서) */
export const TWELVE_STAGE_ORDER: TwelveStage[] = [
  '장생', '목욕', '관대', '건록', '제왕',
  '쇠', '병', '사', '묘', '절', '태', '양',
];

/** 천간별 장생 시작 오프셋 (CHANG_SHENG_OFFSET) */
export const CHANG_SHENG_OFFSET: Record<HeavenlyStem, number> = {
  '甲': 1, '乙': 6, '丙': 10, '丁': 9, '戊': 10,
  '己': 9, '庚': 7, '辛': 0, '壬': 4, '癸': 3,
};

/**
 * 한국식 확장 지장간 테이블
 * 중국 표준과 달리 모든 지지에 여기/중기/본기 3슬롯 제공
 * 순서: [여기, 중기, 본기] (없으면 null)
 */
export const KOREAN_HIDDEN_STEMS: Record<EarthlyBranch, [HeavenlyStem | null, HeavenlyStem | null, HeavenlyStem]> = {
  '子': ['壬', null, '癸'],
  '丑': ['癸', '辛', '己'],
  '寅': ['戊', '丙', '甲'],
  '卯': ['甲', null, '乙'],
  '辰': ['乙', '癸', '戊'],
  '巳': ['戊', '庚', '丙'],
  '午': ['丙', '己', '丁'],
  '未': ['丁', '乙', '己'],
  '申': ['戊', '壬', '庚'],
  '酉': ['庚', null, '辛'],
  '戌': ['辛', '丁', '戊'],
  '亥': ['戊', '甲', '壬'],
};

/** 지지 인덱스 매핑 */
export const BRANCH_INDEX: Record<EarthlyBranch, number> = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5,
  '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11,
};

/** 천간 인덱스 매핑 */
export const STEM_INDEX: Record<HeavenlyStem, number> = {
  '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
  '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9,
};

/**
 * 거법 십이운성 계산: 각 주의 자체 천간으로 계산
 * (봉법은 일간 기준, 거법은 각 주 천간 기준)
 */
export function calculateDiShiReverse(
  stem: HeavenlyStem,
  branch: EarthlyBranch,
): TwelveStage {
  const offset = CHANG_SHENG_OFFSET[stem];
  const zhiIdx = BRANCH_INDEX[branch];
  const stemIdx = STEM_INDEX[stem];
  const isYang = stemIdx % 2 === 0;

  let index = isYang ? offset + zhiIdx : offset - zhiIdx;
  index = ((index % 12) + 12) % 12;

  return TWELVE_STAGE_ORDER[index];
}
