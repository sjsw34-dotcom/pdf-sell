/**
 * shinsal-truth-table.ts
 *
 * Comprehensive comparison of ALL expert auxiliary shinsal data vs code output.
 * Reads expert data inline from all 11 test files, runs calculateSaju for each,
 * and produces a per-shinsal-type truth table.
 *
 * Usage: npx ts-node --compiler-options '{"module":"CommonJS"}' tests/shinsal-truth-table.ts
 */
import { calculateSaju, SajuInput } from '../src/lib/saju/calculator';
import type { HeavenlyStem, EarthlyBranch } from '../src/lib/types/saju';
import * as fs from 'fs';

// ═══════════════════════════════════════════════════════════════
// Test case inputs
// ═══════════════════════════════════════════════════════════════
const TEST_CASES: { id: string; input: SajuInput }[] = [
  { id: '1971', input: { name: '소현태', gender: '남', birthYear: 1971, birthMonth: 1, birthDay: 1, birthHour: 0, birthMinute: 30, isLunar: false } },
  { id: '1971v2', input: { name: '소현태', gender: '남', birthYear: 1971, birthMonth: 1, birthDay: 1, birthHour: 0, birthMinute: 30, isLunar: false } },
  { id: 'ahn', input: { name: '안다예', gender: '여', birthYear: 1987, birthMonth: 11, birthDay: 2, birthHour: 6, birthMinute: 0, isLunar: false } },
  { id: 'client', input: { name: '의뢰자', gender: '여', birthYear: 1982, birthMonth: 2, birthDay: 14, birthHour: 12, birthMinute: 0, isLunar: true } },
  { id: 'kim', input: { name: '김다혜', gender: '여', birthYear: 2002, birthMonth: 4, birthDay: 17, birthHour: 18, birthMinute: 0, isLunar: false } },
  { id: 'lee', input: { name: '이십', gender: '여', birthYear: 1980, birthMonth: 12, birthDay: 6, birthHour: 12, birthMinute: 0, isLunar: true } },
  { id: 'lee2', input: { name: '이십', gender: '여', birthYear: 1980, birthMonth: 12, birthDay: 6, birthHour: 12, birthMinute: 0, isLunar: true } },
  { id: 'male', input: { name: '남성고객', gender: '남', birthYear: 1983, birthMonth: 10, birthDay: 15, birthHour: 3, birthMinute: 15, isLunar: true } },
  { id: 'molly', input: { name: 'Molly', gender: '여', birthYear: 1973, birthMonth: 5, birthDay: 18, birthHour: 0, birthMinute: 17, isLunar: false } },
  { id: 'oh', input: { name: '오도현', gender: '여', birthYear: 1985, birthMonth: 1, birthDay: 11, birthHour: 8, birthMinute: 0, isLunar: true } },
  { id: 'park', input: { name: '박동희', gender: '남', birthYear: 1988, birthMonth: 10, birthDay: 24, birthHour: 23, birthMinute: 49, isLunar: true } },
];

// ═══════════════════════════════════════════════════════════════
// Expert data: ALL expert auxiliary shinsals from every test file
// ═══════════════════════════════════════════════════════════════

// Helper to extract aux shinsals from a row
function getAux(row: string[], start: number, end: number): string[] {
  return row.slice(start, end).filter(s => s && s.trim() && s !== '-' && s !== '');
}

// ── Format 1 (nested .data arrays): 1971, kim, lee ──

