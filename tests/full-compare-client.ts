import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

const result = calculateSaju({
  name: '의뢰자', gender: '여',
  birthYear: 1982, birthMonth: 2, birthDay: 14,
  birthHour: 12, birthMinute: 0, isLunar: true,
});

fs.writeFileSync('tests/result-client-code.json', JSON.stringify(result, null, 2), 'utf-8');

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

console.log('═══ 사주팔자 기본 ═══');
const ePillar = [['정재','甲','午'],['일간(나)','辛','卯'],['식신','癸','卯'],['상관','壬','戌']];
const pN = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const c = result.pillar.data[i];
  const ok = c[0]===ePillar[i][0] && c[1]===ePillar[i][1] && c[2]===ePillar[i][2];
  console.log(`  ${pN[i]}: ${c[0]} ${c[1]}${c[2]} ${ok?'✅':'❌ 전문가:'+ePillar[i].join(' ')}`);
}
const cY = result.yongsin.data.map(r=>r[0]);
const eY = ['金','土','火','木','水'];
console.log(`  용신: ${JSON.stringify(cY)} ${JSON.stringify(cY)===JSON.stringify(eY)?'✅':'❌ 전문가:'+JSON.stringify(eY)}`);

const expertPillar: Record<string, string[]> = {
  '시주': ['천을귀인','문곡귀인','월덕귀인','현침살','도화살'],
  '일주': ['현침살','도화살','천문성','음착살'],
  '월주': ['현침살','도화살','천문성'],
  '년주': ['양인살','협록','백호살','괴강살','천문성','명예살'],
};
const expertDaeun: Record<string, string[]> = {
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
};
const expertNyunun: Record<string, string[]> = {
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
};
const expertWolun: Record<string, string[]> = {
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
};
const expertWolun2: Record<string, string[]> = {
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
