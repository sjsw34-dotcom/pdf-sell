import type { RawTabKey } from './saju';

export const TIER_CODES = ['basic', 'love', 'full', 'premium'] as const;
export type TierCode = (typeof TIER_CODES)[number];

export interface TierPricing {
  min: number;
  max: number;
  currency: 'USD';
}

export interface TierConfig {
  code: TierCode;
  label: string;
  pricing: TierPricing;
  sections: RawTabKey[];
  estimatedPages: string;
  estimatedTime: string;
  description: string;
}

export const TIER_CONFIGS: Record<TierCode, TierConfig> = {
  basic: {
    code: 'basic',
    label: 'Basic',
    pricing: { min: 19, max: 29, currency: 'USD' },
    sections: ['info', 'pillar', 'yongsin', 'yinyang'],
    estimatedPages: '~30p',
    estimatedTime: '30s ~ 1min',
    description: 'Core four pillars analysis with element balance',
  },
  love: {
    code: 'love',
    label: 'Love',
    pricing: { min: 39, max: 59, currency: 'USD' },
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'shinsal', 'nyunun'],
    estimatedPages: '~60p',
    estimatedTime: '1 ~ 3min',
    description: 'Romance DNA, ideal partner, love timing & strategy',
  },
  full: {
    code: 'full',
    label: 'Full',
    pricing: { min: 49, max: 79, currency: 'USD' },
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'shinsal', 'hyungchung', 'daeun'],
    estimatedPages: '~80-100p',
    estimatedTime: '1 ~ 3min',
    description: 'Complete life analysis with major luck cycles',
  },
  premium: {
    code: 'premium',
    label: 'Premium',
    pricing: { min: 99, max: 149, currency: 'USD' },
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'shinsal', 'hyungchung', 'daeun', 'nyunun', 'wolun', 'wolun2'],
    estimatedPages: '~150p',
    estimatedTime: '2 ~ 4min',
    description: 'Everything included — yearly & monthly fortune details',
  },
} as const;
