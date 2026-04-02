import Anthropic from '@anthropic-ai/sdk';
import type { TierCode } from '@/lib/types/tier';
import type { Language } from '@/lib/types/language';
import type { SajuData, InfoData } from '@/lib/types/saju';
import { getPartPrompt, THREE_LAYER_RULES, OUTPUT_RULES, THREE_LAYER_RULES_KO, OUTPUT_RULES_KO } from './prompts';
import { computeChartHash, findCachedTranslation, saveTranslation } from '@/lib/db/translations';
import { filterSajuDataForPart } from '@/lib/constants/partDataNeeds';

// ─── 유틸리티 ───

/**
 * solarDate("1973년 05월 18일 14:30")에서 생년월일을 파싱한다.
 */
function parseBirthDate(info: InfoData): { year: number; month: number; day: number } | null {
  const m = info.solarDate.match(/(\d{4})년\s*(\d{2})월\s*(\d{2})일/);
  if (!m) return null;
  return { year: +m[1], month: +m[2], day: +m[3] };
}

/**
 * 국제 표준 만나이 계산 (생일 지났으면 year diff, 안 지났으면 -1)
 */
export function calcInternationalAge(info: InfoData): number | null {
  const birth = parseBirthDate(info);
  if (!birth) return null;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  let age = y - birth.year;
  if (m < birth.month || (m === birth.month && d < birth.day)) {
    age--;
  }
  return age;
}

function getDecade(age: number): number {
  return Math.floor(age / 10) * 10;
}

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic();
  }
  return _anthropic;
}

// ─── 시스템 프롬프트 ───

function buildSystemPrompt(additionalRequest: string | null, language: Language = 'en', tier?: TierCode): string {
  const brandName = tier === 'monthly' ? 'AmorMuse' : 'SajuMuse';
  let system: string;

  if (language === 'ko') {
    system = `당신은 ${brandName}의 사주명리학 전문 상담사입니다. 한국 고객을 위한 사주팔자(四柱八字) 분석 보고서를 작성합니다. 전문적이면서 따뜻한 분석 보고서를 작성합니다 — 신뢰받는 상담사가 개인적인 대화를 나누는 것처럼.

작성 스타일:
- 전문적이면서 따뜻하고, 개인적이면서 권위 있는 톤
- 한글(漢字) 형태로 첫 언급 시 한자 병기: "식신(食神)"
- 천간: "경금(庚金) · 양금" 형태
- 지지: "자수(子水) · 쥐" 형태
- 깊이와 가독성의 균형 — 비전문가도 이해할 수 있도록 사주 개념 설명
- 실제 차트 데이터에 기반한 구체적이고 실행 가능한 인사이트 제공
- 어려움을 성장의 기회로 프레이밍, 불길하거나 두려운 표현 절대 금지
- 각 문단은 고객 차트의 구체적 데이터를 참조
- 각 챕터 끝에 독자가 즉시 적용할 수 있는 실용적 조언
- 유려한 산문 형식으로 작성, 불릿 포인트나 번호 목록 금지
- 존댓말(합쇼체) 사용

중요 규칙:
- 차트 데이터를 조작하지 마세요 — 제공된 JSON에 있는 내용만 참조
- 의학적, 법률적, 재정적 조언 금지 — "에너지적 경향" "사주가 시사합니다" 등의 표현 사용
- 이 분석은 자기 성찰과 참고를 위한 것 — 이 관점을 자연스럽게 포함
- 고객의 지성을 존중 — 설명하되 가르치는 톤 금지
- 정확성 필수: 천간의 음양을 정확히 표기. 甲(양목), 乙(음목), 丙(양화), 丁(음화), 戊(양토), 己(음토), 庚(양금), 辛(음금), 壬(양수), 癸(음수). 음양 오류는 신뢰를 심각하게 훼손합니다.
- 주별 데이터 정확성: 특정 주(柱)의 데이터를 참조할 때 반드시 해당 주를 확인. 시주, 일주, 월주, 년주의 데이터를 혼동하지 마세요.
- 십성 정밀성: 십성 그룹을 논할 때 실제 차트에 존재하는 십성만 언급. 차트에 편관 3개, 정관 0개이면 정관이 존재하는 것처럼 언급 금지.

${THREE_LAYER_RULES_KO}

${OUTPUT_RULES_KO}`;
  } else {
    system = `You are a master Saju consultant at ${brandName}, specializing in Korean Four Pillars of Destiny (사주명리학) analysis for an international English-speaking audience. You write professional, warm, and accessible analysis reports — like a trusted counselor having a personal conversation.

Your writing style:
- Write like the sample: professional yet warm, personal yet authoritative
- Always use the bilingual format: "Eating God (식신 · 食神)" on first mention
- For Heavenly Stems: "Gyeong (경 · 庚) · Yang Metal" format
- For Earthly Branches: "Ja (자 · 子) · Rat" format
- Balance depth with readability — explain saju concepts so non-experts understand
- Provide specific, actionable insights based on the actual chart data
- Frame challenges as growth opportunities, never as doom or fear
- Each paragraph should reference concrete data from the client's chart
- End each chapter with practical advice the reader can apply immediately
- Write in flowing prose paragraphs, NOT bullet points or numbered lists

Important rules:
- Never fabricate chart data — only reference what is in the provided JSON
- Never provide medical, legal, or financial advice — use phrases like "energetic tendencies" and "your chart suggests"
- The analysis is for entertainment and self-reflection — include this perspective naturally
- Respect the client's intelligence — explain without condescending
- CRITICAL ACCURACY: When referencing Heavenly Stems, ALWAYS use the correct Yin/Yang polarity from the reference table. 甲(Yang Wood), 乙(Yin Wood), 丙(Yang Fire), 丁(Yin Fire), 戊(Yang Earth), 己(Yin Earth), 庚(Yang Metal), 辛(Yin Metal), 壬(Yang Water), 癸(Yin Water). Misattributing Yin/Yang destroys credibility with knowledgeable readers.
- PILLAR DATA ACCURACY: When referencing specific pillar data (Life Stage, Ten God, etc.), ALWAYS cross-check which pillar you are describing. Hour Pillar (시주), Day Pillar (일주), Month Pillar (월주), Year Pillar (년주) — never swap data between pillars. For example, if the Month Pillar's Life Stage is "Decline (쇠)" and the Year Pillar's is "Nurturing (양)", do NOT attribute Year Pillar data to the Month Pillar.
- TEN GODS PRECISION: When discussing Ten God groups (비겁, 식상, 재성, 관성, 인성), ONLY reference the specific ten gods that actually appear in the chart. If the chart shows 3x Indirect Authority (편관) and 0x Direct Authority (정관), do NOT mention Direct Authority as if it exists. Check the actual pillar data before listing which ten gods are present.

${THREE_LAYER_RULES}

${OUTPUT_RULES}`;
  }

  if (additionalRequest && additionalRequest.trim() !== '') {
    system += `

[Additional Client Request]
The client has specifically requested the following emphasis or additions:
"${additionalRequest.trim()}"
Please incorporate this request naturally into the analysis where relevant.`;
  }

  return system;
}

