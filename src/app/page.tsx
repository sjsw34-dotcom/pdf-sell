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

  // ─── 클라이언트에서 PDF 렌더링 (공통) ───
  async function buildPdf(clientName: string, textsOverride?: Record<string, string>) {
    if (!selectedTier || !sajuData) throw new Error('Missing data');

    const store = useGeneratorStore.getState();
    const clientInfo = extractInfo(sajuData);
    const birthInfo = `${clientInfo.birthDate} ${clientInfo.birthTime}`.trim();
    const texts = textsOverride ?? store.generatedTexts;

    // dynamic import — 브라우저에서 @react-pdf/renderer 로드
    const { renderPdfOnClient } = await import('@/lib/utils/renderPdfClient');

    const blob = await renderPdfOnClient({
      tier: selectedTier,
      sajuData,
      texts,
      coverImage: coverImage || null,
      theme: selectedTheme,
      clientName,
      birthInfo,
    });

    const url = URL.createObjectURL(blob);
    store.setPdfBlobUrl(url);
    triggerDownload(url, `${clientName.replace(/\s+/g, '_')}_saju_${selectedTier}.pdf`);
  }

  // ─── AI 생성 + PDF ───
  const handleGenerate = useCallback(async () => {
    if (!selectedTier || !sajuData) return;

    const store = useGeneratorStore.getState();
    const { setStatus, setProgress, setGeneratedText, addFailedPart, setPdfBlobUrl, setError, showToast } = store;

    const clientInfo = extractInfo(sajuData);
    const clientName = clientInfo.name || 'Valued Guest';
    const partKeys = getPartKeysForTier(selectedTier);

    setStatus('generating');
    setPdfBlobUrl(null);
    setProgress({ current: 0, total: partKeys.length, label: '시작 중...', failedParts: [] });

    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 3;

    for (let i = 0; i < partKeys.length; i++) {
      const partKey = partKeys[i];
      setProgress({ current: i + 1, label: `분석 생성 중: ${partKey} (${i + 1}/${partKeys.length})` });

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
        addFailedPart(partKey);
        showToast(`"${partKey}" 파트 실패 — 대체 텍스트를 사용합니다`);
        consecutiveFailures++;

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          setError(`생성 중단: API 연속 ${MAX_CONSECUTIVE_FAILURES}회 실패. 마지막 오류: ${msg}`);
          return;
        }
      }
    }

    setProgress({ current: partKeys.length, label: '모든 파트 완료' });
    setStatus('rendering');

    try {
      await buildPdf(clientName);
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF 생성 실패';
      setError(msg);
      showToast(msg);
    }
  }, [selectedTier, sajuData, coverImage, selectedTheme, additionalRequest]);

  // ─── 더미 테스트 (AI 없이) ───
  const handleQuickTest = useCallback(async () => {
    if (!selectedTier || !sajuData) return;

    const store = useGeneratorStore.getState();
    const { setStatus, setPdfBlobUrl, setError, showToast } = store;

    const clientInfo = extractInfo(sajuData);
    const clientName = clientInfo.name || 'Valued Guest';

    setStatus('rendering');
    setPdfBlobUrl(null);

    try {
      await buildPdf(clientName, {});
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF 생성 실패';
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
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">SajuMuse PDF 생성기</h1>
          <p className="text-sm text-gray-400">사주명리 분석 데이터를 프리미엄 영문 PDF 리포트로 변환합니다</p>
        </header>

        <div className={isWorking ? 'pointer-events-none opacity-50' : ''}>
          <div className="space-y-8">
            <TierSelector />
            <FileUploader />
            <ImageUploader />
            <ThemeSelector />
            <AdditionalRequest />
          </div>
        </div>

        <section className="w-full flex flex-col items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full max-w-md py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition text-base cursor-pointer"
          >
            {status === 'generating' ? 'AI 분석 생성 중...' : status === 'rendering' ? 'PDF 렌더링 중...' : 'AI로 PDF 생성하기'}
          </button>
          {canGenerate && (
            <button onClick={handleQuickTest} className="text-xs text-gray-500 hover:text-gray-300 transition underline cursor-pointer">
              더미 텍스트로 빠른 테스트 (AI 미사용)
            </button>
          )}
        </section>

        <ProgressBar />

        {status === 'done' && (
          <section className="w-full bg-[#1A1A2E] border border-green-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-green-400 font-medium">PDF가 성공적으로 생성되었습니다.</p>
              {pdfBlobUrl && (
                <button onClick={handleDownload} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition cursor-pointer">
                  PDF 다운로드
                </button>
              )}
              <button onClick={handleReset} className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">
                새로 생성하기
              </button>
            </div>
          </section>
        )}

        {status === 'error' && (
          <section className="w-full bg-[#1A1A2E] border border-red-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-3">
              <p className="text-red-400 text-sm text-center">{useGeneratorStore.getState().errorMessage}</p>
              <div className="flex gap-3">
                <button onClick={handleGenerate} className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 transition cursor-pointer">다시 시도</button>
                <button onClick={handleReset} className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">처음부터</button>
              </div>
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-gray-700 pt-8">SajuMuse &middot; sajumuse.com</footer>
      </div>
      <Toast />
    </main>
  );
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
