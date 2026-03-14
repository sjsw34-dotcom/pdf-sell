import type {
  RawSajuJson,
  RawSajuTab,
  RawTabKey,
  SajuData,
  InfoData,
  PillarData,
  Pillar,
  HiddenStemEntry,
  YongsinData,
  YinyangData,
  ElementCount,
  TenGodGroupCount,
  ShinsalData,
  PillarShinsals,
  GongmangInfo,
  HyungchungData,
  DaeunEntry,
  DaeunData,
  NyununEntry,
  NyununData,
  WolunEntry,
  WolunData,
  FortuneHiddenStems,
  FortuneShinsals,
  HeavenlyStem,
  EarthlyBranch,
  TenGod,
  TenGodWithSelf,
  TwelveStage,
  StrengthLevel,
  FiveElement,
  StrengthDetail,
  PillarPosition,
} from '@/lib/types/saju';
import { FIVE_ELEMENTS, TEN_GOD_GROUPS } from '@/lib/types/saju';

// ─── 결과 타입 ───

export interface ParseSuccess {
  ok: true;
  data: SajuData;
}

export interface ParseError {
  ok: false;
  error: string;
}

export type ParseResult = ParseSuccess | ParseError;

// ─── 메인 파싱 함수 ───

export function parseSajuJson(jsonString: string): ParseResult {
  // 1. JSON 파싱
  let raw: unknown;
  try {
    raw = JSON.parse(jsonString);
  } catch {
    return { ok: false, error: 'JSON 파싱 실패: 유효한 JSON 형식이 아닙니다.' };
  }

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'JSON 최상위가 객체가 아닙니다.' };
  }

  const obj = raw as Record<string, unknown>;

  // 2. 필수 탭 검증
  const requiredTabs: RawTabKey[] = ['info', 'pillar', 'yongsin', 'yinyang'];
  for (const tab of requiredTabs) {
    if (!(tab in obj)) {
      return { ok: false, error: `필수 탭 "${tab}"이(가) 없습니다.` };
    }
    const validation = validateTab(obj[tab], tab);
    if (validation) {
      return { ok: false, error: validation };
    }
  }

  const rawJson = obj as unknown as RawSajuJson;

  // 3. 각 탭 파싱
  try {
    const info = parseInfo(rawJson.info);
    const pillar = parsePillar(rawJson.pillar);
    const yongsin = parseYongsin(rawJson.yongsin);
    const yinyang = parseYinyang(rawJson.yinyang);

    const result: SajuData = { info, pillar, yongsin, yinyang };

    if (rawJson.shinsal) {
      result.shinsal = parseShinsal(rawJson.shinsal);
    }
    if (rawJson.hyungchung) {
      result.hyungchung = parseHyungchung(rawJson.hyungchung);
    }
    if (rawJson.daeun) {
      result.daeun = parseDaeun(rawJson.daeun);
    }
    if (rawJson.nyunun) {
      result.nyunun = parseNyunun(rawJson.nyunun);
    }
    if (rawJson.wolun) {
      result.wolun = parseWolun(rawJson.wolun);
    }
    if (rawJson.wolun2) {
      result.wolun2 = parseWolun(rawJson.wolun2);
    }

    return { ok: true, data: result };
  } catch (e) {
    const message = e instanceof Error ? e.message : '알 수 없는 파싱 오류';
    return { ok: false, error: `파싱 중 오류: ${message}` };
  }
}

// ─── 탭 구조 검증 ───

function validateTab(tab: unknown, name: string): string | null {
  if (typeof tab !== 'object' || tab === null) {
    return `"${name}" 탭이 객체가 아닙니다.`;
  }
  const t = tab as Record<string, unknown>;
  if (!Array.isArray(t.data)) {
    return `"${name}" 탭에 data 배열이 없습니다.`;
  }
  if (t.data.length === 0) {
    return `"${name}" 탭의 data가 비어있습니다.`;
  }
  return null;
}

// ─── 헬퍼 ───

function parseHiddenStem(value: string): HiddenStemEntry | null {
  const trimmed = value.trim();
  if (trimmed === '-' || trimmed === '') return null;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return null;
  return {
    stem: parts[0] as HeavenlyStem,
    tenGod: parts[1] as TenGod,
  };
}

