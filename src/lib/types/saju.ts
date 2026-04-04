// ═══════════════════════════════════════════════════════════════
// Raw JSON Input Types — 업로드되는 JSON 파일의 정확한 구조
// 모든 탭은 동일한 테이블 기반 구조 (2D string 배열)
// ═══════════════════════════════════════════════════════════════

export interface RawSajuTab {
  tab_name: string;
  tab_type: string;
  column_headers: string[];
  row_headers: string[];
  data: string[][];
}

export interface RawSajuJson {
  info: RawSajuTab;
  pillar: RawSajuTab;
  yongsin: RawSajuTab;
  yinyang: RawSajuTab;
  shinsal?: RawSajuTab;
  hyungchung?: RawSajuTab;
  daeun?: RawSajuTab;
  nyunun?: RawSajuTab;
  wolun?: RawSajuTab;
  wolun2?: RawSajuTab;
}

/** RawSajuJson의 탭 키 목록 */
export const RAW_TAB_KEYS = [
  'info', 'pillar', 'yongsin', 'yinyang',
  'shinsal', 'hyungchung', 'daeun', 'nyunun', 'wolun', 'wolun2',
] as const;
export type RawTabKey = (typeof RAW_TAB_KEYS)[number];

// ═══════════════════════════════════════════════════════════════
// 기본 도메인 상수 & 타입
// ═══════════════════════════════════════════════════════════════

export const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;
export type FiveElement = (typeof FIVE_ELEMENTS)[number];

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export type HeavenlyStem = (typeof HEAVENLY_STEMS)[number];

export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];

export const TEN_GODS = [
  '비견', '겁재', '식신', '상관',
  '편재', '정재', '편관', '정관',
  '편인', '정인',
] as const;
export type TenGod = (typeof TEN_GODS)[number];

/** 일간(나) 포함 — pillar 천간십성에서 사용 */
export const TEN_GODS_WITH_SELF = [...TEN_GODS, '일간(나)'] as const;
export type TenGodWithSelf = (typeof TEN_GODS_WITH_SELF)[number];

export const TWELVE_STAGES = [
  '장생', '목욕', '관대', '건록', '제왕',
  '쇠', '병', '사', '묘', '절', '태', '양',
] as const;
export type TwelveStage = (typeof TWELVE_STAGES)[number];

export const STRENGTH_LEVELS = [
  '극신약', '신약', '중신약', '강변약', '중화', '약변강', '신강', '중신강', '극신강',
] as const;
export type StrengthLevel = (typeof STRENGTH_LEVELS)[number];

export const STRENGTH_DETAILS = [
  '득지', '실지', '득령', '실령', '득세', '실세',
] as const;
export type StrengthDetail = (typeof STRENGTH_DETAILS)[number];

/** 십신 5그룹 (음양오행 탭에서 사용) */
export const TEN_GOD_GROUPS = ['비겁', '식상', '재성', '관성', '인성'] as const;
export type TenGodGroup = (typeof TEN_GOD_GROUPS)[number];

export const PILLAR_POSITIONS = ['hour', 'day', 'month', 'year'] as const;
export type PillarPosition = (typeof PILLAR_POSITIONS)[number];

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 1: info — 사주정보
// ═══════════════════════════════════════════════════════════════

