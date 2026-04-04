import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

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

// Save code result
fs.writeFileSync('tests/result-1971-code.json', JSON.stringify(result, null, 2), 'utf-8');

// Expert data inline
const expert = {
  pillar: {
    data: [
      ["식신","戊","子","정관","태","(태)","壬 편관","-","癸 정관","벽력화","극신약"],
      ["일간(나)","丙","戌","식신","묘","(묘)","辛 정재","丁 겁재","戊 식신","옥상토","실지"],
      ["식신","戊","子","정관","태","(태)","壬 편관","-","癸 정관","벽력화","실령"],
      ["편재","庚","戌","식신","묘","(쇠)","辛 정재","丁 겁재","戊 식신","차천금","실세"]
    ]
  },
  shinsal: {
    data: [
      ["空亡:[年]寅卯 [日]午未 , 天乙貴人:酉亥, 월령:癸","","재살","재살","복성귀인","천복귀인","비인살","도화살","","","","","辰亥 子酉 未寅 巳戌 午丑 卯申","子未 丑午 寅酉 卯申 辰亥 巳戌"],
      ["","","화개살","화개살","백호살","천문성","명예살","","","","","","",""],
      ["","","재살","재살","복성귀인","천복귀인","비인살","도화살","","","","","",""],
      ["","","화개살","화개살","괴강살","천문성","명예살","","","","","","",""]
    ]
  },
  daeun: {
    data: [
      ["92","식신","戊","戌","식신","묘","(묘)","辛 정재","丁 겁재","戊 식신","화개살","화개살","괴강살","천문성","명예살","","",""],
      ["82","겁재","丁","酉","정재","사","(장생)","庚 편재","-","辛 정재","육해살","육해살","천을귀인","태극귀인","도화살","","",""],
      ["72","비견","丙","申","편재","병","(병)","戊 식신","壬 편관","庚 편재","역마살","역마살","암록","문창귀인","관귀학관","낙정관살","현침살","역마살"],
      ["62","정인","乙","未","상관","쇠","(양)","丁 겁재","乙 정인","己 상관","반안살","반안살","공망","금여","백호살","천문성","명예살",""],
      ["52","편인","甲","午","겁재","제왕","(사)","丙 비견","己 상관","丁 겁재","장성살","장성살","공망","양인살","협록","현침살","도화살",""],
      ["42","정관","癸","巳","비견","건록","(태)","戊 식신","庚 편재","丙 비견","망신살","망신살","천주귀인","건록","원진(日)","천덕귀인","역마살",""],
      ["32","편관","壬","辰","식신","관대","(묘)","乙 정인","癸 정관","戊 식신","월살","월살","협록","월덕귀인","괴강살","명예살","",""],
      ["22","정재","辛","卯","정인","목욕","(절)","甲 편인","-","乙 정인","년살","년살","태극귀인","현침살","도화살","천문성","",""],
      ["12","편재","庚","寅","편인","장생","(절)","戊 식신","丙 비견","甲 편인","지살","지살","학당귀인","홍염살","문곡귀인","역마살","",""],
      ["2","상관","己","丑","상관","양","(묘)","癸 정관","辛 정재","己 상관","천살","천살","명예살","","","","",""]
    ]
  },
  nyunun: {
    data: [
      ["2035","65 세","정인","乙","卯","정인","목욕","(건록)","甲 편인","-","乙 정인","년살","년살","태극귀인","현침살","도화살","천문성","",""],
      ["2034","64 세","편인","甲","寅","편인","장생","(건록)","戊 식신","丙 비견","甲 편인","지살","지살","학당귀인","홍염살","문곡귀인","현침살","고란살","역마살"],
      ["2033","63 세","정관","癸","丑","상관","양","(관대)","癸 정관","辛 정재","己 상관","천살","천살","백호살","명예살","","","",""],
      ["2032","62 세","편관","壬","子","정관","태","(제왕)","壬 편관","-","癸 정관","재살","재살","복성귀인","천복귀인","비인살","월덕귀인","도화살",""],
      ["2031","61 세","정재","辛","亥","편관","절","(목욕)","戊 식신","甲 편인","壬 편관","겁살","겁살","천을귀인","현침살","고란살","역마살","천문성",""],
      ["2030","60 세","편재","庚","戌","식신","묘","(쇠)","辛 정재","丁 겁재","戊 식신","화개살","화개살","날삼재","괴강살","천문성","명예살","",""],
      ["2029","59 세","상관","己","酉","정재","사","(장생)","庚 편재","-","辛 정재","육해살","육해살","천을귀인","태극귀인","눌삼재","도화살","",""],
      ["2028","58 세","식신","戊","申","편재","병","(병)","戊 식신","壬 편관","庚 편재","역마살","역마살","암록","문창귀인","관귀학관","낙정관살","들삼재","현침살"],
      ["2027","57 세","겁재","丁","未","상관","쇠","(관대)","丁 겁재","乙 정인","己 상관","반안살","반안살","공망","금여","천문성","명예살","",""],
      ["2026","56 세","비견","丙","午","겁재","제왕","(제왕)","丙 비견","己 상관","丁 겁재","장성살","장성살","공망","양인살","협록","현침살","도화살",""],
      ["2025","55 세","정인","乙","巳","비견","건록","(목욕)","戊 식신","庚 편재","丙 비견","망신살","망신살","천주귀인","건록","원진(日)","천덕귀인","고란살","역마살"]
    ]
  },
  wolun: {
    data: [
      ["12월","편재","庚","子","정관","태","(사)","壬 편관","-","癸 정관","재살","재살","복성귀인","천복귀인","비인살","도화살","-","-"],
      ["11월","상관","己","亥","편관","절","(태)","戊 식신","甲 편인","壬 편관","겁살","겁살","천을귀인","역마살","천문성","-","-","-"],
      ["10월","식신","戊","戌","식신","묘","(묘)","辛 정재","丁 겁재","戊 식신","화개살","화개살","괴강살","천문성","명예살","-","-","-"],
      ["9월","겁재","丁","酉","정재","사","(장생)","庚 편재","-","辛 정재","육해살","육해살","천을귀인","태극귀인","도화살","-","-","-"],
      ["8월","비견","丙","申","편재","병","(병)","戊 식신","壬 편관","庚 편재","역마살","역마살","암록","문창귀인","관귀학관","낙정관살","현침살","역마살"],
      ["7월","정인","乙","未","상관","쇠","(양)","丁 겁재","乙 정인","己 상관","반안살","반안살","공망","금여","백호살","천문성","명예살","-"],
      ["6월","편인","甲","午","겁재","제왕","(사)","丙 비견","己 상관","丁 겁재","장성살","장성살","공망","양인살","협록","현침살","도화살","-"],
      ["5월","정관","癸","巳","비견","건록","(태)","戊 식신","庚 편재","丙 비견","망신살","망신살","천주귀인","건록","원진(日)","천덕귀인","역마살","-"],
      ["4월","편관","壬","辰","식신","관대","(묘)","乙 정인","癸 정관","戊 식신","월살","월살","협록","월덕귀인","괴강살","명예살","-","-"],
      ["3월","정재","辛","卯","정인","목욕","(절)","甲 편인","-","乙 정인","년살","년살","태극귀인","현침살","도화살","천문성","-","-"],
      ["2월","편재","庚","寅","편인","장생","(절)","戊 식신","丙 비견","甲 편인","지살","지살","학당귀인","홍염살","문곡귀인","역마살","-","-"],
      ["1월","상관","己","丑","상관","양","(묘)","癸 정관","辛 정재","己 상관","천살","천살","명예살","-","-","-","-","-"]
    ]
  },
  wolun2: {
    data: [
      ["12월","편관","壬","子","정관","태","(제왕)","壬 편관","-","癸 정관","재살","재살","복성귀인","천복귀인","비인살","월덕귀인","도화살","-"],
      ["11월","정재","辛","亥","편관","절","(목욕)","戊 식신","甲 편인","壬 편관","겁살","겁살","천을귀인","현침살","고란살","역마살","천문성","-"],
      ["10월","편재","庚","戌","식신","묘","(쇠)","辛 정재","丁 겁재","戊 식신","화개살","화개살","괴강살","천문성","명예살","-","-","-"],
      ["9월","상관","己","酉","정재","사","(장생)","庚 편재","-","辛 정재","육해살","육해살","천을귀인","태극귀인","도화살","-","-","-"],
      ["8월","식신","戊","申","편재","병","(병)","戊 식신","壬 편관","庚 편재","역마살","역마살","암록","문창귀인","관귀학관","낙정관살","현침살","고란살"],
      ["7월","겁재","丁","未","상관","쇠","(관대)","丁 겁재","乙 정인","己 상관","반안살","반안살","공망","금여","천문성","명예살","-","-"],
      ["6월","비견","丙","午","겁재","제왕","(제왕)","丙 비견","己 상관","丁 겁재","장성살","장성살","공망","양인살","협록","현침살","도화살","-"],
      ["5월","정인","乙","巳","비견","건록","(목욕)","戊 식신","庚 편재","丙 비견","망신살","망신살","천주귀인","건록","원진(日)","천덕귀인","고란살","역마살"],
      ["4월","편인","甲","辰","식신","관대","(쇠)","乙 정인","癸 정관","戊 식신","월살","월살","협록","현침살","백호살","명예살","-","-"],
      ["3월","정관","癸","卯","정인","목욕","(장생)","甲 편인","-","乙 정인","년살","년살","태극귀인","현침살","도화살","천문성","-","-"],
      ["2월","편관","壬","寅","편인","장생","(병)","戊 식신","丙 비견","甲 편인","지살","지살","학당귀인","홍염살","문곡귀인","월덕귀인","역마살","-"],
      ["1월","정재","辛","丑","상관","양","(양)","癸 정관","辛 정재","己 상관","천살","천살","현침살","명예살","-","-","-","-"]
    ]
  }
};

