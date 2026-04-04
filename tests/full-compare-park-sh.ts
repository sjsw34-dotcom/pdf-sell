import * as fs from 'fs';
import { calculateSaju } from '../src/lib/saju/calculator';

// 코드에서 직접 생성
const code = calculateSaju({
  name: '박승혁', gender: '남',
  birthYear: 1972, birthMonth: 8, birthDay: 8,
  birthHour: 0, birthMinute: 30,  // 자시 중간값
  isLunar: false,
});

// 전문가 데이터는 파일에서 읽기
const raw = fs.readFileSync('public/test박승혁.txt', 'utf-8');
const parts = raw.split(/^#.*$/m).filter(s => s.trim());
const expert = JSON.parse(parts[1].trim());

let totalMatch = 0, totalMismatch = 0;
const mismatches: string[] = [];

function eq(a: string, b: string) { return a?.trim() === b?.trim(); }

function compareRow(section: string, label: string, codeRow: string[], expertRow: string[]) {
  const maxLen = Math.max(codeRow.length, expertRow.length);
  const diffs: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    const c = (codeRow[i] ?? '').trim();
    const e = (expertRow[i] ?? '').trim();
    if (c !== e) diffs.push(`  [${i}] 코드:"${c}" vs 전문가:"${e}"`);
  }
  if (diffs.length === 0) {
    totalMatch++;
    console.log(`  ${label}: ✅`);
  } else {
    totalMismatch++;
    mismatches.push(`${section}/${label}`);
    console.log(`  ${label}: ❌`);
    diffs.forEach(d => console.log(d));
  }
}

function compareAux(section: string, label: string, codeRow: string[], expertRow: string[], start: number, end: number) {
  const codeAux = codeRow.slice(start, end).filter(s => s && s.trim() && s !== '-');
  const expertAux = expertRow.slice(start, end).filter(s => s && s.trim() && s !== '-');
  const codeSet = new Set(codeAux);
  const expertSet = new Set(expertAux);
  const missing = expertAux.filter(s => !codeSet.has(s));
  const extra = codeAux.filter(s => !expertSet.has(s));
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
    console.log(`    코드:   [${codeAux.join(', ')}]`);
    console.log(`    전문가: [${expertAux.join(', ')}]`);
  }
}

// ═══ 사주팔자 ═══
console.log('\n═══ 사주팔자 ═══\n');
const pillarLabels = ['시주', '일주', '월주', '년주'];
for (let i = 0; i < 4; i++) {
  compareRow('사주팔자', pillarLabels[i], code.pillar.data[i], expert.pillar.data[i]);
}

// ═══ 용신 ═══
console.log('\n═══ 용신 ═══\n');
const yongsinLabels = ['용신', '희신', '기신', '구신', '한신'];
for (let i = 0; i < 5; i++) {
  const c = code.yongsin.data[i]?.[0] ?? '';
  const e = expert.yongsin.data[i]?.[0] ?? '';
  if (eq(c, e)) { totalMatch++; console.log(`  ${yongsinLabels[i]}: ✅ ${c}`); }
  else { totalMismatch++; mismatches.push(`용신/${yongsinLabels[i]}`); console.log(`  ${yongsinLabels[i]}: ❌ 코드:${c} vs 전문가:${e}`); }
}

// ═══ 음양오행 ═══
console.log('\n═══ 음양오행 ═══\n');
compareRow('음양오행', '전체', code.yinyang.data[0], expert.yinyang.data[0]);

