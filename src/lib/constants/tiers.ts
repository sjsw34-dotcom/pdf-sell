import type { RawTabKey } from '@/lib/types/saju';
import type { TierCode } from '@/lib/types/tier';

export interface TierDefinition {
  readonly code: TierCode;
  readonly label: string;
  readonly sections: readonly RawTabKey[];
  readonly pdfParts: number;
  readonly estimatedPages: string;
  readonly priceRange: { readonly min: number; readonly max: number };
  readonly description: string;
}

export const TIERS = {
  basic: {
    code: 'basic',
    label: 'Basic',
    sections: ['info', 'pillar', 'yongsin', 'yinyang'],
    pdfParts: 1,
    estimatedPages: '~30p',
    priceRange: { min: 19, max: 29 },
    description: 'Core four pillars analysis with element balance',
  },
  love: {
    code: 'love',
    label: 'Love',
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'shinsal', 'nyunun'],
    pdfParts: 6,
    estimatedPages: '~60p',
    priceRange: { min: 39, max: 59 },
    description: 'Romance DNA, ideal partner, love timing & strategy',
  },
  full: {
    code: 'full',
    label: 'Full',
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'shinsal', 'hyungchung', 'daeun'],
    pdfParts: 8,
    estimatedPages: '~80-100p',
    priceRange: { min: 49, max: 79 },
    description: 'Complete life analysis with major luck cycles',
  },
  premium: {
    code: 'premium',
    label: 'Premium',
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'shinsal', 'hyungchung', 'daeun', 'nyunun', 'wolun', 'wolun2'],
    pdfParts: 10,
    estimatedPages: '~150p',
    priceRange: { min: 99, max: 149 },
    description: 'Everything included — yearly & monthly fortune details',
  },
  monthly: {
    code: 'monthly',
    label: 'Monthly',
    sections: ['info', 'pillar', 'yongsin', 'yinyang', 'wolun'],
    pdfParts: 8,
    estimatedPages: '~12p',
    priceRange: { min: 0, max: 0 },
    description: 'Monthly fortune report for AmorMuse subscribers',
  },
} as const satisfies Record<TierCode, TierDefinition>;

/** 티어 코드 배열 (순서: basic → premium) */
export const TIER_ORDER: readonly TierCode[] = ['basic', 'love', 'full', 'premium', 'monthly'];

/** 티어 코드로 해당 티어에 필요한 섹션 목록 반환 */
export function getTierSections(tier: TierCode): readonly RawTabKey[] {
  return TIERS[tier].sections;
}
