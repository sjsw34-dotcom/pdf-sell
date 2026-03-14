'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';
import { TIER_ORDER } from '@/lib/constants/tiers';
import type { TierCode } from '@/lib/types/tier';

const TIER_INFO: Record<TierCode, { label: string; desc: string; pages: string; parts: number; price: string }> = {
  basic: { label: 'Basic', desc: '사주원국 + 오행 분석 + 종합 운세', pages: '~30쪽', parts: 1, price: '$19~29' },
  love: { label: 'Love', desc: '연애 DNA, 이상형, 연애 타이밍 & 전략', pages: '~60쪽', parts: 6, price: '$39~59' },
  full: { label: 'Full', desc: '성격/연애/재물/직업/건강/신살/대운 종합 분석', pages: '~80쪽', parts: 8, price: '$49~79' },
  premium: { label: 'Premium', desc: '전체 분석 + 올해 운세 + 10년 운세 년도별 상세', pages: '60쪽+', parts: 10, price: '$99~149' },
};

export function TierSelector() {
  const selectedTier = useGeneratorStore((s) => s.selectedTier);
  const setTier = useGeneratorStore((s) => s.setTier);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        1단계 — 상품 선택
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TIER_ORDER.map((code) => {
          const t = TIER_INFO[code];
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
                  {t.label}
                </span>
                <span className="text-xs text-gray-400">{t.price}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{t.desc}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{t.pages}</span>
                <span>{t.parts}개 파트</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
