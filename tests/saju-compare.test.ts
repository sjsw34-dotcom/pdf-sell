/**
 * 사주 계산 정확도 테스트
 * 전문가 분석 데이터와 우리 계산 결과를 비교
 *
 * 실행: npx tsx tests/saju-compare.test.ts
 */

import { calculateSaju, type SajuInput } from '../src/lib/saju/calculator';
import type { RawSajuJson } from '../src/lib/types/saju';

// ═══════════════════════════════════════════════════════════════
// 테스트 케이스 정의
// ═══════════════════════════════════════════════════════════════

interface TestCase {
  name: string;
  input: SajuInput;
  expected: {
    // pillar
    stems: [string, string, string, string];       // 시간, 일간, 월간, 년간
    branches: [string, string, string, string];     // 시지, 일지, 월지, 년지
    stemTenGods: [string, string, string, string];  // 천간십성
    branchTenGods: [string, string, string, string]; // 지지십성
    strength: string;                               // 강약
    strengthDetails: [string, string, string];      // 실지/득지, 실령/득령, 실세/득세

    // yongsin
    yongsin: [string, string, string, string, string]; // 용신, 희신, 기신, 구신, 한신

    // yinyang
    yinCount: number;
    yangCount: number;
    elements: Record<string, number>;  // 木:1, 火:2 etc
    tenGodGroups: Record<string, number>; // 비겁:1, 식상:1 etc

    // daeun ages
    daeunAges: number[];
    daeunGanZhi: string[];  // ["癸亥", "甲子", ...]

    // nyunun (특정 년도 검증)
    nyununChecks: Array<{
      year: number;
      age: string;  // "43 세"
      gan: string;
      zhi: string;
    }>;

    // wolun (특정 월 검증)
    wolunChecks: Array<{
      month: string;
      gan: string;
      zhi: string;
    }>;
  };
}

