import { calculateSaju } from '../src/lib/saju/calculator';

const result = calculateSaju({
  name: '박동희', gender: '남',
  birthYear: 1988, birthMonth: 10, birthDay: 24,
  birthHour: 23, birthMinute: 49, isLunar: true,
});

// Save result
import * as fs from 'fs';
fs.writeFileSync('tests/result-park-code.json', JSON.stringify(result, null, 2), 'utf-8');

function getAux(row: string[], start: number, end: number): string[] {
  return row.slice(start, end).filter(s => s && s.trim() && s !== '-');
}

let totalMatch = 0, totalMismatch = 0;
const mismatches: string[] = [];

function compare(section: string, label: string, codeAux: string[], expertAux: string[]) {
  const codeSet = new Set(codeAux);
  const expertSet = new Set(expertAux);
  const missing = expertAux.filter(s => !codeSet.has(s));
  const extra = codeAux.filter(s => !expertSet.has(s));
  const match = missing.length === 0 && extra.length === 0;
  if (match) {
    totalMatch++;
    console.log(`  ${label}: ✅`);
  } else {
    totalMismatch++;
    mismatches.push(`${section}/${label}`);
    let detail = '';
    if (missing.length) detail += `누락:[${missing.join(',')}] `;
    if (extra.length) detail += `추가:[${extra.join(',')}]`;
    console.log(`  ${label}: ❌ ${detail}`);
    console.log(`    코드:   [${codeAux.join(', ')}]`);
    console.log(`    전문가: [${expertAux.join(', ')}]`);
  }
}

// --- Expert data keyed by label ---
const expertPillar: Record<string, string[]> = {
  '시주': ['양인살','홍염살','협록','도화살'],
  '일주': ['복성귀인','괴강살','명예살','양차살'],
  '월주': ['건록','역마살','천문성'],
  '년주': ['복성귀인','백호살','명예살'],
};

const expertDaeun: Record<string, string[]> = {
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
};

const expertNyunun: Record<string, string[]> = {
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
};

const expertWolun: Record<string, string[]> = {
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
};

const expertWolun2: Record<string, string[]> = {
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
};

// First verify core pillar data
console.log('═══ 사주팔자 기본 ═══');
const ePillar = [
  ['식신','庚','子','겁재','제왕','(사)'],
  ['일간(나)','壬','辰','편관','묘','(묘)'],
  ['겁재','癸','亥','비견','건록','(제왕)'],
  ['편관','戊','辰','편관','묘','(관대)'],
];
const pNames = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const c = result.pillar.data[i];
  const e = ePillar[i];
  const match = c[0]===e[0] && c[1]===e[1] && c[2]===e[2] && c[3]===e[3];
  console.log(`  ${pNames[i]}: ${c[1]}${c[2]} ${match ? '✅' : '❌ 전문가:'+e[1]+e[2]}`);
}

// Yongsin
const cYong = result.yongsin.data.map(r => r[0]);
const eYong = ['土','火','木','水','金'];
console.log(`  용신: ${JSON.stringify(cYong)} ${JSON.stringify(cYong)===JSON.stringify(eYong) ? '✅' : '❌ 전문가:'+JSON.stringify(eYong)}`);

// Pillar shinsal
console.log('\n═══ 사주팔자 신살 ═══');
for (let i = 0; i < 4; i++) {
  compare('pillar', pNames[i], getAux(result.shinsal!.data[i], 4, 12), expertPillar[pNames[i]]);
}

// Daeun
console.log('\n═══ 대운 ═══');
for (const row of result.daeun!.data) {
  const key = row[0];
  if (expertDaeun[key]) compare('daeun', `${key}세 ${row[2]}${row[3]}`, getAux(row, 12, 18), expertDaeun[key]);
}

// Nyunun
console.log('\n═══ 년운 ═══');
for (const row of result.nyunun!.data) {
  const key = row[0];
  if (expertNyunun[key]) compare('nyunun', `${key} ${row[3]}${row[4]}`, getAux(row, 13, 19), expertNyunun[key]);
}

// Wolun
console.log('\n═══ 2026 월운 ═══');
for (const row of result.wolun!.data) {
  const key = row[0];
  if (expertWolun[key]) compare('wolun', `${key} ${row[2]}${row[3]}`, getAux(row, 12, 18), expertWolun[key]);
}

// Wolun2
console.log('\n═══ 2027 월운 ═══');
for (const row of result.wolun2!.data) {
  const key = row[0];
  if (expertWolun2[key]) compare('wolun2', `${key} ${row[2]}${row[3]}`, getAux(row, 12, 18), expertWolun2[key]);
}

// Summary
const total = totalMatch + totalMismatch;
console.log(`\n═══════════════════════════════════`);
console.log(`총 ${total}개: ✅ ${totalMatch}개 일치 (${((totalMatch/total)*100).toFixed(1)}%), ❌ ${totalMismatch}개 불일치`);
if (mismatches.length) console.log(`불일치: ${mismatches.join(', ')}`);
