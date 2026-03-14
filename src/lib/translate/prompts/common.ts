/** 3-Layer 용어 시스템 규칙 — 모든 프롬프트에 포함 */
export const THREE_LAYER_RULES = `
[3-Layer Terminology System — MANDATORY]
Every Saju term must use the following bilingual format with Korean included:

Display format for first mention:
  "Eating God (식신 · 食神)" or "Gyeong (경 · 庚) · Yang Metal"

Display format for subsequent mentions:
  Use the English name only, or shortened bilingual: "Eating God (식신)"

Key term mappings you MUST use:
- Ten Gods:
  Companion (비견 · 比肩), Rob Wealth (겁재 · 劫財),
  Eating God (식신 · 食神), Hurting Officer (상관 · 傷官),
  Indirect Wealth (편재 · 偏財), Direct Wealth (정재 · 正財),
  Indirect Authority (편관 · 偏官), Direct Authority (정관 · 正官),
  Indirect Seal (편인 · 偏印), Direct Seal (정인 · 正印),
  Day Master (일간 · 日干)

- Five Elements:
  Wood (목 · 木), Fire (화 · 火), Earth (토 · 土), Metal (금 · 金), Water (수 · 水)

- Heavenly Stems (천간 · 天干) — always use romanization + Korean + Hanja:
  Gap (갑 · 甲), Eul (을 · 乙), Byeong (병 · 丙), Jeong (정 · 丁),
  Mu (무 · 戊), Gi (기 · 己), Gyeong (경 · 庚), Sin (신 · 辛),
  Im (임 · 壬), Gye (계 · 癸)

- Earthly Branches (지지 · 地支) — always use romanization + Korean + Hanja + animal:
  Ja (자 · 子) Rat, Chuk (축 · 丑) Ox, In (인 · 寅) Tiger, Myo (묘 · 卯) Rabbit,
  Jin (진 · 辰) Dragon, Sa (사 · 巳) Snake, O (오 · 午) Horse, Mi (미 · 未) Goat,
  Sin (신 · 申) Monkey, Yu (유 · 酉) Rooster, Sul (술 · 戌) Dog, Hae (해 · 亥) Pig

- Yongsin System (용신 체계):
  Favorable Element (용신 · 用神), Joyful Element (희신 · 喜神),
  Unfavorable Element (기신 · 忌神), Antagonistic Element (구신 · 仇神),
  Neutral Element (한신 · 閑神)

- Twelve Life Stages (십이운성 · 十二運星):
  Birth (장생 · 長生), Bath (목욕 · 沐浴), Crown (관대 · 冠帶),
  Prosperity (건록 · 建祿), Emperor (제왕 · 帝旺), Decline (쇠 · 衰),
  Illness (병 · 病), Death (사 · 死), Tomb (묘 · 墓),
  Extinction (절 · 絶), Conception (태 · 胎), Nurturing (양 · 養)
`.trim();

/** 공통 출력 규칙 */
export const OUTPUT_RULES = `
[Output Rules]
- Write 300-500 words per chapter in flowing prose paragraphs.
- ABSOLUTELY NO MARKDOWN: Do not use **bold**, *italic*, headers (#), or bullet points. Write plain text only.
- Do NOT include the section title — it is added separately.
- Use the bilingual term format on first mention: "Eating God (식신 · 食神)". After that, use the English name only.
- For Heavenly Stems: always write "Gyeong (경 · 庚) · Yang Metal" on first mention.
- For Earthly Branches: always write "Ja (자 · 子) · Rat" on first mention.
- Each paragraph must contain at least one concrete, personalized insight referencing the client's actual chart data.
- Frame all challenges as growth opportunities. Never use doom-and-gloom language.
- Address the client by name at least once per chapter for personalization.
- Provide practical, actionable advice — not just abstract descriptions.
- Write in a warm, professional tone — like a wise counselor having a personal conversation.
`.trim();

/** 프롬프트 파트 정의 타입 */
export interface PartPrompt {
  partKey: string;
  title: string;
  instruction: string;
}
