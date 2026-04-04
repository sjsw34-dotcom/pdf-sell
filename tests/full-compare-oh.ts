import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

const result = calculateSaju({
  name: '오도현', gender: '여',
  birthYear: 1985, birthMonth: 1, birthDay: 11,
  birthHour: 8, birthMinute: 0, isLunar: true,
});

fs.writeFileSync('tests/result-oh-code.json', JSON.stringify(result, null, 2), 'utf-8');

function getAux(row: string[], s: number, e: number): string[] {
  return row.slice(s, e).filter(x => x && x.trim() && x !== '-');
}
let totalMatch = 0, totalMismatch = 0;
const mismatches: string[] = [];
function compare(sec: string, label: string, code: string[], expert: string[]) {
  const cs = new Set(code), es = new Set(expert);
  const miss = expert.filter(s => !cs.has(s)), extra = code.filter(s => !es.has(s));
  const ok = miss.length === 0 && extra.length === 0;
  if (ok) { totalMatch++; console.log(`  ${label}: ✅`); }
  else {
    totalMismatch++; mismatches.push(`${sec}/${label}`);
    let d = '';
    if (miss.length) d += `누락:[${miss.join(',')}] `;
    if (extra.length) d += `추가:[${extra.join(',')}]`;
    console.log(`  ${label}: ❌ ${d}`);
    console.log(`    코드:   [${code.join(', ')}]`);
    console.log(`    전문가: [${expert.join(', ')}]`);
  }
}

console.log('═══ 사주팔자 기본 ═══');
const eP = [['비견','庚','辰'],['일간(나)','庚','子'],['편인','戊','寅'],['정재','乙','丑']];
const pN = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const c = result.pillar.data[i];
  console.log(`  ${pN[i]}: ${c[0]} ${c[1]}${c[2]} ${c[0]===eP[i][0]&&c[1]===eP[i][1]&&c[2]===eP[i][2]?'✅':'❌ 전문가:'+eP[i].join(' ')}`);
}
const cY = result.yongsin.data.map(r=>r[0]);
const eY = ['金','土','火','木','水'];
console.log(`  용신: ${JSON.stringify(cY)} ${JSON.stringify(cY)===JSON.stringify(eY)?'✅':'❌ 전문가:'+JSON.stringify(eY)}`);

const xP: Record<string, string[]> = {
  '시주': ['괴강살','명예살'],
  '일주': ['낙정관살','도화살'],
  '월주': ['태극귀인','관귀학관','역마살'],
  '년주': ['천을귀인','명예살'],
};
const xD: Record<string, string[]> = {
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
};
const xN: Record<string, string[]> = {
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
};
const xW: Record<string, string[]> = {
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
};
const xW2: Record<string, string[]> = {
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
};

console.log('\n═══ 사주팔자 신살 ═══');
for (let i=0;i<4;i++) compare('pillar',pN[i],getAux(result.shinsal!.data[i],4,12),xP[pN[i]]);

console.log('\n═══ 대운 ═══');
for (const r of result.daeun!.data) { if(xD[r[0]]) compare('daeun',`${r[0]}세 ${r[2]}${r[3]}`,getAux(r,12,18),xD[r[0]]); }

console.log('\n═══ 년운 ═══');
for (const r of result.nyunun!.data) { if(xN[r[0]]) compare('nyunun',`${r[0]} ${r[3]}${r[4]}`,getAux(r,13,19),xN[r[0]]); }

console.log('\n═══ 2025 월운 ═══');
for (const r of result.wolun!.data) { if(xW[r[0]]) compare('wolun',`${r[0]} ${r[2]}${r[3]}`,getAux(r,12,18),xW[r[0]]); }

console.log('\n═══ 2026 월운 ═══');
for (const r of result.wolun2!.data) { if(xW2[r[0]]) compare('wolun2',`${r[0]} ${r[2]}${r[3]}`,getAux(r,12,18),xW2[r[0]]); }

const total = totalMatch+totalMismatch;
console.log(`\n═══════════════════════════════════`);
console.log(`총 ${total}개: ✅ ${totalMatch}개 일치 (${((totalMatch/total)*100).toFixed(1)}%), ❌ ${totalMismatch}개 불일치`);
if(mismatches.length) console.log(`불일치: ${mismatches.join(', ')}`);
