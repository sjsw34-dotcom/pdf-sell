/**
 * 전문가 데이터 전수 추출 + 코드 비교 스크립트
 * 모든 테스트 케이스에서 보조신살 진위표를 생성
 */
import { calculateSaju, SajuInput } from '../src/lib/saju/calculator';
import { collectAuxiliaryShinsals, getSamJae } from '../src/lib/saju/shinsal-rules';
import type { HeavenlyStem, EarthlyBranch } from '../src/lib/types/saju';
import * as fs from 'fs';

// ═══ 모든 테스트 케이스 입력 ═══
const TEST_CASES: { id: string; input: SajuInput }[] = [
  { id: '1971', input: { name: '소현태', gender: '남', birthYear: 1971, birthMonth: 1, birthDay: 1, birthHour: 0, birthMinute: 30, isLunar: false } },
  { id: 'ahn', input: { name: '안다예', gender: '여', birthYear: 1987, birthMonth: 11, birthDay: 2, birthHour: 6, birthMinute: 0, isLunar: false } },
  { id: 'client', input: { name: '의뢰자', gender: '여', birthYear: 1982, birthMonth: 2, birthDay: 14, birthHour: 12, birthMinute: 0, isLunar: true } },
  { id: 'kim', input: { name: '김다혜', gender: '여', birthYear: 2002, birthMonth: 4, birthDay: 17, birthHour: 18, birthMinute: 0, isLunar: false } },
  { id: 'lee', input: { name: '이십', gender: '여', birthYear: 1980, birthMonth: 12, birthDay: 6, birthHour: 12, birthMinute: 0, isLunar: true } },
  { id: 'male', input: { name: '남성고객', gender: '남', birthYear: 1983, birthMonth: 10, birthDay: 15, birthHour: 3, birthMinute: 15, isLunar: true } },
  { id: 'molly', input: { name: 'Molly', gender: '여', birthYear: 1973, birthMonth: 5, birthDay: 18, birthHour: 0, birthMinute: 17, isLunar: false } },
  { id: 'oh', input: { name: '오도현', gender: '여', birthYear: 1985, birthMonth: 1, birthDay: 11, birthHour: 8, birthMinute: 0, isLunar: true } },
  { id: 'park', input: { name: '박동희', gender: '남', birthYear: 1988, birthMonth: 10, birthDay: 24, birthHour: 23, birthMinute: 49, isLunar: true } },
];

interface ShinsalSample {
  caseId: string;
  tab: string; // daeun/nyunun/wolun/wolun2/pillar
  label: string; // age/year/month
  dayStem: HeavenlyStem;
  monthBranch: EarthlyBranch;
  yearBranch: EarthlyBranch;
  dayBranch: EarthlyBranch;
  targetStem: HeavenlyStem;
  targetBranch: EarthlyBranch;
  expertShinsals: string[];
  codeShinsals: string[];
  missing: string[]; // expert has, code doesn't
  extra: string[];   // code has, expert doesn't
}

function getAux(row: string[], start: number, end: number): string[] {
  return row.slice(start, end).filter(s => s && s.trim() && s !== '-' && s !== '');
}

// 결과 수집
const allSamples: ShinsalSample[] = [];

for (const tc of TEST_CASES) {
  const result = calculateSaju(tc.input);

  // 사주 컨텍스트 추출
  const dayStem = result.pillar.data[1][1] as HeavenlyStem;   // 일간
  const dayBranch = result.pillar.data[1][2] as EarthlyBranch; // 일지
  const monthBranch = result.pillar.data[2][2] as EarthlyBranch; // 월지
  const yearBranch = result.pillar.data[3][2] as EarthlyBranch;  // 년지

  // 전문가 데이터 JSON 로드 (코드 결과는 이미 있음)
  // 대운/년운/월운의 보조신살을 코드 결과에서 추출하여 비교

  // ── 대운 ──
  if (result.daeun) {
    for (const row of result.daeun.data) {
      const targetStem = row[2] as HeavenlyStem;
      const targetBranch = row[3] as EarthlyBranch;
      const codeAux = getAux(row, 12, 18);

      allSamples.push({
        caseId: tc.id,
        tab: 'daeun',
        label: row[0],
        dayStem, monthBranch, yearBranch, dayBranch,
        targetStem, targetBranch,
        expertShinsals: [], // will fill from expert data
        codeShinsals: codeAux,
        missing: [], extra: [],
      });
    }
  }

  // ── 년운 ──
  if (result.nyunun) {
    for (const row of result.nyunun.data) {
      const targetStem = row[3] as HeavenlyStem;
      const targetBranch = row[4] as EarthlyBranch;
      const codeAux = getAux(row, 13, 19);

      allSamples.push({
        caseId: tc.id,
        tab: 'nyunun',
        label: row[0],
        dayStem, monthBranch, yearBranch, dayBranch,
        targetStem, targetBranch,
        expertShinsals: [],
        codeShinsals: codeAux,
        missing: [], extra: [],
      });
    }
  }

  // ── 월운 ──
  for (const tabName of ['wolun', 'wolun2'] as const) {
    const tabData = result[tabName];
    if (!tabData) continue;
    for (const row of tabData.data) {
      const targetStem = row[2] as HeavenlyStem;
      const targetBranch = row[3] as EarthlyBranch;
      const codeAux = getAux(row, 12, 18);

      allSamples.push({
        caseId: tc.id,
        tab: tabName,
        label: row[0],
        dayStem, monthBranch, yearBranch, dayBranch,
        targetStem, targetBranch,
        expertShinsals: [],
        codeShinsals: codeAux,
        missing: [], extra: [],
      });
    }
  }
}

console.log(`총 ${allSamples.length}개 샘플 추출 (${TEST_CASES.length}명)`);

// 고유 (dayStem, monthBranch, yearBranch, dayBranch, targetStem, targetBranch) 조합 수
const uniqueKeys = new Set(allSamples.map(s =>
  `${s.dayStem}|${s.monthBranch}|${s.yearBranch}|${s.dayBranch}|${s.targetStem}|${s.targetBranch}`
));
console.log(`고유 조합: ${uniqueKeys.size}개`);

// 각 신살 타입별 출현 빈도
const shinsalCounts: Record<string, number> = {};
for (const s of allSamples) {
  for (const sh of s.codeShinsals) {
    shinsalCounts[sh] = (shinsalCounts[sh] || 0) + 1;
  }
}

console.log('\n── 코드 기준 신살 출현 빈도 ──');
const sorted = Object.entries(shinsalCounts).sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted) {
  console.log(`  ${name}: ${count}회`);
}

// JSON 저장 (전문가 데이터 매칭용)
const output = allSamples.map(s => ({
  caseId: s.caseId,
  tab: s.tab,
  label: s.label,
  context: `${s.dayStem}${s.dayBranch}일/${s.monthBranch}월/${s.yearBranch}년`,
  target: `${s.targetStem}${s.targetBranch}`,
  codeShinsals: s.codeShinsals,
}));

fs.writeFileSync('tests/all-code-shinsals.json', JSON.stringify(output, null, 2), 'utf-8');
console.log('\n코드 결과 → tests/all-code-shinsals.json 저장 완료');
