'use client';

import { useState, useCallback } from 'react';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';

const THEME_ORDER: ThemeCode[] = ['classic', 'modern', 'minimal', 'elegant', 'love'];

// ─── 이미지 압축 ───

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const ratio = Math.min(800 / width, 1100 / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.6;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > 200 * 1024 && quality > 0.3) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다'));
    img.src = URL.createObjectURL(file);
  });
}

// ─── 텍스트 파싱 ───

function parseBodyText(raw: string): { title?: string; body: string }[] {
  const chunks = raw.split(/^---+$/m).map((c) => c.trim()).filter((c) => c.length > 0);
  if (chunks.length === 0) return [];

  return chunks.map((chunk) => {
    // 첫 줄이 짧으면 (80자 이하) 제목으로 처리
    const lines = chunk.split('\n');
    const firstLine = lines[0].trim();
    if (lines.length > 1 && firstLine.length <= 80 && firstLine.length > 0) {
      return { title: firstLine, body: lines.slice(1).join('\n').trim() };
    }
    return { body: chunk };
  });
}

// ─── 페이지 ───

export default function ManualPage() {
  const [clientName, setClientName] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeCode>('classic');
  const [showBrand, setShowBrand] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCompressing(true);
    try { setCoverImage(await compressImage(file)); } catch { /* ignore */ } finally { setCompressing(false); }
  }, []);

  const canGenerate = !!(clientName.trim() && bodyText.trim() && status !== 'rendering');

  const handleGenerate = useCallback(async () => {
    if (!clientName.trim() || !bodyText.trim()) return;
    setStatus('rendering');
    setErrorMessage(null);

    try {
      const React = await import('react');
      const { pdf } = await import('@react-pdf/renderer');
      const { SimplePdfDocument } = await import('@/components/pdf/SimplePdfDocument');

      const sections = parseBodyText(bodyText);
      const element = React.createElement(SimplePdfDocument, {
        clientName: clientName.trim(),
        sections,
        theme: selectedTheme,
        coverImage,
        showBrand,
      });

      const instance = pdf(element as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>);
      const blob = await instance.toBlob();

      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      triggerDownload(url, `${clientName.trim().replace(/\s+/g, '_')}_saju.pdf`);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'PDF 생성 실패');
      setStatus('error');
    }
  }, [clientName, bodyText, selectedTheme, coverImage, showBrand, pdfBlobUrl]);

  const handleDownload = useCallback(() => {
    if (!pdfBlobUrl) return;
    triggerDownload(pdfBlobUrl, `${clientName.trim().replace(/\s+/g, '_')}_saju.pdf`);
  }, [pdfBlobUrl, clientName]);

  const handleReset = useCallback(() => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setClientName('');
    setBodyText('');
    setSelectedTheme('classic');
    setShowBrand(true);
    setCoverImage(null);
    setStatus('idle');
    setErrorMessage(null);
    setPdfBlobUrl(null);
  }, [pdfBlobUrl]);

  const sectionCount = bodyText.trim() ? parseBodyText(bodyText).length : 0;

  return (
    <main className="min-h-screen bg-[#0A0A0F] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">수동 PDF 생성기</h1>
          <p className="text-sm text-gray-400">작성한 글을 그대로 PDF 템플릿에 담습니다</p>
          <div className="flex justify-center gap-3 mt-4">
            <a href="/" className="px-5 py-2 text-sm font-medium text-purple-400 border border-purple-700/50 rounded-lg hover:bg-purple-900/20 transition">AI 생성기</a>
            <a href="/mailer" target="_blank" className="px-5 py-2 text-sm font-medium text-amber-400 border border-amber-700/50 rounded-lg hover:bg-amber-900/20 transition">이메일 발송 도구</a>
          </div>
        </header>

        <div className={status === 'rendering' ? 'pointer-events-none opacity-50' : ''}>
          <div className="space-y-6">

            {/* 고객 이름 */}
            <section>
              <label className="text-sm font-semibold text-gray-400 tracking-widest mb-2 block">고객 이름</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="예: Sarah Kim"
                className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </section>

            {/* 본문 */}
            <section>
              <label className="text-sm font-semibold text-gray-400 tracking-widest mb-2 block">본문 텍스트</label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder={"분석 글을 여기에 붙여넣으세요.\n\n챕터를 나누려면 --- 로 구분합니다.\n각 챕터의 첫 줄이 80자 이하이면 자동으로 제목이 됩니다.\n\n예시:\nYour Destiny Overview\nYour Four Pillars reveal a deeply...\n---\nPersonality & Core Strengths\nYour Day Pillar of Eul-Mok..."}
                rows={20}
                className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-y leading-relaxed"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>{bodyText.length.toLocaleString()}자</span>
                {sectionCount > 0 && <span>{sectionCount}개 섹션</span>}
              </div>
            </section>

            {/* 옵션 */}
            <section className="bg-[#1A1A2E] border border-[#2a2a45] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest">옵션</h2>

              {/* 테마 */}
              <div className="flex gap-2 flex-wrap">
                {THEME_ORDER.map((code) => {
                  const theme = THEMES[code];
                  const active = selectedTheme === code;
                  return (
                    <button key={code} onClick={() => setSelectedTheme(code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm cursor-pointer ${
                        active ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-[#12121f] hover:border-gray-500'
                      }`}>
                      <div className="flex -space-x-1">
                        <span className="w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: theme.colors.primary }} />
                        <span className="w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: theme.colors.secondary }} />
                      </div>
                      <span className={active ? 'text-white font-semibold' : 'text-gray-400'}>{theme.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 브랜드 토글 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">SajuMuse 브랜드 포함</span>
                <button type="button" onClick={() => setShowBrand(!showBrand)}
                  className={`relative w-12 h-6 rounded-full transition cursor-pointer ${showBrand ? 'bg-purple-600' : 'bg-gray-700'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${showBrand ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* 커버 이미지 */}
              <div>
                <span className="text-xs text-gray-500 block mb-2">커버 이미지 (선택)</span>
                {!coverImage ? (
                  <div onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }} onDragOver={(e) => e.preventDefault()}
                    className="border border-dashed border-gray-700 rounded-lg p-3 text-center hover:border-purple-500 transition cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} className="hidden" id="manual-cover" />
                    <label htmlFor="manual-cover" className="cursor-pointer text-xs text-gray-500">
                      {compressing ? '압축 중...' : '이미지 업로드'}
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <img src={coverImage} alt="커버" className="w-16 h-22 object-cover rounded border border-gray-700" />
                    <button onClick={() => setCoverImage(null)} className="text-xs text-red-400 hover:text-red-300">제거</button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* 생성 버튼 */}
        <section className="flex flex-col items-center gap-2">
          <button onClick={handleGenerate} disabled={!canGenerate}
            className="w-full max-w-md py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition text-base cursor-pointer">
            {status === 'rendering' ? 'PDF 생성 중...' : 'PDF 생성'}
          </button>
        </section>

        {/* 결과 */}
        {status === 'done' && (
          <section className="bg-[#1A1A2E] border border-green-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-green-400 font-medium">PDF 생성 완료</p>
              <div className="flex gap-3">
                {pdfBlobUrl && <button onClick={handleDownload} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition cursor-pointer">PDF 다운로드</button>}
                <button onClick={handleReset} className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">새로 생성</button>
              </div>
            </div>
          </section>
        )}

        {status === 'error' && (
          <section className="bg-[#1A1A2E] border border-red-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-3">
              <p className="text-red-400 text-sm">{errorMessage}</p>
              <div className="flex gap-3">
                <button onClick={handleGenerate} className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 transition cursor-pointer">다시 시도</button>
                <button onClick={handleReset} className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">처음부터</button>
              </div>
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-gray-700 pt-8">SajuMuse &middot; sajumuse.com</footer>
      </div>
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
