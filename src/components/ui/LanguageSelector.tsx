'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';
import type { Language } from '@/lib/types/language';

const OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
];

export function LanguageSelector() {
  const language = useGeneratorStore((s) => s.language);
  const setLanguage = useGeneratorStore((s) => s.setLanguage);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        PDF 언어 선택
      </h2>
      <div className="flex gap-3">
        {OPTIONS.map(({ code, label }) => {
          const active = language === code;
          return (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer border ${
                active
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-[#1A1A2E] border-[#2a2a45] text-gray-400 hover:border-purple-700/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
