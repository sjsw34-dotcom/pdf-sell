import * as fs from 'fs';
import { calculateSaju } from '../src/lib/saju/calculator';

const raw = fs.readFileSync('public/test이철규.txt', 'utf-8');
const parts = raw.split(/^#.*$/m).filter(s => s.trim());
const expert = JSON.parse(parts[1].trim());

// 전문가 info에서 추출: 1997.10.09 亥時(22:30) 양력 남
const code = calculateSaju({
  name: '이철규', gender: '남',
  birthYear: 1997, birthMonth: 10, birthDay: 9,
  birthHour: 22, birthMinute: 30,
  isLunar: false,
});

function eq(a: string, b: string) { return a?.trim() === b?.trim(); }

let ok = 0, fail = 0;
const issues: string[] = [];

// 사주팔자
for (let i = 0; i < 4; i++) {
  const labels = ['시주','일주','월주','년주'];
  const c = code.pillar.data[i], e = expert.pillar.data[i];
  const match = eq(c[0],e[0]) && eq(c[1],e[1]) && eq(c[2],e[2]) && eq(c[3],e[3]);
  if (match) ok++; else { fail++; issues.push(`팔자/${labels[i]}(코드:${c[1]}${c[2]} 전문가:${e[1]}${e[2]})`); }
}

// 용신
['용신','희신','기신','구신','한신'].forEach((n,i)=>{
  const c=code.yongsin.data[i]?.[0]??'', e=expert.yongsin.data[i]?.[0]??'';
  if(eq(c,e)) ok++; else { fail++; issues.push(`용신/${n}(${c}→${e})`); }
});

// 대운
const cD=code.daeun?.data??[], eD=expert.daeun?.data??[];
for(let i=0;i<Math.min(cD.length,eD.length);i++){
  const c=cD[i],e=eD[i];
  const ageMatch=eq(c[0],e[0]), ganzhiMatch=eq(c[2],e[2])&&eq(c[3],e[3]);
  if(ageMatch&&ganzhiMatch) ok++; else { fail++; issues.push(`대운/${c[0]}세(${c[2]}${c[3]}→${e[2]}${e[3]},나이${c[0]}→${e[0]})`); }
}

// 년운
const cN=code.nyunun?.data??[], eN=expert.nyunun?.data??[];
for(let i=0;i<Math.min(cN.length,eN.length);i++){
  const c=cN[i],e=eN[i];
  if(eq(c[0],e[0])&&eq(c[3],e[3])&&eq(c[4],e[4])) ok++; else { fail++; issues.push(`년운/${c[0]}(${c[3]}${c[4]}→${e[3]}${e[4]})`); }
}

// 월운
const cW=code.wolun?.data??[], eW=expert.wolun?.data??[];
for(let i=0;i<Math.min(cW.length,eW.length);i++){
  const c=cW[i],e=eW[i];
  if(eq(c[0],e[0])&&eq(c[2],e[2])&&eq(c[3],e[3])) ok++; else { fail++; issues.push(`월운/${c[0]}(${c[2]}${c[3]}→${e[2]}${e[3]})`); }
}

const total=ok+fail;
const pct=total>0?Math.round(ok/total*100):0;
const status=fail===0?'✅':pct>=90?'🟡':'❌';
console.log(`${status} 이철규: ${pct}% (${ok}/${total})${fail>0?' — '+issues.join(', '):''}`);

