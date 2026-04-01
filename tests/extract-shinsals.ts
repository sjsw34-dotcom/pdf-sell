import * as fs from 'fs';
import * as path from 'path';

function findJsonFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findJsonFiles(full));
    else if (entry.name.endsWith('.json')) results.push(full);
  }
  return results;
}

interface ShinsalCase {
  file: string;
  dayStem: string;
  yearBranch: string;
  monthBranch: string;
  dayBranch: string;
  pillarShinsals: { pillar: string; stem: string; branch: string; shinsals: string[] }[];
  fortuneShinsals: { type: string; stem: string; branch: string; shinsals: string[] }[];
}

const files = findJsonFiles('sample');
const allCases: ShinsalCase[] = [];

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (!data.pillar || !data.shinsal) continue;

    const pillar = data.pillar.data;
    const dayStem = pillar[1][1];
    const dayBranch = pillar[1][2];
    const monthBranch = pillar[2][2];
    const yearBranch = pillar[3][2];

    const cas: ShinsalCase = {
      file: path.basename(file),
      dayStem, yearBranch, monthBranch, dayBranch,
      pillarShinsals: [],
      fortuneShinsals: [],
    };

    const shinsalData = data.shinsal.data;
    const pillarNames = ['시주', '일주', '월주', '년주'];
    for (let i = 0; i < 4; i++) {
      const row = shinsalData[i];
      const details: string[] = [];
      for (let j = 4; j <= 11; j++) {
        if (row[j] && row[j].trim()) details.push(row[j].trim());
      }
      cas.pillarShinsals.push({
        pillar: pillarNames[i],
        stem: pillar[i][1],
        branch: pillar[i][2],
        shinsals: details,
      });
    }

    if (data.daeun?.data) {
      for (const row of data.daeun.data) {
        const shinsals: string[] = [];
        for (let j = 12; j <= 17; j++) {
          if (row[j] && row[j].trim() && row[j] !== '-') shinsals.push(row[j].trim());
        }
        cas.fortuneShinsals.push({ type: 'daeun' + row[0], stem: row[2], branch: row[3], shinsals });
      }
    }

    if (data.nyunun?.data) {
      for (const row of data.nyunun.data) {
        const shinsals: string[] = [];
        for (let j = 13; j <= 18; j++) {
          if (row[j] && row[j].trim() && row[j] !== '-') shinsals.push(row[j].trim());
        }
        cas.fortuneShinsals.push({ type: 'nyunun' + row[0], stem: row[3], branch: row[4], shinsals });
      }
    }

    for (const wolKey of ['wolun', 'wolun2']) {
      if (data[wolKey]?.data) {
        for (const row of data[wolKey].data) {
          const shinsals: string[] = [];
          for (let j = 12; j <= 17; j++) {
            if (row[j] && row[j].trim() && row[j] !== '-') shinsals.push(row[j].trim());
          }
          cas.fortuneShinsals.push({ type: wolKey + row[0], stem: row[2], branch: row[3], shinsals });
        }
      }
    }

    allCases.push(cas);
  } catch (e) {
    // skip
  }
}

// Build reverse lookup
const shinsalTypes = new Map<string, { dayStem: string; targetBranch: string; targetStem: string; monthBranch: string; yearBranch: string; dayBranch: string; source: string }[]>();

for (const cas of allCases) {
  for (const p of cas.pillarShinsals) {
    for (const s of p.shinsals) {
      if (!shinsalTypes.has(s)) shinsalTypes.set(s, []);
      shinsalTypes.get(s)!.push({
        dayStem: cas.dayStem, targetBranch: p.branch, targetStem: p.stem,
        monthBranch: cas.monthBranch, yearBranch: cas.yearBranch, dayBranch: cas.dayBranch,
        source: cas.file + '/' + p.pillar,
      });
    }
  }
  for (const f of cas.fortuneShinsals) {
    for (const s of f.shinsals) {
      if (!shinsalTypes.has(s)) shinsalTypes.set(s, []);
      shinsalTypes.get(s)!.push({
        dayStem: cas.dayStem, targetBranch: f.branch, targetStem: f.stem,
        monthBranch: cas.monthBranch, yearBranch: cas.yearBranch, dayBranch: cas.dayBranch,
        source: cas.file + '/' + f.type,
      });
    }
  }
}