function getAux(row: string[], start: number, end: number): string[] {
  return row.slice(start, end).filter(s => s && s.trim() && s !== '-');
}

function compareAux(label: string, codeAux: string[], expertAux: string[]): { match: boolean; detail: string } {
  const codeSet = new Set(codeAux);
  const expertSet = new Set(expertAux);
  const missing = expertAux.filter(s => !codeSet.has(s));
  const extra = codeAux.filter(s => !expertSet.has(s));
  const match = missing.length === 0 && extra.length === 0;
  let detail = match ? '✅' : '';
  if (missing.length) detail += ` 누락:[${missing.join(',')}]`;
  if (extra.length) detail += ` 추가:[${extra.join(',')}]`;
  return { match, detail };
}

let totalMatch = 0;
let totalMismatch = 0;
const mismatches: string[] = [];

// Pillar shinsal
console.log('═══ 사주팔자 신살 ═══\n');
const pillarNames = ['시주', '일주', '월주', '년주'];
for (let i = 0; i < 4; i++) {
  const codeAux = getAux(result.shinsal!.data[i], 4, 12);
  const expertAux = getAux(expert.shinsal.data[i], 4, 12);
  const { match, detail } = compareAux(`${pillarNames[i]}`, codeAux, expertAux);
  const stem = result.pillar.data[i][1];
  const branch = result.pillar.data[i][2];
  console.log(`${pillarNames[i]}(${stem}${branch}): ${detail}`);
  console.log(`  코드:   [${codeAux.join(', ')}]`);
  console.log(`  전문가: [${expertAux.join(', ')}]`);
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`pillar/${pillarNames[i]}`); }
}