// ═══ 신살 ═══
console.log('\n═══ 신살 ═══\n');
const shinsalLabels = ['시주', '일주', '월주', '년주'];
// Row 0: 공망/천을귀인/월령 (첫번째 셀만 비교)
{
  const c0 = (code.shinsal.data[0]?.[0] ?? '').trim();
  const e0 = (expert.shinsal.data[0]?.[0] ?? '').trim();
  if (eq(c0, e0)) { totalMatch++; console.log(`  공망/천을귀인/월령: ✅`); }
  else { totalMismatch++; mismatches.push('신살/공망헤더'); console.log(`  공망/천을귀인/월령: ❌\n  코드:   ${c0}\n  전문가: ${e0}`); }
}
// 각 주별 신살 비교 (십이신살 + 보조신살 세트 비교)
for (let col = 0; col < 4; col++) {
  const codeShinsals: string[] = [];
  const expertShinsals: string[] = [];
  for (let row = 0; row < code.shinsal.data.length; row++) {
    const c = (code.shinsal.data[row]?.[col + 2] ?? '').trim(); // +2: 십이신살년지기준부터
    const e = (expert.shinsal.data[row]?.[col + 2] ?? '').trim();
    if (c) codeShinsals.push(c);
    if (e) expertShinsals.push(e);
  }
  // 세트 비교
  const cSet = new Set(codeShinsals);
  const eSet = new Set(expertShinsals);
  const missing = expertShinsals.filter(s => !cSet.has(s));
  const extra = codeShinsals.filter(s => !eSet.has(s));
  if (missing.length === 0 && extra.length === 0) {
    totalMatch++; console.log(`  ${shinsalLabels[col]} 신살: ✅`);
  } else {
    totalMismatch++; mismatches.push(`신살/${shinsalLabels[col]}`);
    let d = '';
    if (missing.length) d += `누락:[${missing.join(',')}] `;
    if (extra.length) d += `추가:[${extra.join(',')}]`;
    console.log(`  ${shinsalLabels[col]} 신살: ❌ ${d}`);
    console.log(`    코드:   [${codeShinsals.join(', ')}]`);
    console.log(`    전문가: [${expertShinsals.join(', ')}]`);
  }
}

// ═══ 대운 ═══
console.log('\n═══ 대운 ═══\n');
const cDaeun = code.daeun?.data ?? [];
const eDaeun = expert.daeun?.data ?? [];
for (let i = 0; i < Math.max(cDaeun.length, eDaeun.length); i++) {
  const c = cDaeun[i] ?? [];
  const e = eDaeun[i] ?? [];
  const label = `${c[0] ?? e[0]}세 ${c[2] ?? ''}${c[3] ?? ''}`;
  // 기본필드 (나이~지장간본기, 0~9)
  const basicMatch = c.slice(0, 10).every((v: string, j: number) => eq(v, e[j] ?? ''));
  // 십이신살 (10~11)
  const shinsalMatch = eq(c[10] ?? '', e[10] ?? '') && eq(c[11] ?? '', e[11] ?? '');
  // 보조신살 (12~17) 세트 비교
  const cAux = c.slice(12, 18).filter((s: string) => s && s.trim() && s !== '-');
  const eAux = e.slice(12, 18).filter((s: string) => s && s.trim() && s !== '-');
  const auxCSet = new Set(cAux);
  const auxMissing = eAux.filter((s: string) => !auxCSet.has(s));
  const auxESet = new Set(eAux);
  const auxExtra = cAux.filter((s: string) => !auxESet.has(s));
  const auxMatch = auxMissing.length === 0 && auxExtra.length === 0;

  if (basicMatch && shinsalMatch && auxMatch) {
    totalMatch++; console.log(`  ${label}: ✅`);
  } else {
    totalMismatch++; mismatches.push(`대운/${label}`);
    console.log(`  ${label}: ❌`);
    if (!basicMatch) {
      for (let j = 0; j < 10; j++) {
        if (!eq(c[j] ?? '', e[j] ?? '')) console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`);
      }
    }
    if (!shinsalMatch) console.log(`    신살: 코드:[${c[10]},${c[11]}] vs 전문가:[${e[10]},${e[11]}]`);
    if (!auxMatch) {
      let d = '';
      if (auxMissing.length) d += `누락:[${auxMissing.join(',')}] `;
      if (auxExtra.length) d += `추가:[${auxExtra.join(',')}]`;
      console.log(`    보조신살: ${d}`);
      console.log(`      코드:   [${cAux.join(', ')}]`);
      console.log(`      전문가: [${eAux.join(', ')}]`);
    }
  }
}

// ═══ 년운 ═══
console.log('\n═══ 년운 ═══\n');
const cNyunun = code.nyunun?.data ?? [];
const eNyunun = expert.nyunun?.data ?? [];
for (let i = 0; i < Math.max(cNyunun.length, eNyunun.length); i++) {
  const c = cNyunun[i] ?? [];
  const e = eNyunun[i] ?? [];
  const label = `${c[0] ?? e[0]} ${c[3] ?? ''}${c[4] ?? ''}`;
  const basicMatch = c.slice(0, 11).every((v: string, j: number) => eq(v, e[j] ?? ''));
  const shinsalMatch = eq(c[11] ?? '', e[11] ?? '') && eq(c[12] ?? '', e[12] ?? '');
  const cAux = c.slice(13, 19).filter((s: string) => s && s.trim() && s !== '-');
  const eAux = e.slice(13, 19).filter((s: string) => s && s.trim() && s !== '-');
  const auxCSet = new Set(cAux);
  const auxMissing = eAux.filter((s: string) => !auxCSet.has(s));
  const auxESet = new Set(eAux);
  const auxExtra = cAux.filter((s: string) => !auxESet.has(s));
  const auxMatch = auxMissing.length === 0 && auxExtra.length === 0;

  if (basicMatch && shinsalMatch && auxMatch) {
    totalMatch++; console.log(`  ${label}: ✅`);
  } else {
    totalMismatch++; mismatches.push(`년운/${label}`);
    console.log(`  ${label}: ❌`);
    if (!basicMatch) {
      for (let j = 0; j < 11; j++) {
        if (!eq(c[j] ?? '', e[j] ?? '')) console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`);
      }
    }
    if (!shinsalMatch) console.log(`    신살: 코드:[${c[11]},${c[12]}] vs 전문가:[${e[11]},${e[12]}]`);
    if (!auxMatch) {
      let d = '';
      if (auxMissing.length) d += `누락:[${auxMissing.join(',')}] `;
      if (auxExtra.length) d += `추가:[${auxExtra.join(',')}]`;
      console.log(`    보조신살: ${d}`);
      console.log(`      코드:   [${cAux.join(', ')}]`);
      console.log(`      전문가: [${eAux.join(', ')}]`);
    }
  }
}