// ─── 실제 십신 추출 ───

function extractActualTenGods(sajuData: SajuData): string | null {
  const pillar = sajuData.pillar;
  if (!pillar) return null;

  const tenGods: Record<string, number> = {};
  const pillars = [pillar.hourPillar, pillar.dayPillar, pillar.monthPillar, pillar.yearPillar];

  for (const p of pillars) {
    // 천간 십신
    if (p.stemTenGod && p.stemTenGod !== '일간(나)') {
      tenGods[p.stemTenGod] = (tenGods[p.stemTenGod] || 0) + 1;
    }
    // 지지 십신
    if (p.branchTenGod) {
      tenGods[p.branchTenGod] = (tenGods[p.branchTenGod] || 0) + 1;
    }
  }

  const entries = Object.entries(tenGods).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  const TEN_GOD_EN: Record<string, string> = {
    '비견': 'Companion (비견 · 比肩)', '겁재': 'Rob Wealth (겁재 · 劫財)',
    '식신': 'Eating God (식신 · 食神)', '상관': 'Hurting Officer (상관 · 傷官)',
    '편재': 'Indirect Wealth (편재 · 偏財)', '정재': 'Direct Wealth (정재 · 正財)',
    '편관': 'Indirect Authority (편관 · 偏官)', '정관': 'Direct Authority (정관 · 正官)',
    '편인': 'Indirect Seal (편인 · 偏印)', '정인': 'Direct Seal (정인 · 正印)',
  };

  const list = entries.map(([k, v]) => `  - ${TEN_GOD_EN[k] || k}: ${v}x`).join('\n');

  // 없는 십신도 명시
  const allTenGods = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
  const absent = allTenGods.filter(g => !tenGods[g]);
  const absentList = absent.map(k => TEN_GOD_EN[k] || k).join(', ');

  return `TEN GODS ACTUALLY PRESENT IN THIS CHART (DO NOT mention ten gods that are NOT listed here):
${list}

NOT present (count = 0, do NOT reference these as if they exist): ${absentList}

IMPORTANT: When discussing a ten god group (e.g. Authority Group 관성), only mention the specific ten gods that actually exist. For example, if only Indirect Authority (편관) appears with 0 Direct Authority (정관), say "Indirect Authority (편관 · 偏官)" — do NOT say "both Indirect Authority and Direct Authority".`;
}

