import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

const result = calculateSaju({
  name: '이십', gender: '여',
  birthYear: 1980, birthMonth: 12, birthDay: 6,
  birthHour: 12, birthMinute: 0, isLunar: true,
});

fs.writeFileSync('tests/result-lee2-code.json', JSON.stringify(result, null, 2), 'utf-8');

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

// ==================== 전문가 데이터 ====================
const expert = {
  pillar: {
    data: [
      ["상관","庚","午","편인","건록","(목욕)","丙 정인","己 비견","丁 편인","노방토","신강"],
      ["일간(나)","己","丑","비견","묘","(묘)","癸 편재","辛 식신","己 비견","벽력화","득지"],
      ["비견","己","丑","비견","묘","(묘)","癸 편재","辛 식신","己 비견","벽력화","득령"],
      ["상관","庚","申","상관","목욕","(건록)","戊 겁재","壬 정재","庚 상관","석류목","실세"]
    ]
  },
  yongsin: { data: [["木"],["水"],["金"],["土"],["火"]] },
  yinyang: { data: [["陰 : 4","陽 : 4","木 : 0","火 : 1","土 : 4","金 : 3","水 : 0","일간","비겁 : 3","식상 : 3","재성 : 0","관성: 0","인성 : 1"]] },
  shinsal: {
    data: [
      ["空亡:[年]子丑 [日]午未 , 天乙貴人:子申, 월령:癸","[日]공망","재살","년살","건록","천덕귀인","월덕귀인","현침살","도화살","","","","辰亥 子酉 未寅 巳戌 午丑 卯申","子未 丑午 寅酉 卯申 辰亥 巳戌"],
      ["","[年]공망","반안살","화개살","태극귀인","비인살","명예살","","","","","","",""],
      ["","[年]공망","반안살","화개살","태극귀인","비인살","명예살","","","","","","",""],
      ["","","지살","망신살","천을귀인","금여","천덕귀인","월덕귀인","현침살","역마살","","","",""]
    ]
  },
  daeun: {
    data: [
      ["92","비견","己","卯","편관","병","(병)","甲 정관","-","乙 편관","육해살","재살","문곡귀인","원진(年)","현침살","도화살","천문성",""],
      ["82","상관","庚","辰","겁재","쇠","(양)","乙 편관","癸 편재","戊 겁재","화개살","천살","홍염살","천덕귀인","월덕귀인","괴강살","명예살",""],
      ["72","식신","辛","巳","정인","제왕","(사)","戊 겁재","庚 상관","丙 정인","겁살","지살","협록","낙정관살","현침살","역마살","",""],
      ["62","정재","壬","午","편인","건록","(태)","丙 정인","己 비견","丁 편인","재살","년살","공망","건록","원진(日)","현침살","도화살",""],
      ["52","편재","癸","未","비견","관대","(묘)","丁 편인","乙 편관","己 비견","천살","월살","공망","암록","태극귀인","복성귀인","양인살","협록"],
      ["42","정관","甲","申","상관","목욕","(절)","戊 겁재","壬 정재","庚 상관","지살","망신살","천을귀인","금여","현침살","역마살","",""],
      ["32","편관","乙","酉","식신","장생","(절)","庚 상관","-","辛 식신","년살","장성살","문창귀인","천주귀인","학당귀인","도화살","",""],
      ["22","정인","丙","戌","겁재","양","(묘)","辛 식신","丁 편인","戊 겁재","월살","반안살","태극귀인","백호살","천문성","명예살","",""],
      ["12","편인","丁","亥","정재","태","(태)","戊 겁재","甲 정관","壬 정재","망신살","역마살","관귀학관","역마살","천문성","","",""],
      ["2","겁재","戊","子","편재","절","(태)","壬 정재","-","癸 편재","장성살","육해살","천을귀인","도화살","","","",""]
    ]
  },
  nyunun: {
    data: [
      ["2035","55 세","편관","乙","卯","편관","병","(건록)","甲 정관","-","乙 편관","육해살","재살","문곡귀인","눌삼재","원진(年)","현침살","도화살","천문성"],
      ["2034","54 세","정관","甲","寅","정관","사","(건록)","戊 겁재","丙 정인","甲 정관","역마살","겁살","천복귀인","들삼재","현침살","고란살","역마살",""],
      ["2033","53 세","편재","癸","丑","비견","묘","(관대)","癸 편재","辛 식신","己 비견","반안살","화개살","태극귀인","비인살","백호살","명예살","",""],
      ["2032","52 세","정재","壬","子","편재","절","(제왕)","壬 정재","-","癸 편재","장성살","육해살","천을귀인","도화살","","","",""],
      ["2031","51 세","식신","辛","亥","정재","태","(목욕)","戊 겁재","甲 정관","壬 정재","망신살","역마살","관귀학관","현침살","고란살","역마살","천문성",""],
      ["2030","50 세","상관","庚","戌","겁재","양","(쇠)","辛 식신","丁 편인","戊 겁재","월살","반안살","태극귀인","천덕귀인","월덕귀인","괴강살","천문성","명예살"],
      ["2029","49 세","비견","己","酉","식신","장생","(장생)","庚 상관","-","辛 식신","년살","장성살","문창귀인","천주귀인","학당귀인","도화살","",""],
      ["2028","48 세","겁재","戊","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","지살","망신살","천을귀인","금여","현침살","고란살","역마살",""],
      ["2027","47 세","편인","丁","未","비견","관대","(관대)","丁 편인","乙 편관","己 비견","천살","월살","공망","암록","태극귀인","복성귀인","양인살","협록"],
      ["2026","46 세","정인","丙","午","편인","건록","(제왕)","丙 정인","己 비견","丁 편인","재살","년살","공망","건록","원진(日)","현침살","도화살",""],
      ["2025","45 세","편관","乙","巳","정인","제왕","(목욕)","戊 겁재","庚 상관","丙 정인","겁살","지살","협록","낙정관살","고란살","역마살","",""]
    ]
  },
  // 월운: 전문가는 12→1 역순. 코드 월 이름으로 매칭
  wolun_byMonth: {
    "1월": ["1월","비견","己","丑","비견","묘","(묘)","癸 편재","辛 식신","己 비견","반안살","화개살","태극귀인","비인살","명예살","-","-","-"],
    "2월": ["2월","상관","庚","寅","정관","사","(절)","戊 겁재","丙 정인","甲 정관","역마살","겁살","천복귀인","천덕귀인","월덕귀인","역마살","-","-"],
    "3월": ["3월","식신","辛","卯","편관","병","(절)","甲 정관","-","乙 편관","육해살","재살","문곡귀인","원진(年)","현침살","도화살","천문성","-"],
    "4월": ["4월","정재","壬","辰","겁재","쇠","(묘)","乙 편관","癸 편재","戊 겁재","화개살","천살","홍염살","괴강살","명예살","-","-","-"],
    "5월": ["5월","편재","癸","巳","정인","제왕","(태)","戊 겁재","庚 상관","丙 정인","겁살","지살","협록","낙정관살","역마살","-","-","-"],
    "6월": ["6월","정관","甲","午","편인","건록","(사)","丙 정인","己 비견","丁 편인","재살","년살","공망","건록","원진(日)","현침살","도화살","-"],
    "7월": ["7월","편관","乙","未","비견","관대","(양)","丁 편인","乙 편관","己 비견","천살","월살","공망","암록","태극귀인","복성귀인","양인살","협록"],
    "8월": ["8월","정인","丙","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","지살","망신살","천을귀인","금여","현침살","역마살","-","-"],
    "9월": ["9월","편인","丁","酉","식신","장생","(장생)","庚 상관","-","辛 식신","년살","장성살","문창귀인","천주귀인","학당귀인","도화살","-","-"],
    "10월": ["10월","겁재","戊","戌","겁재","양","(묘)","辛 식신","丁 편인","戊 겁재","월살","반안살","태극귀인","괴강살","천문성","명예살","-","-"],
    "11월": ["11월","비견","己","亥","정재","태","(태)","戊 겁재","甲 정관","壬 정재","망신살","역마살","관귀학관","역마살","천문성","-","-","-"],
    "12월": ["12월","상관","庚","子","편재","절","(사)","壬 정재","-","癸 편재","장성살","육해살","천을귀인","천덕귀인","월덕귀인","도화살","-","-"],
  } as Record<string, string[]>,
  wolun2_byMonth: {
    "1월": ["1월","식신","辛","丑","비견","묘","(양)","癸 편재","辛 식신","己 비견","반안살","화개살","태극귀인","비인살","현침살","명예살","-","-"],
    "2월": ["2월","정재","壬","寅","정관","사","(병)","戊 겁재","丙 정인","甲 정관","역마살","겁살","천복귀인","역마살","-","-","-","-"],
    "3월": ["3월","편재","癸","卯","편관","병","(장생)","甲 정관","-","乙 편관","육해살","재살","문곡귀인","원진(年)","현침살","도화살","천문성","-"],
    "4월": ["4월","정관","甲","辰","겁재","쇠","(쇠)","乙 편관","癸 편재","戊 겁재","화개살","천살","홍염살","현침살","백호살","명예살","-","-"],
    "5월": ["5월","편관","乙","巳","정인","제왕","(목욕)","戊 겁재","庚 상관","丙 정인","겁살","지살","협록","낙정관살","고란살","역마살","-","-"],
    "6월": ["6월","정인","丙","午","편인","건록","(제왕)","丙 정인","己 비견","丁 편인","재살","년살","공망","건록","원진(日)","현침살","도화살","-"],
    "7월": ["7월","편인","丁","未","비견","관대","(관대)","丁 편인","乙 편관","己 비견","천살","월살","공망","암록","태극귀인","복성귀인","양인살","협록"],
    "8월": ["8월","겁재","戊","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","지살","망신살","천을귀인","금여","현침살","고란살","역마살","-"],
    "9월": ["9월","비견","己","酉","식신","장생","(장생)","庚 상관","-","辛 식신","년살","장성살","문창귀인","천주귀인","학당귀인","도화살","-","-"],
    "10월": ["10월","상관","庚","戌","겁재","양","(쇠)","辛 식신","丁 편인","戊 겁재","월살","반안살","태극귀인","천덕귀인","월덕귀인","괴강살","천문성","명예살"],
    "11월": ["11월","식신","辛","亥","정재","태","(목욕)","戊 겁재","甲 정관","壬 정재","망신살","역마살","관귀학관","현침살","고란살","역마살","천문성","-"],
    "12월": ["12월","정재","壬","子","편재","절","(제왕)","壬 정재","-","癸 편재","장성살","육해살","천을귀인","도화살","-","-","-","-"],
  } as Record<string, string[]>,
};

