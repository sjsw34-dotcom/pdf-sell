import { calculateSaju } from '../src/lib/saju/calculator';
import * as fs from 'fs';

const result = calculateSaju({
  name: '김다혜', gender: '여',
  birthYear: 2002, birthMonth: 4, birthDay: 17,
  birthHour: 18, birthMinute: 0, isLunar: false,
});

fs.writeFileSync('tests/result-kim-code.json', JSON.stringify(result, null, 2), 'utf-8');

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
  info: {
    tab_name: "사주정보", tab_type: "info",
    column_headers: ["항목","내용"], row_headers: [],
    data: [
      ["성별 및 이름","양력","음력","경도보정","썸머타임보정","최종","[입추]","[백로]"],
      ["[女] 김다혜 (24세)","양력 : 2002년 04월 17일 酉時 (보정 : -30분)","음력 : 2002년 03월 05일 (평달)","경도보정 : 한국시표준 동경 127˚30＇ 기준 -30분","썸머타임보정 : 해당사항 없음","최종 : 출생시 -30분으로 사주분석","양력 : 18:16","양력 : 37:17"]
    ]
  },
  pillar: {
    tab_name: "사주팔자", tab_type: "pillar",
    column_headers: ["시주","일주","월주","년주"],
    row_headers: ["천간십성","천간한자","지지한자","지지십성","십이운성_봉법","십이운성_거법","지장간여기","지장간중기","지장간본기","납음오행","강약"],
    data: [
      ["비견","乙","酉","편관","절","(절)","庚 정관","-","辛 편관","천중수","약변강"],
      ["일간(나)","乙","卯","비견","건록","(건록)","甲 겁재","-","乙 비견","대계수","득지"],
      ["겁재","甲","辰","정재","관대","(쇠)","乙 비견","癸 편인","戊 정재","복등화","실령"],
      ["정인","壬","午","식신","장생","(태)","丙 상관","己 편재","丁 식신","양류목","득세"]
    ]
  },
  yongsin: {
    tab_name: "용신", tab_type: "yongsin",
    column_headers: ["用神(용신)","喜神(희신)","忌神(기신)","仇神(구신)","閑神(한신)"],
    row_headers: [],
    data: [["金"],["土"],["火"],["木"],["水"]]
  },
  yinyang: {
    tab_name: "음양오행", tab_type: "yinyang",
    column_headers: ["음양/오행/십신"], row_headers: [],
    data: [["陰 : 4","陽 : 4","木 : 4","火 : 1","土 : 1","金 : 1","水 : 1","일간","비겁 : 3","식상 : 1","재성 : 1","관성: 1","인성 : 1"]]
  },
  shinsal: {
    data: [
      // 시주
      ["空亡:[年]申酉 [日]子丑 , 天乙貴人:申子, 월령:戊","[年]공망","육해살","재살","도화살","","","","","","","","辰亥 子酉 未寅 巳戌 午丑 卯申","子未 丑午 寅酉 卯申 辰亥 巳戌"],
      // 일주
      ["","","년살","장성살","건록","현침살","도화살","천문성","","","","","",""],
      // 월주
      ["","","월살","반안살","양인살","협록","현침살","백호살","명예살","","","","",""],
      // 년주
      ["","","장성살","육해살","문창귀인","태극귀인","천주귀인","학당귀인","홍염살","천덕귀인","월덕귀인","현침살","",""]
    ]
  },
  daeun: {
    data: [
      ["94","겁재","甲","午","식신","장생","(사)","丙 상관","己 편재","丁 식신","장성살","육해살","문창귀인","태극귀인","천주귀인","학당귀인","홍염살","현침살"],
      ["84","비견","乙","未","편재","양","(양)","丁 식신","乙 비견","己 편재","반안살","화개살","백호살","천문성","명예살","","",""],
      ["74","상관","丙","申","정관","태","(병)","戊 정재","壬 정인","庚 정관","역마살","겁살","천을귀인","홍염살","천복귀인","원진(日)","현침살","역마살"],
      ["64","식신","丁","酉","편관","절","(장생)","庚 정관","-","辛 편관","육해살","재살","도화살","","","","",""],
      ["54","정재","戊","戌","정재","묘","(묘)","辛 편관","丁 식신","戊 정재","화개살","천살","암록","비인살","괴강살","천문성","명예살",""],
      ["44","편재","己","亥","정인","사","(태)","戊 정재","甲 겁재","壬 정인","겁살","지살","역마살","천문성","","","",""],
      ["34","정관","庚","子","편인","병","(사)","壬 정인","-","癸 편인","재살","년살","공망","천을귀인","태극귀인","문곡귀인","낙정관살","도화살"],
      ["24","편관","辛","丑","편재","쇠","(양)","癸 편인","辛 편관","己 편재","천살","월살","공망","복성귀인","원진(年)","현침살","명예살",""],
      ["14","정인","壬","寅","겁재","제왕","(병)","戊 정재","丙 상관","甲 겁재","지살","망신살","협록","천덕귀인","월덕귀인","역마살","",""],
      ["4","편인","癸","卯","비견","건록","(장생)","甲 겁재","-","乙 비견","년살","장성살","건록","현침살","도화살","천문성","",""]
    ]
  },
  nyunun: {
    data: [
      ["2034","33 세","겁재","甲","寅","겁재","제왕","(건록)","戊 정재","丙 상관","甲 겁재","지살","망신살","협록","현침살","고란살","역마살","",""],
      ["2033","32 세","편인","癸","丑","편재","쇠","(관대)","癸 편인","辛 편관","己 편재","천살","월살","공망","복성귀인","원진(年)","백호살","명예살",""],
      ["2032","31 세","정인","壬","子","편인","병","(제왕)","壬 정인","-","癸 편인","재살","년살","공망","천을귀인","태극귀인","문곡귀인","낙정관살","천덕귀인"],
      ["2031","30 세","편관","辛","亥","정인","사","(목욕)","戊 정재","甲 겁재","壬 정인","겁살","지살","현침살","고란살","역마살","천문성","",""],
      ["2030","29 세","정관","庚","戌","정재","묘","(쇠)","辛 편관","丁 식신","戊 정재","화개살","천살","암록","비인살","날삼재","괴강살","천문성","명예살"],
      ["2029","28 세","편재","己","酉","편관","절","(장생)","庚 정관","-","辛 편관","육해살","재살","눌삼재","도화살","","","",""],
      ["2028","27 세","정재","戊","申","정관","태","(병)","戊 정재","壬 정인","庚 정관","역마살","겁살","천을귀인","홍염살","천복귀인","들삼재","원진(日)","현침살"],
      ["2027","26 세","식신","丁","未","편재","양","(관대)","丁 식신","乙 비견","己 편재","반안살","화개살","천문성","명예살","","","",""],
      ["2026","25 세","상관","丙","午","식신","장생","(제왕)","丙 상관","己 편재","丁 식신","장성살","육해살","문창귀인","태극귀인","천주귀인","학당귀인","홍염살","현침살"],
      ["2025","24 세","비견","乙","巳","상관","목욕","(목욕)","戊 정재","庚 정관","丙 상관","망신살","역마살","금여","관귀학관","고란살","역마살","",""]
    ]
  },
  wolun: {
    data: [
      ["12월","정재","戊","子","편인","병","(태)","壬 정인","-","癸 편인","재살","년살","공망","천을귀인","태극귀인","문곡귀인","낙정관살","도화살"],
      ["11월","식신","丁","亥","정인","사","(태)","戊 정재","甲 겁재","壬 정인","겁살","지살","역마살","천문성","-","-","-","-"],
      ["10월","상관","丙","戌","정재","묘","(묘)","辛 편관","丁 식신","戊 정재","화개살","천살","암록","비인살","백호살","천문성","명예살","-"],
      ["9월","비견","乙","酉","편관","절","(절)","庚 정관","-","辛 편관","육해살","재살","도화살","-","-","-","-","-"],
      ["8월","겁재","甲","申","정관","태","(절)","戊 정재","壬 정인","庚 정관","역마살","겁살","천을귀인","홍염살","천복귀인","원진(日)","현침살","역마살"],
      ["7월","편인","癸","未","편재","양","(묘)","丁 식신","乙 비견","己 편재","반안살","화개살","천문성","명예살","-","-","-","-"],
      ["6월","정인","壬","午","식신","장생","(태)","丙 상관","己 편재","丁 식신","장성살","육해살","문창귀인","태극귀인","천주귀인","학당귀인","홍염살","천덕귀인"],
      ["5월","편관","辛","巳","상관","목욕","(사)","戊 정재","庚 정관","丙 상관","망신살","역마살","금여","관귀학관","현침살","역마살","-","-"],
      ["4월","정관","庚","辰","정재","관대","(양)","乙 비견","癸 편인","戊 정재","월살","반안살","양인살","협록","괴강살","명예살","-","-"],
      ["3월","편재","己","卯","비견","건록","(병)","甲 겁재","-","乙 비견","년살","장성살","건록","현침살","도화살","천문성","-","-"],
      ["2월","정재","戊","寅","겁재","제왕","(장생)","戊 정재","丙 상관","甲 겁재","지살","망신살","협록","역마살","-","-","-","-"],
      ["1월","식신","丁","丑","편재","쇠","(묘)","癸 편인","辛 편관","己 편재","천살","월살","공망","복성귀인","원진(年)","백호살","명예살","-"]
    ]
  },
  wolun2: {
    data: [
      ["12월","정관","庚","子","편인","병","(사)","壬 정인","-","癸 편인","재살","년살","공망","천을귀인","태극귀인","문곡귀인","낙정관살","도화살"],
      ["11월","편재","己","亥","정인","사","(태)","戊 정재","甲 겁재","壬 정인","겁살","지살","역마살","천문성","-","-","-","-"],
      ["10월","정재","戊","戌","정재","묘","(묘)","辛 편관","丁 식신","戊 정재","화개살","천살","암록","비인살","괴강살","천문성","명예살","-"],
      ["9월","식신","丁","酉","편관","절","(장생)","庚 정관","-","辛 편관","육해살","재살","도화살","-","-","-","-","-"],
      ["8월","상관","丙","申","정관","태","(병)","戊 정재","壬 정인","庚 정관","역마살","겁살","천을귀인","홍염살","천복귀인","원진(日)","현침살","역마살"],
      ["7월","비견","乙","未","편재","양","(양)","丁 식신","乙 비견","己 편재","반안살","화개살","백호살","천문성","명예살","-","-","-"],
      ["6월","겁재","甲","午","식신","장생","(사)","丙 상관","己 편재","丁 식신","장성살","육해살","문창귀인","태극귀인","천주귀인","학당귀인","홍염살","현침살"],
      ["5월","편인","癸","巳","상관","목욕","(태)","戊 정재","庚 정관","丙 상관","망신살","역마살","금여","관귀학관","역마살","-","-","-"],
      ["4월","정인","壬","辰","정재","관대","(묘)","乙 비견","癸 편인","戊 정재","월살","반안살","양인살","협록","천덕귀인","월덕귀인","괴강살","명예살"],
      ["3월","편관","辛","卯","비견","건록","(절)","甲 겁재","-","乙 비견","년살","장성살","건록","현침살","도화살","천문성","-","-"],
      ["2월","정관","庚","寅","겁재","제왕","(절)","戊 정재","丙 상관","甲 겁재","지살","망신살","협록","역마살","-","-","-","-"],
      ["1월","편재","己","丑","편재","쇠","(묘)","癸 편인","辛 편관","己 편재","천살","월살","공망","복성귀인","원진(年)","명예살","-","-"]
    ]
  }
};