// Daeun
console.log('\n═══ 대운 ═══\n');
for (let i = 0; i < result.daeun!.data.length; i++) {
  const cRow = result.daeun!.data[i];
  const eRow = expert.daeun.data[i];
  const codeAux = getAux(cRow, 12, 18);
  const expertAux = getAux(eRow, 12, 18);
  const { match, detail } = compareAux('', codeAux, expertAux);
  console.log(`${cRow[0]}세 ${cRow[2]}${cRow[3]}: ${detail}`);
  if (!match) {
    console.log(`  코드:   [${codeAux.join(', ')}]`);
    console.log(`  전문가: [${expertAux.join(', ')}]`);
  }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`daeun/${cRow[0]}`); }
}

// Nyunun
console.log('\n═══ 년운 ═══\n');
for (let i = 0; i < result.nyunun!.data.length; i++) {
  const cRow = result.nyunun!.data[i];
  const eRow = expert.nyunun.data[i];
  const codeAux = getAux(cRow, 13, 19);
  const expertAux = getAux(eRow, 13, 19);
  const { match, detail } = compareAux('', codeAux, expertAux);
  console.log(`${cRow[0]} ${cRow[3]}${cRow[4]}: ${detail}`);
  if (!match) {
    console.log(`  코드:   [${codeAux.join(', ')}]`);
    console.log(`  전문가: [${expertAux.join(', ')}]`);
  }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`nyunun/${cRow[0]}`); }
}

// 월운 비교 헬퍼: 월 라벨 기준으로 매칭 (정렬 순서 무관)
function buildExpertMap(expertData: string[][]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const row of expertData) {
    map[row[0]] = getAux(row, 12, 18);
  }
  return map;
}

// Wolun
console.log('\n═══ 2026 월운 ═══\n');
const expertWolunMap = buildExpertMap(expert.wolun.data);
for (const cRow of result.wolun!.data) {
  const monthLabel = cRow[0];
  const codeAux = getAux(cRow, 12, 18);
  const expertAux = expertWolunMap[monthLabel] || [];
  const { match, detail } = compareAux('', codeAux, expertAux);
  console.log(`${monthLabel} ${cRow[2]}${cRow[3]}: ${detail}`);
  if (!match) {
    console.log(`  코드:   [${codeAux.join(', ')}]`);
    console.log(`  전문가: [${expertAux.join(', ')}]`);
  }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`wolun/${monthLabel}`); }
}

// Wolun2
console.log('\n═══ 2027 월운 ═══\n');
const expertWolun2Map = buildExpertMap(expert.wolun2.data);
for (const cRow of result.wolun2!.data) {
  const monthLabel = cRow[0];
  const codeAux = getAux(cRow, 12, 18);
  const expertAux = expertWolun2Map[monthLabel] || [];
  const { match, detail } = compareAux('', codeAux, expertAux);
  console.log(`${monthLabel} ${cRow[2]}${cRow[3]}: ${detail}`);
  if (!match) {
    console.log(`  코드:   [${codeAux.join(', ')}]`);
    console.log(`  전문가: [${expertAux.join(', ')}]`);
  }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`wolun2/${monthLabel}`); }
}

// Summary
console.log('\n═══════════════════════════════════');
console.log(`총 ${totalMatch + totalMismatch}개 항목: ✅ ${totalMatch}개 일치, ❌ ${totalMismatch}개 불일치`);
console.log(`일치율: ${((totalMatch / (totalMatch + totalMismatch)) * 100).toFixed(1)}%`);
if (mismatches.length) {
  console.log(`\n불일치 항목: ${mismatches.join(', ')}`);
}
