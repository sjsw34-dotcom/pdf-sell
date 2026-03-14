import type { PartPrompt } from './common';

/**
 * Love 티어 — Ch.1~3 인트로 + Part 1~6 + Callout 6종
 * 사용 섹션: info, pillar, yongsin, yinyang, shinsal, nyunun
 *
 * 톤: 감성적, 현대적, 친근한 2인칭. 사주 용어를 연애 언어로 풀어서 설명.
 * 구체적 액션 플랜 포함 (시기, 장소, 상황별 멘트 예시).
 */

const LOVE_TONE = `
[Love Tier Tone Rules]
- Write as if you're a wise, warm friend who also happens to be a cosmic love expert.
- Use modern, relatable language — "your romantic superpower," "dating energy," "love blueprint."
- Minimize classical/original terminology usage — keep it light, use Natural names primarily.
- Include at least one concrete, actionable tip per chapter (a date idea, a timing suggestion, a behavioral insight).
- Address {clientName} by name frequently to create intimacy.
- Use vivid sensory metaphors: seasons, weather, music, taste — not abstract philosophy.
`.trim();

export const LOVE_PROMPTS: PartPrompt[] = [
  // ─── Ch.1~3 인트로 ───
  {
    partKey: 'love_ch1',
    title: 'Your Four Pillars & Love',
    instruction: `${LOVE_TONE}

Analyze {clientName}'s Four Pillars through the lens of romantic destiny.

Cover:
1. How each pillar influences their love life — Hour (inner desires), Day (core romantic self), Month (how partners perceive them), Year (family/societal influence on love)
2. The overall romantic energy signature of the chart
3. What the Day Master element means for how they experience love

Make the reader feel like they're discovering their romantic DNA for the first time. End with a teaser for what's coming in the deeper analysis.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'love_ch2',
    title: 'Day Master Romance Personality',
    instruction: `${LOVE_TONE}

Deep-dive into {clientName}'s Day Master element as a romantic archetype.

Cover:
1. How their Day Master falls in love — fast or slow, intense or gentle, loyal or adventurous
2. Emotional needs and attachment style through the Saju lens
3. The Day Pillar (Stem + Branch) combination as a romantic metaphor
4. How the strength classification affects their romantic behavior — do they lead or follow in love?

Make this feel like reading a deeply personal love horoscope that's eerily accurate.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'love_ch3',
    title: 'Elements & Your Love Language',
    instruction: `${LOVE_TONE}

Connect {clientName}'s Five Elements distribution and Ten Gods pattern to their love language.

Cover:
1. Which of the 5 love languages (words, touch, time, gifts, service) aligns with their dominant elements
2. How the Ten Gods groups (비겁/식상/재성/관성/인성 distribution) shape what they give and need in love
3. The elemental voids in the chart — what's missing and how a partner can complement it
4. How they express love vs. how they want to receive it (these are often different)

Target: 300-400 words, 3 paragraphs.`,
  },

  // ─── Callout 6종 ───
  {
    partKey: 'love_callout_dna',
    title: 'Romance DNA Callout',
    instruction: `${LOVE_TONE}

Write a single compelling sentence or very short paragraph (2-3 sentences MAX) that captures {clientName}'s romantic DNA in a poetic, memorable way.

Start with: "If we could describe your romantic DNA in a single phrase, it would be: "
Then add 1-2 sentences expanding on this phrase.

This will appear in a highlighted callout box — make it quotable and share-worthy.`,
  },
  {
    partKey: 'love_callout_first',
    title: 'First Impression Callout',
    instruction: `${LOVE_TONE}

Write 2-3 sentences about {clientName}'s secret first-impression superpower in romantic contexts. Reference a specific chart element (a Ten God, a Spirit Star, or their Day Master). Make it feel like a flattering secret revealed.`,
  },
  {
    partKey: 'love_callout_match',
    title: 'Cosmic Match Blueprint Callout',
    instruction: `${LOVE_TONE}

Write 2-3 sentences describing {clientName}'s ideal partner elemental profile. Be specific: "Someone with strong [Element] energy in their Day Pillar..." Explain the dynamic this creates in 1 sentence. This is a highlighted callout — make it memorable.`,
  },
  {
    partKey: 'love_callout_timing',
    title: 'Love Calendar Callout',
    instruction: `${LOVE_TONE}

Write 2-3 sentences about {clientName}'s best seasons, months, or specific years for romantic milestones. Use the nyunun (annual fortune) data to identify 1-2 specific power years. Mention spring/autumn seasonality if relevant to their elements.`,
  },
  {
    partKey: 'love_callout_adult',
    title: 'Intimacy Style Callout',
    instruction: `${LOVE_TONE}

Write 2-3 tasteful, elegant sentences about {clientName}'s intimate connection style. Focus on emotional prerequisites (trust, safety, familiarity) rather than physical mechanics. Reference their Day Master's nature. Keep it classy.`,
  },
  {
    partKey: 'love_callout_luck',
    title: 'Love Luck Amplifiers Callout',
    instruction: `${LOVE_TONE}

Write 2-3 sentences with SPECIFIC lucky items for {clientName}'s romance: 1-2 colors to wear on dates, a type of venue (near water? green spaces?), a direction (east? south?), and optionally a lucky number. Derive these from their Yongsin element and elemental needs.`,
  },

  // ─── Part 1~6 ───
  {
    partKey: 'love_p1',
    title: 'Romance DNA & First Impressions',
    instruction: `${LOVE_TONE}

Analyze {clientName}'s romantic DNA and first-impression style.

Cover:
1. The "romantic archetype" their chart creates — give it a catchy name (e.g., "The Quiet Storm," "The Slow-Burn Flame")
2. How their Charm & Attraction star (桃花殺) or absence thereof shapes their magnetic presence
3. First-date energy: what draws people in, what they project vs. what's happening internally
4. The difference between their "attraction style" (who they draw in) vs. "attachment style" (who they keep)

Include 1 concrete dating tip based on their chart.

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'love_p2',
    title: 'Love Strengths & Dating Style',
    instruction: `${LOVE_TONE}

Analyze {clientName}'s greatest romantic strengths and natural dating preferences.

Cover:
1. Top 3 romantic strengths derived from their Ten Gods and elements
2. Preferred dating cadence — do they prefer intensity or slow burn? Depth or variety?
3. How they behave in committed relationships — the small things they do that partners treasure
4. Their relationship "superpower" — the thing that makes them irreplaceable as a partner

Include 1 specific scenario: "On a perfect date, {clientName} would..."

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'love_p3',
    title: 'Destined Match & Compatibility',
    instruction: `${LOVE_TONE}

Analyze {clientName}'s ideal partner profile and compatibility dynamics.

Cover:
1. Ideal partner's elemental composition — which Day Master elements complement theirs
2. "Types to seek": 2-3 personality archetypes described in modern terms (not just elements)
3. "Types requiring caution": dynamics that feel exciting initially but drain over time
4. The "dealbreaker constellation" — what their chart absolutely cannot tolerate in a partner
5. A brief note on age gaps, cultural differences, or unconventional pairings if the chart suggests openness

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'love_p4',
    title: 'Romantic Timing & Lucky Places',
    instruction: `${LOVE_TONE}

Use the Annual Fortune (nyunun) data to map {clientName}'s romantic timeline.

Cover:
1. The #1 power year for romance in the next decade — explain why this year's cosmic energy supports love
2. The best seasons/months for first dates, proposals, and relationship conversations
3. 3-5 specific venue TYPES for romantic encounters (reference elemental resonance: water venues for Water-hungry charts, green spaces for Wood, etc.)
4. Direction and time-of-day guidance for dates
5. A "romantic action plan" — 2-3 concrete steps to take in the current year

Target: 300-500 words, 3-4 paragraphs.`,
  },
  {
    partKey: 'love_p5',
    title: 'Deep Connection & Intimacy',
    instruction: `${LOVE_TONE}

Analyze {clientName}'s physical and emotional intimacy style. Keep the tone elegant, warm, and respectful.

Cover:
1. Emotional prerequisites for physical closeness — what needs to happen before they fully open up
2. How their Day Master element expresses itself in intimate settings (e.g., Wood = responsive and adaptive, Metal = precise and attentive)
3. How intimacy deepens over time in their chart — first encounters vs. long-term connection
4. The role of trust and vulnerability for their specific strength classification

Absolutely NO explicit content. Focus on emotional depth, trust dynamics, and the evolution of closeness.

Target: 300-400 words, 3 paragraphs.`,
  },
  {
    partKey: 'love_p6',
    title: 'Lucky Items & Romance Strategy',
    instruction: `${LOVE_TONE}

Provide {clientName} with a concrete romantic toolkit based on their chart.

Cover:
1. Lucky colors for dates and romantic settings (derive from Yongsin and supportive elements)
2. Lucky numbers and how to use them (table reservations, scheduling dates)
3. Lucky venue types and environmental elements
4. 3-5 strategic romance tips specific to their chart:
   - Conversation approach (based on their Ten Gods — listeners vs. storytellers)
   - Timing advice (based on monthly/seasonal patterns)
   - Body language and energy tips (based on their strength classification)
   - A "secret move" — one specific, unusual tip that leverages their unique chart pattern

End with an empowering closing statement about {clientName}'s romantic future.

Target: 300-500 words, 3-4 paragraphs.`,
  },
];