// ═══ 월운 (2026) ═══
console.log('\n═══ 월운 2026 ═══\n');
const cWolun = code.wolun?.data ?? [];
const eWolun = expert.wolun?.data ?? [];
for (let i = 0; i < Math.max(cWolun.length, eWolun.length); i++) {
  const c = cWolun[i] ?? [];
  const e = eWolun[i] ?? [];
  const label = `${c[0] ?? e[0]} ${c[2] ?? ''}${c[3] ?? ''}`;
  const basicMatch = c.slice(0, 11).every((v: string, j: number) => eq(v, e[j] ?? ''));
  const shinsalMatch = eq(c[11] ?? '', e[11] ?? '') && eq(c[12] ?? '', e[12] ?? '');
  const cAux = c.slice(13, 19).filter((s: string) => s && s.trim() && s !== '-');
  const eAux = e.slice(13, 19).filter((s: string) => s && s.trim() && s !== '-');
  const auxCSet = new Set(cAux);
  const auxMissing = eAux.filter((s: string) => !auxCSet.has(s));
  const auxESet = new Set(eAux);
  const auxExtra = cAux.filter((s: string) => !auxESet.has(s));
  const auxMatch = auxMissing.length === 0 && auxExtra.length === 0;

  if (basicMatch && shinsalMatch && auxMatch) {
    totalMatch++; console.log(`  ${label}: ✅`);
  } else {
    totalMismatch++; mismatches.push(`월운/${label}`);
    console.log(`  ${label}: ❌`);
    if (!basicMatch) {
      for (let j = 0; j < 11; j++) {
        if (!eq(c[j] ?? '', e[j] ?? '')) console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`);
      }
    }
    if (!shinsalMatch) console.log(`    신살: 코드:[${c[11]},${c[12]}] vs 전문가:[${e[11]},${e[12]}]`);
    if (!auxMatch) {
      let d = '';
      if (auxMissing.length) d += `누락:[${auxMissing.join(',')}] `;
      if (auxExtra.length) d += `추가:[${auxExtra.join(',')}]`;
      console.log(`    보조신살: ${d}`);
    }
  }
}

// ═══ 결과 요약 ═══
console.log('\n════════════════════════════════');
console.log(`✅ 일치: ${totalMatch}`);
console.log(`❌ 불일치: ${totalMismatch}`);
if (mismatches.length > 0) {
  console.log(`\n불일치 목록:`);
  mismatches.forEach(m => console.log(`  - ${m}`));
}
const pct = totalMatch + totalMismatch > 0 ? Math.round(totalMatch / (totalMatch + totalMismatch) * 100) : 0;
console.log(`\n일치율: ${pct}%`);
