import * as fs from 'fs';
import { calculateSaju } from '../src/lib/saju/calculator';

// 최인국: 1982.06.05 寅時(인시), 음력 윤달, 남성
const code = calculateSaju({
  name: '최인국', gender: '남',
  birthYear: 1982, birthMonth: 4, birthDay: 14,
  birthHour: 4, birthMinute: 30,
  isLunar: true, isLeapMonth: true,
});

const raw = fs.readFileSync('public/test최인국.txt', 'utf-8');
const parts = raw.split(/^#.*$/m).filter(s => s.trim());
const expert = JSON.parse(parts[1].trim());

let totalMatch = 0, totalMismatch = 0;
const mismatches: string[] = [];

function eq(a: string, b: string) { return a?.trim() === b?.trim(); }

function compareAuxSet(section: string, label: string, codeRow: string[], expertRow: string[], start: number, end: number) {
  const cAux = codeRow.slice(start, end).filter(s => s && s.trim() && s !== '-');
  const eAux = expertRow.slice(start, end).filter(s => s && s.trim() && s !== '-');
  const cSet = new Set(cAux);
  const eSet = new Set(eAux);
  const missing = eAux.filter(s => !cSet.has(s));
  const extra = cAux.filter(s => !eSet.has(s));
  if (missing.length === 0 && extra.length === 0) {
    totalMatch++;
    console.log(`  ${label}: ✅`);
  } else {
    totalMismatch++;
    mismatches.push(`${section}/${label}`);
    let d = '';
    if (missing.length) d += `누락:[${missing.join(',')}] `;
    if (extra.length) d += `추가:[${extra.join(',')}]`;
    console.log(`  ${label}: ❌ ${d}`);
    console.log(`    코드:   [${cAux.join(', ')}]`);
    console.log(`    전문가: [${eAux.join(', ')}]`);
  }
}

// ═══ 사주팔자 ═══
console.log('\n═══ 사주팔자 ═══\n');
const pillarLabels = ['시주', '일주', '월주', '년주'];
for (let i = 0; i < 4; i++) {
  const c = code.pillar.data[i];
  const e = expert.pillar.data[i];
  const match = c.every((v: string, j: number) => eq(v, e[j] ?? ''));
  if (match) { totalMatch++; console.log(`  ${pillarLabels[i]}: ✅`); }
  else {
    totalMismatch++; mismatches.push(`사주팔자/${pillarLabels[i]}`);
    console.log(`  ${pillarLabels[i]}: ❌`);
    c.forEach((v: string, j: number) => { if (!eq(v, e[j] ?? '')) console.log(`    [${j}] 코드:"${v}" vs 전문가:"${e[j]}"`); });
  }
}

// ═══ 용신 ═══
console.log('\n═══ 용신 ═══\n');
['용신','희신','기신','구신','한신'].forEach((name, i) => {
  const c = code.yongsin.data[i]?.[0] ?? '';
  const e = expert.yongsin.data[i]?.[0] ?? '';
  if (eq(c, e)) { totalMatch++; console.log(`  ${name}: ✅ ${c}`); }
  else { totalMismatch++; mismatches.push(`용신/${name}`); console.log(`  ${name}: ❌ 코드:${c} vs 전문가:${e}`); }
});

// ═══ 대운 ═══
console.log('\n═══ 대운 ═══\n');
const cD = code.daeun?.data ?? [];
const eD = expert.daeun?.data ?? [];
for (let i = 0; i < Math.max(cD.length, eD.length); i++) {
  const c = cD[i] ?? []; const e = eD[i] ?? [];
  const label = `${c[0]??e[0]}세 ${c[2]??''}${c[3]??''}`;
  const basicMatch = c.slice(0,10).every((v:string,j:number) => eq(v, e[j]??''));
  const shinsalMatch = eq(c[10]??'',e[10]??'') && eq(c[11]??'',e[11]??'');
  const cAux = c.slice(12,18).filter((s:string) => s&&s.trim()&&s!=='-');
  const eAux = e.slice(12,18).filter((s:string) => s&&s.trim()&&s!=='-');
  const auxCSet = new Set(cAux); const auxESet = new Set(eAux);
  const auxMissing = eAux.filter((s:string) => !auxCSet.has(s));
  const auxExtra = cAux.filter((s:string) => !auxESet.has(s));
  const auxMatch = auxMissing.length===0 && auxExtra.length===0;
  if (basicMatch && shinsalMatch && auxMatch) { totalMatch++; console.log(`  ${label}: ✅`); }
  else {
    totalMismatch++; mismatches.push(`대운/${label}`);
    console.log(`  ${label}: ❌`);
    if (!basicMatch) { for (let j=0;j<10;j++) if (!eq(c[j]??'',e[j]??'')) console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`); }
    if (!shinsalMatch) console.log(`    신살: 코드:[${c[10]},${c[11]}] vs 전문가:[${e[10]},${e[11]}]`);
    if (!auxMatch) { console.log(`    보조신살: 누락:[${auxMissing}] 추가:[${auxExtra}]`); console.log(`      코드:   [${cAux}]`); console.log(`      전문가: [${eAux}]`); }
  }
}

// ═══ 년운 ═══
console.log('\n═══ 년운 ═══\n');
const cN = code.nyunun?.data ?? [];
const eN = expert.nyunun?.data ?? [];
for (let i = 0; i < Math.max(cN.length, eN.length); i++) {
  const c = cN[i] ?? []; const e = eN[i] ?? [];
  const label = `${c[0]??e[0]} ${c[3]??''}${c[4]??''}`;
  const basicMatch = c.slice(0,11).every((v:string,j:number) => eq(v, e[j]??''));
  const shinsalMatch = eq(c[11]??'',e[11]??'') && eq(c[12]??'',e[12]??'');
  const cAux = c.slice(13,19).filter((s:string) => s&&s.trim()&&s!=='-');
  const eAux = e.slice(13,19).filter((s:string) => s&&s.trim()&&s!=='-');
  const auxCSet = new Set(cAux); const auxESet = new Set(eAux);
  const auxMissing = eAux.filter((s:string) => !auxCSet.has(s));
  const auxExtra = cAux.filter((s:string) => !auxESet.has(s));
  const auxMatch = auxMissing.length===0 && auxExtra.length===0;
  if (basicMatch && shinsalMatch && auxMatch) { totalMatch++; console.log(`  ${label}: ✅`); }
  else {
    totalMismatch++; mismatches.push(`년운/${label}`);
    console.log(`  ${label}: ❌`);
    if (!basicMatch) { for (let j=0;j<11;j++) if (!eq(c[j]??'',e[j]??'')) console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`); }
    if (!shinsalMatch) console.log(`    신살: 코드:[${c[11]},${c[12]}] vs 전문가:[${e[11]},${e[12]}]`);
    if (!auxMatch) { console.log(`    보조신살: 누락:[${auxMissing}] 추가:[${auxExtra}]`); console.log(`      코드:   [${cAux}]`); console.log(`      전문가: [${eAux}]`); }
  }
}

