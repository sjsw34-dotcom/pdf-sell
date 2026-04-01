import { calculateSaju } from '../src/lib/saju/calculator';

const result = calculateSaju({
  name: '소현태', gender: '남',
  birthYear: 1971, birthMonth: 1, birthDay: 1,
  birthHour: 0, birthMinute: 30, isLunar: false,
});

// Expert aux shinsals keyed by label
const expertDaeun: Record<string, string[]> = {
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
};

const expertNyunun: Record<string, string[]> = {
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
};

const expertWolun: Record<string, string[]> = {
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
};

const expertWolun2: Record<string, string[]> = {
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
};

const expertPillar: Record<string, string[]> = {
  '시주': ['복성귀인','천복귀인','비인살','도화살'],
  '일주': ['백호살','천문성','명예살'],
  '월주': ['복성귀인','천복귀인','비인살','도화살'],
  '년주': ['괴강살','천문성','명예살'],
};

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

// Pillar
console.log('═══ 사주팔자 신살 ═══');
const pNames = ['시주', '일주', '월주', '년주'];
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