// 1971: Format 1
const expert_1971 = {
  pillar: [
    ['복성귀인','천복귀인','비인살','도화살'],        // 시주 aux (indices 4-11)
    ['백호살','천문성','명예살'],                      // 일주
    ['복성귀인','천복귀인','비인살','도화살'],          // 월주
    ['괴강살','천문성','명예살'],                       // 년주
  ],
  daeun: {
    '92': ['괴강살','천문성','명예살'],
    '82': ['천을귀인','태극귀인','도화살'],
    '72': ['암록','문창귀인','관귀학관','낙정관살','현침살','역마살'],
    '62': ['공망','금여','백호살','천문성','명예살'],
    '52': ['공망','양인살','협록','현침살','도화살'],
    '42': ['천주귀인','건록','원진(日)','천덕귀인','역마살'],
    '32': ['협록','월덕귀인','괴강살','명예살'],
    '22': ['태극귀인','현침살','도화살','천문성'],
    '12': ['학당귀인','홍염살','문곡귀인','역마살'],
    '2':  ['명예살'],
  } as Record<string, string[]>,
  nyunun: {
    '2035': ['태극귀인','현침살','도화살','천문성'],
    '2034': ['학당귀인','홍염살','문곡귀인','현침살','고란살','역마살'],
    '2033': ['백호살','명예살'],
    '2032': ['복성귀인','천복귀인','비인살','월덕귀인','도화살'],
    '2031': ['천을귀인','현침살','고란살','역마살','천문성'],
    '2030': ['날삼재','괴강살','천문성','명예살'],
    '2029': ['천을귀인','태극귀인','눌삼재','도화살'],
    '2028': ['암록','문창귀인','관귀학관','낙정관살','들삼재','현침살'],
    '2027': ['공망','금여','천문성','명예살'],
    '2026': ['공망','양인살','협록','현침살','도화살'],
    '2025': ['천주귀인','건록','원진(日)','천덕귀인','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['복성귀인','천복귀인','비인살','도화살'],
    '11월': ['천을귀인','역마살','천문성'],
    '10월': ['괴강살','천문성','명예살'],
    '9월':  ['천을귀인','태극귀인','도화살'],
    '8월':  ['암록','문창귀인','관귀학관','낙정관살','현침살','역마살'],
    '7월':  ['공망','금여','백호살','천문성','명예살'],
    '6월':  ['공망','양인살','협록','현침살','도화살'],
    '5월':  ['천주귀인','건록','원진(日)','천덕귀인','역마살'],
    '4월':  ['협록','월덕귀인','괴강살','명예살'],
    '3월':  ['태극귀인','현침살','도화살','천문성'],
    '2월':  ['학당귀인','홍염살','문곡귀인','역마살'],
    '1월':  ['명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['복성귀인','천복귀인','비인살','월덕귀인','도화살'],
    '11월': ['천을귀인','현침살','고란살','역마살','천문성'],
    '10월': ['괴강살','천문성','명예살'],
    '9월':  ['천을귀인','태극귀인','도화살'],
    '8월':  ['암록','문창귀인','관귀학관','낙정관살','현침살','고란살'],
    '7월':  ['공망','금여','천문성','명예살'],
    '6월':  ['공망','양인살','협록','현침살','도화살'],
    '5월':  ['천주귀인','건록','원진(日)','천덕귀인','고란살','역마살'],
    '4월':  ['협록','현침살','백호살','명예살'],
    '3월':  ['태극귀인','현침살','도화살','천문성'],
    '2월':  ['학당귀인','홍염살','문곡귀인','월덕귀인','역마살'],
    '1월':  ['현침살','명예살'],
  } as Record<string, string[]>,
};

// 1971v2: same person, same input, but uses Format 2 expert data from full-compare-1971-v2.ts
const expert_1971v2 = expert_1971; // identical expert data

// kim: Format 1, extract aux from row indices 12-17
const expert_kim = {
  pillar: [
    ['도화살'],                                         // 시주
    ['건록','현침살','도화살','천문성'],                  // 일주
    ['양인살','협록','현침살','백호살','명예살'],          // 월주
    ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','천덕귀인','월덕귀인','현침살'], // 년주
  ],
  daeun: {
    '94': ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','현침살'],
    '84': ['백호살','천문성','명예살'],
    '74': ['천을귀인','홍염살','천복귀인','원진(日)','현침살','역마살'],
    '64': ['도화살'],
    '54': ['암록','비인살','괴강살','천문성','명예살'],
    '44': ['역마살','천문성'],
    '34': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '24': ['공망','복성귀인','원진(年)','현침살','명예살'],
    '14': ['협록','천덕귀인','월덕귀인','역마살'],
    '4':  ['건록','현침살','도화살','천문성'],
  } as Record<string, string[]>,
  nyunun: {
    '2034': ['협록','현침살','고란살','역마살'],
    '2033': ['공망','복성귀인','원진(年)','백호살','명예살'],
    '2032': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','천덕귀인'],
    '2031': ['현침살','고란살','역마살','천문성'],
    '2030': ['암록','비인살','날삼재','괴강살','천문성','명예살'],
    '2029': ['눌삼재','도화살'],
    '2028': ['천을귀인','홍염살','천복귀인','들삼재','원진(日)','현침살'],
    '2027': ['천문성','명예살'],
    '2026': ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','현침살'],
    '2025': ['금여','관귀학관','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '11월': ['역마살','천문성'],
    '10월': ['암록','비인살','백호살','천문성','명예살'],
    '9월':  ['도화살'],
    '8월':  ['천을귀인','홍염살','천복귀인','원진(日)','현침살','역마살'],
    '7월':  ['천문성','명예살'],
    '6월':  ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','천덕귀인'],
    '5월':  ['금여','관귀학관','현침살','역마살'],
    '4월':  ['양인살','협록','괴강살','명예살'],
    '3월':  ['건록','현침살','도화살','천문성'],
    '2월':  ['협록','역마살'],
    '1월':  ['공망','복성귀인','원진(年)','백호살','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '11월': ['역마살','천문성'],
    '10월': ['암록','비인살','괴강살','천문성','명예살'],
    '9월':  ['도화살'],
    '8월':  ['천을귀인','홍염살','천복귀인','원진(日)','천덕귀인','월덕귀인'],
    '7월':  ['백호살','천문성','명예살'],
    '6월':  ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','현침살'],
    '5월':  ['금여','관귀학관','역마살'],
    '4월':  ['양인살','협록','괴강살','명예살'],
    '3월':  ['건록','현침살','도화살','천문성'],
    '2월':  ['협록','역마살'],
    '1월':  ['공망','복성귀인','명예살'],
  } as Record<string, string[]>,
};

// lee: Format 1, from full-compare-lee.ts (row data with indices 12-17)
const expert_lee = {
  pillar: [
    ['건록','천덕귀인','월덕귀인','현침살','도화살'],     // 시주
    ['태극귀인','비인살','명예살'],                        // 일주
    ['태극귀인','비인살','명예살'],                        // 월주
    ['천을귀인','금여','천덕귀인','월덕귀인','현침살','역마살'], // 년주
  ],
  daeun: {
    '92': ['문곡귀인','원진(年)','현침살','도화살','천문성'],
    '82': ['홍염살','천덕귀인','월덕귀인','괴강살','명예살'],
    '72': ['협록','낙정관살','현침살','역마살'],
    '62': ['공망','건록','원진(日)','현침살','도화살'],
    '52': ['공망','암록','태극귀인','복성귀인','양인살','협록'],
    '42': ['천을귀인','금여','현침살','역마살'],
    '32': ['문창귀인','천주귀인','학당귀인','도화살'],
    '22': ['태극귀인','백호살','천문성','명예살'],
    '12': ['관귀학관','역마살','천문성'],
    '2':  ['천을귀인','도화살'],
  } as Record<string, string[]>,
  nyunun: {
    '2035': ['문곡귀인','눌삼재','원진(Year)','현침살','도화살','천문성'],
    '2034': ['천복귀인','들삼재','현침살','고란살','역마살'],
    '2033': ['태극귀인','비인살','백호살','명예살'],
    '2032': ['천을귀인','도화살'],
    '2031': ['관귀학관','현침살','고란살','역마살','천문성'],
    '2030': ['태극귀인','천덕귀인','월덕귀인','괴강살','천문성','명예살'],
    '2029': ['문창귀인','천주귀인','학당귀인','도화살'],
    '2028': ['천을귀인','금여','현침살','고란살','역마살'],
    '2027': ['공망','암록','태극귀인','복성귀인','양인살','협록'],
    '2026': ['공망','건록','원진(日)','현침살','도화살'],
    '2025': ['협록','낙정관살','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['천을귀인','천덕귀인','월덕귀인','도화살'],
    '11월': ['관귀학관','역마살','천문성'],
    '10월': ['태극귀인','괴강살','천문성','명예살'],
    '9월':  ['문창귀인','천주귀인','학당귀인','도화살'],
    '8월':  ['천을귀인','금여','현침살','역마살'],
    '7월':  ['공망','암록','태극귀인','복성귀인','양인살','협록'],
    '6월':  ['공망','건록','원진(日)','현침살','도화살'],
    '5월':  ['협록','낙정관살','역마살'],
    '4월':  ['홍염살','괴강살','명예살'],
    '3월':  ['문곡귀인','원진(年)','현침살','도화살','천문성'],
    '2월':  ['천복귀인','천덕귀인','월덕귀인','역마살'],
    '1월':  ['태극귀인','비인살','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['천을귀인','도화살'],
    '11월': ['관귀학관','현침살','고란살','역마살','천문성'],
    '10월': ['태극귀인','천덕귀인','월덕귀인','괴강살','천문성','명예살'],
    '9월':  ['문창귀인','천주귀인','학당귀인','도화살'],
    '8월':  ['천을귀인','금여','현침살','고란살','역마살'],
    '7월':  ['공망','암록','태극귀인','복성귀인','양인살','협록'],
    '6월':  ['공망','건록','원진(日)','현침살','도화살'],
    '5월':  ['협록','낙정관살','고란살','역마살'],
    '4월':  ['홍염살','현침살','백호살','명예살'],
    '3월':  ['문곡귀인','원진(Year)','현침살','도화살','천문성'],
    '2월':  ['천복귀인','역마살'],
    '1월':  ['태극귀인','비인살','현침살','명예살'],
  } as Record<string, string[]>,
};

// lee2: same person as lee, separate expert data from full-compare-lee2.ts
const expert_lee2 = {
  pillar: expert_lee.pillar,
  daeun: expert_lee.daeun,
  nyunun: expert_lee.nyunun,
  wolun: {
    '1월':  ['태극귀인','비인살','명예살'],
    '2월':  ['천복귀인','천덕귀인','월덕귀인','역마살'],
    '3월':  ['문곡귀인','원진(年)','현침살','도화살','천문성'],
    '4월':  ['홍염살','괴강살','명예살'],
    '5월':  ['협록','낙정관살','역마살'],
    '6월':  ['공망','건록','원진(日)','현침살','도화살'],
    '7월':  ['공망','암록','태극귀인','복성귀인','양인살','협록'],
    '8월':  ['천을귀인','금여','현침살','역마살'],
    '9월':  ['문창귀인','천주귀인','학당귀인','도화살'],
    '10월': ['태극귀인','괴강살','천문성','명예살'],
    '11월': ['관귀학관','역마살','천문성'],
    '12월': ['천을귀인','천덕귀인','월덕귀인','도화살'],
  } as Record<string, string[]>,
  wolun2: {
    '1월':  ['태극귀인','비인살','현침살','명예살'],
    '2월':  ['천복귀인','역마살'],
    '3월':  ['문곡귀인','원진(Year)','현침살','도화살','천문성'],
    '4월':  ['홍염살','현침살','백호살','명예살'],
    '5월':  ['협록','낙정관살','고란살','역마살'],
    '6월':  ['공망','건록','원진(日)','현침살','도화살'],
    '7월':  ['공망','암록','태극귀인','복성귀인','양인살','협록'],
    '8월':  ['천을귀인','금여','현침살','고란살','역마살'],
    '9월':  ['문창귀인','천주귀인','학당귀인','도화살'],
    '10월': ['태극귀인','천덕귀인','월덕귀인','괴강살','천문성','명예살'],
    '11월': ['관귀학관','현침살','고란살','역마살','천문성'],
    '12월': ['천을귀인','도화살'],
  } as Record<string, string[]>,
};

// ahn: Format 2
const expert_ahn = {
  pillar: [
    ['건록','현침살','도화살','천문성'],
    ['건록','현침살','도화살','천문성'],
    ['암록','비인살','괴강살','천문성','명예살'],
    ['건록','현침살','도화살','천문성'],
  ],
  daeun: {
    '92': ['천을귀인','홍염살','천복귀인','원진(日)','현침살','역마살'],
    '82': ['천문성','명예살'],
    '72': ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','현침살'],
    '62': ['금여','관귀학관','고란살','역마살'],
    '52': ['양인살','협록','천덕귀인','월덕귀인','명예살'],
    '42': ['건록','현침살','도화살','천문성'],
    '32': ['협록','현침살','고란살','역마살'],
    '22': ['공망','복성귀인','백호살','명예살'],
    '12': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '2':  ['현침살','고란살','역마살','천문성'],
  } as Record<string, string[]>,
  nyunun: {
    '2034': ['협록','현침살','고란살','역마살'],
    '2033': ['공망','복성귀인','백호살','명예살'],
    '2032': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '2031': ['현침살','고란살','역마살','천문성'],
    '2030': ['암록','비인살','괴강살','천문성','명예살'],
    '2029': ['도화살'],
    '2028': ['천을귀인','홍염살','천복귀인','원진(日)','현침살','고란살'],
    '2027': ['날삼재','천문성','명예살'],
    '2026': ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','눌삼재'],
    '2025': ['금여','관귀학관','들삼재','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '11월': ['역마살','천문성'],
    '10월': ['암록','비인살','천덕귀인','월덕귀인','백호살','천문성'],
    '9월':  ['도화살'],
    '8월':  ['천을귀인','홍염살','천복귀인','원진(日)','현침살','역마살'],
    '7월':  ['천문성','명예살'],
    '6월':  ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','현침살'],
    '5월':  ['금여','관귀학관','현침살','역마살'],
    '4월':  ['양인살','협록','괴강살','명예살'],
    '3월':  ['건록','현침살','도화살','천문성'],
    '2월':  ['협록','역마살'],
    '1월':  ['공망','복성귀인','백호살','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['공망','천을귀인','태극귀인','문곡귀인','낙정관살','도화살'],
    '11월': ['역마살','천문성'],
    '10월': ['암록','비인살','괴강살','천문성','명예살'],
    '9월':  ['도화살'],
    '8월':  ['천을귀인','홍염살','천복귀인','원진(日)','천덕귀인','월덕귀인'],
    '7월':  ['백호살','천문성','명예살'],
    '6월':  ['문창귀인','태극귀인','천주귀인','학당귀인','홍염살','현침살'],
    '5월':  ['금여','관귀학관','역마살'],
    '4월':  ['양인살','협록','괴강살','명예살'],
    '3월':  ['건록','현침살','도화살','천문성'],
    '2월':  ['협록','역마살'],
    '1월':  ['공망','복성귀인','명예살'],
  } as Record<string, string[]>,
};

// client: Format 2
const expert_client = {
  pillar: [
    ['천을귀인','문곡귀인','월덕귀인','현침살','도화살'],
    ['현침살','도화살','천문성','음착살'],
    ['현침살','도화살','천문성'],
    ['양인살','협록','백호살','괴강살','천문성','명예살'],
  ],
  daeun: {
    '91': ['복성귀인','천복귀인','원진(年)','역마살'],
    '81': ['공망','천을귀인','문곡귀인','월덕귀인','현침살','도화살'],
    '71': ['공망','백호살','천문성','명예살'],
    '61': ['협록','낙정관살','원진(日)','천덕귀인','현침살','역마살'],
    '51': ['건록','홍염살','도화살'],
    '41': ['양인살','협록','괴강살','천문성','명예살'],
    '31': ['금여','태극귀인','역마살','천문성'],
    '21': ['문창귀인','천주귀인','학당귀인','도화살'],
    '11': ['현침살','명예살'],
    '1':  ['천을귀인','태극귀인','관귀학관','역마살'],
  } as Record<string, string[]>,
  nyunun: {
    '2034': ['천을귀인','태극귀인','관귀학관','월덕귀인','현침살','고란살'],
    '2033': ['백호살','명예살'],
    '2032': ['문창귀인','천주귀인','학당귀인','도화살'],
    '2031': ['금여','태극귀인','현침살','고란살','역마살','천문성'],
    '2030': ['양인살','협록','날삼재','괴강살','천문성','명예살'],
    '2029': ['건록','홍염살','눌삼재','도화살'],
    '2028': ['협록','낙정관살','들삼재','원진(日)','천덕귀인','현침살'],
    '2027': ['공망','천문성','명예살'],
    '2026': ['공망','천을귀인','문곡귀인','현침살','도화살'],
    '2025': ['복성귀인','천복귀인','원진(年)','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['문창귀인','천주귀인','학당귀인','도화살'],
    '11월': ['금여','태극귀인','역마살','천문성'],
    '10월': ['양인살','협록','백호살','천문성','명예살'],
    '9월':  ['건록','홍염살','도화살'],
    '8월':  ['협록','낙정관살','원진(日)','천덕귀인','월덕귀인','현침살'],
    '7월':  ['공망','천문성','명예살'],
    '6월':  ['공망','천을귀인','문곡귀인','현침살','도화살'],
    '5월':  ['복성귀인','천복귀인','원진(年)','현침살','역마살'],
    '4월':  ['비인살','암록','괴강살','명예살'],
    '3월':  ['현침살','도화살','천문성'],
    '2월':  ['천을귀인','태극귀인','관귀학관','역마살'],
    '1월':  ['백호살','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['문창귀인','천주귀인','학당귀인','도화살'],
    '11월': ['금여','태극귀인','역마살','천문성'],
    '10월': ['양인살','협록','괴강살','천문성','명예살'],
    '9월':  ['건록','홍염살','도화살'],
    '8월':  ['협록','낙정관살','원진(日)','천덕귀인','현침살','역마살'],
    '7월':  ['공망','백호살','천문성','명예살'],
    '6월':  ['공망','천을귀인','문곡귀인','월덕귀인','현침살','도화살'],
    '5월':  ['복성귀인','천복귀인','원진(年)','역마살'],
    '4월':  ['비인살','암록','괴강살','명예살'],
    '3월':  ['현침살','도화살','천문성'],
    '2월':  ['천을귀인','태극귀인','관귀학관','역마살'],
    '1월':  ['명예살'],
  } as Record<string, string[]>,
};

// male: Format 2
const expert_male = {
  pillar: [
    ['명예살'],
    ['금여','태극귀인','현침살','고란살','역마살','천문성'],
    ['금여','태극귀인','역마살','천문성'],
    ['금여','태극귀인','역마살','천문성'],
  ],
  daeun: {
    '94': ['백호살','명예살'],
    '84': ['공망','천을귀인','태극귀인','관귀학관','월덕귀인','현침살'],
    '74': ['공망','천덕귀인','현침살','도화살','천문성'],
    '64': ['비인살','암록','원진(日)','명예살'],
    '54': ['복성귀인','천복귀인','고란살','역마살'],
    '44': ['천을귀인','문곡귀인','현침살','도화살'],
    '34': ['천문성','명예살'],
    '24': ['협록','낙정관살','현침살','역마살'],
    '14': ['건록','홍염살','현침살','도화살'],
    '4':  ['양인살','협록','백호살','괴강살','천문성','명예살'],
  } as Record<string, string[]>,
  nyunun: {
    '2034': ['공망','천을귀인','태극귀인','관귀학관','월덕귀인','현침살'],
    '2033': ['백호살','명예살'],
    '2032': ['문창귀인','천주귀인','학당귀인','도화살'],
    '2031': ['금여','태극귀인','현침살','고란살','역마살','천문성'],
    '2030': ['양인살','협록','괴강살','천문성','명예살'],
    '2029': ['건록','홍염살','도화살'],
    '2028': ['협록','낙정관살','현침살','고란살','역마살'],
    '2027': ['날삼재','천문성','명예살'],
    '2026': ['천을귀인','문곡귀인','눌삼재','현침살','도화살'],
    '2025': ['복성귀인','천복귀인','들삼재','천덕귀인','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['문창귀인','천주귀인','학당귀인','도화살'],
    '11월': ['금여','태극귀인','역마살','천문성'],
    '10월': ['양인살','협록','백호살','천문성','명예살'],
    '9월':  ['건록','홍염살','천덕귀인','도화살'],
    '8월':  ['협록','낙정관살','월덕귀인','현침살','역마살'],
    '7월':  ['천문성','명예살'],
    '6월':  ['천을귀인','문곡귀인','현침살','도화살'],
    '5월':  ['복성귀인','천복귀인','현침살','역마살'],
    '4월':  ['비인살','암록','원진(日)','괴강살','명예살'],
    '3월':  ['공망','현침살','도화살','천문성'],
    '2월':  ['공망','천을귀인','태극귀인','관귀학관','역마살'],
    '1월':  ['백호살','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['문창귀인','천주귀인','학당귀인','도화살'],
    '11월': ['금여','태극귀인','역마살','천문성'],
    '10월': ['양인살','협록','괴강살','천문성','명예살'],
    '9월':  ['건록','홍염살','도화살'],
    '8월':  ['협록','낙정관살','현침살','역마살'],
    '7월':  ['천덕귀인','백호살','천문성','명예살'],
    '6월':  ['천을귀인','문곡귀인','월덕귀인','현침살','도화살'],
    '5월':  ['복성귀인','천복귀인','역마살'],
    '4월':  ['비인살','암록','원진(日)','괴강살','명예살'],
    '3월':  ['공망','현침살','도화살','천문성'],
    '2월':  ['공망','천을귀인','태극귀인','관귀학관','역마살'],
    '1월':  ['명예살'],
  } as Record<string, string[]>,
};

// molly: Format 2
const expert_molly = {
  pillar: [
    ['태극귀인','현침살','도화살'],
    ['복성귀인','건록','현침살','고란살','역마살'],
    ['문창귀인','천주귀인','관귀학관','낙정관살','고란살','역마살'],
    ['천을귀인','협록','백호살','명예살'],
  ],
  daeun: {
    '96': ['양인살','협록','현침살','도화살','천문성'],
    '86': ['복성귀인','건록','역마살'],
    '76': ['공망','천을귀인','협록','명예살'],
    '66': ['공망','태극귀인','현침살','도화살'],
    '56': ['암록','학당귀인','문곡귀인','역마살','천문성'],
    '46': ['백호살','괴강살','천문성','명예살'],
    '36': ['비인살','천복귀인','원진(日)','천덕귀인','현침살','도화살'],
    '26': ['홍염살','월덕귀인','현침살','역마살'],
    '16': ['천을귀인','천문성','명예살'],
    '6':  ['태극귀인','홍염살','원진(年)','현침살','도화살'],
  } as Record<string, string[]>,
  nyunun: {
    '2035': ['양인살','협록','현침살','도화살','천문성'],
    '2034': ['복성귀인','건록','현침살','고란살','역마살'],
    '2033': ['공망','천을귀인','협록','날삼재','백호살','명예살'],
    '2032': ['공망','태극귀인','눌삼재','도화살'],
    '2031': ['암록','학당귀인','문곡귀인','들삼재','천덕귀인','현침살'],
    '2030': ['월덕귀인','괴강살','천문성','명예살'],
    '2029': ['비인살','천복귀인','원진(日)','도화살'],
    '2028': ['홍염살','현침살','고란살','역마살'],
    '2027': ['천을귀인','천문성','명예살'],
    '2026': ['태극귀인','홍염살','원진(年)','현침살','도화살'],
    '2025': ['문창귀인','천주귀인','관귀학관','낙정관살','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['공망','태극귀인','월덕귀인','도화살'],
    '11월': ['암록','학당귀인','문곡귀인','역마살','천문성'],
    '10월': ['괴강살','천문성','명예살'],
    '9월':  ['비인살','천복귀인','원진(日)','도화살'],
    '8월':  ['홍염살','현침살','역마살'],
    '7월':  ['천을귀인','백호살','천문성','명예살'],
    '6월':  ['태극귀인','홍염살','원진(年)','현침살','도화살'],
    '5월':  ['문창귀인','천주귀인','관귀학관','낙정관살','역마살'],
    '4월':  ['금여','괴강살','명예살'],
    '3월':  ['양인살','협록','천덕귀인','현침살','도화살','천문성'],
    '2월':  ['복성귀인','건록','월덕귀인','역마살'],
    '1월':  ['공망','천을귀인','협록','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['공망','태극귀인','도화살'],
    '11월': ['암록','학당귀인','문곡귀인','천덕귀인','현침살','고란살'],
    '10월': ['월덕귀인','괴강살','천문성','명예살'],
    '9월':  ['비인살','천복귀인','원진(日)','도화살'],
    '8월':  ['홍염살','현침살','고란살','역마살'],
    '7월':  ['천을귀인','천문성','명예살'],
    '6월':  ['태극귀인','홍염살','원진(年)','현침살','도화살'],
    '5월':  ['문창귀인','천주귀인','관귀학관','낙정관살','고란살','역마살'],
    '4월':  ['금여','현침살','백호살','명예살'],
    '3월':  ['양인살','협록','현침살','도화살','천문성'],
    '2월':  ['복성귀인','건록','역마살'],
    '1월':  ['공망','천을귀인','협록','천덕귀인','현침살','명예살'],
  } as Record<string, string[]>,
};

// oh: Format 2
const expert_oh = {
  pillar: [
    ['괴강살','명예살'],
    ['낙정관살','도화살'],
    ['태극귀인','관귀학관','역마살'],
    ['천을귀인','명예살'],
  ],
  daeun: {
    '91': ['낙정관살','도화살'],
    '81': ['문창귀인','천주귀인','태극귀인','천덕귀인','역마살','천문성'],
    '71': ['금여','홍염살','월덕귀인','백호살','천문성','명예살'],
    '61': ['양인살','협록','도화살'],
    '51': ['건록','홍염살','현침살','역마살'],
    '41': ['천을귀인','협록','원진(日)','천문성','명예살'],
    '31': ['복성귀인','천복귀인','원진(年)','현침살','도화살'],
    '21': ['공망','암록','학당귀인','문곡귀인','현침살','역마살'],
    '11': ['공망','괴강살','명예살'],
    '1':  ['비인살','현침살','도화살','천문성'],
  } as Record<string, string[]>,
  nyunun: {
    '2034': ['태극귀인','관귀학관','현침살','고란살','역마살'],
    '2033': ['천을귀인','날삼재','백호살','명예살'],
    '2032': ['낙정관살','눌삼재','도화살'],
    '2031': ['문창귀인','천주귀인','태극귀인','들삼재','현침살','고란살'],
    '2030': ['금여','홍염살','괴강살','천문성','명예살'],
    '2029': ['양인살','협록','도화살'],
    '2028': ['건록','홍염살','현침살','고란살','역마살'],
    '2027': ['천을귀인','협록','원진(日)','천덕귀인','천문성','명예살'],
    '2026': ['복성귀인','천복귀인','원진(年)','월덕귀인','현침살','도화살'],
    '2025': ['공망','암록','학당귀인','문곡귀인','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['낙정관살','도화살'],
    '11월': ['문창귀인','천주귀인','태극귀인','천덕귀인','역마살','천문성'],
    '10월': ['금여','홍염살','월덕귀인','백호살','천문성','명예살'],
    '9월':  ['양인살','협록','도화살'],
    '8월':  ['건록','홍염살','현침살','역마살'],
    '7월':  ['천을귀인','협록','원진(日)','천문성','명예살'],
    '6월':  ['복성귀인','천복귀인','원진(年)','현침살','도화살'],
    '5월':  ['공망','암록','학당귀인','문곡귀인','현침살','역마살'],
    '4월':  ['공망','괴강살','명예살'],
    '3월':  ['비인살','현침살','도화살','천문성'],
    '2월':  ['태극귀인','관귀학관','역마살'],
    '1월':  ['천을귀인','천덕귀인','백호살','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['낙정관살','도화살'],
    '11월': ['문창귀인','천주귀인','태극귀인','역마살','천문성'],
    '10월': ['금여','홍염살','괴강살','천문성','명예살'],
    '9월':  ['양인살','협록','천덕귀인','도화살'],
    '8월':  ['건록','홍염살','월덕귀인','현침살','역마살'],
    '7월':  ['천을귀인','협록','원진(日)','백호살','천문성','명예살'],
    '6월':  ['복성귀인','천복귀인','원진(年)','현침살','도화살'],
    '5월':  ['공망','암록','학당귀인','문곡귀인','역마살'],
    '4월':  ['공망','괴강살','명예살'],
    '3월':  ['비인살','현침살','도화살','천문성'],
    '2월':  ['태극귀인','관귀학관','역마살'],
    '1월':  ['천을귀인','명예살'],
  } as Record<string, string[]>,
};

// park: Format 2
const expert_park = {
  pillar: [
    ['양인살','홍염살','협록','도화살'],
    ['복성귀인','괴강살','명예살','양차살'],
    ['건록','역마살','천문성'],
    ['복성귀인','백호살','명예살'],
  ],
  daeun: {
    '91': ['도화살'],
    '81': ['태극귀인','학당귀인','관귀학관','문곡귀인','현침살','역마살'],
    '71': ['공망','현침살','천문성','명예살'],
    '61': ['공망','비인살','천복귀인','현침살','도화살'],
    '51': ['천을귀인','태극귀인','역마살'],
    '41': ['복성귀인','백호살','명예살'],
    '31': ['천을귀인','현침살','도화살','천문성'],
    '21': ['문창귀인','천주귀인','암록','역마살'],
    '11': ['금여','천덕귀인','명예살'],
    '1':  ['양인살','홍염살','협록','월덕귀인','현침살','도화살'],
  } as Record<string, string[]>,
  nyunun: {
    '2035': ['천을귀인','눌삼재','천덕귀인','현침살','도화살','천문성'],
    '2034': ['문창귀인','천주귀인','암록','들삼재','월덕귀인','현침살'],
    '2033': ['금여','백호살','명예살'],
    '2032': ['양인살','홍염살','협록','도화살'],
    '2031': ['건록','원진(日)','현침살','고란살','역마살','천문성'],
    '2030': ['협록','낙정관살','괴강살','천문성','명예살'],
    '2029': ['도화살'],
    '2028': ['태극귀인','학당귀인','관귀학관','문곡귀인','현침살','고란살'],
    '2027': ['공망','천문성','명예살'],
    '2026': ['공망','비인살','천복귀인','현침살','도화살'],
    '2025': ['천을귀인','태극귀인','천덕귀인','고란살','역마살'],
  } as Record<string, string[]>,
  wolun: {
    '12월': ['양인살','홍염살','협록','도화살'],
    '11월': ['건록','원진(日)','역마살','천문성'],
    '10월': ['협록','낙정관살','괴강살','천문성','명예살'],
    '9월':  ['도화살'],
    '8월':  ['태극귀인','학당귀인','관귀학관','문곡귀인','현침살','역마살'],
    '7월':  ['공망','천덕귀인','백호살','천문성','명예살'],
    '6월':  ['공망','비인살','천복귀인','월덕귀인','현침살','도화살'],
    '5월':  ['천을귀인','태극귀인','역마살'],
    '4월':  ['복성귀인','괴강살','명예살'],
    '3월':  ['천을귀인','현침살','도화살','천문성'],
    '2월':  ['문창귀인','천주귀인','암록','역마살'],
    '1월':  ['금여','명예살'],
  } as Record<string, string[]>,
  wolun2: {
    '12월': ['양인살','홍염살','협록','도화살'],
    '11월': ['건록','원진(日)','현침살','고란살','역마살','천문성'],
    '10월': ['협록','낙정관살','괴강살','천문성','명예살'],
    '9월':  ['도화살'],
    '8월':  ['태극귀인','학당귀인','관귀학관','문곡귀인','현침살','고란살'],
    '7월':  ['공망','천문성','명예살'],
    '6월':  ['공망','비인살','천복귀인','현침살','도화살'],
    '5월':  ['천을귀인','태극귀인','천덕귀인','고란살','역마살'],
    '4월':  ['복성귀인','월덕귀인','현침살','백호살','명예살'],
    '3월':  ['천을귀인','현침살','도화살','천문성'],
    '2월':  ['문창귀인','천주귀인','암록','역마살'],
    '1월':  ['금여','현침살','명예살'],
  } as Record<string, string[]>,
};

// Map test case IDs to their expert data
const EXPERT_DATA: Record<string, typeof expert_1971> = {
  '1971': expert_1971,
  '1971v2': expert_1971v2,
  'ahn': expert_ahn,
  'client': expert_client,
  'kim': expert_kim,
  'lee': expert_lee,
  'lee2': expert_lee2,
  'male': expert_male,
  'molly': expert_molly,
  'oh': expert_oh,
  'park': expert_park,
};

// ═══════════════════════════════════════════════════════════════
// Comparison engine
// ═══════════════════════════════════════════════════════════════

interface ComparisonRow {
  caseId: string;
  tab: string;         // pillar / daeun / nyunun / wolun / wolun2
  label: string;       // age / year / month / pillar name
  dayStem: string;
  dayBranch: string;
  monthBranch: string;
  yearBranch: string;
  targetStem: string;
  targetBranch: string;
  expertShinsals: string[];
  codeShinsals: string[];
  missing: string[];   // expert has, code doesn't (false negatives)
  extra: string[];     // code has, expert doesn't (false positives)
}

const allRows: ComparisonRow[] = [];

// Samjae shinsals to exclude from comparison (they are not "auxiliary" shinsals in the same sense)
const SAMJAE_NAMES = new Set(['날삼재', '눌삼재', '들삼재']);

for (const tc of TEST_CASES) {
  const result = calculateSaju(tc.input);
  const expert = EXPERT_DATA[tc.id];
  if (!expert) continue;

  // Extract birth chart context
  const dayStem = result.pillar.data[1][1];
  const dayBranch = result.pillar.data[1][2];
  const monthBranch = result.pillar.data[2][2];
  const yearBranch = result.pillar.data[3][2];

  // ── Pillar shinsal ──
  const pillarNames = ['시주', '일주', '월주', '년주'];
  for (let i = 0; i < 4; i++) {
    const codeRow = result.shinsal?.data[i] || [];
    const codeAux = getAux(codeRow, 4, 12);
    const expertAux = expert.pillar[i] || [];
    const targetStem = result.pillar.data[i][1];
    const targetBranch = result.pillar.data[i][2];

    const codeSet = new Set(codeAux);
    const expertSet = new Set(expertAux);
    const missing = expertAux.filter(s => !codeSet.has(s) && !SAMJAE_NAMES.has(s));
    const extra = codeAux.filter(s => !expertSet.has(s) && !SAMJAE_NAMES.has(s));

    allRows.push({
      caseId: tc.id, tab: 'pillar', label: pillarNames[i],
      dayStem, dayBranch, monthBranch, yearBranch,
      targetStem, targetBranch,
      expertShinsals: expertAux.filter(s => !SAMJAE_NAMES.has(s)),
      codeShinsals: codeAux.filter(s => !SAMJAE_NAMES.has(s)),
      missing, extra,
    });
  }

  // ── Daeun ──
  if (result.daeun) {
    for (const row of result.daeun.data) {
      const age = row[0];
      const expertAux = expert.daeun[age];
      if (!expertAux) continue;
      const codeAux = getAux(row, 12, 18);
      const targetStem = row[2];
      const targetBranch = row[3];

      const codeSet = new Set(codeAux);
      const expertSet = new Set(expertAux);
      const filteredExpert = expertAux.filter(s => !SAMJAE_NAMES.has(s));
      const filteredCode = codeAux.filter(s => !SAMJAE_NAMES.has(s));
      const missing = filteredExpert.filter(s => !codeSet.has(s));
      const extra = filteredCode.filter(s => !expertSet.has(s));

      allRows.push({
        caseId: tc.id, tab: 'daeun', label: age,
        dayStem, dayBranch, monthBranch, yearBranch,
        targetStem, targetBranch,
        expertShinsals: filteredExpert,
        codeShinsals: filteredCode,
        missing, extra,
      });
    }
  }

  // ── Nyunun ──
  if (result.nyunun) {
    // Build expert map by ganzi (stem+branch) for cross-year matching
    const expertNyununByGanzi: Record<string, { key: string; shinsals: string[] }> = {};
    for (const [key, val] of Object.entries(expert.nyunun)) {
      // We'll match by year key first, then fall back to ganzi
      expertNyununByGanzi[key] = { key, shinsals: val };
    }

    for (const row of result.nyunun.data) {
      const yearKey = row[0];
      const targetStem = row[3];
      const targetBranch = row[4];

      // Try matching by year key first
      let expertAux = expert.nyunun[yearKey];

      // If not found, try matching by ganzi (stem+branch)
      if (!expertAux) {
        const ganzi = `${targetStem}${targetBranch}`;
        for (const [eKey, eVal] of Object.entries(expert.nyunun)) {
          // Can't easily match ganzi without expert stem/branch, skip
        }
      }

      if (!expertAux) continue;

      const codeAux = getAux(row, 13, 19);
      const codeSet = new Set(codeAux);
      const expertSet = new Set(expertAux);
      const filteredExpert = expertAux.filter(s => !SAMJAE_NAMES.has(s));
      const filteredCode = codeAux.filter(s => !SAMJAE_NAMES.has(s));
      const missing = filteredExpert.filter(s => !codeSet.has(s));
      const extra = filteredCode.filter(s => !expertSet.has(s));

      allRows.push({
        caseId: tc.id, tab: 'nyunun', label: yearKey,
        dayStem, dayBranch, monthBranch, yearBranch,
        targetStem, targetBranch,
        expertShinsals: filteredExpert,
        codeShinsals: filteredCode,
        missing, extra,
      });
    }
  }

  // ── Wolun / Wolun2 ──
  for (const tabName of ['wolun', 'wolun2'] as const) {
    const tabData = (result as any)[tabName];
    if (!tabData) continue;
    const expertTab = expert[tabName] as Record<string, string[]>;
    if (!expertTab) continue;

    for (const row of tabData.data) {
      const monthLabel = row[0];
      const expertAux = expertTab[monthLabel];
      if (!expertAux) continue;
      const codeAux = getAux(row, 12, 18);
      const targetStem = row[2];
      const targetBranch = row[3];

      const codeSet = new Set(codeAux);
      const expertSet = new Set(expertAux);
      const filteredExpert = expertAux.filter(s => !SAMJAE_NAMES.has(s));
      const filteredCode = codeAux.filter(s => !SAMJAE_NAMES.has(s));
      const missing = filteredExpert.filter(s => !codeSet.has(s));
      const extra = filteredCode.filter(s => !expertSet.has(s));

      allRows.push({
        caseId: tc.id, tab: tabName, label: monthLabel,
        dayStem, dayBranch, monthBranch, yearBranch,
        targetStem, targetBranch,
        expertShinsals: filteredExpert,
        codeShinsals: filteredCode,
        missing, extra,
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Analysis: per-shinsal-type truth table
// ═══════════════════════════════════════════════════════════════

interface ShinsalStats {
  name: string;
  totalExpert: number;   // times expert says YES
  totalCode: number;     // times code says YES
  truePositive: number;  // both agree YES
  falsePositive: number; // code YES, expert NO
  falseNegative: number; // expert YES, code NO
  fpDetails: { caseId: string; tab: string; label: string; dayStem: string; dayBranch: string; monthBranch: string; yearBranch: string; targetStem: string; targetBranch: string }[];
  fnDetails: { caseId: string; tab: string; label: string; dayStem: string; dayBranch: string; monthBranch: string; yearBranch: string; targetStem: string; targetBranch: string }[];
}

const shinsalMap: Record<string, ShinsalStats> = {};

function getStats(name: string): ShinsalStats {
  if (!shinsalMap[name]) {
    shinsalMap[name] = { name, totalExpert: 0, totalCode: 0, truePositive: 0, falsePositive: 0, falseNegative: 0, fpDetails: [], fnDetails: [] };
  }
  return shinsalMap[name];
}

// Collect all unique shinsal names
const allShinsalNames = new Set<string>();
for (const row of allRows) {
  for (const s of row.expertShinsals) allShinsalNames.add(s);
  for (const s of row.codeShinsals) allShinsalNames.add(s);
}

// For each row, for each shinsal name, check presence
for (const row of allRows) {
  const expertSet = new Set(row.expertShinsals);
  const codeSet = new Set(row.codeShinsals);

  const allInRow = new Set([...row.expertShinsals, ...row.codeShinsals]);

  for (const s of allInRow) {
    const stats = getStats(s);
    const inExpert = expertSet.has(s);
    const inCode = codeSet.has(s);
    const detail = {
      caseId: row.caseId, tab: row.tab, label: row.label,
      dayStem: row.dayStem, dayBranch: row.dayBranch,
      monthBranch: row.monthBranch, yearBranch: row.yearBranch,
      targetStem: row.targetStem, targetBranch: row.targetBranch,
    };

    if (inExpert) stats.totalExpert++;
    if (inCode) stats.totalCode++;

    if (inExpert && inCode) {
      stats.truePositive++;
    } else if (inCode && !inExpert) {
      stats.falsePositive++;
      stats.fpDetails.push(detail);
    } else if (inExpert && !inCode) {
      stats.falseNegative++;
      stats.fnDetails.push(detail);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Output
// ═══════════════════════════════════════════════════════════════

// Summary stats
let totalRows = allRows.length;
let totalMatch = allRows.filter(r => r.missing.length === 0 && r.extra.length === 0).length;
let totalMismatch = totalRows - totalMatch;

console.log('════════════════════════════════════════════════════════');
console.log('  SHINSAL TRUTH TABLE - Comprehensive Expert vs Code');
console.log('════════════════════════════════════════════════════════');
console.log(`\nTest cases: ${TEST_CASES.length}`);
console.log(`Total comparison rows: ${totalRows}`);
console.log(`Exact match rows: ${totalMatch} (${((totalMatch / totalRows) * 100).toFixed(1)}%)`);
console.log(`Mismatch rows: ${totalMismatch} (${((totalMismatch / totalRows) * 100).toFixed(1)}%)`);

// Per-case summary
console.log('\n── Per-Case Summary ──');
for (const tc of TEST_CASES) {
  const caseRows = allRows.filter(r => r.caseId === tc.id);
  const caseMatch = caseRows.filter(r => r.missing.length === 0 && r.extra.length === 0).length;
  console.log(`  ${tc.id.padEnd(8)}: ${caseMatch}/${caseRows.length} match (${((caseMatch / caseRows.length) * 100).toFixed(1)}%)`);
}

// Per-shinsal-type summary sorted by error count
const sortedShinsals = Object.values(shinsalMap)
  .sort((a, b) => (b.falsePositive + b.falseNegative) - (a.falsePositive + a.falseNegative));

console.log('\n── Per-Shinsal-Type Analysis (sorted by error count) ──');
console.log('  ' + 'Shinsal'.padEnd(16) + 'Expert'.padStart(7) + 'Code'.padStart(7) + '  TP'.padStart(5) + '  FP'.padStart(5) + '  FN'.padStart(5) + '  Prec%'.padStart(7) + '  Rec%'.padStart(7));
console.log('  ' + '-'.repeat(65));

for (const s of sortedShinsals) {
  const precision = s.totalCode > 0 ? ((s.truePositive / s.totalCode) * 100).toFixed(1) : 'N/A';
  const recall = s.totalExpert > 0 ? ((s.truePositive / s.totalExpert) * 100).toFixed(1) : 'N/A';
  console.log(`  ${s.name.padEnd(16)}${String(s.totalExpert).padStart(7)}${String(s.totalCode).padStart(7)}${String(s.truePositive).padStart(5)}${String(s.falsePositive).padStart(5)}${String(s.falseNegative).padStart(5)}${String(precision).padStart(7)}${String(recall).padStart(7)}`);
}

// Detail FP/FN for the worst offenders (top 10)
console.log('\n── Top 10 Worst Shinsals: False Positive Details ──');
for (const s of sortedShinsals.slice(0, 10)) {
  if (s.fpDetails.length === 0) continue;
  console.log(`\n  [${s.name}] ${s.fpDetails.length} false positives (code adds, expert doesn't have):`);
  for (const d of s.fpDetails.slice(0, 5)) {
    console.log(`    case=${d.caseId} tab=${d.tab} label=${d.label} day=${d.dayStem}${d.dayBranch} month=${d.monthBranch} year=${d.yearBranch} target=${d.targetStem}${d.targetBranch}`);
  }
  if (s.fpDetails.length > 5) console.log(`    ... and ${s.fpDetails.length - 5} more`);
}

console.log('\n── Top 10 Worst Shinsals: False Negative Details ──');
for (const s of sortedShinsals.slice(0, 10)) {
  if (s.fnDetails.length === 0) continue;
  console.log(`\n  [${s.name}] ${s.fnDetails.length} false negatives (expert has, code doesn't):`);
  for (const d of s.fnDetails.slice(0, 5)) {
    console.log(`    case=${d.caseId} tab=${d.tab} label=${d.label} day=${d.dayStem}${d.dayBranch} month=${d.monthBranch} year=${d.yearBranch} target=${d.targetStem}${d.targetBranch}`);
  }
  if (s.fnDetails.length > 5) console.log(`    ... and ${s.fnDetails.length - 5} more`);
}

// Per-tab accuracy
console.log('\n── Per-Tab Accuracy ──');
for (const tab of ['pillar', 'daeun', 'nyunun', 'wolun', 'wolun2']) {
  const tabRows = allRows.filter(r => r.tab === tab);
  const tabMatch = tabRows.filter(r => r.missing.length === 0 && r.extra.length === 0).length;
  console.log(`  ${tab.padEnd(10)}: ${tabMatch}/${tabRows.length} (${tabRows.length > 0 ? ((tabMatch / tabRows.length) * 100).toFixed(1) : 'N/A'}%)`);
}

// Write JSON output
const jsonOutput = {
  summary: {
    totalCases: TEST_CASES.length,
    totalRows,
    totalMatch,
    totalMismatch,
    matchRate: ((totalMatch / totalRows) * 100).toFixed(1) + '%',
  },
  perCase: TEST_CASES.map(tc => {
    const caseRows = allRows.filter(r => r.caseId === tc.id);
    const caseMatch = caseRows.filter(r => r.missing.length === 0 && r.extra.length === 0).length;
    return { id: tc.id, total: caseRows.length, match: caseMatch, rate: ((caseMatch / caseRows.length) * 100).toFixed(1) + '%' };
  }),
  perTab: ['pillar', 'daeun', 'nyunun', 'wolun', 'wolun2'].map(tab => {
    const tabRows = allRows.filter(r => r.tab === tab);
    const tabMatch = tabRows.filter(r => r.missing.length === 0 && r.extra.length === 0).length;
    return { tab, total: tabRows.length, match: tabMatch, rate: tabRows.length > 0 ? ((tabMatch / tabRows.length) * 100).toFixed(1) + '%' : 'N/A' };
  }),
  perShinsal: sortedShinsals.map(s => ({
    name: s.name,
    totalExpert: s.totalExpert,
    totalCode: s.totalCode,
    truePositive: s.truePositive,
    falsePositive: s.falsePositive,
    falseNegative: s.falseNegative,
    precision: s.totalCode > 0 ? ((s.truePositive / s.totalCode) * 100).toFixed(1) + '%' : 'N/A',
    recall: s.totalExpert > 0 ? ((s.truePositive / s.totalExpert) * 100).toFixed(1) + '%' : 'N/A',
    fpDetails: s.fpDetails,
    fnDetails: s.fnDetails,
  })),
  allRows: allRows.map(r => ({
    caseId: r.caseId, tab: r.tab, label: r.label,
    context: `${r.dayStem}${r.dayBranch}/${r.monthBranch}/${r.yearBranch}`,
    target: `${r.targetStem}${r.targetBranch}`,
    expert: r.expertShinsals,
    code: r.codeShinsals,
    missing: r.missing,
    extra: r.extra,
  })),
};

fs.writeFileSync('tests/shinsal-truth-table.json', JSON.stringify(jsonOutput, null, 2), 'utf-8');
console.log('\n\nResults saved to tests/shinsal-truth-table.json');
