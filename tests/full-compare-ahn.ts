import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

// 오시 = 5시(卯時, 05:00-07:00)
const result = calculateSaju({
  name: '안다예', gender: '여',
  birthYear: 1987, birthMonth: 11, birthDay: 2,
  birthHour: 6, birthMinute: 0, isLunar: false,
});

fs.writeFileSync('tests/result-ahn-code.json', JSON.stringify(result, null, 2), 'utf-8');

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
  if (match) { totalMatch++; console.log(`  ${label}: ✅`); }
  else {
    totalMismatch++; mismatches.push(`${section}/${label}`);
    let d = '';
    if (missing.length) d += `누락:[${missing.join(',')}] `;
    if (extra.length) d += `추가:[${extra.join(',')}]`;
    console.log(`  ${label}: ❌ ${d}`);
    console.log(`    코드:   [${codeAux.join(', ')}]`);
    console.log(`    전문가: [${expertAux.join(', ')}]`);
  }
}

// Expert pillar check
console.log('═══ 사주팔자 기본 ═══');
const ePillar = [['편재','己','卯'],['일간(나)','乙','卯'],['정관','庚','戌'],['식신','丁','卯']];
const pN = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const c = result.pillar.data[i];
  const ok = c[0]===ePillar[i][0] && c[1]===ePillar[i][1] && c[2]===ePillar[i][2];
  console.log(`  ${pN[i]}: ${c[0]} ${c[1]}${c[2]} ${ok?'✅':'❌ 전문가:'+ePillar[i].join(' ')}`);
}
const cY = result.yongsin.data.map(r=>r[0]);
const eY = ['木','水','金','土','火'];
console.log(`  용신: ${JSON.stringify(cY)} ${JSON.stringify(cY)===JSON.stringify(eY)?'✅':'❌ 전문가:'+JSON.stringify(eY)}`);

// Expert shinsal
const expertPillar: Record<string, string[]> = {
  '시주': ['건록','현침살','도화살','천문성'],
  '일주': ['건록','현침살','도화살','천문성'],
  '월주': ['암록','비인살','괴강살','천문성','명예살'],
  '년주': ['건록','현침살','도화살','천문성'],
};

const expertDaeun: Record<string, string[]> = {
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
};

const expertNyunun: Record<string, string[]> = {
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
};

const expertWolun: Record<string, string[]> = {
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
};

const expertWolun2: Record<string, string[]> = {
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
};

console.log('\n═══ 사주팔자 신살 ═══');
for (let i=0;i<4;i++) compare('pillar',pN[i],getAux(result.shinsal!.data[i],4,12),expertPillar[pN[i]]);

console.log('\n═══ 대운 ═══');
for (const r of result.daeun!.data) { if(expertDaeun[r[0]]) compare('daeun',`${r[0]}세 ${r[2]}${r[3]}`,getAux(r,12,18),expertDaeun[r[0]]); }

console.log('\n═══ 년운 ═══');
for (const r of result.nyunun!.data) { if(expertNyunun[r[0]]) compare('nyunun',`${r[0]} ${r[3]}${r[4]}`,getAux(r,13,19),expertNyunun[r[0]]); }

console.log('\n═══ 2025 월운 ═══');
for (const r of result.wolun!.data) { if(expertWolun[r[0]]) compare('wolun',`${r[0]} ${r[2]}${r[3]}`,getAux(r,12,18),expertWolun[r[0]]); }

console.log('\n═══ 2026 월운 ═══');
for (const r of result.wolun2!.data) { if(expertWolun2[r[0]]) compare('wolun2',`${r[0]} ${r[2]}${r[3]}`,getAux(r,12,18),expertWolun2[r[0]]); }

const total = totalMatch+totalMismatch;
console.log(`\n═══════════════════════════════════`);
console.log(`총 ${total}개: ✅ ${totalMatch}개 일치 (${((totalMatch/total)*100).toFixed(1)}%), ❌ ${totalMismatch}개 불일치`);
if(mismatches.length) console.log(`불일치: ${mismatches.join(', ')}`);
