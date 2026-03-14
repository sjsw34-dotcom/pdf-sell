'use client';

import { useCallback } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';
import { extractInfo } from '@/lib/utils/extractInfo';
import { getPartKeysForTier } from '@/lib/constants/partKeys';
import { TierSelector } from '@/components/ui/TierSelector';
import { FileUploader } from '@/components/ui/FileUploader';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { AdditionalRequest } from '@/components/ui/AdditionalRequest';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';

export default function HomePage() {
  const selectedTier = useGeneratorStore((s) => s.selectedTier);
  const sajuData = useGeneratorStore((s) => s.sajuData);
  const coverImage = useGeneratorStore((s) => s.coverImage);
  const selectedTheme = useGeneratorStore((s) => s.selectedTheme);
  const additionalRequest = useGeneratorStore((s) => s.additionalRequest);
  const status = useGeneratorStore((s) => s.status);
  const pdfBlobUrl = useGeneratorStore((s) => s.pdfBlobUrl);

  const isWorking = status === 'generating' || status === 'rendering';
  const canGenerate = !!(selectedTier && sajuData && !isWorking);

  // ─── AI 생성 + PDF 렌더링 전체 플로우 ───
  const handleGenerate = useCallback(async () => {
    if (!selectedTier || !sajuData) return;

    const store = useGeneratorStore.getState();
    const { setStatus, setProgress, setGeneratedText, addFailedPart, setPdfBlobUrl, setError, showToast } = store;

    const clientInfo = extractInfo(sajuData);
    const clientName = clientInfo.name || 'Valued Guest';
    const birthInfo = `${clientInfo.birthDate} ${clientInfo.birthTime}`.trim();
    const partKeys = getPartKeysForTier(selectedTier);

    // 1. 상태 초기화
    setStatus('generating');
    setPdfBlobUrl(null);
    setProgress({ current: 0, total: partKeys.length, label: 'Starting...', failedParts: [] });

    // 2. 파트별 순차 호출
    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 3;

    for (let i = 0; i < partKeys.length; i++) {
      const partKey = partKeys[i];
      setProgress({ current: i + 1, label: `Generating: ${partKey} (${i + 1}/${partKeys.length})` });

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: selectedTier,
            partKey,
            sajuData,
            additionalRequest: additionalRequest || null,
            clientName,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.text) {
          setGeneratedText(partKey, data.text);
          consecutiveFailures = 0;
        } else {
          throw new Error('Empty response');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[generate] Part "${partKey}" failed: ${msg}`);

        addFailedPart(partKey);
        showToast(`Part "${partKey}" failed — using fallback text`);
        consecutiveFailures++;

        // 연속 실패 3회 시 전체 중단
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          setError(`Generation stopped: ${MAX_CONSECUTIVE_FAILURES} consecutive API failures. Last error: ${msg}`);
          return;
        }
      }
    }

    // 3. 모든 파트 완료 → PDF 렌더링
    setProgress({ current: partKeys.length, label: 'All parts complete' });
    setStatus('rendering');

    try {
      const currentTexts = useGeneratorStore.getState().generatedTexts;

      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          sajuData,
          texts: currentTexts,
          coverImage,
          theme: selectedTheme,
        }),
      });

      if (!pdfRes.ok) {
        const errData = await pdfRes.json().catch(() => ({ error: pdfRes.statusText }));
        throw new Error(errData.error || `PDF rendering failed (HTTP ${pdfRes.status})`);
      }

      // 4. PDF blob 생성 + URL 저장
      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      // 자동 다운로드
      triggerDownload(url, `${clientName.replace(/\s+/g, '_')}_saju_${selectedTier}.pdf`);

      // 5. 완료
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF generation failed';
      setError(msg);
      showToast(msg);
    }
  }, [selectedTier, sajuData, coverImage, selectedTheme, additionalRequest]);

  // ─── 더미 테스트 (AI 없이 바로 PDF) ───
  const handleQuickTest = useCallback(async () => {
    if (!selectedTier || !sajuData) return;

    const store = useGeneratorStore.getState();
    const { setStatus, setPdfBlobUrl, setError, showToast } = store;

    const clientInfo = extractInfo(sajuData);
    const clientName = clientInfo.name || 'Valued Guest';

    setStatus('rendering');
    setPdfBlobUrl(null);

    try {
      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          sajuData,
          texts: {},
          coverImage,
          theme: selectedTheme,
        }),
      });

      if (!pdfRes.ok) {
        const errData = await pdfRes.json().catch(() => ({ error: pdfRes.statusText }));
        throw new Error(errData.error || `HTTP ${pdfRes.status}`);
      }

      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      triggerDownload(url, `${clientName.replace(/\s+/g, '_')}_test_${selectedTier}.pdf`);
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF generation failed';
      setError(msg);
      showToast(msg);
    }
  }, [selectedTier, sajuData, coverImage, selectedTheme]);

  // ─── 수동 다운로드 ───
  const handleDownload = useCallback(() => {
    if (!pdfBlobUrl || !selectedTier || !sajuData) return;
    const clientInfo = extractInfo(sajuData);
    const clientName = clientInfo.name || 'Valued Guest';
    triggerDownload(pdfBlobUrl, `${clientName.replace(/\s+/g, '_')}_saju_${selectedTier}.pdf`);
  }, [pdfBlobUrl, selectedTier, sajuData]);

  const handleReset = useCallback(() => {
    useGeneratorStore.getState().reset();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0F] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 헤더 */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            SajuMuse PDF Generator
          </h1>
          <p className="text-sm text-gray-400">
            Transform Korean Four Pillars data into a premium English PDF report
          </p>
        </header>

        {/* Steps — 생성 중에는 입력부 비활성화 */}
        <div className={isWorking ? 'pointer-events-none opacity-50' : ''}>
          <div className="space-y-8">
            <TierSelector />
            <FileUploader />
            <ImageUploader />
            <ThemeSelector />
            <AdditionalRequest />
          </div>
        </div>

        {/* 생성 버튼 */}
        <section className="w-full flex flex-col items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full max-w-md py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition text-base cursor-pointer"
          >
            {status === 'generating'
              ? 'Generating...'
              : status === 'rendering'
              ? 'Rendering PDF...'
              : 'Generate PDF with AI'}
          </button>

          {canGenerate && (
            <button
              onClick={handleQuickTest}
              className="text-xs text-gray-500 hover:text-gray-300 transition underline cursor-pointer"
            >
              Quick test with dummy text (no AI)
            </button>
          )}
        </section>

        {/* 진행 상태 */}
        <ProgressBar />

        {/* 완료 */}
        {status === 'done' && (
          <section className="w-full bg-[#1A1A2E] border border-green-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-green-400 font-medium">
                PDF generated successfully.
              </p>

              {/* 다운로드 버튼 */}
              {pdfBlobUrl && (
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Download PDF
                </button>
              )}

              {/* 실패 파트 경고 */}
              {useGeneratorStore.getState().progress.failedParts.length > 0 && (
                <p className="text-xs text-amber-400 text-center">
                  Note: {useGeneratorStore.getState().progress.failedParts.length} part(s) used fallback text due to API errors.
                </p>
              )}

              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer"
              >
                Generate Another
              </button>
            </div>
          </section>
        )}

        {/* 에러 */}
        {status === 'error' && (
          <section className="w-full bg-[#1A1A2E] border border-red-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-3">
              <p className="text-red-400 text-sm text-center">
                {useGeneratorStore.getState().errorMessage}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 transition cursor-pointer"
                >
                  Retry
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer"
                >
                  Start Over
                </button>
              </div>
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-gray-700 pt-8">
          SajuMuse &middot; sajumuse.com
        </footer>
      </div>

      {/* 토스트 */}
      <Toast />
    </main>
  );
}

// ─── 유틸 ───

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
