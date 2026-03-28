'use client';

import { useState, useCallback } from 'react';
import type { TierCode } from '@/lib/types/tier';
import type { ThemeCode } from '@/lib/types/theme';
import type { SajuData } from '@/lib/types/saju';
import { TIER_ORDER } from '@/lib/constants/tiers';
import { THEMES } from '@/lib/constants/themes';
import { getPartKeysForTier } from '@/lib/constants/partKeys';
import { parseSajuJson } from '@/lib/utils/parseJson';
import { extractInfo, type ExtractedInfo } from '@/lib/utils/extractInfo';

// ─── 상수 ───

const TIER_INFO: Record<TierCode, { label: string; desc: string; pages: string }> = {
  basic: { label: 'Basic', desc: '커버 + 인트로 + 차트 + 본문 + 엔딩', pages: '~30쪽' },
  love: { label: 'Love', desc: 'Love 테마 고정, 연애 차트 포함', pages: '~60쪽' },
  full: { label: 'Full', desc: '신살표 + 대운 타임라인 포함', pages: '~80쪽' },
  premium: { label: 'Premium', desc: '월운/년운 차트 포함, 최대 구성', pages: '100쪽+' },
};

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

// ─── 텍스트 → 파트키 매핑 ───

/** 사용자 텍스트를 --- 구분선으로 분리 후 해당 티어의 파트키에 순서대로 매핑 */
function mapTextToPartKeys(rawText: string, tier: TierCode): Record<string, string> {
  const partKeys = getPartKeysForTier(tier);
  const chunks = rawText
    .split(/^---+$/m)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const texts: Record<string, string> = {};

  if (chunks.length <= 1) {
    // 구분선 없음 → 전체 텍스트를 첫 번째 키에 할당
    if (chunks[0]) texts[partKeys[0]] = chunks[0];
  } else {
    // 구분선 있음 → 순서대로 매핑
    chunks.forEach((chunk, i) => {
      if (i < partKeys.length) {
        texts[partKeys[i]] = chunk;
      }
    });
  }

  return texts;
}

// ─── 페이지 ───

