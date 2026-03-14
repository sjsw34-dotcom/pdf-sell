'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';

export function ProgressBar() {
  const status = useGeneratorStore((s) => s.status);
  const progress = useGeneratorStore((s) => s.progress);
  const errorMessage = useGeneratorStore((s) => s.errorMessage);

  if (status === 'idle' || status === 'done') return null;

  const pct = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const hasFails = progress.failedParts.length > 0;

  return (
    <section className="w-full">
      <div className="bg-[#1A1A2E] border border-gray-700 rounded-xl p-5">
        {/* 상태 라벨 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">
            {status === 'generating' && progress.label}
            {status === 'rendering' && 'Rendering PDF...'}
            {status === 'error' && 'Generation Failed'}
          </span>
          <span className="text-xs text-gray-500">
            {status === 'generating' && `${progress.current}/${progress.total}`}
            {status === 'rendering' && 'Almost done'}
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'error' ? 'bg-red-500' : 'bg-purple-500'
            }`}
            style={{ width: status === 'rendering' ? '95%' : `${pct}%` }}
          />
        </div>

        {/* 실패 파트 경고 */}
        {status === 'generating' && hasFails && (
          <p className="mt-3 text-xs text-amber-400">
            {progress.failedParts.length} part(s) used fallback text: {progress.failedParts.join(', ')}
          </p>
        )}

        {/* 에러 메시지 */}
        {status === 'error' && errorMessage && (
          <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
        )}
      </div>
    </section>
  );
}
