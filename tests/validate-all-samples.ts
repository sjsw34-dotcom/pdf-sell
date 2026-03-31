import * as fs from 'fs';
import * as path from 'path';
import { calculateSaju } from '../src/lib/saju/calculator';

function findJsonFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findJsonFiles(full));
    else if (entry.name.endsWith('.json')) results.push(full);
  }
  return results;
}

const files = findJsonFiles('sample');
let totalChecks = 0;
let totalMatches = 0;
let totalMismatches = 0;
const issues: string[] = [];

for (const file of files) {
  try {
    const expert = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (!expert.pillar || !expert.daeun) continue;

    const fname = path.basename(file);

    // Extract birth info from expert
    const infoStr = expert.info.data[1][1]; // "양력 : 1992년 01월 10일 02:57 (보정 : -30분)"
    const nameStr = expert.info.data[1][0]; // "[女] Name (35세)"
    const genderMatch = nameStr.match(/\[(男|女)\]/);
    const gender = genderMatch?.[1] === '男' ? '남' : '여';

    // We can't easily reconstruct exact input, so compare fortune shinsals only
    // Compare daeun shinsals between expert and code
    // Since we can't run calculator without exact birth time, skip this approach

    // Instead, compare the shinsal RULES directly by checking expert daeun data
    // For each daeun entry, check if our rules would produce the same shinsals

    const dayStem = expert.pillar.data[1][1];
    const dayBranch = expert.pillar.data[1][2];
    const monthBranch = expert.pillar.data[2][2];
    const yearBranch = expert.pillar.data[3][2];

    // Check pillar shinsals (4 pillars, slots 4-11)
    for (let i = 0; i < 4; i++) {
      const row = expert.shinsal.data[i];
      const expertShinsals = row.slice(4, 12).filter((s: string) => s && s.trim());
      totalChecks++;

      // We just count and report for now
    }

    // Check daeun shinsals
    for (const row of expert.daeun.data) {
      const expertAux = row.slice(12, 18).filter((s: string) => s && s.trim() && s !== '-');
      if (expertAux.length === 0) continue;

      totalChecks++;
    }

  } catch (e) {
    // skip
  }
}

// Now do a focused comparison: run calculator on a few known samples and compare
// Sample 1: sample_saju.json (Female, 1992-01-10, ~02:57)
console.log('=== SAMPLE-BY-SAMPLE DAEUN VALIDATION ===\n');

// We'll compare expert daeun shinsals directly since we extracted them
// Focus on checking if specific shinsals that changed now match

interface SampleCheck {
  file: string;
  dayStem: string;
  checks: { label: string; stem: string; branch: string; expertAux: string[] }[];
}

const samples: SampleCheck[] = [];

for (const file of files) {
  try {
    const expert = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (!expert.pillar || !expert.daeun) continue;

    const fname = path.basename(file);
    const dayStem = expert.pillar.data[1][1];
    const checks: SampleCheck['checks'] = [];

    // Check all daeun entries
    for (const row of expert.daeun.data) {
      const aux = row.slice(12, 18).filter((s: string) => s && s.trim() && s !== '-');
      if (aux.length > 0) {
        checks.push({
          label: `daeun${row[0]}`,
          stem: row[2],
          branch: row[3],
          expertAux: aux,
        });
      }
    }

    samples.push({ file: fname, dayStem, checks });
  } catch (e) {
    // skip
  }
}

// Import shinsal rules to test
import {
  isDoHwaSal, isBaekHoSal, isMyungYeSal, isGwaeGangSal, isGoRanSal,
  isCheonMunSeong, isHyunChimSal, isCheonBokGwiIn, isBiInSal,
  isNakJeongGwanSal, isCheonJuGwiIn,
} from '../src/lib/saju/shinsal-rules';

// Validate specific rules across all samples
const ruleChecks = {
  '도화살': { fn: (s: string, b: string) => isDoHwaSal(b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
  '백호살': { fn: (s: string, b: string) => isBaekHoSal(s as any, b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
  '명예살': { fn: (s: string, b: string) => isMyungYeSal(b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
  '괴강살': { fn: (s: string, b: string) => isGwaeGangSal(s as any, b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
  '고란살': { fn: (s: string, b: string) => isGoRanSal(s as any, b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
  '천문성': { fn: (s: string, b: string) => isCheonMunSeong(b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
  '현침살': { fn: (s: string, b: string) => isHyunChimSal(s as any, b as any), match: 0, miss: 0, falsePos: 0, details: [] as string[] },
};

for (const sample of samples) {
  for (const check of sample.checks) {
    for (const [name, rule] of Object.entries(ruleChecks)) {
      const expertHas = check.expertAux.includes(name);
      const codeHas = rule.fn(check.stem, check.branch);

      if (expertHas && codeHas) rule.match++;
      else if (expertHas && !codeHas) {
        rule.miss++;
        if (rule.details.length < 3) {
          rule.details.push(`MISS: ${sample.file} ${check.label} ${check.stem}${check.branch} (day=${sample.dayStem})`);
        }
      } else if (!expertHas && codeHas) {
        rule.falsePos++;
        if (rule.details.length < 3) {
          rule.details.push(`FALSE+: ${sample.file} ${check.label} ${check.stem}${check.branch} (day=${sample.dayStem})`);
        }
      }
    }
  }
}

console.log('RULE VALIDATION RESULTS (daeun only, all samples):\n');
for (const [name, rule] of Object.entries(ruleChecks)) {
  const total = rule.match + rule.miss;
  const accuracy = total > 0 ? ((rule.match / total) * 100).toFixed(1) : 'N/A';
  const status = rule.miss === 0 && rule.falsePos === 0 ? '✅' : rule.miss > 0 ? '⚠️' : '🔸';
  console.log(`${status} ${name}: match=${rule.match} miss=${rule.miss} falsePos=${rule.falsePos} accuracy=${accuracy}%`);
  for (const d of rule.details) {
    console.log(`    ${d}`);
  }
}
