'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';
import { THEMES } from '@/lib/constants/themes';
import type { ThemeCode } from '@/lib/types/theme';

const THEME_ORDER: ThemeCode[] = ['classic', 'modern', 'minimal', 'elegant', 'love'];

export function ThemeSelector() {
  const selectedTheme = useGeneratorStore((s) => s.selectedTheme);
  const selectedTier = useGeneratorStore((s) => s.selectedTier);
  const setTheme = useGeneratorStore((s) => s.setTheme);
  const isLoveTier = selectedTier === 'love';

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        4단계 — PDF 테마
        {isLoveTier && <span className="ml-2 text-xs text-pink-400">(Love 티어는 자동 고정)</span>}
      </h2>
      <div className="flex gap-3 flex-wrap">
        {THEME_ORDER.map((code) => {
          const theme = THEMES[code];
          const active = selectedTheme === code;
          const disabled = isLoveTier && code !== 'love';
          return (
            <button
              key={code}
              onClick={() => !disabled && setTheme(code)}
              disabled={disabled}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition ${
                active
                  ? 'border-purple-500 bg-purple-500/10'
                  : disabled
                  ? 'border-gray-800 bg-gray-900 opacity-30 cursor-not-allowed'
                  : 'border-gray-700 bg-[#1A1A2E] hover:border-gray-500 cursor-pointer'
              }`}
            >
              <div className="flex -space-x-1">
                <span
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
              <span className={`text-sm ${active ? 'text-white font-semibold' : 'text-gray-400'}`}>
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
