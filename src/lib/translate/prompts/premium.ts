import type { PartPrompt } from './common';
import { FULL_PROMPTS } from './full';

/**
 * Premium 티어 — Full (Part 1~8) + Part 9~10
 * Part 9: 년운 (intro + 년도별 개별 호출 가능)
 * Part 10: 월운 (intro + 월별 개별 호출 가능)
 * 사용 섹션: 전체 (info ~ wolun2)
 */

// 월 이름 — 배열 초기화 전에 선언 필수
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Full의 Part 1~8을 그대로 포함
export const PREMIUM_PROMPTS: PartPrompt[] = [
  ...FULL_PROMPTS,

  // ─── Part 9: 올해 운세 (Premium 전용) ───
  {
    partKey: 'this_year_forecast',
    title: 'This Year\'s Fortune Forecast',
    instruction: `Write a comprehensive fortune forecast for {clientName}'s CURRENT YEAR (use the wolun/monthly fortune data to identify the year).

This is the crown jewel of the Premium report — a detailed, actionable guide for the year ahead.

Cover:
1. The year's Heavenly Stem and Earthly Branch — what they mean for {clientName}'s Day Master
2. The dominant Ten God energy this year — which life domains are activated
3. Key Spirit Stars active this year — protective and cautionary
4. A quarterly roadmap: Q1 (theme), Q2 (peak opportunity), Q3 (challenges to navigate), Q4 (harvest and preparation)
5. Monthly highlights — the 2-3 best months and 1-2 months requiring caution
6. Specific action items: career moves, relationship milestones, financial decisions, health priorities
7. Lucky elements: colors, directions, activities that amplify this year's positive energy

Write as an empowering, practical guide. {clientName} should finish reading this section with a clear plan for the year.

Target: 500-600 words, 4-5 paragraphs.`,
  },

  // ─── Part 10: 10년 운세 개요 ───
  {
    partKey: 'part9_intro',
    title: 'Annual Fortune Overview',
    instruction: `Write an overview of {clientName}'s Annual Fortune (Nyunun) spanning the provided years.

Cover:
1. The overall trajectory arc — is the decade one of ascent, consolidation, or transformation?
2. Key transition years where the dominant element shifts significantly
3. Which years align with the Key Balancer (用神) — mark these as power years
4. Which years carry Challenge Element (忌神) energy — mark these as patience years
5. A roadmap metaphor tying the years together into a coherent narrative

Reference 2-3 specific years with their stems and branches.

Target: 300-400 words, 3 paragraphs.`,
  },
  {
    partKey: 'part9_ch1',
    title: 'Near-Term Annual Fortune',
    instruction: `Analyze the first 3-4 years of {clientName}'s Annual Fortune data in detail.

For each year cover:
1. The Heavenly Stem and Earthly Branch and their interaction with the natal chart
2. The Ten Gods active in this year — what life domain they activate
3. Key Spirit Stars — protective and cautionary
4. One concrete recommendation for the year

Write as a flowing narrative, not a year-by-year list. Group related years together.

Target: 400-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part9_ch2',
    title: 'Long-Term Annual Fortune',
    instruction: `Analyze the remaining years of {clientName}'s Annual Fortune data (typically 7-8 years).

Cover:
1. Long-term trends and elemental shifts
2. The most pivotal single year in this range — why it matters
3. Strategic positioning: what to build now to capitalize on future favorable years
4. An empowering closing statement about {clientName}'s long-term destiny arc

Group thematically rather than chronologically where it makes narrative sense.

Target: 400-500 words, 3-4 paragraphs.`,
  },

  // ─── Part 9: 년도별 개별 프롬프트 (12회 호출 가능) ───
  ...generateYearPrompts(),

  // ─── Part 10: 월운 ───
  {
    partKey: 'part10_intro',
    title: 'Monthly Fortune Overview',
    instruction: `Write an overview of {clientName}'s Monthly Fortune (Wolun) data.

Cover:
1. How monthly energies layer on top of the annual and natal chart
2. The general monthly rhythm — which months tend to be strongest and weakest for this chart type
3. How to use the monthly fortune as a planning tool
4. Brief mention of the most and least favorable months in the data

Target: 250-350 words, 2-3 paragraphs.`,
  },
  {
    partKey: 'part10_ch1',
    title: 'First Half Monthly Fortune (Jan–Jun)',
    instruction: `Analyze {clientName}'s January through June monthly fortune in detail.

For each month cover:
1. Heavenly Stem, Earthly Branch, and their interaction with the natal chart
2. The Ten God energy active this month — career, love, or health implications
3. Notable Spirit Stars and their practical influence
4. One specific action recommendation

Write as flowing narrative. Group months with similar energy together.

Target: 400-500 words, 4 paragraphs.`,
  },
  {
    partKey: 'part10_ch2',
    title: 'Second Half Monthly Fortune (Jul–Dec)',
    instruction: `Analyze {clientName}'s July through December monthly fortune in detail.

For each month cover:
1. Monthly energy signature and its interaction with the natal chart
2. Career, love, and health highlights
3. Key Spirit Stars
4. One actionable monthly tip

End with a year-end summary: what was this year about and what it prepared {clientName} for.

Target: 400-500 words, 4 paragraphs.`,
  },

  // ─── Part 10: 월별 개별 프롬프트 (12회 호출 가능) ───
  ...generateMonthPrompts(),
];

// ─── 년도별 프롬프트 생성기 ───

function generateYearPrompts(): PartPrompt[] {
  const years: PartPrompt[] = [];
  for (let y = 2025; y <= 2035; y++) {
    years.push({
      partKey: `year_${y}`,
      title: `Annual Fortune — ${y}`,
      instruction: `Analyze {clientName}'s fortune for the year ${y} specifically.

Using the nyunun data for ${y}, cover:
1. The Heavenly Stem and Earthly Branch of ${y} — their elemental nature
2. How these energies interact with {clientName}'s Day Master and Key Balancer
3. The Ten Gods active this year — which life domains are activated (career, love, health, wealth)
4. The Twelve Life Stage for this year — the energetic phase
5. Spirit Stars active in ${y} — highlight 2-3 most impactful ones
6. A concrete quarterly roadmap: Q1 (focus), Q2 (opportunity), Q3 (caution/growth), Q4 (harvest/preparation)

Address {clientName} by name. End with an empowering statement about what ${y} offers.

Target: 300-400 words, 3-4 paragraphs.`,
    });
  }
  return years;
}

// ─── 월별 프롬프트 생성기 ───

function generateMonthPrompts(): PartPrompt[] {
  const months: PartPrompt[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push({
      partKey: `month_${m}`,
      title: `Monthly Fortune — ${MONTH_NAMES[m]}`,
      instruction: `Analyze {clientName}'s fortune for ${MONTH_NAMES[m]} specifically.

Using the wolun data for month ${m}, cover:
1. The Heavenly Stem and Earthly Branch of this month
2. Interaction with {clientName}'s natal chart — supportive or challenging?
3. Ten God energy: career impact, romantic energy, financial outlook
4. Spirit Stars active this month — highlight the most impactful 1-2
5. Best days/weeks within the month and activities to prioritize
6. One specific, actionable recommendation for ${MONTH_NAMES[m]}

Keep it concise and practical — this is a planning tool.

Target: 200-300 words, 2-3 paragraphs.`,
    });
  }
  return months;
}
