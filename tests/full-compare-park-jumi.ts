import { calculateSaju } from '../src/lib/saju/calculator';

const result = calculateSaju({
  name: '박주미',
  gender: '여',
  birthYear: 1996,
  birthMonth: 1,
  birthDay: 2,
  birthHour: 0,
  birthMinute: 18,
  isLunar: false,
});

// 전문가 데이터 (wolun은 12→1월 내림차순)
const expert = {
  pillar: {
    data: [
      ["정관","甲","子","편재","절","(목욕)","壬 정재","-","癸 편재","해중금","극신약"],
      ["일간(나)","己","亥","정재","태","(태)","戊 겁재","甲 정관","壬 정재","평지목","실지"],
      ["겁재","戊","子","편재","절","(태)","壬 정재","-","癸 편재","벽력화","실령"],
      ["편관","乙","亥","정재","태","(사)","戊 겁재","甲 정관","壬 정재","산두화","실세"]
    ]
  },
  shinsal: {
    data: [
      ["空亡:[年]申酉 [日]辰巳 , 天乙貴人:子申, 월령:癸","","년살","년살","천을귀인","현침살","도화살","","","","","","辰亥 子酉 未寅 巳戌 午丑 卯申","子未 丑午 寅酉 卯申 辰亥 巳戌"],
      ["","","지살","지살","관귀학관","역마살","천문성","","","","","","",""],
      ["","","년살","년살","천을귀인","도화살","","","","","","","",""],
      ["","","지살","지살","관귀학관","역마살","천문성","","","","","","",""]
    ]
  },
  daeun: {
    data: [
      ["91","겁재","戊","戌","겁재","양","(묘)","辛 식신","丁 편인","戊 겁재","천살","천살","태극귀인","괴강살","천문성","명예살","",""],
      ["81","편인","丁","酉","식신","장생","(장생)","庚 상관","-","辛 식신","재살","재살","문창귀인","천주귀인","학당귀인","도화살","",""],
      ["71","정인","丙","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","겁살","겁살","천을귀인","금여","현침살","역마살","",""],
      ["61","편관","乙","未","비견","관대","(양)","丁 편인","乙 편관","己 비견","화개살","화개살","암록","태극귀인","복성귀인","양인살","협록","백호살"],
      ["51","정관","甲","午","편인","건록","(사)","丙 정인","己 비견","丁 편인","육해살","육해살","건록","현침살","도화살","","",""],
      ["41","편재","癸","巳","정인","제왕","(태)","戊 겁재","庚 상관","丙 정인","역마살","역마살","공망","협록","낙정관살","천덕귀인","역마살",""],
      ["31","정재","壬","辰","겁재","쇠","(묘)","乙 편관","癸 편재","戊 겁재","반안살","반안살","공망","홍염살","원진(日)","월덕귀인","괴강살","명예살"],
      ["21","식신","辛","卯","편관","병","(절)","甲 정관","-","乙 편관","장성살","장성살","문곡귀인","현침살","도화살","천문성","",""],
      ["11","상관","庚","寅","정관","사","(절)","戊 겁재","丙 정인","甲 정관","망신살","망신살","천복귀인","역마살","","","",""],
      ["1","비견","己","丑","비견","묘","(묘)","癸 편재","辛 식신","己 비견","월살","월살","태극귀인","비인살","명예살","","",""]
    ]
  },
  nyunun: {
    data: [
      ["2035","40 세","편관","乙","卯","편관","병","(건록)","甲 정관","-","乙 편관","장성살","장성살","문곡귀인","현침살","도화살","천문성","",""],
      ["2034","39 세","정관","甲","寅","정관","사","(건록)","戊 겁재","丙 정인","甲 정관","망신살","망신살","천복귀인","현침살","고란살","역마살","",""],
      ["2033","38 세","편재","癸","丑","비견","묘","(관대)","癸 편재","辛 식신","己 비견","월살","월살","태극귀인","비인살","백호살","명예살","",""],
      ["2032","37 세","정재","壬","子","편재","절","(제왕)","壬 정재","-","癸 편재","년살","년살","천을귀인","월덕귀인","도화살","","",""],
      ["2031","36 세","식신","辛","亥","정재","태","(목욕)","戊 겁재","甲 정관","壬 정재","지살","지살","관귀학관","현침살","고란살","역마살","천문성",""],
      ["2030","35 세","상관","庚","戌","겁재","양","(쇠)","辛 식신","丁 편인","戊 겁재","천살","천살","태극귀인","괴강살","천문성","명예살","",""],
      ["2029","34 세","비견","己","酉","식신","장생","(장생)","庚 상관","-","辛 식신","재살","재살","문창귀인","천주귀인","학당귀인","도화살","",""],
      ["2028","33 세","겁재","戊","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","겁살","겁살","천을귀인","금여","현침살","고란살","역마살",""],
      ["2027","32 세","편인","丁","未","비견","관대","(관대)","丁 편인","乙 편관","己 비견","화개살","화개살","암록","태극귀인","복성귀인","양인살","협록","날삼재"],
      ["2026","31 세","정인","丙","午","편인","건록","(제왕)","丙 정인","己 비견","丁 편인","육해살","육해살","건록","눌삼재","현침살","도화살","",""],
      ["2025","30 세","편관","乙","巳","정인","제왕","(목욕)","戊 겁재","庚 상관","丙 정인","역마살","역마살","공망","협록","천덕귀인","낙정관살","들삼재","고란살"]
    ]
  },
  wolun: {
    data: [
      ["12월","상관","庚","子","편재","절","(사)","壬 정재","-","癸 편재","년살","년살","천을귀인","도화살","-","-","-","-"],
      ["11월","비견","己","亥","정재","태","(태)","戊 겁재","甲 정관","壬 정재","지살","지살","관귀학관","역마살","천문성","-","-","-"],
      ["10월","겁재","戊","戌","겁재","양","(묘)","辛 식신","丁 편인","戊 겁재","천살","천살","태극귀인","괴강살","천문성","명예살","-","-"],
      ["9월","편인","丁","酉","식신","장생","(장생)","庚 상관","-","辛 식신","재살","재살","문창귀인","천주귀인","학당귀인","도화살","-","-"],
      ["8월","정인","丙","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","겁살","겁살","천을귀인","금여","현침살","역마살","-","-"],
      ["7월","편관","乙","未","비견","관대","(양)","丁 편인","乙 편관","己 비견","화개살","화개살","암록","태극귀인","복성귀인","양인살","협록","백호살"],
      ["6월","정관","甲","午","편인","건록","(사)","丙 정인","己 비견","丁 편인","육해살","육해살","건록","현침살","도화살","-","-","-"],
      ["5월","편재","癸","巳","정인","제왕","(태)","戊 겁재","庚 상관","丙 정인","역마살","역마살","공망","협록","낙정관살","천덕귀인","역마살","-"],
      ["4월","정재","壬","辰","겁재","쇠","(묘)","乙 편관","癸 편재","戊 겁재","반안살","반안살","공망","홍염살","원진(日)","월덕귀인","괴강살","명예살"],
      ["3월","식신","辛","卯","편관","병","(절)","甲 정관","-","乙 편관","장성살","장성살","문곡귀인","현침살","도화살","천문성","-","-"],
      ["2월","상관","庚","寅","정관","사","(절)","戊 겁재","丙 정인","甲 정관","망신살","망신살","천복귀인","역마살","-","-","-","-"],
      ["1월","비견","己","丑","비견","묘","(묘)","癸 편재","辛 식신","己 비견","월살","월살","태극귀인","비인살","명예살","-","-","-"]
    ]
  },
  wolun2: {
    data: [
      ["12월","정재","壬","子","편재","절","(제왕)","壬 정재","-","癸 편재","년살","년살","천을귀인","월덕귀인","도화살","-","-","-"],
      ["11월","식신","辛","亥","정재","태","(목욕)","戊 겁재","甲 정관","壬 정재","지살","지살","관귀학관","현침살","고란살","역마살","천문성","-"],
      ["10월","상관","庚","戌","겁재","양","(쇠)","辛 식신","丁 편인","戊 겁재","천살","천살","태극귀인","괴강살","천문성","명예살","-","-"],
      ["9월","비견","己","酉","식신","장생","(장생)","庚 상관","-","辛 식신","재살","재살","문창귀인","천주귀인","학당귀인","도화살","-","-"],
      ["8월","겁재","戊","申","상관","목욕","(병)","戊 겁재","壬 정재","庚 상관","겁살","겁살","천을귀인","금여","현침살","고란살","역마살","-"],
      ["7월","편인","丁","未","비견","관대","(관대)","丁 편인","乙 편관","己 비견","화개살","화개살","암록","태극귀인","복성귀인","양인살","협록","천문성"],
      ["6월","정인","丙","午","편인","건록","(제왕)","丙 정인","己 비견","丁 편인","육해살","육해살","건록","현침살","도화살","-","-","-"],
      ["5월","편관","乙","巳","정인","제왕","(목욕)","戊 겁재","庚 상관","丙 정인","역마살","역마살","공망","협록","낙정관살","천덕귀인","고란살","역마살"],
      ["4월","정관","甲","辰","겁재","쇠","(쇠)","乙 편관","癸 편재","戊 겁재","반안살","반안살","공망","홍염살","원진(日)","현침살","백호살","명예살"],
      ["3월","편재","癸","卯","편관","병","(장생)","甲 정관","-","乙 편관","장성살","장성살","문곡귀인","현침살","도화살","천문성","-","-"],
      ["2월","정재","壬","寅","정관","사","(병)","戊 겁재","丙 정인","甲 정관","망신살","망신살","천복귀인","월덕귀인","역마살","-","-","-"],
      ["1월","식신","辛","丑","비견","묘","(양)","癸 편재","辛 식신","己 비견","월살","월살","태극귀인","비인살","현침살","명예살","-","-"]
    ]
  }
};