export interface InfoData {
  genderName: string;         // "[女] Valued Guest (35세)" — 성별+이름+나이 원본
  gender: '남' | '여';
  name: string;               // 파싱된 이름
  age: number;
  solarDate: string;          // "1992년 01월 10일 02:57"
  lunarDate: string;          // "1991년 12월 06일 (평달)"
  longitudeCorrection: string;  // "한국시표준 동경 127˚30＇ 기준 -30분"
  summerTimeCorrection: string; // "해당사항 없음"
  finalCorrection: string;      // "출생시 -30분으로 사주분석"
  ipchu: string;              // 입추 양력 시각
  baengno: string;            // 백로 양력 시각
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 2: pillar — 사주팔자
// ═══════════════════════════════════════════════════════════════

/** 지장간 항목 (여기/중기/본기 각 1개) — "癸 편인" 형태에서 파싱 */
export interface HiddenStemEntry {
  stem: HeavenlyStem;
  tenGod: TenGod;
}

export interface Pillar {
  stemTenGod: TenGodWithSelf;     // 천간십성 ("식신", "일간(나)" 등)
  heavenlyStem: HeavenlyStem;     // 천간 한자 ("丁", "乙" 등)
  earthlyBranch: EarthlyBranch;   // 지지 한자 ("丑", "酉" 등)
  branchTenGod: TenGod;          // 지지십성 ("편재", "편관" 등)
  twelveStage: TwelveStage;      // 십이운성 봉법
  twelveStageReverse: TwelveStage;  // 십이운성 거법 (괄호 제거된 값)
  hiddenStems: {
    yeogi: HiddenStemEntry | null;   // 지장간 여기
    junggi: HiddenStemEntry | null;  // 지장간 중기 ("-" → null)
    bongi: HiddenStemEntry | null;   // 지장간 본기
  };
  napEumOheng: string;           // 납음오행 ("간하수", "천중수" 등)
}

export interface PillarData {
  hourPillar: Pillar;     // 시주
  dayPillar: Pillar;      // 일주 (일간 = 나)
  monthPillar: Pillar;    // 월주
  yearPillar: Pillar;     // 년주
  strength: StrengthLevel;  // 전체 강약 ("극신약" 등)
  strengthDetails: {
    deukji: StrengthDetail;     // 득지/실지 (일주 위치)
    deukryeong: StrengthDetail; // 득령/실령 (월주 위치)
    deukse: StrengthDetail;     // 득세/실세 (년주 위치)
  };
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 3: yongsin — 용신
// ═══════════════════════════════════════════════════════════════

export interface YongsinData {
  yongsin: FiveElement;   // 용신 (예: "木")
  huisin: FiveElement;    // 희신 (예: "水")
  gisin: FiveElement;     // 기신 (예: "金")
  gusin: FiveElement;     // 구신 (예: "土")
  hansin: FiveElement;    // 한신 (예: "火")
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 4: yinyang — 음양오행
// ═══════════════════════════════════════════════════════════════

export interface ElementCount {
  element: FiveElement;
  count: number;
}

export interface TenGodGroupCount {
  group: TenGodGroup;
  count: number;
}

export interface YinyangData {
  yin: number;              // 음 개수 (예: 8)
  yang: number;             // 양 개수 (예: 0)
  elements: ElementCount[]; // 오행별 개수 (5개)
  dayMaster: string;        // "일간" 표시
  tenGodGroups: TenGodGroupCount[];  // 비겁/식상/재성/관성/인성 (5그룹)
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 5: shinsal — 신살
// ═══════════════════════════════════════════════════════════════

export const SHINSAL_SENTIMENTS = ['positive', 'neutral', 'caution'] as const;
export type ShinsalSentiment = (typeof SHINSAL_SENTIMENTS)[number];

export interface GongmangInfo {
  year: [EarthlyBranch, EarthlyBranch];   // [年] 공망 지지 2개
  day: [EarthlyBranch, EarthlyBranch];    // [日] 공망 지지 2개
}

export interface PillarShinsals {
  gongmangPosition: string | null;        // "[日]공망" 등, 없으면 null
  twelveShinsalByYear: string;            // 년지 기준 12신살
  twelveShinsalByDay: string;             // 일지 기준 12신살
  detailedShinsals: string[];             // 세부신살 (최대 8개, 빈 문자열 제외)
}

export interface ShinsalData {
  gongmang: GongmangInfo;
  cheonEulGwiIn: string;                  // "申子" 등 — 천을귀인 지지
  wolryeong: string;                      // 월령 천간 ("癸" 등)
  pillars: Record<PillarPosition, PillarShinsals>;
  gwimunGwansal: string;                  // 전체 참조 문자열
  wonJinsal: string;                      // 전체 참조 문자열
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 6: hyungchung — 형충회합
// 전체 참조 테이블 (특정 사주의 충돌이 아닌 가능한 모든 조합)
// ═══════════════════════════════════════════════════════════════

export interface HyungchungData {
  cheonganHap: string;      // 천간합 ("甲己(土) 乙庚(金) ...")
  cheonganChung: string;    // 천간충
  cheonganByeongjon: string;  // 천간병존
  jijiSamhap: string;       // 지지삼합
  jijiBanghap: string;      // 지지방합
  jijiYukhap: string;       // 지지육합
  jijiChung: string;        // 지지충
  jijiByeongjon: string;    // 지지병존
  jijiHyung: string;        // 지지형
  jijiPa: string;           // 지지파
  jijiHae: string;          // 지지해
  amhap: string;            // 암합
}

// ═══════════════════════════════════════════════════════════════
// 공통: 운세 항목 (대운/년운/월운 공유)
// ═══════════════════════════════════════════════════════════════

export interface FortuneHiddenStems {
  yeogi: HiddenStemEntry | null;
  junggi: HiddenStemEntry | null;
  bongi: HiddenStemEntry | null;
}

export interface FortuneShinsals {
  byYear: string;            // 신살(년지기준)
  byDay: string;             // 신살(일지기준)
  auxiliary: string[];       // 보조신살 1~6 (빈 문자열 제외)
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 7: daeun — 대운
// ═══════════════════════════════════════════════════════════════

export interface DaeunEntry {
  startAge: number;                 // 대운 시작 나이
  stemTenGod: TenGod;              // 천간십성
  heavenlyStem: HeavenlyStem;      // 천간
  earthlyBranch: EarthlyBranch;    // 지지
  branchTenGod: TenGod;           // 지지십성
  twelveStage: TwelveStage;       // 십이운성 봉법
  twelveStageReverse: TwelveStage; // 십이운성 거법
  hiddenStems: FortuneHiddenStems;
  shinsals: FortuneShinsals;
}

export interface DaeunData {
  entries: DaeunEntry[];   // 10개 대운 (99세 → 9세 순)
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 8: nyunun — 년운
// ═══════════════════════════════════════════════════════════════

export interface NyununEntry {
  year: number;                     // 2025, 2026, ...
  age: string;                     // "34 세", "35 세" 등
  stemTenGod: TenGod;
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  branchTenGod: TenGod;
  twelveStage: TwelveStage;
  twelveStageReverse: TwelveStage;
  hiddenStems: FortuneHiddenStems;
  shinsals: FortuneShinsals;
}

export interface NyununData {
  entries: NyununEntry[];   // 2025~2035 (11개)
}

// ═══════════════════════════════════════════════════════════════
// Parsed Tab 9: wolun — 월운
// ═══════════════════════════════════════════════════════════════

export interface WolunEntry {
  month: number;                    // 1~12
  stemTenGod: TenGod;
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  branchTenGod: TenGod;
  twelveStage: TwelveStage;
  twelveStageReverse: TwelveStage;
  hiddenStems: FortuneHiddenStems;
  shinsals: FortuneShinsals;
}

export interface WolunData {
  year: number;             // 2026 또는 2027
  entries: WolunEntry[];    // 12개월
}

// ═══════════════════════════════════════════════════════════════
// 최상위 타입
// ═══════════════════════════════════════════════════════════════

/** 파싱 완료된 구조화 데이터 — 앱 내부에서 사용 */
export interface SajuData {
  info: InfoData;
  pillar: PillarData;
  yongsin: YongsinData;
  yinyang: YinyangData;
  shinsal?: ShinsalData;
  hyungchung?: HyungchungData;
  daeun?: DaeunData;
  nyunun?: NyununData;
  wolun?: WolunData;
  wolun2?: WolunData;
}