console.log('=== ' + allCases.length + ' samples analyzed ===\n');
for (const cas of allCases) {
  console.log(cas.file + ': day=' + cas.dayStem + ' year=' + cas.yearBranch + ' month=' + cas.monthBranch + ' dayBr=' + cas.dayBranch);
}

const focusShinsals = ['현침살', '백호살', '명예살', '천복귀인', '도화살', '천문성', '복성귀인', '음착살', '금여', '홍염살', '괴강살', '고란살', '비인살', '낙정관살', '문곡귀인', '학당귀인', '천주귀인'];

console.log('\n=== SHINSAL REVERSE ENGINEERING ===\n');

for (const name of focusShinsals) {
  const entries = shinsalTypes.get(name);
  if (!entries) { console.log('X ' + name + ': NOT FOUND'); continue; }

  console.log('\n-- ' + name + ' (' + entries.length + ' occurrences) --');

  const byDayStem = new Map<string, Set<string>>();
  for (const e of entries) {
    if (!byDayStem.has(e.dayStem)) byDayStem.set(e.dayStem, new Set());
    byDayStem.get(e.dayStem)!.add(e.targetBranch);
  }
  console.log('  dayStem -> targetBranch:');
  for (const [stem, branches] of [...byDayStem.entries()].sort()) {
    console.log('    ' + stem + ' -> [' + [...branches].join(', ') + ']');
  }

  for (const e of entries.slice(0, 8)) {
    console.log('    ex: day=' + e.dayStem + ' tgt=' + e.targetStem + e.targetBranch + ' mo=' + e.monthBranch + ' yr=' + e.yearBranch + ' dayBr=' + e.dayBranch + ' (' + e.source + ')');
  }
  if (entries.length > 8) console.log('    ... +' + (entries.length - 8) + ' more');
}

// 현침살 deep analysis
console.log('\n\n=== HYUNCHIMSAL DEEP ANALYSIS ===');
const hyunchim = shinsalTypes.get('현침살') || [];
console.log('Total: ' + hyunchim.length);
const combos = new Map<string, number>();
for (const e of hyunchim) {
  const c = e.targetStem + e.targetBranch;
  combos.set(c, (combos.get(c) || 0) + 1);
}
console.log('Stem+Branch combos:');
for (const [c, n] of [...combos.entries()].sort()) {
  console.log('  ' + c + ': ' + n);
}

// 도화살 deep analysis
console.log('\n=== DOHWASAL DEEP ANALYSIS ===');
const dohwa = shinsalTypes.get('도화살') || [];
for (const e of dohwa) {
  // Standard: 寅午戌->卯, 巳酉丑->午, 申子辰->酉, 亥卯未->子
  const stdYear = getStdDohwa(e.yearBranch);
  const stdDay = getStdDohwa(e.dayBranch);
  const match = (stdYear === e.targetBranch) ? 'yearMatch' : (stdDay === e.targetBranch) ? 'dayMatch' : 'NEITHER';
  console.log('  tgt=' + e.targetBranch + ' yr=' + e.yearBranch + '(std=' + stdYear + ') day=' + e.dayBranch + '(std=' + stdDay + ') => ' + match + ' (' + e.source + ')');
}

function getStdDohwa(branch: string): string {
  const m: Record<string, string> = {
    '子': '酉', '丑': '午', '寅': '卯', '卯': '子',
    '辰': '酉', '巳': '午', '午': '卯', '未': '子',
    '申': '酉', '酉': '午', '戌': '卯', '亥': '子',
  };
  return m[branch] || '?';
}

// 천문성 deep analysis
console.log('\n=== CHEONMUNSEONG DEEP ANALYSIS ===');
const cheonmun = shinsalTypes.get('천문성') || [];
const cmBranches = new Map<string, number>();
for (const e of cheonmun) {
  cmBranches.set(e.targetBranch, (cmBranches.get(e.targetBranch) || 0) + 1);
}
console.log('Branch distribution:', Object.fromEntries([...cmBranches.entries()].sort()));
