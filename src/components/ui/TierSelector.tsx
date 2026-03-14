'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';
import { TIERS, TIER_ORDER } from '@/lib/constants/tiers';
import type { TierCode } from '@/lib/types/tier';

export function TierSelector() {
  const selectedTier = useGeneratorStore((s) => s.selectedTier);
  const setTier = useGeneratorStore((s) => s.setTier);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Step 1 — Select Tier
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TIER_ORDER.map((code) => {
          const tier = TIERS[code];
          const active = selectedTier === code;
          return (
            <button
              key={code}
              onClick={() => setTier(active ? null : code)}
              className={`rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${
                active
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-[#1A1A2E] hover:border-gray-500'
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className={`text-lg font-bold ${active ? 'text-purple-400' : 'text-white'}`}>
                  {tier.label}
                </span>
                <span className="text-xs text-gray-400">
                  ${tier.priceRange.min}–${tier.priceRange.max}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{tier.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{tier.estimatedPages}</span>
                <span>{tier.pdfParts} parts</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
