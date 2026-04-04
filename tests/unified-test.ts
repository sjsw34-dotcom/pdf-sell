import * as fs from 'fs';
import { calculateSaju } from '../src/lib/saju/calculator';

// ─── 모든 인물 정의 ───
const people = [
  { name: '이인구', file: 'public/test이인구.txt', gender: '남' as const, y:1983, m:7, d:20, h:21, mi:48, lunar:false, leap:false },
  { name: '박승혁', file: 'public/test박승혁.txt', gender: '남' as const, y:1972, m:8, d:8, h:0, mi:30, lunar:false, leap:false },
  { name: '최인국', file: 'public/test최인국.txt', gender: '남' as const, y:1982, m:4, d:14, h:4, mi:30, lunar:true, leap:true },
  { name: '정수정', file: 'public/test정수정.txt', gender: '여' as const, y:1991, m:10, d:22, h:10, mi:30, lunar:false, leap:false },
  { name: '김미영', file: 'public/test김미영.txt', gender: '여' as const, y:1993, m:3, d:28, h:2, mi:16, lunar:false, leap:false },
  { name: '최영옥', file: 'public/test최영옥.txt', gender: '여' as const, y:1969, m:7, d:28, h:3, mi:9, lunar:false, leap:false },
  { name: '박주미', file: 'public/test박주미.txt', gender: '여' as const, y:1996, m:1, d:2, h:0, mi:18, lunar:false, leap:false },
];

function eq(a: string, b: string) { return a?.trim() === b?.trim(); }

function setMatch(cArr: string[], eArr: string[]) {
  const cSet = new Set(cArr);
  const eSet = new Set(eArr);
  const missing = eArr.filter(s => !cSet.has(s));
  const extra = cArr.filter(s => !eSet.has(s));
  return { missing, extra, match: missing.length === 0 && extra.length === 0 };
}

for (const p of people) {
  // 코드 생성
  const code = calculateSaju({
    name: p.name, gender: p.gender,
    birthYear: p.y, birthMonth: p.m, birthDay: p.d,
    birthHour: p.h, birthMinute: p.mi,
    isLunar: p.lunar, isLeapMonth: p.leap,
  });

  // 전문가 데이터
  let expert: any;
  try {
    const raw = fs.readFileSync(p.file, 'utf-8');
    const parts = raw.split(/^#.*$/m).filter(s => s.trim());
    expert = JSON.parse(parts[1].trim());
  } catch { console.log(`\n❌ ${p.name}: 전문가 데이터 파싱 실패`); continue; }

  let ok = 0, fail = 0;
  const issues: string[] = [];

  // 사주팔자 (4주)
  for (let i = 0; i < 4; i++) {
    const labels = ['시주','일주','월주','년주'];
    const c = code.pillar.data[i], e = expert.pillar.data[i];
    // 천간+지지+십성만 비교 (index 0~3)
    const match = eq(c[0],e[0]) && eq(c[1],e[1]) && eq(c[2],e[2]) && eq(c[3],e[3]);
    if (match) ok++; else { fail++; issues.push(`팔자/${labels[i]}(코드:${c[1]}${c[2]} 전문가:${e[1]}${e[2]})`); }
  }

  // 용신
  const yn = ['용신','희신','기신','구신','한신'];
  for (let i = 0; i < 5; i++) {
    const c = code.yongsin.data[i]?.[0]??'', e = expert.yongsin.data[i]?.[0]??'';
    if (eq(c,e)) ok++; else { fail++; issues.push(`용신/${yn[i]}(${c}→${e})`); }
  }

  // 대운 (나이+간지)
  const cD = code.daeun?.data??[], eD = expert.daeun?.data??[];
  for (let i = 0; i < Math.min(cD.length, eD.length); i++) {
    const c = cD[i], e = eD[i];
    const ageMatch = eq(c[0],e[0]);
    const ganzhiMatch = eq(c[2],e[2]) && eq(c[3],e[3]);
    if (ageMatch && ganzhiMatch) ok++; else { fail++; issues.push(`대운/${c[0]}세(${c[2]}${c[3]}→${e[2]}${e[3]},나이${c[0]}→${e[0]})`); }
  }

  // 년운 (년도+간지)
  const cN = code.nyunun?.data??[], eN = expert.nyunun?.data??[];
  for (let i = 0; i < Math.min(cN.length, eN.length); i++) {
    const c = cN[i], e = eN[i];
    const match = eq(c[0],e[0]) && eq(c[3],e[3]) && eq(c[4],e[4]);
    if (match) ok++; else { fail++; issues.push(`년운/${c[0]}(${c[3]}${c[4]}→${e[3]}${e[4]})`); }
  }

  // 월운 (월+간지)
  const cW = code.wolun?.data??[], eW = expert.wolun?.data??[];
  for (let i = 0; i < Math.min(cW.length, eW.length); i++) {
    const c = cW[i], e = eW[i];
    const match = eq(c[0],e[0]) && eq(c[2],e[2]) && eq(c[3],e[3]);
    if (match) ok++; else { fail++; issues.push(`월운/${c[0]}(${c[2]}${c[3]}→${e[2]}${e[3]})`); }
  }

  const total = ok + fail;
  const pct = total > 0 ? Math.round(ok/total*100) : 0;
  const status = fail === 0 ? '✅' : pct >= 90 ? '🟡' : '❌';
  console.log(`${status} ${p.name}: ${pct}% (${ok}/${total})${fail > 0 ? ' — ' + issues.join(', ') : ''}`);
}
