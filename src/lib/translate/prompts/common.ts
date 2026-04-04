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

- Heavenly Stems (천간 · 天干) — always use romanization + Korean + Hanja + CORRECT Yin/Yang + Element:
  Gap (갑 · 甲) · Yang Wood, Eul (을 · 乙) · Yin Wood,
  Byeong (병 · 丙) · Yang Fire, Jeong (정 · 丁) · Yin Fire,
  Mu (무 · 戊) · Yang Earth, Gi (기 · 己) · Yin Earth,
  Gyeong (경 · 庚) · Yang Metal, Sin (신 · 辛) · Yin Metal,
  Im (임 · 壬) · Yang Water, Gye (계 · 癸) · Yin Water

  CRITICAL: Odd-numbered stems (甲丙戊庚壬) are YANG, even-numbered stems (乙丁己辛癸) are YIN.
  Never confuse Yin/Yang — this is a fundamental accuracy requirement.

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

/** 3-Layer 용어 시스템 규칙 — 한국어 버전 */
export const THREE_LAYER_RULES_KO = `
[용어 표기 규칙 — 필수]
모든 사주 용어는 한글(漢字) 형태로 표기합니다:

- 십성: 비견(比肩), 겁재(劫財), 식신(食神), 상관(傷官), 편재(偏財), 정재(正財), 편관(偏官), 정관(正官), 편인(偏印), 정인(正印), 일간(日干)
- 오행: 목(木), 화(火), 토(土), 금(金), 수(水)
- 천간: 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸)
- 지지: 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥)
- 용신 체계: 용신(用神), 희신(喜神), 기신(忌神), 구신(仇神), 한신(閑神)
- 십이운성: 장생(長生), 목욕(沐浴), 관대(冠帶), 건록(建祿), 제왕(帝旺), 쇠(衰), 병(病), 사(死), 묘(墓), 절(絶), 태(胎), 양(養)

중요: 양(陽)/음(陰) 구분을 정확히 해야 합니다.
홀수 천간(甲丙戊庚壬)은 양, 짝수 천간(乙丁己辛癸)은 음입니다.
`.trim();

/** 공통 출력 규칙 — 한국어 버전 */
export const OUTPUT_RULES_KO = `
[출력 규칙]
- 챕터당 600~1000자(한국어 기준) 분량으로 작성합니다.
- 마크다운 서식 절대 금지: **볼드**, *이탤릭*, #제목, 불릿 포인트를 사용하지 마세요. 일반 텍스트만 작성합니다.
- 섹션 제목은 포함하지 마세요 — 별도로 추가됩니다.
- 첫 언급 시 한자를 병기합니다: "식신(食神)". 이후에는 한글만 사용합니다.
- 각 문단에는 고객의 실제 차트 데이터를 참조하는 구체적이고 개인화된 통찰을 포함해야 합니다.
- 모든 어려움은 성장의 기회로 프레이밍합니다. 불길하거나 두려운 표현은 사용하지 마세요.
- 챕터당 최소 한 번은 고객 이름을 언급하세요.
- 구체적이고 실행 가능한 조언을 제시합니다 — 추상적 설명이 아닌 실용적 가이드를 제공하세요.
- 따뜻하고 전문적인 어조로 작성합니다 — 현명한 상담자가 개인적 대화를 나누듯 합니다.
- 존댓말(합쇼체)을 사용합니다.
`.trim();

/** 프롬프트 파트 정의 타입 */
export interface PartPrompt {
  partKey: string;
  title: string;
  instruction: string;
}