export default function ManualPage() {
  // 설정
  const [selectedTier, setSelectedTier] = useState<TierCode | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeCode>('classic');
  const [showBrand, setShowBrand] = useState(true);
  const [sajuData, setSajuData] = useState<SajuData | null>(null);
  const [sajuInfo, setSajuInfo] = useState<ExtractedInfo | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // 텍스트
  const [bodyText, setBodyText] = useState('');
  const [personalQuestion, setPersonalQuestion] = useState('');
  const [personalAnswer, setPersonalAnswer] = useState('');

  // JSON 입력
  const [jsonError, setJsonError] = useState('');
  const [jsonMode, setJsonMode] = useState<'file' | 'paste'>('file');
  const [pasteText, setPasteText] = useState('');

  // PDF 상태
  const [status, setStatus] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  // ─── 핸들러 ───

  const handleSelectTier = useCallback((tier: TierCode) => {
    setSelectedTier((prev) => {
      const next = prev === tier ? null : tier;
      if (next === 'love') setSelectedTheme('love');
      else if (prev === 'love') setSelectedTheme('classic');
      return next;
    });
  }, []);

  const handleSelectTheme = useCallback((theme: ThemeCode) => {
    if (selectedTier === 'love') return;
    setSelectedTheme(theme);
  }, [selectedTier]);

  const processJson = useCallback((text: string) => {
    setJsonError('');
    const result = parseSajuJson(text);
    if (!result.ok) { setJsonError(result.error); setSajuData(null); setSajuInfo(null); return; }
    setSajuData(result.data);
    setSajuInfo(extractInfo(result.data));
  }, []);

  const handleJsonFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { const t = e.target?.result; if (typeof t === 'string') processJson(t); };
    reader.readAsText(file);
  }, [processJson]);

  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCompressing(true);
    try { setCoverImage(await compressImage(file)); } catch { /* ignore */ } finally { setCompressing(false); }
  }, []);

  // ─── PDF 생성 ───

  const canGenerate = !!(selectedTier && sajuData && bodyText.trim() && status !== 'rendering');

  const handleGenerate = useCallback(async () => {
    if (!selectedTier || !sajuData || !bodyText.trim()) return;
    setStatus('rendering');
    setErrorMessage(null);

    try {
      const { renderPdfOnClient } = await import('@/lib/utils/renderPdfClient');
      const clientInfo = extractInfo(sajuData);
      const clientName = clientInfo.name || 'Valued Guest';
      const birthInfo = `${clientInfo.birthDate} ${clientInfo.birthTime}`.trim();

      const texts = mapTextToPartKeys(bodyText, selectedTier);

      const blob = await renderPdfOnClient({
        tier: selectedTier,
        sajuData,
        texts,
        coverImage: coverImage || null,
        theme: selectedTheme,
        clientName,
        birthInfo,
        personalQuestion: personalQuestion || undefined,
        personalAnswer: personalAnswer || undefined,
        showBrand,
      });

      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      triggerDownload(url, `${clientName.replace(/\s+/g, '_')}_saju_${selectedTier}.pdf`);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'PDF 생성 실패');
      setStatus('error');
    }
  }, [selectedTier, sajuData, bodyText, coverImage, selectedTheme, personalQuestion, personalAnswer, showBrand, pdfBlobUrl]);

  const handleDownload = useCallback(() => {
    if (!pdfBlobUrl || !selectedTier || !sajuData) return;
    const clientInfo = extractInfo(sajuData);
    triggerDownload(pdfBlobUrl, `${(clientInfo.name || 'Guest').replace(/\s+/g, '_')}_saju_${selectedTier}.pdf`);
  }, [pdfBlobUrl, selectedTier, sajuData]);

  const handleReset = useCallback(() => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setSelectedTier(null);
    setSelectedTheme('classic');
    setShowBrand(true);
    setSajuData(null);
    setSajuInfo(null);
    setCoverImage(null);
    setBodyText('');
    setPersonalQuestion('');
    setPersonalAnswer('');
    setStatus('idle');
    setErrorMessage(null);
    setPdfBlobUrl(null);
  }, [pdfBlobUrl]);

  // 챕터 미리보기
  const chunkCount = bodyText.trim()
    ? bodyText.split(/^---+$/m).filter((c) => c.trim().length > 0).length
    : 0;
  const partKeyCount = selectedTier ? getPartKeysForTier(selectedTier).length : 0;

  // ─── 렌더링 ───

  return (
    <main className="min-h-screen bg-[#0A0A0F] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 헤더 */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">수동 텍스트 PDF 생성기</h1>
          <p className="text-sm text-gray-400">내가 작성한 글을 그대로 사주 PDF 템플릿에 담습니다</p>
          <div className="flex justify-center gap-3 mt-4">
            <a href="/" className="px-5 py-2 text-sm font-medium text-purple-400 border border-purple-700/50 rounded-lg hover:bg-purple-900/20 transition">
              AI 생성기
            </a>
            <a href="/mailer" target="_blank" className="px-5 py-2 text-sm font-medium text-amber-400 border border-amber-700/50 rounded-lg hover:bg-amber-900/20 transition">
              이메일 발송 도구
            </a>
          </div>
        </header>

        <div className={status === 'rendering' ? 'pointer-events-none opacity-50' : ''}>
          <div className="space-y-8">

            {/* 1. 템플릿 선택 */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">1 — 템플릿 선택</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TIER_ORDER.map((code) => {
                  const t = TIER_INFO[code];
                  const active = selectedTier === code;
                  return (
                    <button key={code} onClick={() => handleSelectTier(code)}
                      className={`rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${active ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-[#1A1A2E] hover:border-gray-500'}`}>
                      <span className={`text-lg font-bold ${active ? 'text-purple-400' : 'text-white'}`}>{t.label}</span>
                      <p className="text-xs text-gray-400 mt-1 mb-2">{t.desc}</p>
                      <span className="text-xs text-gray-500">{t.pages}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. JSON */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">2 — 사주 JSON</h2>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setJsonMode('file')} className={`px-3 py-1 text-xs rounded-md transition ${jsonMode === 'file' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>파일 업로드</button>
                <button onClick={() => setJsonMode('paste')} className={`px-3 py-1 text-xs rounded-md transition ${jsonMode === 'paste' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>직접 붙여넣기</button>
              </div>
              {!sajuData ? (
                jsonMode === 'file' ? (
                  <div onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleJsonFile(f); }} onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer">
                    <input type="file" accept=".json" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleJsonFile(f); }} className="hidden" id="manual-json" />
                    <label htmlFor="manual-json" className="cursor-pointer">
                      <p className="text-gray-400 mb-1">.json 파일을 끌어놓거나 클릭</p>
                    </label>
                  </div>
                ) : (
                  <div>
                    <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="사주 JSON을 여기에 붙여넣으세요..." rows={5}
                      className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none font-mono" />
                    <button onClick={() => { if (pasteText.trim()) processJson(pasteText.trim()); }} disabled={!pasteText.trim()}
                      className="mt-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-purple-500 transition">JSON 파싱</button>
                  </div>
                )
              ) : (
                <div className="bg-[#1A1A2E] border border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-400 font-medium">JSON 로드 완료</span>
                    </div>
                    <button onClick={() => { setSajuData(null); setSajuInfo(null); setJsonError(''); setPasteText(''); }} className="text-xs text-gray-500 hover:text-red-400 transition">초기화</button>
                  </div>
                  {sajuInfo && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-gray-500">이름</span><p className="text-white font-medium">{sajuInfo.name || '미입력'}</p></div>
                      <div><span className="text-gray-500">성별</span><p className="text-white font-medium">{sajuInfo.gender === '남' ? '남성' : '여성'}</p></div>
                      <div><span className="text-gray-500">생년월일</span><p className="text-white font-medium">{sajuInfo.birthDate}</p></div>
                      <div><span className="text-gray-500">나이</span><p className="text-white font-medium">만 {sajuInfo.age}세</p></div>
                    </div>
                  )}
                </div>
              )}
              {jsonError && <p className="mt-2 text-sm text-red-400">{jsonError}</p>}
            </section>

            {/* 3. 본문 텍스트 */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">3 — 본문 텍스트</h2>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder={"여기에 분석 글 전체를 붙여넣으세요.\n\n챕터를 나누려면 --- (대시 3개) 줄로 구분하세요.\n\n예시:\n첫 번째 챕터 내용...\n---\n두 번째 챕터 내용...\n---\n세 번째 챕터 내용..."}
                rows={16}
                className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-y leading-relaxed"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>{bodyText.length.toLocaleString()}자</span>
                {chunkCount > 0 && (
                  <span>
                    {chunkCount}개 챕터 감지
                    {chunkCount > partKeyCount && selectedTier && (
                      <span className="text-amber-500 ml-1">(최대 {partKeyCount}개 — 초과분 무시됨)</span>
                    )}
                  </span>
                )}
              </div>
            </section>

            {/* 4. 옵션 (커버/테마/브랜드) */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">4 — 옵션</h2>
              <div className="space-y-4">
                {/* 커버 이미지 */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">커버 이미지 (선택)</label>
                  {!coverImage ? (
                    <div onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }} onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-purple-500 transition cursor-pointer">
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} className="hidden" id="manual-cover" />
                      <label htmlFor="manual-cover" className="cursor-pointer text-sm text-gray-500">
                        {compressing ? '압축 중...' : '이미지 업로드 (표지 배경)'}
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-end gap-3">
                      <div className="relative">
                        <img src={coverImage} alt="커버" className="w-24 h-32 object-cover rounded-lg border border-gray-700" />
                        <button onClick={() => setCoverImage(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-500">X</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 테마 */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    테마
                    {selectedTier === 'love' && <span className="ml-1 text-pink-400">(Love 자동 고정)</span>}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {THEME_ORDER.map((code) => {
                      const theme = THEMES[code];
                      const active = selectedTheme === code;
                      const disabled = selectedTier === 'love' && code !== 'love';
                      return (
                        <button key={code} onClick={() => handleSelectTheme(code)} disabled={disabled}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm ${
                            active ? 'border-purple-500 bg-purple-500/10' : disabled ? 'border-gray-800 bg-gray-900 opacity-30 cursor-not-allowed' : 'border-gray-700 bg-[#1A1A2E] hover:border-gray-500 cursor-pointer'
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
                </div>

                {/* 브랜드 토글 */}
                <div className="flex items-center justify-between bg-[#12121f] rounded-xl px-5 py-3">
                  <div>
                    <p className="text-sm text-white">SajuMuse 브랜드 포함</p>
                    <p className="text-xs text-gray-600">외부 플랫폼 주문 시 OFF</p>
                  </div>
                  <button type="button" onClick={() => setShowBrand(!showBrand)}
                    className={`relative w-12 h-6 rounded-full transition cursor-pointer ${showBrand ? 'bg-purple-600' : 'bg-gray-700'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${showBrand ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                {/* 개인 Q&A */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">개인 질문 & 답변 (선택)</label>
                  <div className="space-y-2">
                    <textarea value={personalQuestion} onChange={(e) => setPersonalQuestion(e.target.value)}
                      placeholder="고객 질문..." rows={2}
                      className="w-full bg-[#12121f] border border-gray-700/50 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-700 focus:border-purple-500 focus:outline-none resize-none" />
                    <textarea value={personalAnswer} onChange={(e) => setPersonalAnswer(e.target.value)}
                      placeholder="답변..." rows={3}
                      className="w-full bg-[#12121f] border border-gray-700/50 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-700 focus:border-purple-500 focus:outline-none resize-y" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 생성 버튼 */}
        <section className="flex flex-col items-center gap-3">
          <button onClick={handleGenerate} disabled={!canGenerate}
            className="w-full max-w-md py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition text-base cursor-pointer">
            {status === 'rendering' ? 'PDF 렌더링 중...' : 'PDF 생성'}
          </button>
          {!selectedTier && <p className="text-xs text-gray-600">템플릿을 선택하세요</p>}
          {selectedTier && !sajuData && <p className="text-xs text-gray-600">사주 JSON을 입력하세요</p>}
          {selectedTier && sajuData && !bodyText.trim() && <p className="text-xs text-gray-600">본문 텍스트를 입력하세요</p>}
        </section>

        {/* 결과 */}
        {status === 'done' && (
          <section className="bg-[#1A1A2E] border border-green-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-green-400 font-medium">PDF 생성 완료</p>
              <div className="flex gap-3">
                {pdfBlobUrl && (
                  <button onClick={handleDownload} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition cursor-pointer">PDF 다운로드</button>
                )}
                <button onClick={handleReset} className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">새로 생성</button>
              </div>
            </div>
          </section>
        )}

        {status === 'error' && (
          <section className="bg-[#1A1A2E] border border-red-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-3">
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
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