function parseFortuneHiddenStems(
  yeogi: string,
  junggi: string,
  bongi: string,
): FortuneHiddenStems {
  return {
    yeogi: parseHiddenStem(yeogi),
    junggi: parseHiddenStem(junggi),
    bongi: parseHiddenStem(bongi),
  };
}

function parseFortuneShinsals(
  byYear: string,
  byDay: string,
  auxiliaries: string[],
): FortuneShinsals {
  return {
    byYear: byYear.trim(),
    byDay: byDay.trim(),
    auxiliary: auxiliaries
      .map((s) => s.trim())
      .filter((s) => s !== '' && s !== '-'),
  };
}

function stripParens(value: string): string {
  return value.replace(/[()（）]/g, '').trim();
}

function safeGet(arr: string[], index: number): string {
  return arr[index] ?? '';
}

// ─── Tab 파서들 ───

function parseInfo(tab: RawSajuTab): InfoData {
  const row0 = tab.data[0] ?? [];
  const row1 = tab.data[1] ?? [];

  // "[女] Valued Guest (35세)" 파싱
  const genderName = safeGet(row1, 0);
  const genderMatch = genderName.match(/\[(男|女)]/);
  const gender = genderMatch?.[1] === '男' ? '남' : '여';

  const nameMatch = genderName.match(/]\s*(.+?)\s*\(/);
  const name = nameMatch?.[1] ?? '';

  const ageMatch = genderName.match(/(\d+)세/);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : 0;

  return {
    genderName,
    gender,
    name,
    age,
    solarDate: safeGet(row1, 1).replace(/^양력\s*:\s*/, ''),
    lunarDate: safeGet(row1, 2).replace(/^음력\s*:\s*/, ''),
    longitudeCorrection: safeGet(row1, 3).replace(/^경도보정\s*:\s*/, ''),
    summerTimeCorrection: safeGet(row1, 4).replace(/^썸머타임보정\s*:\s*/, ''),
    finalCorrection: safeGet(row1, 5).replace(/^최종\s*:\s*/, ''),
    ipchu: safeGet(row1, 6).replace(/^양력\s*:\s*/, ''),
    baengno: safeGet(row1, 7).replace(/^양력\s*:\s*/, ''),
  };
}

function parseSinglePillar(column: string[]): Pillar {
  return {
    stemTenGod: safeGet(column, 0) as TenGodWithSelf,
    heavenlyStem: safeGet(column, 1) as HeavenlyStem,
    earthlyBranch: safeGet(column, 2) as EarthlyBranch,
    branchTenGod: safeGet(column, 3) as TenGod,
    twelveStage: safeGet(column, 4) as TwelveStage,
    twelveStageReverse: stripParens(safeGet(column, 5)) as TwelveStage,
    hiddenStems: {
      yeogi: parseHiddenStem(safeGet(column, 6)),
      junggi: parseHiddenStem(safeGet(column, 7)),
      bongi: parseHiddenStem(safeGet(column, 8)),
    },
    napEumOheng: safeGet(column, 9),
  };
}

function parsePillar(tab: RawSajuTab): PillarData {
  // data[0]=시주, data[1]=일주, data[2]=월주, data[3]=년주
  const hour = tab.data[0] ?? [];
  const day = tab.data[1] ?? [];
  const month = tab.data[2] ?? [];
  const year = tab.data[3] ?? [];

  return {
    hourPillar: parseSinglePillar(hour),
    dayPillar: parseSinglePillar(day),
    monthPillar: parseSinglePillar(month),
    yearPillar: parseSinglePillar(year),
    strength: safeGet(hour, 10) as StrengthLevel,
    strengthDetails: {
      deukji: safeGet(day, 10) as StrengthDetail,
      deukryeong: safeGet(month, 10) as StrengthDetail,
      deukse: safeGet(year, 10) as StrengthDetail,
    },
  };
}

function parseYongsin(tab: RawSajuTab): YongsinData {
  // data: [["木"],["水"],["金"],["土"],["火"]]
  // column_headers 순서: 용신, 희신, 기신, 구신, 한신
  return {
    yongsin: safeGet(tab.data[0] ?? [], 0) as FiveElement,
    huisin: safeGet(tab.data[1] ?? [], 0) as FiveElement,
    gisin: safeGet(tab.data[2] ?? [], 0) as FiveElement,
    gusin: safeGet(tab.data[3] ?? [], 0) as FiveElement,
    hansin: safeGet(tab.data[4] ?? [], 0) as FiveElement,
  };
}