function getAux(row: string[], start: number, end: number): string[] {
  return row.slice(start, end).filter(s => s && s.trim() && s !== '-');
}
function compareAux(codeAux: string[], expertAux: string[]): { match: boolean; detail: string } {
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

let totalMatch = 0, totalMismatch = 0;
const mismatches: string[] = [];

// Pillar
console.log('═══ 사주팔자 ═══\n');
const pillarNames = ['시주', '일주', '월주', '년주'];
for (let i = 0; i < 4; i++) {
  const cRow = result.pillar.data[i];
  const eRow = expert.pillar.data[i];
  let allMatch = true;
  for (let j = 0; j < 11; j++) {
    if ((cRow[j]||'') !== (eRow[j]||'')) { allMatch = false; break; }
  }
  console.log(`${pillarNames[i]}: ${allMatch ? '✅' : '❌'}`);
  if (!allMatch) {
    for (let j = 0; j < 11; j++) {
      if ((cRow[j]||'') !== (eRow[j]||'')) console.log(`  [${j}] 코드=[${cRow[j]}] 전문가=[${eRow[j]}]`);
    }
    totalMismatch++; mismatches.push(`pillar/${pillarNames[i]}`);
  } else totalMatch++;
}

// Shinsal
console.log('\n═══ 신살(보조) ═══\n');
for (let i = 0; i < 4; i++) {
  const codeAux = getAux(result.shinsal!.data[i], 4, 12);
  const expertAux = getAux(expert.shinsal.data[i], 4, 12);
  const { match, detail } = compareAux(codeAux, expertAux);
  console.log(`${pillarNames[i]}: ${detail}`);
  if (!match) { console.log(`  코드: [${codeAux}]`); console.log(`  전문가: [${expertAux}]`); }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`shinsal/${pillarNames[i]}`); }
}

