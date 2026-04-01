import { calculateSaju } from '../src/lib/saju/calculator';

const result = calculateSaju({
  name: '소현태',
  gender: '남',
  birthYear: 1971,
  birthMonth: 1,
  birthDay: 1,
  birthHour: 0,
  birthMinute: 30,
  isLunar: false,
});

// Expert data for comparison
const expertPillarShinsals: Record<string, string[]> = {
  '시주(戊子)': ['복성귀인', '천복귀인', '비인살', '도화살'],
  '일주(丙戌)': ['백호살', '천문성', '명예살'],
  '월주(戊子)': ['복성귀인', '천복귀인', '비인살', '도화살'],
  '년주(庚戌)': ['괴강살', '천문성', '명예살'],
};

const expertDaeunShinsals: Record<string, string[]> = {
  '92 戊戌': ['괴강살', '천문성', '명예살'],
  '82 丁酉': ['천을귀인', '태극귀인', '도화살'],
  '72 丙申': ['암록', '문창귀인', '관귀학관', '낙정관살', '현침살', '역마살'],
  '62 乙未': ['공망', '금여', '백호살', '천문성', '명예살'],
  '52 甲午': ['공망', '양인살', '협록', '현침살', '도화살'],
};

console.log('=== PILLAR SHINSAL COMPARISON ===\n');
const pillarNames = ['시주', '일주', '월주', '년주'];
for (let i = 0; i < 4; i++) {
  const p = result.shinsal!.data[i];
  const stem = result.pillar.data[i][1];
  const branch = result.pillar.data[i][2];
  const key = `${pillarNames[i]}(${stem}${branch})`;
  const codeShinsals = p.slice(4, 12).filter(s => s.trim());
  const expert = expertPillarShinsals[key] || [];

  const missing = expert.filter(s => !codeShinsals.includes(s));
  const extra = codeShinsals.filter(s => !expert.includes(s));

  console.log(`${key}:`);
  console.log(`  코드:   [${codeShinsals.join(', ')}]`);
  console.log(`  전문가: [${expert.join(', ')}]`);
  if (missing.length) console.log(`  누락: ${missing.join(', ')}`);
  if (extra.length) console.log(`  추가: ${extra.join(', ')}`);
  if (!missing.length && !extra.length) console.log(`  ✅ 완전 일치!`);
  console.log();
}

console.log('=== DAEUN SHINSAL COMPARISON ===\n');
for (const row of result.daeun!.data.slice(0, 5)) {
  const key = `${row[0]} ${row[2]}${row[3]}`;
  const codeShinsals = row.slice(12, 18).filter(s => s.trim());
  const expert = expertDaeunShinsals[key] || [];

  const missing = expert.filter(s => !codeShinsals.includes(s));
  const extra = codeShinsals.filter(s => !expert.includes(s));

  console.log(`대운 ${key}:`);
  console.log(`  코드:   [${codeShinsals.join(', ')}]`);
  console.log(`  전문가: [${expert.join(', ')}]`);
  if (missing.length) console.log(`  누락: ${missing.join(', ')}`);
  if (extra.length) console.log(`  추가: ${extra.join(', ')}`);
  if (!missing.length && !extra.length) console.log(`  ✅ 완전 일치!`);
  console.log();
}

// Full daeun comparison
console.log('=== ALL DAEUN ===\n');
for (const row of result.daeun!.data) {
  const aux = row.slice(12, 18).filter(s => s.trim());
  console.log(`${row[0]}세 ${row[2]}${row[3]}: [${aux.join(', ')}]`);
}
