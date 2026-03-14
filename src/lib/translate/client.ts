import Anthropic from '@anthropic-ai/sdk';
import type { TierCode } from '@/lib/types/tier';
import type { SajuData } from '@/lib/types/saju';
import { getPartPrompt, THREE_LAYER_RULES, OUTPUT_RULES } from './prompts';

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic();
  }
  return _anthropic;
}

// ─── 시스템 프롬프트 ───

function buildSystemPrompt(additionalRequest: string | null): string {
  let system = `You are a master Saju consultant at SajuMuse, specializing in Korean Four Pillars of Destiny (사주명리학) analysis for an international English-speaking audience. You write professional, warm, and accessible analysis reports — like a trusted counselor having a personal conversation.

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

${THREE_LAYER_RULES}

${OUTPUT_RULES}`;

  if (additionalRequest && additionalRequest.trim() !== '') {
    system += `

[Additional Client Request]
The client has specifically requested the following emphasis or additions:
"${additionalRequest.trim()}"
Please incorporate this request naturally into the analysis where relevant.`;
  }

  return system;
}

// ─── 유저 프롬프트 ───

function buildUserPrompt(
  tier: TierCode,
  partKey: string,
  sajuData: SajuData,
  clientName: string,
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

  return `Write the "${prompt.title}" section for this client's Saju report.

Client Name: ${clientName}

Instructions:
${instruction}

Chart Data (JSON):
${JSON.stringify(sajuData, null, 2)}

Write only the analysis text. Do not include the section title — it will be added separately. Do not use markdown headers. Write in flowing paragraphs.`;
}

// ─── 메인 함수 ───

interface TranslateParams {
  tier: TierCode;
  partKey: string;
  sajuData: SajuData;
  additionalRequest: string | null;
  clientName: string;
}

export async function translateAndAnalyze({
  tier,
  partKey,
  sajuData,
  additionalRequest,
  clientName,
}: TranslateParams): Promise<string | null> {
  const system = buildSystemPrompt(additionalRequest);
  const userMessage = buildUserPrompt(tier, partKey, sajuData, clientName);

  try {
    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      system,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      console.error(`[translate] No text block in response for partKey="${partKey}"`);
      return null;
    }

    return textBlock.text;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[translate] Failed for partKey="${partKey}": ${message}`);
    return null;
  }
}