// ─── 유저 프롬프트 ───

function buildUserPrompt(
  tier: TierCode,
  partKey: string,
  sajuData: SajuData,
  clientName: string,
  language: Language = 'en',
): string {
  const prompt = getPartPrompt(tier, partKey);

  if (!prompt) {
    return `Analyze the following Saju chart data and write a comprehensive analysis section. 300-500 words.

Client: ${clientName}

Chart Data:
${JSON.stringify(sajuData, null, 2)}`;
  }

  // {clientName} 플레이스홀더를 실제 이름으로 치환
  const instruction = prompt.instruction.replace(/\{clientName\}/g, clientName);

  // ─── 데이터 이상 감지 ───
  const notes: string[] = [];

  // 용신 체계 이상 감지 (모든 조합)
  if (sajuData.yongsin) {
    const y = sajuData.yongsin;
    const yongsinConflicts: string[] = [];
    if (y.yongsin === y.gisin) yongsinConflicts.push(`Favorable (용신) and Unfavorable (기신) are BOTH "${y.yongsin}"`);
    if (y.huisin === y.gusin) yongsinConflicts.push(`Joyful (희신) and Antagonistic (구신) are BOTH "${y.huisin}"`);
    if (y.yongsin === y.gusin) yongsinConflicts.push(`Favorable (용신) and Antagonistic (구신) are BOTH "${y.yongsin}"`);
    if (y.huisin === y.gisin) yongsinConflicts.push(`Joyful (희신) and Unfavorable (기신) are BOTH "${y.huisin}"`);
    if (yongsinConflicts.length > 0) {
      notes.push(
        `YONGSIN ANOMALY DETECTED:\n${yongsinConflicts.map(c => `  - ${c}`).join('\n')}\nThis is an unusual configuration. If you reference the Yongsin system, acknowledge this directly and explain it from a 명리학 perspective. Do NOT treat conflicting elements as simply "good" or "bad" — explain the dual role.`
      );
    }
  }

  // 나이 일관성 — 국제 표준 만나이 사용
  if (sajuData.info) {
    const intAge = calcInternationalAge(sajuData.info);
    const birth = parseBirthDate(sajuData.info);
    if (intAge !== null && birth) {
      const currentYear = new Date().getFullYear();
      notes.push(
        `CLIENT AGE: ${clientName} is ${intAge} years old (born ${birth.year}, international/Western age as of ${currentYear}). ALWAYS use this age when referring to the client's current age or life stage — say "${intAge}" or "in their ${getDecade(intAge)}s". Do NOT use Korean age (세) which would be ${intAge + 1} or ${intAge + 2}.\n\nNOTE: Ages shown in Daeun (대운) and Nyunun (년운) tables follow the traditional Saju cycle system and may differ from the client's Western age by 1-2 years. When referencing these cycles in your text, use the cycle's own age labels (e.g., "the cycle starting at age 32") but clarify the client's current Western age separately.`
      );
    }
  }

  // 월운 데이터 연도 명시 — Claude가 올바른 연도 데이터를 사용하도록
  const isWolunRelated = partKey.startsWith('part10_') || partKey.startsWith('month_') || partKey === 'this_year_forecast';
  if (isWolunRelated && sajuData.wolun) {
    const wolunYear = sajuData.wolun.year;
    const wolun2Year = sajuData.wolun2?.year;
    notes.push(
      `MONTHLY FORTUNE YEAR DATA:\n  - "wolun" contains monthly data for year ${wolunYear}\n  - ${wolun2Year ? `"wolun2" contains monthly data for year ${wolun2Year}` : 'No wolun2 data'}\n\nCRITICAL: For this section, you MUST use the "wolun" data (year ${wolunYear}) ONLY. Do NOT use wolun2 data. When referencing months, always specify they are in ${wolunYear}. Double-check every Heavenly Stem and Earthly Branch against the wolun.entries array for year ${wolunYear}.`
    );
  }

  // 실제 존재하는 십신 목록 추출 — Claude가 없는 십신을 언급하지 않도록
  const actualTenGods = extractActualTenGods(sajuData);
  if (actualTenGods) {
    notes.push(actualTenGods);
  }

  const notesBlock = notes.length > 0
    ? `\n\n[CRITICAL DATA NOTES — READ BEFORE WRITING]\n${notes.join('\n\n')}\n`
    : '';

  if (language === 'ko') {
    return `이 고객의 사주 보고서에서 "${prompt.title}" 섹션을 작성하세요.

고객명: ${clientName}

작성 지시:
${instruction}
${notesBlock}
차트 데이터 (JSON):
${JSON.stringify(filterSajuDataForPart(partKey, sajuData), null, 2)}

분석 텍스트만 작성하세요. 섹션 제목은 포함하지 마세요 — 별도로 추가됩니다. 마크다운 헤더를 사용하지 마세요. 유려한 문단으로 작성하세요. 반드시 한국어로 작성하세요.`;
  }

  return `Write the "${prompt.title}" section for this client's Saju report.

Client Name: ${clientName}

Instructions:
${instruction}
${notesBlock}
Chart Data (JSON):
${JSON.stringify(filterSajuDataForPart(partKey, sajuData), null, 2)}

Write only the analysis text. Do not include the section title — it will be added separately. Do not use markdown headers. Write in flowing paragraphs.`;
}

