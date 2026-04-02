import type { TierCode } from '@/lib/types/tier';
import type { PartPrompt } from './common';
import { THREE_LAYER_RULES, OUTPUT_RULES } from './common';
import { BASIC_PROMPTS } from './basic';
import { LOVE_PROMPTS } from './love';
import { FULL_PROMPTS } from './full';
import { PREMIUM_PROMPTS } from './premium';
import { MONTHLY_PROMPTS } from './monthly';

export { THREE_LAYER_RULES, OUTPUT_RULES, THREE_LAYER_RULES_KO, OUTPUT_RULES_KO } from './common';
export type { PartPrompt } from './common';

const PROMPTS_BY_TIER: Record<TierCode, PartPrompt[]> = {
  basic: BASIC_PROMPTS,
  love: LOVE_PROMPTS,
  full: FULL_PROMPTS,
  premium: PREMIUM_PROMPTS,
  monthly: MONTHLY_PROMPTS,
};

/**
 * 티어 + partKey로 해당 파트의 프롬프트를 조회한다.
 * 찾지 못하면 null 반환.
 */
export function getPartPrompt(tier: TierCode, partKey: string): PartPrompt | null {
  const prompts = PROMPTS_BY_TIER[tier];
  return prompts.find((p) => p.partKey === partKey) ?? null;
}

/**
 * 티어에 해당하는 모든 파트 키 목록을 반환한다.
 */
export function getPartKeys(tier: TierCode): string[] {
  return PROMPTS_BY_TIER[tier].map((p) => p.partKey);
}
