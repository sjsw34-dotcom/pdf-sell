import type { PartPrompt } from './common';

/**
 * Monthly 티어 — AmorMuse 구독자용 월간 운세 리포트
 * 사용 섹션: info, pillar, yongsin, yinyang, wolun
 * PDF 구성: message → overview (1-2) → cautions (1-2) → lucky dates → lucky items → tips (1-2)
 *
 * IMPORTANT: All prompts reference wolun (monthly fortune) data.
 * The system prompt will inject the current month's wolun entry.
 */
export const MONTHLY_PROMPTS: PartPrompt[] = [
  {
    partKey: 'monthly_message',
    title: 'Your Month at a Glance',
    instruction: `Write a personal, warm opening message for {clientName} about this month.

This is the "one message" they'll remember. Think of it as a fortune cookie, but deeper and personalized.

Rules:
- Reference their Day Master element and this month's dominant energy (from wolun data)
- 3-4 sentences maximum. Impactful, poetic but accessible.
- Do NOT use generic phrases like "this month brings change." Be specific to their chart.
- Mention ONE concrete thing they should pay attention to.
- Tone: warm, wise, like a trusted friend who reads energy.

Target: 60-80 words, 1 paragraph. Quality over quantity.`,
  },
  {
    partKey: 'monthly_overview',
    title: "This Month's Fortune",
    instruction: `Write a detailed overview of {clientName}'s fortune for this month.

Analyze based on:
1. This month's Heavenly Stem and Earthly Branch from wolun data — what energy dominates
2. How this month's Ten God interacts with {clientName}'s Day Master — harmony or tension
3. The Twelve Life Stage active this month — what phase of the cycle they're in
4. How the month's element balance affects their overall five-element distribution
5. The Yongsin alignment — is this month's energy favorable (용신/희신) or challenging (기신/구신)?

Write in flowing prose. Be specific — name the actual stems, branches, and ten gods from the data.
Make it feel like a personalized reading, not a horoscope column.

Target: 500-600 words, 5-6 paragraphs.`,
  },
  {
    partKey: 'monthly_overview_2',
    title: "This Month's Fortune (continued)",
    instruction: `Continue the monthly fortune analysis for {clientName}.

Focus on:
1. Career and productivity energy this month — based on ten god patterns (재성=wealth, 관성=authority, 식상=creativity)
2. Social and relationship dynamics — not romantic love, but interpersonal energy and communication style this month
3. Health and energy levels — which element is excessive or depleted, and what that means physically
4. The hidden stems in this month's branch — subtle undercurrents that may surface mid-month

End with a brief summary of the month's overall trajectory: "The first half... the second half..."

Target: 400-500 words, 4-5 paragraphs.`,
  },
  {
    partKey: 'monthly_cautions',
    title: 'Dates to Watch',
    instruction: `Identify specific dates and periods this month that {clientName} should be careful about.

Analyze based on:
1. Days when this month's branch clashes (충) or harms (해) with {clientName}'s chart pillars
2. Any spirit stars (신살) active this month that signal caution
3. The 12 Life Stage transition points — when energy shifts suddenly
4. If the month's stem/branch creates 형 (punishment) or 파 (destruction) with existing pillars

For each caution period:
- State the approximate date range (e.g., "Around the 7th-10th")
- Explain WHAT to watch for (not just "be careful" — specify: finances? communication? health? travel?)
- Give ONE concrete action to mitigate it

Format each caution as a separate paragraph starting with the date range.

Target: 400-500 words, 4-6 caution entries.`,
  },
  {
    partKey: 'monthly_lucky_dates',
    title: 'Lucky Dates',
    instruction: `Identify the most fortunate dates this month for {clientName}.

Analyze based on:
1. Days when the daily stem/branch harmonizes (합) with {clientName}'s Day Master or favorable elements
2. Days aligned with the Yongsin (용신) element
3. Auspicious spirit stars active on specific dates
4. Traditional lucky day patterns from the Earthly Branch cycle

For each lucky date:
- State the date or range
- Explain WHY it's favorable (which element/interaction makes it lucky)
- Suggest what to DO on that day: sign contracts? start projects? important conversations? travel?

Include 4-6 lucky dates spread across the month.
Format each as a separate paragraph starting with the date.

Target: 350-450 words.`,
  },
  {
    partKey: 'monthly_lucky_items',
    title: 'Lucky Colors, Directions & Items',
    instruction: `Recommend lucky colors, directions, numbers, and items for {clientName} this month.

Base ALL recommendations on their Yongsin (favorable element) and this month's energy:

1. LUCKY COLORS (2-3):
   - Primary color aligned with Yongsin element (Wood=green, Fire=red, Earth=yellow/brown, Metal=white/silver, Water=black/blue)
   - Secondary color from Huisin (supporting element)
   - State where to use them: clothing, accessories, workspace

2. LUCKY DIRECTIONS (1-2):
   - Based on the favorable element's associated direction
   - Suggest practical use: which direction to face when working, travel direction

3. LUCKY NUMBERS (2-3):
   - Element-based number associations
   - Practical use: choosing dates, floor numbers, meeting times

4. LUCKY ITEMS (2-3):
   - Physical items that carry the beneficial element's energy
   - Be creative but practical: plants (Wood), candles (Fire), crystals (Metal), etc.

5. THINGS TO AVOID:
   - Colors/directions/items associated with the challenging element (기신)

Target: 400-500 words.`,
  },
  {
    partKey: 'monthly_tips',
    title: 'Action Tips for This Month',
    instruction: `Write practical, actionable tips for {clientName} to make the most of this month.

Create 5-6 specific action tips based on their chart + this month's energy:

1. MORNING ROUTINE TIP — aligned with the month's dominant element
2. WORK/PRODUCTIVITY TIP — based on which ten god energy is strongest
3. SOCIAL TIP — how to navigate relationships this month
4. SELF-CARE TIP — addressing the element that's depleted or excessive
5. MINDSET TIP — based on the Twelve Life Stage active this month
6. END-OF-MONTH PREP — what to prepare for next month's incoming energy

Rules:
- Each tip must be SPECIFIC and ACTIONABLE (not "be positive" but "spend 10 minutes journaling about X")
- Connect each tip to actual chart data — explain WHY this tip matters for their specific energy
- Keep it warm and encouraging, not preachy

Target: 450-550 words.`,
  },
  {
    partKey: 'monthly_tips_2',
    title: 'Action Tips (continued)',
    instruction: `Write additional practical guidance for {clientName} this month.

Focus on:
1. WEEKLY RHYTHM — brief guidance for each week of the month based on energy flow
   - Week 1: ...
   - Week 2: ...
   - Week 3: ...
   - Week 4: ...

2. ONE THING TO LET GO — based on challenging elements, what habit or mindset to release this month

3. ONE THING TO EMBRACE — based on favorable elements, what new practice to adopt

End with an encouraging closing thought specific to their chart energy this month.

Target: 350-400 words.`,
  },
];