// ==================== 비교 시작 ====================

// 1. 사주팔자
console.log('\n=== 사주팔자 (Pillar) ===');
const pillarNames = ['시주','일주','월주','년주'];
const fields = ['천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','납음오행','강약'];
for (let i = 0; i < 4; i++) {
  const code = result.pillar.data[i];
  const exp = expert.pillar.data[i];
  for (let j = 0; j < fields.length; j++) {
    const c = code[j] || '';
    const e = exp[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`pillar/${pillarNames[i]}/${fields[j]}`);
      console.log(`  ${pillarNames[i]}/${fields[j]}: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
}

// 2. 용신
console.log('\n=== 용신 (Yongsin) ===');
const yongsinLabels = ['용신','희신','기신','구신','한신'];
for (let i = 0; i < 5; i++) {
  const c = result.yongsin.data[i]?.[0] || '';
  const e = expert.yongsin.data[i]?.[0] || '';
  if (c === e) { totalMatch++; console.log(`  ${yongsinLabels[i]}: ✅ ${c}`); }
  else {
    totalMismatch++; mismatches.push(`yongsin/${yongsinLabels[i]}`);
    console.log(`  ${yongsinLabels[i]}: ❌ 코드=[${c}] 전문가=[${e}]`);
  }
}

// 3. 음양오행
console.log('\n=== 음양오행 (YinYang) ===');
const codeYY = result.yinyang.data[0];
const expYY = expert.yinyang.data[0];
for (let i = 0; i < expYY.length; i++) {
  const c = (codeYY[i] || '').replace(/\s+/g, '');
  const e = (expYY[i] || '').replace(/\s+/g, '');
  if (c === e) { totalMatch++; }
  else {
    totalMismatch++; mismatches.push(`yinyang/[${i}]`);
    console.log(`  [${i}]: ❌ 코드=[${codeYY[i]}] 전문가=[${expYY[i]}]`);
  }
}

// 4. 신살
console.log('\n=== 신살 (Shinsal) ===');
const shinsalNames = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const codeRow = result.shinsal?.data[i] || [];
  const expRow = expert.shinsal.data[i];
  for (let j = 2; j <= 3; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`shinsal/${shinsalNames[i]}/십이신살[${j}]`);
      console.log(`  ${shinsalNames[i]}/십이신살[${j}]: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
  const codeAux = getAux(codeRow, 4, 12);
  const expAux = getAux(expRow, 4, 12);
  compare('shinsal', shinsalNames[i], codeAux, expAux);
}

// 5. 대운
console.log('\n=== 대운 (Daeun) ===');
const daeunFields = ['나이','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
for (let i = 0; i < expert.daeun.data.length; i++) {
  const expRow = expert.daeun.data[i];
  const age = expRow[0];
  const codeRow = result.daeun?.data[i] || [];
  for (let j = 0; j < 12; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`daeun/${age}/${daeunFields[j]}`);
      console.log(`  대운${age}/${daeunFields[j]}: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
  const codeAux = getAux(codeRow, 12, 18);
  const expAux = getAux(expRow, 12, 18);
  compare('daeun', `대운${age}/보조신살`, codeAux, expAux);
}

// 6. 년운
console.log('\n=== 년운 (Nyunun) ===');
const nyununFields = ['년도','나이','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
for (let i = 0; i < expert.nyunun.data.length; i++) {
  const expRow = expert.nyunun.data[i];
  const year = expRow[0];
  const codeRow = result.nyunun?.data[i] || [];
  for (let j = 0; j < 13; j++) {
    const c = (codeRow[j] || '').replace(/\s+/g, '');
    const e = (expRow[j] || '').replace(/\s+/g, '');
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`nyunun/${year}/[${j}]${nyununFields[j]}`);
      console.log(`  ${year}/${nyununFields[j]}: ❌ 코드=[${codeRow[j]}] 전문가=[${expRow[j]}]`);
    }
  }
  const codeAux = getAux(codeRow, 13, 19);
  const expAux = getAux(expRow, 13, 19);
  compare('nyunun', `${year}/보조신살`, codeAux, expAux);
}

// 7. 월운 2026 — 월 이름으로 매칭
console.log('\n=== 월운 2026 (Wolun) - 월 이름 매칭 ===');
const wolunFields = ['월','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
const codeWolun = result.wolun?.data || [];
for (const codeRow of codeWolun) {
  const monthName = codeRow[0]; // e.g. "1월", "2월"...
  const expRow = expert.wolun_byMonth[monthName];
  if (!expRow) {
    console.log(`  ${monthName}: ⚠️ 전문가 데이터 없음`);
    continue;
  }
  for (let j = 0; j < 12; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`wolun/${monthName}/[${j}]${wolunFields[j]}`);
      console.log(`  ${monthName}/${wolunFields[j]}: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
  const codeAux = getAux(codeRow, 12, 18);
  const expAux = getAux(expRow, 12, 18).filter(s => s !== '-');
  compare('wolun', `${monthName}/보조신살`, codeAux, expAux);
}

// 8. 월운 2027
console.log('\n=== 월운 2027 (Wolun2) - 월 이름 매칭 ===');
const codeWolun2 = result.wolun2?.data || [];
for (const codeRow of codeWolun2) {
  const monthName = codeRow[0];
  const expRow = expert.wolun2_byMonth[monthName];
  if (!expRow) {
    console.log(`  ${monthName}: ⚠️ 전문가 데이터 없음`);
    continue;
  }
  for (let j = 0; j < 12; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`wolun2/${monthName}/[${j}]${wolunFields[j]}`);
      console.log(`  ${monthName}/${wolunFields[j]}: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
  const codeAux = getAux(codeRow, 12, 18);
  const expAux = getAux(expRow, 12, 18).filter(s => s !== '-');
  compare('wolun2', `${monthName}/보조신살`, codeAux, expAux);
}

// ==================== 결과 요약 ====================
console.log('\n========================================');
console.log(`총 비교: ${totalMatch + totalMismatch}`);
console.log(`✅ 일치: ${totalMatch}`);
console.log(`❌ 불일치: ${totalMismatch}`);
console.log(`정확도: ${((totalMatch / (totalMatch + totalMismatch)) * 100).toFixed(1)}%`);
if (mismatches.length > 0) {
  console.log('\n불일치 목록:');
  mismatches.forEach(m => console.log(`  - ${m}`));
}