// Daeun
console.log('\n═══ 대운 ═══\n');
for (let i = 0; i < result.daeun!.data.length; i++) {
  const cRow = result.daeun!.data[i];
  const eRow = expert.daeun.data[i];
  const codeAux = getAux(cRow, 12, 18);
  const expertAux = getAux(eRow, 12, 18);
  const { match, detail } = compareAux(codeAux, expertAux);
  console.log(`${cRow[0]}세 ${cRow[2]}${cRow[3]}: ${detail}`);
  if (!match) { console.log(`  코드: [${codeAux}]`); console.log(`  전문가: [${expertAux}]`); }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`daeun/${cRow[0]}`); }
}

// Nyunun
console.log('\n═══ 년운 ═══\n');
for (let i = 0; i < result.nyunun!.data.length; i++) {
  const cRow = result.nyunun!.data[i];
  const eRow = expert.nyunun.data[i];
  const codeAux = getAux(cRow, 13, 19);
  const expertAux = getAux(eRow, 13, 19);
  const { match, detail } = compareAux(codeAux, expertAux);
  console.log(`${cRow[0]} ${cRow[3]}${cRow[4]}: ${detail}`);
  if (!match) { console.log(`  코드: [${codeAux}]`); console.log(`  전문가: [${expertAux}]`); }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`nyunun/${cRow[0]}`); }
}

// Wolun (월 라벨 기준 매칭)
function buildExpertMap(data: string[][]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const row of data) map[row[0]] = getAux(row, 12, 18);
  return map;
}

console.log('\n═══ 2026 월운 ═══\n');
const expertWolunMap = buildExpertMap(expert.wolun.data);
for (const cRow of result.wolun!.data) {
  const m = cRow[0];
  const codeAux = getAux(cRow, 12, 18);
  const expertAux = expertWolunMap[m] || [];
  const { match, detail } = compareAux(codeAux, expertAux);
  console.log(`${m} ${cRow[2]}${cRow[3]}: ${detail}`);
  if (!match) { console.log(`  코드: [${codeAux}]`); console.log(`  전문가: [${expertAux}]`); }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`wolun/${m}`); }
}

console.log('\n═══ 2027 월운 ═══\n');
const expertWolun2Map = buildExpertMap(expert.wolun2.data);
for (const cRow of result.wolun2!.data) {
  const m = cRow[0];
  const codeAux = getAux(cRow, 12, 18);
  const expertAux = expertWolun2Map[m] || [];
  const { match, detail } = compareAux(codeAux, expertAux);
  console.log(`${m} ${cRow[2]}${cRow[3]}: ${detail}`);
  if (!match) { console.log(`  코드: [${codeAux}]`); console.log(`  전문가: [${expertAux}]`); }
  if (match) totalMatch++; else { totalMismatch++; mismatches.push(`wolun2/${m}`); }
}

// Summary
console.log('\n═══════════════════════════════════');
console.log(`총 ${totalMatch + totalMismatch}개 항목: ✅ ${totalMatch}개 일치, ❌ ${totalMismatch}개 불일치`);
console.log(`일치율: ${((totalMatch / (totalMatch + totalMismatch)) * 100).toFixed(1)}%`);
if (mismatches.length) console.log(`\n불일치 항목: ${mismatches.join(', ')}`);
