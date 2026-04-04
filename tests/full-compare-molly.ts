import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

const result = calculateSaju({
  name: 'Molly Anne Simm', gender: '여',
  birthYear: 1973, birthMonth: 5, birthDay: 18,
  birthHour: 0, birthMinute: 17, isLunar: false,
});

fs.writeFileSync('tests/result-molly-code.json', JSON.stringify(result, null, 2), 'utf-8');

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

const expertPillar: Record<string, string[]> = {
  '시주': ['태극귀인','현침살','도화살'],
  '일주': ['복성귀인','건록','현침살','고란살','역마살'],
  '월주': ['문창귀인','천주귀인','관귀학관','낙정관살','고란살','역마살'],
  '년주': ['천을귀인','협록','백호살','명예살'],
};
const expertDaeun: Record<string, string[]> = {
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
};
const expertNyunun: Record<string, string[]> = {
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
};
const expertWolun: Record<string, string[]> = {
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
};
const expertWolun2: Record<string, string[]> = {
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
};

// Pillar basics
console.log('═══ 사주팔자 기본 ═══');
const ePillar = [['비견','甲','子'],['일간(나)','甲','寅'],['상관','丁','巳'],['정인','癸','丑']];
const pN = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const c = result.pillar.data[i];
  const ok = c[1]===ePillar[i][1] && c[2]===ePillar[i][2];
  console.log(`  ${pN[i]}: ${c[1]}${c[2]} ${ok?'✅':'❌ 전문가:'+ePillar[i][1]+ePillar[i][2]}`);
}
const cY = result.yongsin.data.map(r=>r[0]);
console.log(`  용신: ${JSON.stringify(cY)} ${JSON.stringify(cY)===JSON.stringify(['火','木','水','金','土'])?'✅':'❌'}`);

console.log('\n═══ 사주팔자 신살 ═══');
for (let i=0;i<4;i++) compare('pillar',pN[i],getAux(result.shinsal!.data[i],4,12),expertPillar[pN[i]]);

console.log('\n═══ 대운 ═══');
for (const r of result.daeun!.data) { if(expertDaeun[r[0]]) compare('daeun',`${r[0]}세 ${r[2]}${r[3]}`,getAux(r,12,18),expertDaeun[r[0]]); }

console.log('\n═══ 년운 ═══');
for (const r of result.nyunun!.data) { if(expertNyunun[r[0]]) compare('nyunun',`${r[0]} ${r[3]}${r[4]}`,getAux(r,13,19),expertNyunun[r[0]]); }

console.log('\n═══ 2026 월운 ═══');
for (const r of result.wolun!.data) { if(expertWolun[r[0]]) compare('wolun',`${r[0]} ${r[2]}${r[3]}`,getAux(r,12,18),expertWolun[r[0]]); }

console.log('\n═══ 2027 월운 ═══');
for (const r of result.wolun2!.data) { if(expertWolun2[r[0]]) compare('wolun2',`${r[0]} ${r[2]}${r[3]}`,getAux(r,12,18),expertWolun2[r[0]]); }

const total = totalMatch+totalMismatch;
console.log(`\n═══════════════════════════════════`);
console.log(`총 ${total}개: ✅ ${totalMatch}개 일치 (${((totalMatch/total)*100).toFixed(1)}%), ❌ ${totalMismatch}개 불일치`);
if(mismatches.length) console.log(`불일치: ${mismatches.join(', ')}`);