function parseYinyang(tab: RawSajuTab): YinyangData {
  // 단일 row: ["陰 : 8", "陽 : 0", "木 : 1", ..., "일간", "비겁 : 0", ...]
  const row = tab.data[0] ?? [];

  function extractCount(str: string): number {
    const match = str.match(/:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  const elements: ElementCount[] = FIVE_ELEMENTS.map((el, i) => ({
    element: el,
    count: extractCount(safeGet(row, 2 + i)),
  }));

  const tenGodGroups: TenGodGroupCount[] = TEN_GOD_GROUPS.map((group, i) => ({
    group,
    count: extractCount(safeGet(row, 8 + i)),
  }));

  return {
    yin: extractCount(safeGet(row, 0)),
    yang: extractCount(safeGet(row, 1)),
    elements,
    dayMaster: safeGet(row, 7),
    tenGodGroups,
  };
}

function parseShinsal(tab: RawSajuTab): ShinsalData {
  // data[0]=시주, data[1]=일주, data[2]=월주, data[3]=년주
  const hour = tab.data[0] ?? [];
  const day = tab.data[1] ?? [];
  const month = tab.data[2] ?? [];
  const year = tab.data[3] ?? [];

  // 첫 행 시주: "空亡:[年]戌亥 [日]午未 , 天乙貴人:申子, 월령:癸"
  const headerStr = safeGet(hour, 0);

  // 공망 파싱
  const yearGongmang = headerStr.match(/\[年](\S)(\S)/);
  const dayGongmang = headerStr.match(/\[日](\S)(\S)/);
  const gongmang: GongmangInfo = {
    year: [
      (yearGongmang?.[1] ?? '') as EarthlyBranch,
      (yearGongmang?.[2] ?? '') as EarthlyBranch,
    ],
    day: [
      (dayGongmang?.[1] ?? '') as EarthlyBranch,
      (dayGongmang?.[2] ?? '') as EarthlyBranch,
    ],
  };

  // 천을귀인 파싱
  const gwiinMatch = headerStr.match(/天乙貴人[:：]\s*(\S+)/);
  const cheonEulGwiIn = gwiinMatch?.[1] ?? '';

  // 월령 파싱
  const wolryeongMatch = headerStr.match(/월령[:：]\s*(\S+)/);
  const wolryeong = wolryeongMatch?.[1] ?? '';

  function parsePillarShinsals(
    col: string[],
  ): PillarShinsals {
    const gongmangPos = safeGet(col, 1).trim();
    return {
      gongmangPosition: gongmangPos !== '' ? gongmangPos : null,
      twelveShinsalByYear: safeGet(col, 2).trim(),
      twelveShinsalByDay: safeGet(col, 3).trim(),
      detailedShinsals: col
        .slice(4, 12)
        .map((s) => s.trim())
        .filter((s) => s !== '' && s !== '-'),
    };
  }

  const positions: PillarPosition[] = ['hour', 'day', 'month', 'year'];
  const columns = [hour, day, month, year];
  const pillars = {} as Record<PillarPosition, PillarShinsals>;
  positions.forEach((pos, i) => {
    pillars[pos] = parsePillarShinsals(columns[i]);
  });

  return {
    gongmang,
    cheonEulGwiIn,
    wolryeong,
    pillars,
    gwimunGwansal: safeGet(hour, 12).trim(),
    wonJinsal: safeGet(hour, 13).trim(),
  };
}

function parseHyungchung(tab: RawSajuTab): HyungchungData {
  // row 0: 라벨들, row 1: 값들
  const labels = tab.data[0] ?? [];
  const values = tab.data[1] ?? [];

  // 라벨 인덱스 매핑 (실제 JSON 순서 기반)
  // 0:천간합, 1:천간충, 2:"", 3:천간병존, 4:"",
  // 5:지지삼합, 6:지지방합, 7:지지육합, 8:"",
  // 9:지지충, 10:지지병존, 11:"",
  // 12:지지형, 13:"", 14:"",
  // 15:지지파, 16:지지해, 17:암합, 18:""
  return {
    cheonganHap: safeGet(values, 0).trim(),
    cheonganChung: safeGet(values, 1).trim(),
    cheonganByeongjon: safeGet(values, 3).trim(),
    jijiSamhap: safeGet(values, 5).trim(),
    jijiBanghap: safeGet(values, 6).trim(),
    jijiYukhap: safeGet(values, 7).trim(),
    jijiChung: safeGet(values, 9).trim(),
    jijiByeongjon: safeGet(values, 10).trim(),
    jijiHyung: safeGet(values, 12).trim(),
    jijiPa: safeGet(values, 15).trim(),
    jijiHae: safeGet(values, 16).trim(),
    amhap: safeGet(values, 17).trim(),
  };
}

function parseDaeun(tab: RawSajuTab): DaeunData {
  // data: 10개 컬럼 (각 대운 1개), 18개 row
  const entries: DaeunEntry[] = tab.data.map((col) => ({
    startAge: parseInt(safeGet(col, 0), 10),
    stemTenGod: safeGet(col, 1) as TenGod,
    heavenlyStem: safeGet(col, 2) as HeavenlyStem,
    earthlyBranch: safeGet(col, 3) as EarthlyBranch,
    branchTenGod: safeGet(col, 4) as TenGod,
    twelveStage: safeGet(col, 5) as TwelveStage,
    twelveStageReverse: stripParens(safeGet(col, 6)) as TwelveStage,
    hiddenStems: parseFortuneHiddenStems(
      safeGet(col, 7),
      safeGet(col, 8),
      safeGet(col, 9),
    ),
    shinsals: parseFortuneShinsals(
      safeGet(col, 10),
      safeGet(col, 11),
      col.slice(12, 18),
    ),
  }));

  return { entries };
}

function parseNyunun(tab: RawSajuTab): NyununData {
  // data: 11개 컬럼 (각 년운 1개), 19개 row
  const entries: NyununEntry[] = tab.data.map((col) => ({
    year: parseInt(safeGet(col, 0), 10),
    age: safeGet(col, 1),
    stemTenGod: safeGet(col, 2) as TenGod,
    heavenlyStem: safeGet(col, 3) as HeavenlyStem,
    earthlyBranch: safeGet(col, 4) as EarthlyBranch,
    branchTenGod: safeGet(col, 5) as TenGod,
    twelveStage: safeGet(col, 6) as TwelveStage,
    twelveStageReverse: stripParens(safeGet(col, 7)) as TwelveStage,
    hiddenStems: parseFortuneHiddenStems(
      safeGet(col, 8),
      safeGet(col, 9),
      safeGet(col, 10),
    ),
    shinsals: parseFortuneShinsals(
      safeGet(col, 11),
      safeGet(col, 12),
      col.slice(13, 19),
    ),
  }));

  return { entries };
}

function parseWolun(tab: RawSajuTab): WolunData {
  // row_headers[0]에서 연도 추출: "2026년월운(양력)" 또는 "2027년월운(양력)"
  const yearMatch = (tab.row_headers[0] ?? '').match(/(\d{4})년/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;

  // data: 12개 컬럼 (각 월운 1개), 18개 row
  const entries: WolunEntry[] = tab.data.map((col) => {
    const monthStr = safeGet(col, 0);
    const monthMatch = monthStr.match(/(\d+)월/);
    const month = monthMatch ? parseInt(monthMatch[1], 10) : 0;

    return {
      month,
      stemTenGod: safeGet(col, 1) as TenGod,
      heavenlyStem: safeGet(col, 2) as HeavenlyStem,
      earthlyBranch: safeGet(col, 3) as EarthlyBranch,
      branchTenGod: safeGet(col, 4) as TenGod,
      twelveStage: safeGet(col, 5) as TwelveStage,
      twelveStageReverse: stripParens(safeGet(col, 6)) as TwelveStage,
      hiddenStems: parseFortuneHiddenStems(
        safeGet(col, 7),
        safeGet(col, 8),
        safeGet(col, 9),
      ),
      shinsals: parseFortuneShinsals(
        safeGet(col, 10),
        safeGet(col, 11),
        col.slice(12, 18),
      ),
    };
  });

  return { year, entries };
}
