import type { PartPrompt } from './common';

/**
 * Basic 티어 — 1개 통합 파트 (종합 분석)
 * 사용 섹션: info, pillar, yongsin, yinyang
 * PDF 구성: overview → personality → fortune
 */
export const BASIC_PROMPTS: PartPrompt[] = [
  {
    partKey: 'overview',
    title: 'Your Destiny Overview',
    instruction: `Write a comprehensive overview of {clientName}'s Four Pillars chart.

Cover these aspects in flowing prose:
1. Day Master element identity — what it reveals about their core nature
2. The dominant Ten Gods pattern across all four pillars and its life implications
3. Overall strength classification (身强/身弱) and what it means practically
4. Key Balancer (用神) element and how to invite it into daily life
5. Twelve Life Stages across the pillars — the overall life rhythm

Reference specific data: name each Heavenly Stem and Earthly Branch present in the chart. Explain the interplay between pillars, not just each pillar in isolation.

Target: 400-500 words, 4 paragraphs.`,
  },
  {
    partKey: 'personality',
    title: 'Personality & Core Strengths',
    instruction: `Analyze {clientName}'s personality based on their Day Pillar and surrounding energies.

Cover:
1. Day Pillar archetype — the Heavenly Stem + Earthly Branch combination and its metaphor
2. Interpersonal style — how they appear in social settings vs. their inner nature
3. The Ten Gods distribution pattern and what it says about their approach to life (wealth orientation, authority relationship, creative tendencies)
4. Core strengths that emerge from their elemental configuration
5. The strength classification's practical meaning — not as weakness/strength but as a behavioral style

Use vivid metaphors. Make the analysis feel like a mirror the client recognizes themselves in.

Target: 400-500 words, 4 paragraphs.`,
  },
  {
    partKey: 'fortune',
    title: 'Fortune & Life Direction',
    instruction: `Analyze {clientName}'s overall fortune trajectory and provide directional guidance.

Cover:
1. Key Balancer (用神) and Lucky Support (喜神) — concrete ways to engage these elements in career, relationships, and habits
2. Challenge Element (忌神) — how it manifests and strategies to moderate its influence without fighting it
3. The broad arc of fortune based on elemental patterns — when to push forward and when to build foundations
4. Practical recommendations: career fields, relationship dynamics, lifestyle choices aligned with the chart's energies

End with an empowering forward-looking statement specific to {clientName}'s chart.

Target: 400-500 words, 4 paragraphs.`,
  },
];
