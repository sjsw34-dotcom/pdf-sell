import * as fs from 'fs';
import { calculateSaju } from '../src/lib/saju/calculator';

// 정수정: 1991.10.22 巳時(사시 10:30), 여성, 양력
const code = calculateSaju({
  name: '정수정', gender: '여',
  birthYear: 1991, birthMonth: 10, birthDay: 22,
  birthHour: 10, birthMinute: 30,  // 사시 중간값
  isLunar: false,
});

const raw = fs.readFileSync('public/test정수정.txt', 'utf-8');
const parts = raw.split(/^#.*$/m).filter(s => s.trim());
const expert = JSON.parse(parts[1].trim());

let totalMatch = 0, totalMismatch = 0;
const mismatches: string[] = [];
function eq(a: string, b: string) { return a?.trim() === b?.trim(); }

// 사주팔자
console.log('\n═══ 사주팔자 ═══\n');
for (let i = 0; i < 4; i++) {
  const c = code.pillar.data[i], e = expert.pillar.data[i];
  const labels = ['시주','일주','월주','년주'];
  const match = c.every((v: string, j: number) => eq(v, e[j]??''));
  if (match) { totalMatch++; console.log(`  ${labels[i]}: ✅`); }
  else { totalMismatch++; mismatches.push(`사주팔자/${labels[i]}`); console.log(`  ${labels[i]}: ❌`); c.forEach((v:string,j:number)=>{if(!eq(v,e[j]??''))console.log(`    [${j}] 코드:"${v}" vs 전문가:"${e[j]}"`);}); }
}

// 용신
console.log('\n═══ 용신 ═══\n');
['용신','희신','기신','구신','한신'].forEach((n,i)=>{
  const c=code.yongsin.data[i]?.[0]??'', e=expert.yongsin.data[i]?.[0]??'';
  if(eq(c,e)){totalMatch++;console.log(`  ${n}: ✅ ${c}`);}
  else{totalMismatch++;mismatches.push(`용신/${n}`);console.log(`  ${n}: ❌ 코드:${c} vs 전문가:${e}`);}
});

// 대운
console.log('\n═══ 대운 ═══\n');
const cD=code.daeun?.data??[], eD=expert.daeun?.data??[];
for(let i=0;i<Math.max(cD.length,eD.length);i++){
  const c=cD[i]??[],e=eD[i]??[];
  const label=`${c[0]??e[0]}세 ${c[2]??''}${c[3]??''}`;
  const basicMatch=c.slice(0,10).every((v:string,j:number)=>eq(v,e[j]??''));
  const cAux=c.slice(12,18).filter((s:string)=>s&&s.trim()&&s!=='-');
  const eAux=e.slice(12,18).filter((s:string)=>s&&s.trim()&&s!=='-');
  const auxCSet=new Set(cAux),auxESet=new Set(eAux);
  const auxMissing=eAux.filter((s:string)=>!auxCSet.has(s));
  const auxExtra=cAux.filter((s:string)=>!auxESet.has(s));
  const auxMatch=auxMissing.length===0&&auxExtra.length===0;
  if(basicMatch&&auxMatch){totalMatch++;console.log(`  ${label}: ✅`);}
  else{totalMismatch++;mismatches.push(`대운/${label}`);console.log(`  ${label}: ❌`);
    if(!basicMatch){for(let j=0;j<10;j++)if(!eq(c[j]??'',e[j]??''))console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`);}
    if(!auxMatch){console.log(`    보조신살: 누락:[${auxMissing}] 추가:[${auxExtra}]`);console.log(`      코드:   [${cAux}]`);console.log(`      전문가: [${eAux}]`);}
  }
}

// 년운
console.log('\n═══ 년운 ═══\n');
const cN=code.nyunun?.data??[],eN=expert.nyunun?.data??[];
for(let i=0;i<Math.max(cN.length,eN.length);i++){
  const c=cN[i]??[],e=eN[i]??[];
  const label=`${c[0]??e[0]} ${c[3]??''}${c[4]??''}`;
  const basicMatch=c.slice(0,11).every((v:string,j:number)=>eq(v,e[j]??''));
  const cAux=c.slice(13,19).filter((s:string)=>s&&s.trim()&&s!=='-');
  const eAux=e.slice(13,19).filter((s:string)=>s&&s.trim()&&s!=='-');
  const auxCSet=new Set(cAux),auxESet=new Set(eAux);
  const auxMissing=eAux.filter((s:string)=>!auxCSet.has(s));
  const auxExtra=cAux.filter((s:string)=>!auxESet.has(s));
  const auxMatch=auxMissing.length===0&&auxExtra.length===0;
  if(basicMatch&&auxMatch){totalMatch++;console.log(`  ${label}: ✅`);}
  else{totalMismatch++;mismatches.push(`년운/${label}`);console.log(`  ${label}: ❌`);
    if(!basicMatch){for(let j=0;j<11;j++)if(!eq(c[j]??'',e[j]??''))console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`);}
    if(!auxMatch){console.log(`    보조신살: 누락:[${auxMissing}] 추가:[${auxExtra}]`);console.log(`      코드:   [${cAux}]`);console.log(`      전문가: [${eAux}]`);}
  }
}

// 월운
console.log('\n═══ 월운 ═══\n');
const cW=code.wolun?.data??[],eW=expert.wolun?.data??[];
for(let i=0;i<Math.max(cW.length,eW.length);i++){
  const c=cW[i]??[],e=eW[i]??[];
  const label=`${c[0]??e[0]} ${c[2]??''}${c[3]??''}`;
  const basicMatch=c.slice(0,11).every((v:string,j:number)=>eq(v,e[j]??''));
  const cAux=c.slice(12,18).filter((s:string)=>s&&s.trim()&&s!=='-');
  const eAux=e.slice(12,18).filter((s:string)=>s&&s.trim()&&s!=='-');
  const auxCSet=new Set(cAux),auxESet=new Set(eAux);
  const auxMissing=eAux.filter((s:string)=>!auxCSet.has(s));
  const auxExtra=cAux.filter((s:string)=>!auxESet.has(s));
  const auxMatch=auxMissing.length===0&&auxExtra.length===0;
  if(basicMatch&&auxMatch){totalMatch++;console.log(`  ${label}: ✅`);}
  else{totalMismatch++;mismatches.push(`월운/${label}`);console.log(`  ${label}: ❌`);
    if(!basicMatch){for(let j=0;j<11;j++)if(!eq(c[j]??'',e[j]??''))console.log(`    [${j}] 코드:"${c[j]}" vs 전문가:"${e[j]}"`);}
    if(!auxMatch){console.log(`    보조신살: 누락:[${auxMissing}] 추가:[${auxExtra}]`);console.log(`      코드:   [${cAux}]`);console.log(`      전문가: [${eAux}]`);}
  }
}

console.log('\n════════════════════════════════');
console.log(`✅ 일치: ${totalMatch}`);
console.log(`❌ 불일치: ${totalMismatch}`);
if(mismatches.length){console.log('\n불일치:');mismatches.forEach(m=>console.log(`  - ${m}`));}
const pct=totalMatch+totalMismatch>0?Math.round(totalMatch/(totalMatch+totalMismatch)*100):0;
console.log(`\n일치율: ${pct}%`);