// ═══ 월운 ═══
console.log('\n═══ 월운 2026 ═══\n');
const cW = code.wolun?.data ?? [];
const eW = expert.wolun?.data ?? [];
for (let i = 0; i < Math.max(cW.length, eW.length); i++) {
  const c = cW[i] ?? []; const e = eW[i] ?? [];
  const label = `${c[0]??e[0]} ${c[2]??''}${c[3]??''}`;
  const basicMatch = c.slice(0,11).every((v:string,j:number) => eq(v, e[j]??''));
  const shinsalMatch = eq(c[11]??'',e[11]??'') && eq(c[12]??'',e[12]??'');
  const cAux = c.slice(13,19).filter((s:string) => s&&s.trim()&&s!=='-');
  const eAux = e.slice(13,19).filter((s:string) => s&&s.trim()&&s!=='-');
  const auxCSet = new Set(cAux); const auxESet = new Set(eAux);
  const auxMissing = eAux.filter((s:string) => !auxCSet.has(s));
  const auxExtra = cAux.filter((s:string) => !auxESet.has(s));
  const auxMatch = auxMissing.length===0 && auxExtra.length===0;
  if (basicMatch && shinsalMatch && auxMatch) { totalMatch++; console.log(`  ${label}: ✅`); }
  else {
    totalMismatch++; mismatches.push(`월운/${label}`);
    console.log(`  ${label}: ❌`);
    if (!basicMatch) { for (let j=0;j<11;j++) if (!eq(c[j]??'',e[j]??'')) console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`); }
    if (!shinsalMatch) console.log(`    신살: 코드:[${c[11]},${c[12]}] vs 전문가:[${e[11]},${e[12]}]`);
    if (!auxMatch) { console.log(`    보조신살: 누락:[${auxMissing}] 추가:[${auxExtra}]`); console.log(`      코드:   [${cAux}]`); console.log(`      전문가: [${eAux}]`); }
  }
}

// ═══ 결과 ═══
console.log('\n════════════════════════════════');
console.log(`✅ 일치: ${totalMatch}`);
console.log(`❌ 불일치: ${totalMismatch}`);
if (mismatches.length) { console.log('\n불일치 목록:'); mismatches.forEach(m => console.log(`  - ${m}`)); }
const pct = totalMatch+totalMismatch>0 ? Math.round(totalMatch/(totalMatch+totalMismatch)*100) : 0;
console.log(`\n일치율: ${pct}%`);