// ==================== 비교 시작 ====================

// 1. 사주팔자 (Pillar) 비교
console.log('\n=== 사주팔자 (Pillar) ===');
const pillarNames = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const code = result.pillar.data[i];
  const exp = expert.pillar.data[i];
  const name = pillarNames[i];

  const fields = ['천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','납음오행','강약'];
  for (let j = 0; j < fields.length; j++) {
    const c = code[j] || '';
    const e = exp[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`pillar/${name}/${fields[j]}`);
      console.log(`  ${name}/${fields[j]}: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
}

// 2. 용신 비교
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

// 3. 음양오행 비교
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

// 4. 신살 비교 (보조신살)
console.log('\n=== 신살 (Shinsal) - 보조신살 ===');
const shinsalPillarNames = ['시주','일주','월주','년주'];
for (let i = 0; i < 4; i++) {
  const codeRow = result.shinsal?.data[i] || [];
  const expRow = expert.shinsal.data[i];
  // 십이신살 (indices 2-3)
  for (let j = 2; j <= 3; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`shinsal/${shinsalPillarNames[i]}/십이신살[${j}]`);
      console.log(`  ${shinsalPillarNames[i]}/십이신살[${j}]: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
  // 보조신살 (indices 4-11)
  const codeAux = getAux(codeRow, 4, 12);
  const expAux = getAux(expRow, 4, 12);
  compare('shinsal', shinsalPillarNames[i], codeAux, expAux);
}

// 5. 대운 비교
console.log('\n=== 대운 (Daeun) ===');
for (let i = 0; i < expert.daeun.data.length; i++) {
  const expRow = expert.daeun.data[i];
  const age = expRow[0];
  const codeRow = result.daeun?.data[i] || [];

  // 기본 필드 (0~11)
  const daeunFields = ['나이','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
  for (let j = 0; j < 12; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`daeun/${age}/${daeunFields[j]}`);
      console.log(`  대운${age}/${daeunFields[j]}: ❌ 코드=[${c}] 전문가=[${e}]`);
    }
  }
  // 보조신살 (12~17)
  const codeAux = getAux(codeRow, 12, 18);
  const expAux = getAux(expRow, 12, 18);
  compare('daeun', `대운${age}/보조신살`, codeAux, expAux);
}

