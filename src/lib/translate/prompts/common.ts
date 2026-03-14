/** 3-Layer 용어 시스템 규칙 — 모든 프롬프트에 포함 */
export const THREE_LAYER_RULES = `
[3-Layer Terminology System — MANDATORY]
Every Saju term must follow the 3-layer format:

Layer 1 (natural): Modern English that a Western reader instantly understands.
Layer 2 (classical): Traditional English translation used in academic Saju literature.
Layer 3 (original): Chinese characters + Korean romanization.

Display rules:
- First mention in text: "**Natural Name** (Classical Name / 漢字 Romanization)"
  Example: "**Creative Expression** (Eating God / 食神 Sik-sin)"
- Subsequent mentions: Use only the Natural Name.
  Example: "Creative Expression"
- Charts and tables: Natural abbreviation + Original.
  Example: "Creative Expr. | 食神"

Key term mappings you MUST use:
- Ten Gods: Self & Independence (Parallel/比肩), Competition & Drive (Rob Wealth/劫財), Creative Expression (Eating God/食神), Bold Innovation (Hurting Officer/傷官), Unexpected Fortune (Indirect Wealth/偏財), Steady Prosperity (Direct Wealth/正財), Pressure & Discipline (Indirect Officer/偏官), Honor & Responsibility (Direct Officer/正官), Unconventional Wisdom (Indirect Seal/偏印), Knowledge & Nurture (Direct Seal/正印)
- Five Elements: Growth & Flexibility (Wood/木), Passion & Energy (Fire/火), Stability & Trust (Earth/土), Precision & Strength (Metal/金), Wisdom & Adaptability (Water/水)
- Yongsin: Your Key Balancer (Favorable God/用神), Your Lucky Support (Joy God/喜神), Your Challenge Element (Jealousy God/忌神), Your Hidden Obstacle (Enemy God/仇神), Neutral Energy (Idle God/閑神)
- Strength: Very Gentle Energy (極身弱), Gentle Energy (身弱), Balanced Energy (中和), Strong Energy (身強), Very Strong Energy (極身強)
`.trim();

/** 공통 출력 규칙 */
export const OUTPUT_RULES = `
[Output Rules]
- Write 300-500 words per chapter in flowing prose paragraphs.
- ABSOLUTELY NO MARKDOWN: Do not use **bold**, *italic*, headers (#), or bullet points. Write plain text only. The PDF renderer cannot display markdown formatting.
- Do NOT include the section title — it is added separately by the system.
- When mentioning saju terms, write them inline without any special formatting: "Your Key Balancer (Favorable God / 用神 Yong-sin) is Wood" — no bold, no asterisks.
- Each paragraph must contain at least one concrete, personalized insight referencing the client's actual chart data.
- Frame all challenges as growth opportunities. Never use doom-and-gloom language.
- Address the client by name at least once per chapter for personalization.
`.trim();

/** 프롬프트 파트 정의 타입 */
export interface PartPrompt {
  partKey: string;
  title: string;
  instruction: string;
}
