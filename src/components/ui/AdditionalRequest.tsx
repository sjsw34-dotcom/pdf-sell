'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';

const MAX_LENGTH = 500;

export function AdditionalRequest() {
  const additionalRequest = useGeneratorStore((s) => s.additionalRequest);
  const setAdditionalRequest = useGeneratorStore((s) => s.setAdditionalRequest);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Step 5 — Special Requests <span className="text-gray-600">(Optional)</span>
      </h2>
      <textarea
        value={additionalRequest}
        onChange={(e) => setAdditionalRequest(e.target.value)}
        placeholder="e.g. Please emphasize career advice related to tech startups, or add real estate investment guidance..."
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
