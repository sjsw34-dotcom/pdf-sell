import type { SajuData } from '@/lib/types/saju';
import type { RawTabKey } from '@/lib/types/saju';
import type { TierCode } from '@/lib/types/tier';
import { TIERS } from '@/lib/constants/tiers';

/**
 * 티어에 해당하는 섹션만 포함하는 SajuData를 반환한다.
 * 필수 탭(info, pillar, yongsin, yinyang)은 항상 포함.
 * 티어에 없는 optional 탭은 undefined로 설정.
 */
export function filterByTier(tier: TierCode, data: SajuData): SajuData {
  const allowedSections = TIERS[tier].sections as readonly RawTabKey[];

  return {
    info: data.info,
    pillar: data.pillar,
    yongsin: data.yongsin,
    yinyang: data.yinyang,
    shinsal: allowedSections.includes('shinsal') ? data.shinsal : undefined,
    hyungchung: allowedSections.includes('hyungchung') ? data.hyungchung : undefined,
    daeun: allowedSections.includes('daeun') ? data.daeun : undefined,
    nyunun: allowedSections.includes('nyunun') ? data.nyunun : undefined,
    wolun: allowedSections.includes('wolun') ? data.wolun : undefined,
    wolun2: allowedSections.includes('wolun2') ? data.wolun2 : undefined,
  };
}