// 6. 년운 비교
console.log('\n=== 년운 (Nyunun) ===');
for (let i = 0; i < expert.nyunun.data.length; i++) {
  const expRow = expert.nyunun.data[i];
  const year = expRow[0];
  const codeRow = result.nyunun?.data[i] || [];

  const nyununFields = ['년도','나이','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
  for (let j = 0; j < 13; j++) {
    const c = (codeRow[j] || '').replace(/\s+/g, '');
    const e = (expRow[j] || '').replace(/\s+/g, '');
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`nyunun/${year}/[${j}]${nyununFields[j]}`);
      console.log(`  ${year}/${nyununFields[j]}: ❌ 코드=[${codeRow[j]}] 전문가=[${expRow[j]}]`);
    }
  }
  // 보조신살 (13~18)
  const codeAux = getAux(codeRow, 13, 19);
  const expAux = getAux(expRow, 13, 19);
  compare('nyunun', `${year}/보조신살`, codeAux, expAux);
}

// 월 라벨 기준 코드 데이터 매핑 (정렬 순서 무관)
function buildCodeMap(data: string[][] | undefined): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  if (!data) return map;
  for (const row of data) map[row[0]] = row;
  return map;
}

// 7. 월운 비교 (2025)
console.log('\n=== 월운 2025 (Wolun) ===');
const wolunCodeMap = buildCodeMap(result.wolun?.data);
for (let i = 0; i < expert.wolun.data.length; i++) {
  const expRow = expert.wolun.data[i];
  const month = expRow[0];
  const codeRow = wolunCodeMap[month] || [];

  const wolunFields = ['월','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
  for (let j = 0; j < 12; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`wolun/${month}/[${j}]${wolunFields[j]}`);
      console.log(`  ${month}/${wolunFields[j]}: ❌ 코드=[${codeRow[j]}] 전문가=[${expRow[j]}]`);
    }
  }
  // 보조신살 (12~17)
  const codeAux = getAux(codeRow, 12, 18);
  const expAux = getAux(expRow, 12, 18).filter(s => s !== '-');
  compare('wolun', `${month}/보조신살`, codeAux, expAux);
}

// 8. 월운2 비교 (2026)
console.log('\n=== 월운 2026 (Wolun2) ===');
const wolun2CodeMap = buildCodeMap(result.wolun2?.data);
for (let i = 0; i < expert.wolun2.data.length; i++) {
  const expRow = expert.wolun2.data[i];
  const month = expRow[0];
  const codeRow = wolun2CodeMap[month] || [];

  const wolunFields = ['월','천간십성','천간','지지','지지십성','십이운성_봉','십이운성_거','지장간여기','지장간중기','지장간본기','신살년지','신살일지'];
  for (let j = 0; j < 12; j++) {
    const c = codeRow[j] || '';
    const e = expRow[j] || '';
    if (c === e) { totalMatch++; }
    else {
      totalMismatch++; mismatches.push(`wolun2/${month}/[${j}]${wolunFields[j]}`);
      console.log(`  ${month}/${wolunFields[j]}: ❌ 코드=[${codeRow[j]}] 전문가=[${expRow[j]}]`);
    }
  }
  // 보조신살 (12~17)
  const codeAux = getAux(codeRow, 12, 18);
  const expAux = getAux(expRow, 12, 18).filter(s => s !== '-');
  compare('wolun2', `${month}/보조신살`, codeAux, expAux);
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