// ─── 메인 함수 ───

interface TranslateParams {
  tier: TierCode;
  partKey: string;
  sajuData: SajuData;
  additionalRequest: string | null;
  clientName: string;
  skipCache?: boolean;
  language?: Language;
}

// 서버 측 재시도: 1회만 (Vercel 120초 제한 내에서 안전하게)
// 클라이언트(page.tsx)에서 추가 1회 재시도하므로 총 최대 4회
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;
const PER_CALL_TIMEOUT_MS = 50_000; // 50초 (2번 × 50초 + 대기 = ~102초 < 120초 Vercel 제한)

const MODEL_ID = 'claude-sonnet-4-20250514';

export async function translateAndAnalyze({
  tier,
  partKey,
  sajuData,
  additionalRequest,
  clientName,
  skipCache,
  language = 'en',
}: TranslateParams): Promise<string | null> {
  // ─── 1. 캐시 조회 ───
  // additionalRequest가 있으면 캐시 사용하지 않음 (개인화된 요청이므로)
  // 언어별로 캐시 키를 분리: 한국어는 partKey:ko
  const cachePartKey = language === 'en' ? partKey : `${partKey}:${language}`;
  let chartHash: string | null = null;
  if (!skipCache && !additionalRequest) {
    try {
      chartHash = await computeChartHash(sajuData.pillar, sajuData.info.gender);
      const cached = await findCachedTranslation(chartHash, cachePartKey, tier);
      if (cached) {
        console.log(`[translate] Cache HIT for partKey="${cachePartKey}" chartHash="${chartHash.slice(0, 8)}..."`);
        return cached.text;
      }
      console.log(`[translate] Cache MISS for partKey="${cachePartKey}"`);
    } catch (err) {
      console.error('[translate] Cache lookup failed, proceeding with API call:', err);
    }
  }

  // ─── 2. Claude API 호출 ───
  const systemText = buildSystemPrompt(additionalRequest, language, tier);
  const userMessage = buildUserPrompt(tier, partKey, sajuData, clientName, language);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await getClient().messages.create(
        {
          model: MODEL_ID,
          max_tokens: 4096,
          temperature: 0.7,
          // Prompt Caching: 시스템 프롬프트를 ephemeral로 마킹
          system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: userMessage }],
        },
        { timeout: PER_CALL_TIMEOUT_MS },
      );

      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        console.error(`[translate] No text block for partKey="${partKey}" (attempt ${attempt + 1})`);
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return null;
      }

      const resultText = textBlock.text;

      // ─── 3. 캐시 저장 ───
      if (chartHash && !additionalRequest) {
        saveTranslation(
          {
            chartHash,
            dayMaster: sajuData.pillar.dayPillar.heavenlyStem,
            strength: sajuData.pillar.strength,
            yongsinEl: sajuData.yongsin.yongsin,
            gender: sajuData.info.gender,
            pillarJson: sajuData.pillar,
          },
          cachePartKey,
          tier,
          resultText,
          MODEL_ID,
        ).catch(err => console.error('[translate] Background save failed:', err));
      }

      return resultText;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[translate] Failed partKey="${partKey}" (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ${message}`);

      // Anthropic SDK 에러 타입으로 정확히 판별
      const isNonRetryable =
        err instanceof Anthropic.BadRequestError ||      // 400
        err instanceof Anthropic.AuthenticationError ||  // 401
        err instanceof Anthropic.PermissionDeniedError || // 403
        err instanceof Anthropic.NotFoundError;           // 404

      if (isNonRetryable || attempt >= MAX_RETRIES) {
        return null;
      }

      console.log(`[translate] Retrying partKey="${partKey}" in ${RETRY_DELAY_MS}ms...`);
      await sleep(RETRY_DELAY_MS);
    }
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
