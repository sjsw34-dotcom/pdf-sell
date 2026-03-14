'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';

const MAX_LENGTH = 500;

export function AdditionalRequest() {
  const additionalRequest = useGeneratorStore((s) => s.additionalRequest);
  const setAdditionalRequest = useGeneratorStore((s) => s.setAdditionalRequest);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        5단계 — 추가 요청사항 <span className="text-gray-600">(선택사항)</span>
      </h2>
      <textarea
        value={additionalRequest}
        onChange={(e) => setAdditionalRequest(e.target.value)}
        placeholder="예: 재물운 부분에 부동산 투자 관련 조언을 추가해주세요, 또는 IT 창업 관련 커리어 조언을 강조해주세요..."
        rows={3}
        maxLength={MAX_LENGTH}
        className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
      />
      <p className="text-right text-xs text-gray-600 mt-1">
        {additionalRequest.length}/{MAX_LENGTH}
      </p>
    </section>
  );
}