const TEST_CASES: TestCase[] = [
  {
    name: '박세희 1984.09.19 18:44 양력 여',
    input: {
      name: '박세희',
      gender: '여',
      birthYear: 1984,
      birthMonth: 9,
      birthDay: 19,
      birthHour: 18,
      birthMinute: 44,
      isLunar: false,
    },
    expected: {
      stems: ['丁', '丙', '癸', '甲'],
      branches: ['酉', '辰', '酉', '子'],
      stemTenGods: ['겁재', '일간(나)', '정관', '편인'],
      branchTenGods: ['정재', '식신', '정재', '정관'],
      strength: '극신약',
      strengthDetails: ['실지', '실령', '실세'],

      yongsin: ['火', '木', '水', '金', '土'],

      yinCount: 4,
      yangCount: 4,
      elements: { '木': 1, '火': 2, '土': 1, '金': 2, '水': 2 },
      tenGodGroups: { '비겁': 1, '식상': 1, '재성': 2, '관성': 2, '인성': 1 },

      daeunAges: [94, 84, 74, 64, 54, 44, 34, 24, 14, 4],
      daeunGanZhi: ['癸亥', '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申'],

      nyununChecks: [
        { year: 2026, age: '43 세', gan: '丙', zhi: '午' },
        { year: 2027, age: '44 세', gan: '丁', zhi: '未' },
        { year: 2030, age: '47 세', gan: '庚', zhi: '戌' },
        { year: 2035, age: '52 세', gan: '乙', zhi: '卯' },
      ],

      wolunChecks: [
        { month: '1월', gan: '己', zhi: '丑' },
        { month: '2월', gan: '庚', zhi: '寅' },
        { month: '3월', gan: '辛', zhi: '卯' },
        { month: '6월', gan: '甲', zhi: '午' },
        { month: '9월', gan: '丁', zhi: '酉' },
        { month: '12월', gan: '庚', zhi: '子' },
      ],
    },
  },
  {
    name: 'Molly Anne Simm 1973.05.18 00:17 양력 여 (자정경계 야자시)',
    input: {
      name: 'Molly Anne Simm',
      gender: '여',
      birthYear: 1973,
      birthMonth: 5,
      birthDay: 18,
      birthHour: 0,
      birthMinute: 17,
      isLunar: false,
    },
    expected: {
      stems: ['甲', '甲', '丁', '癸'],
      branches: ['子', '寅', '巳', '丑'],
      stemTenGods: ['비견', '일간(나)', '상관', '정인'],
      branchTenGods: ['정인', '비견', '식신', '정재'],
      strength: '약변강',
      strengthDetails: ['득지', '실령', '득세'],

      yongsin: ['火', '木', '水', '金', '土'],

      yinCount: 4,
      yangCount: 4,
      elements: { '木': 3, '火': 2, '土': 1, '金': 0, '水': 2 },
      tenGodGroups: { '비겁': 2, '식상': 2, '재성': 1, '관성': 0, '인성': 2 },

      daeunAges: [96, 86, 76, 66, 56, 46, 36, 26, 16, 6],
      daeunGanZhi: ['丁卯', '丙寅', '乙丑', '甲子', '癸亥', '壬戌', '辛酉', '庚申', '己未', '戊午'],

      nyununChecks: [
        { year: 2026, age: '54 세', gan: '丙', zhi: '午' },
        { year: 2027, age: '55 세', gan: '丁', zhi: '未' },
        { year: 2029, age: '57 세', gan: '己', zhi: '酉' },
        { year: 2035, age: '63 세', gan: '乙', zhi: '卯' },
      ],

      wolunChecks: [
        { month: '1월', gan: '己', zhi: '丑' },
        { month: '2월', gan: '庚', zhi: '寅' },
        { month: '5월', gan: '癸', zhi: '巳' },
        { month: '6월', gan: '甲', zhi: '午' },
        { month: '9월', gan: '丁', zhi: '酉' },
        { month: '12월', gan: '庚', zhi: '子' },
      ],
    },
  },
  {
    name: '박동희 1988.10.24(음력) 23:49 남 (조자시 + 음력)',
    input: {
      name: '박동희',
      gender: '남',
      birthYear: 1988,
      birthMonth: 10,
      birthDay: 24,
      birthHour: 23,
      birthMinute: 49,
      isLunar: true,
    },
    expected: {
      stems: ['庚', '壬', '癸', '戊'],
      branches: ['子', '辰', '亥', '辰'],
      stemTenGods: ['편인', '일간(나)', '겁재', '편관'],
      branchTenGods: ['겁재', '편관', '비견', '편관'],
      strength: '중신강',
      strengthDetails: ['실지', '득령', '득세'],

      yongsin: ['土', '火', '木', '水', '金'],

      yinCount: 2,
      yangCount: 6,
      elements: { '木': 0, '火': 0, '土': 3, '金': 1, '水': 4 },
      tenGodGroups: { '비겁': 3, '식상': 0, '재성': 0, '관성': 3, '인성': 1 },

      daeunAges: [91, 81, 71, 61, 51, 41, 31, 21, 11, 1],
      daeunGanZhi: ['癸酉', '壬申', '辛未', '庚午', '己巳', '戊辰', '丁卯', '丙寅', '乙丑', '甲子'],

      nyununChecks: [
        { year: 2026, age: '39 세', gan: '丙', zhi: '午' },
        { year: 2027, age: '40 세', gan: '丁', zhi: '未' },
        { year: 2032, age: '45 세', gan: '壬', zhi: '子' },
        { year: 2035, age: '48 세', gan: '乙', zhi: '卯' },
      ],

      wolunChecks: [
        { month: '1월', gan: '己', zhi: '丑' },
        { month: '2월', gan: '庚', zhi: '寅' },
        { month: '5월', gan: '癸', zhi: '巳' },
        { month: '9월', gan: '丁', zhi: '酉' },
        { month: '12월', gan: '庚', zhi: '子' },
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// 테스트 러너
// ═══════════════════════════════════════════════════════════════

let totalTests = 0;
let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(label: string, actual: unknown, expected: unknown) {
  totalTests++;
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passed++;
  } else {
    failed++;
    failures.push(`  ❌ ${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

function runTest(tc: TestCase) {
  console.log(`\n▶ ${tc.name}`);
  const result = calculateSaju(tc.input);

  // ─── Pillar ───
  console.log('  [사주팔자]');
  const pillar = result.pillar.data;

  for (let i = 0; i < 4; i++) {
    const pos = ['시주', '일주', '월주', '년주'][i];
    assert(`${pos} 천간`, pillar[i][1], tc.expected.stems[i]);
    assert(`${pos} 지지`, pillar[i][2], tc.expected.branches[i]);
    assert(`${pos} 천간십성`, pillar[i][0], tc.expected.stemTenGods[i]);
    assert(`${pos} 지지십성`, pillar[i][3], tc.expected.branchTenGods[i]);
  }

  // 강약
  assert('강약', pillar[0][10], tc.expected.strength);
  assert('득지/실지', pillar[1][10], tc.expected.strengthDetails[0]);
  assert('득령/실령', pillar[2][10], tc.expected.strengthDetails[1]);
  assert('득세/실세', pillar[3][10], tc.expected.strengthDetails[2]);

  // ─── Yongsin ───
  console.log('  [용신]');
  const yongsin = result.yongsin.data;
  for (let i = 0; i < 5; i++) {
    const names = ['용신', '희신', '기신', '구신', '한신'];
    assert(names[i], yongsin[i][0], tc.expected.yongsin[i]);
  }

  // ─── Yinyang ───
  console.log('  [음양오행]');
  const yinyang = result.yinyang.data[0];
  const yinMatch = yinyang[0]?.match(/(\d+)/);
  const yangMatch = yinyang[1]?.match(/(\d+)/);
  assert('음', Number(yinMatch?.[1]), tc.expected.yinCount);
  assert('양', Number(yangMatch?.[1]), tc.expected.yangCount);

  for (const [elem, count] of Object.entries(tc.expected.elements)) {
    const cell = yinyang.find(c => c.startsWith(elem));
    const m = cell?.match(/(\d+)/);
    assert(`오행 ${elem}`, Number(m?.[1]), count);
  }
  for (const [group, count] of Object.entries(tc.expected.tenGodGroups)) {
    const cell = yinyang.find(c => c.includes(group));
    const m = cell?.match(/(\d+)/);
    assert(`십신 ${group}`, Number(m?.[1]), count);
  }

  // ─── Daeun ───
  console.log('  [대운]');
  const daeun = result.daeun!.data;
  const daeunAges = daeun.map(row => parseInt(row[0]));
  assert('대운 나이들', daeunAges, tc.expected.daeunAges);

  for (let i = 0; i < daeun.length; i++) {
    const ganZhi = daeun[i][2] + daeun[i][3];
    assert(`대운 ${daeunAges[i]}세 간지`, ganZhi, tc.expected.daeunGanZhi[i]);
  }

  // ─── Nyunun ───
  console.log('  [년운]');
  const nyunun = result.nyunun!.data;
  for (const check of tc.expected.nyununChecks) {
    const row = nyunun.find(r => r[0] === String(check.year));
    if (!row) {
      totalTests += 3;
      failed += 3;
      failures.push(`  ❌ 년운 ${check.year}: 행 없음`);
      continue;
    }
    assert(`년운 ${check.year} 나이`, row[1], check.age);
    assert(`년운 ${check.year} 천간`, row[3], check.gan);
    assert(`년운 ${check.year} 지지`, row[4], check.zhi);
  }

  // ─── Wolun ───
  console.log('  [월운]');
  const wolun = result.wolun!.data;
  for (const check of tc.expected.wolunChecks) {
    const row = wolun.find(r => r[0] === check.month);
    if (!row) {
      totalTests += 2;
      failed += 2;
      failures.push(`  ❌ 월운 ${check.month}: 행 없음`);
      continue;
    }
    assert(`월운 ${check.month} 천간`, row[2], check.gan);
    assert(`월운 ${check.month} 지지`, row[3], check.zhi);
  }
}

// ═══════════════════════════════════════════════════════════════
// 실행
// ═══════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════');
console.log('  사주 계산 정확도 테스트');
console.log('═══════════════════════════════════════');

for (const tc of TEST_CASES) {
  runTest(tc);
}

console.log('\n═══════════════════════════════════════');
console.log(`  결과: ${passed}/${totalTests} 통과 (${failed} 실패)`);
console.log('═══════════════════════════════════════');

if (failures.length > 0) {
  console.log('\n실패 항목:');
  for (const f of failures) {
    console.log(f);
  }
  process.exit(1);
} else {
  console.log('\n✅ 모든 테스트 통과!');
}
