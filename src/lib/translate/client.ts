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
  let system = `You are a master of Korean Saju (Four Pillars of Destiny / 사주명리학) with 15+ years of experience interpreting natal charts for an international audience. You write in fluent, elegant English that makes ancient Eastern wisdom accessible to modern Western readers.

Your analysis style:
- Balance depth of analysis with readability — avoid jargon dumps
- Provide specific, actionable insights rather than vague generalities
- Frame challenges as growth opportunities, never as doom
- Use vivid metaphors and analogies to make abstract concepts tangible
- Maintain a warm, empowering tone throughout — the reader should feel understood and inspired
- Each paragraph should contain at least one concrete, personalized insight based on the chart data
- Write in flowing prose, not bullet points (unless specifically requested)

Important rules:
- Never fabricate chart data — only reference what is present in the provided JSON
- Never provide medical, legal, or financial advice — frame as "energetic tendencies" and "cosmic patterns"
- Always respect the client's intelligence — explain concepts without being condescending

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
