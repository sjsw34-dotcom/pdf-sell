import type { PartPrompt } from './common';

/**
 * Full 티어 — Part 1~8 (각 2챕터)
 * 사용 섹션: info, pillar, yongsin, yinyang, shinsal, hyungchung, daeun
 */
export const FULL_PROMPTS: PartPrompt[] = [
  // ─── Part 1: 사주 상세 분석 ───
  {
    partKey: 'part1_ch1',
    title: 'Pillar-by-Pillar Analysis',
    instruction: `Analyze each of {clientName}'s four pillars individually.

For each pillar (Hour → Day → Month → Year):
1. Name the Heavenly Stem and Earthly Branch using the 3-layer system
2. Explain the Ten God relationship to the Day Master
3. Describe the Twelve Life Stage and its practical meaning
4. How this pillar influences a specific life domain (Hour=legacy/children, Day=self/spouse, Month=career/society, Year=ancestry/early life)

Connect the pillars to show how they interact as a system, not just isolated parts.

Target: 400-500 words, 4 paragraphs.`,
  },
  {
    partKey: 'part1_ch2',
    title: 'Hidden Stems & Napeum',
    instruction: `Analyze the hidden stems (지장간) and Napeum Five Elements (납음오행) in {clientName}'s chart.

Cover:
1. The hidden stems within each Earthly Branch — yeogi, junggi, bongi — and what they reveal about subconscious drives
2. Where hidden stems reinforce surface-level patterns vs. where they create internal tension
3. The Napeum Five Elements for each pillar — these poetic elemental images and their symbolic meaning
4. The strength details (득지/실지, 득령/실령, 득세/실세) and their combined assessment

These are the "underwater currents" of {clientName}'s chart — the energies others don't see.

Target: 300-400 words, 3-4 paragraphs.`,
  },

  // ─── Part 2: 황금기 ───
  {
    partKey: 'part2_ch1',
    title: 'Peak Decades (Golden Period)',
    instruction: `Identify {clientName}'s Golden Periods using the Major Luck Cycle (Daeun) data.

Cover:
1. Which decade(s) align most favorably with their Key Balancer (用神) element
2. The specific Heavenly Stem and Earthly Branch of these peak cycles and why they're supportive
3. What "golden" looks like practically — career breakthroughs, relationship deepening, financial growth, or creative output
4. The current or approaching Major Luck Cycle and how to maximize it

Reference the actual Daeun data: ages, stems, branches, ten gods.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part2_ch2',
    title: 'Seasonal & Daily Timing',
    instruction: `Map {clientName}'s optimal seasonal and daily timing patterns.

Cover:
1. Best months of the year — which Earthly Branches support the Day Master
2. Challenging months — when the Challenge Element (忌神) energy peaks
3. Daily rhythms — the birth hour's influence on peak productivity and energy cycles
4. Day-of-week and seasonal planning strategies derived from the Five Elements

Provide 2-3 concrete timing rules {clientName} can apply immediately.

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Part 3: 연애운 ───
  {
    partKey: 'part3_ch1',
    title: 'Your Romantic Archetype',
    instruction: `Analyze {clientName}'s romantic destiny through the lens of their Four Pillars.

Cover:
1. Day Pillar as romantic core — what the Stem-Branch combination means for love
2. Wealth stars (Direct/Indirect) and Officer stars (Direct/Indirect) as romantic indicators
3. The romantic archetype their chart creates — name it with a memorable phrase
4. Patterns that repeat in relationships and their elemental source

Reference specific chart data: which pillars carry romance-relevant stars.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part3_ch2',
    title: 'Love Timing & Compatibility',
    instruction: `Map {clientName}'s romantic timeline and compatibility factors.

Cover:
1. The best Daeun decades for romantic milestones (meeting a partner, deepening commitment)
2. Elemental compatibility — which Day Master elements in a partner create harmony
3. The role of Spirit Stars (Charm & Attraction, Solitude, etc.) in romantic patterns
4. Practical compatibility advice based on the chart's specific energies

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Part 4: 재물운 ───
  {
    partKey: 'part4_ch1',
    title: 'Wealth Pattern Analysis',
    instruction: `Analyze {clientName}'s wealth destiny through their Four Pillars.

Cover:
1. Direct Wealth vs. Indirect Wealth stars — which dominates and what this means for income style
2. The Yongsin element's connection to wealth generation — which industries/fields align
3. Hidden Wealth indicators in the hidden stems
4. The overall wealth pattern: steady accumulation, windfall-oriented, or creative monetization

Reference the actual count and positions of Wealth stars in the chart.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part4_ch2',
    title: 'Prosperous Periods & Financial Strategy',
    instruction: `Identify {clientName}'s most financially prosperous periods and provide strategic guidance.

Cover:
1. Peak wealth decades from the Daeun data — which cycles bring financial support
2. Financial caution periods — when speculative risks are highest
3. Long-term wealth strategy aligned with the chart's elemental strengths
4. 2-3 practical financial principles derived from the chart

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Part 5: 직업운 ───
  {
    partKey: 'part5_ch1',
    title: 'Ideal Career Fields',
    instruction: `Analyze {clientName}'s career destiny and recommend professional directions.

Cover:
1. The Ten Gods pattern as a career indicator — Officer energy (authority/structure), Wealth energy (entrepreneurship), Seal energy (academia/mentorship), Expression energy (creative/communication)
2. Elemental career affinities — specific fields aligned with the Key Balancer element
3. The Hour Pillar as the pillar of legacy — what the late career looks like
4. 3-5 specific career field recommendations with elemental reasoning

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part5_ch2',
    title: 'Leadership & Work Style',
    instruction: `Describe {clientName}'s leadership style and optimal work environment.

Cover:
1. Leadership archetype — commanding vs. collaborative vs. expertise-based
2. Ideal work environment — structured vs. flexible, solo vs. team
3. Professional growth trajectory — early career vs. mid-career vs. legacy phase
4. Work-life balance considerations based on strength classification

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Part 6: 건강 ───
  {
    partKey: 'part6_ch1',
    title: 'Constitutional Health Profile',
    instruction: `Analyze {clientName}'s constitutional health tendencies through the Five Elements.

Cover:
1. Elemental excess and deficiency — which organ systems are under pressure
2. The Five Elements health mapping: Wood=liver/eyes, Fire=heart/circulation, Earth=stomach/digestion, Metal=lungs/skin, Water=kidneys/bones
3. The strength classification's impact on energy levels and stress processing
4. Constitutional vulnerabilities to be aware of (framed as tendencies, not diagnoses)

DISCLAIMER: Frame as "energetic tendencies," not medical advice.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part6_ch2',
    title: 'Seasonal Health & Elemental Remedies',
    instruction: `Provide seasonal health guidance and elemental remedies for {clientName}.

Cover:
1. Most vulnerable seasons and why (elemental reasoning)
2. Preventive strategies for each season
3. Elemental remedies: diet (foods aligned with Key Balancer), exercise, lifestyle practices
4. Stress management approach specific to the chart's strength classification

Provide 3-4 actionable health practices.

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Part 7: 귀인/신살 ───
  {
    partKey: 'part7_ch1',
    title: 'Your Protective Stars',
    instruction: `Analyze the positive and neutral Spirit Stars (shinsal) in {clientName}'s chart.

Cover:
1. Guardian Angel Star (天乙貴人) and other Noble Stars — their positions and protective influence
2. Talent and career stars: Scholar, Academic, Artistic stars
3. Neutral/dual-nature stars: Charm & Attraction, Travel & Change, Leadership, etc.
4. How to consciously activate these protective energies

Use the shinsal data to identify which stars appear in which pillars.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'part7_ch2',
    title: 'Cautionary Stars & Growth Guidance',
    instruction: `Analyze the caution-level Spirit Stars in {clientName}'s chart.

Cover:
1. Which caution stars are present and in which pillars
2. How each star manifests in practical life — specific scenarios
3. Mitigation strategies: timing awareness, behavioral adjustments, elemental remedies
4. Reframing: how each "challenge star" also carries a hidden gift

IMPORTANT: Frame EVERY caution star as containing a growth opportunity. No fear-based language.

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Part 8: 대운/개운 ───
  {
    partKey: 'part8_ch1',
    title: 'Decade-by-Decade Life Overview',
    instruction: `Analyze each Major Luck Cycle (Daeun) from {clientName}'s data.

For each decade (summarize key points, don't exhaustively list all 10):
1. Age range, Heavenly Stem, Earthly Branch
2. Dominant Ten God energy and its life theme
3. Key Spirit Stars active in this cycle
4. One-sentence summary: the decade's promise

Identify the current cycle and provide focused guidance for now.

Target: 400-500 words, 4-5 paragraphs.`,
  },
  {
    partKey: 'part8_ch2',
    title: 'Destiny Modification (改運)',
    instruction: `Provide specific destiny modification advice for {clientName}.

Cover:
1. Colors to wear and use (derived from Key Balancer and Lucky Support elements)
2. Directions and spatial arrangement (home, office, travel)
3. Dietary recommendations (foods aligned with needed elements)
4. Timing strategies (best months/seasons for major decisions)
5. Relationship strategies (which elemental types to seek as allies)
6. Daily habits and rituals for elemental balance

Provide 5-6 immediately actionable recommendations.

Target: 300-400 words, 3-4 paragraphs.`,
  },
];
