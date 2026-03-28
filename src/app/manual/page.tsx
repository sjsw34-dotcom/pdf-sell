'use client';

import { useState, useCallback, useReducer } from 'react';
import type { TierCode } from '@/lib/types/tier';
import type { ThemeCode } from '@/lib/types/theme';
import type { SajuData } from '@/lib/types/saju';
import { TIER_ORDER } from '@/lib/constants/tiers';
import { THEMES } from '@/lib/constants/themes';
import { getGroupedPartKeys } from '@/lib/constants/partKeyLabels';
import { parseSajuJson } from '@/lib/utils/parseJson';
import { extractInfo, type ExtractedInfo } from '@/lib/utils/extractInfo';

// ─── 상수 ───

const TIER_INFO: Record<TierCode, { label: string; desc: string; pages: string; parts: number }> = {
  basic: { label: 'Basic', desc: '사주원국 + 오행 분석 + 종합 운세', pages: '~30쪽', parts: 1 },
  love: { label: 'Love', desc: '연애 DNA, 이상형, 연애 타이밍 & 전략', pages: '~60쪽', parts: 6 },
  full: { label: 'Full', desc: '성격/연애/재물/직업/건강/신살/대운 종합', pages: '~80쪽', parts: 8 },
  premium: { label: 'Premium', desc: '전체 분석 + 올해 운세 + 10년 운세', pages: '60쪽+', parts: 10 },
};

const THEME_ORDER: ThemeCode[] = ['classic', 'modern', 'minimal', 'elegant', 'love'];

// ─── 이미지 압축 ───

const MAX_WIDTH = 800;
const MAX_HEIGHT = 1100;
const JPEG_QUALITY = 0.6;
const MAX_BASE64_KB = 200;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = JPEG_QUALITY;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > MAX_BASE64_KB * 1024 && quality > 0.3) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다'));
    img.src = URL.createObjectURL(file);
  });
}

// ─── Texts Reducer ───

type TextsAction = { type: 'set'; key: string; value: string } | { type: 'reset' };

function textsReducer(state: Record<string, string>, action: TextsAction): Record<string, string> {
  switch (action.type) {
    case 'set': return { ...state, [action.key]: action.value };
    case 'reset': return {};
  }
}

// ─── 페이지 ───

export default function ManualPage() {
  // 기본 설정
  const [selectedTier, setSelectedTier] = useState<TierCode | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeCode>('classic');
  const [showBrand, setShowBrand] = useState(true);
  const [sajuData, setSajuData] = useState<SajuData | null>(null);
  const [sajuInfo, setSajuInfo] = useState<ExtractedInfo | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [personalQuestion, setPersonalQuestion] = useState('');
  const [personalAnswer, setPersonalAnswer] = useState('');

  // 텍스트 입력
  const [texts, dispatchTexts] = useReducer(textsReducer, {});

  // JSON 입력
  const [jsonError, setJsonError] = useState('');
  const [jsonMode, setJsonMode] = useState<'file' | 'paste'>('file');
  const [pasteText, setPasteText] = useState('');

  // PDF 상태
  const [status, setStatus] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // 접기/펼치기
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [compressing, setCompressing] = useState(false);

  // ─── 핸들러 ───

  const handleSelectTier = useCallback((tier: TierCode) => {
    setSelectedTier((prev) => {
      const next = prev === tier ? null : tier;
      if (next === 'love') setSelectedTheme('love');
      else if (prev === 'love') setSelectedTheme('classic');
      return next;
    });
    dispatchTexts({ type: 'reset' });
    setExpandedGroups(new Set());
  }, []);

  const handleSelectTheme = useCallback((theme: ThemeCode) => {
    if (selectedTier === 'love') return;
    setSelectedTheme(theme);
  }, [selectedTier]);

  const processJson = useCallback((text: string) => {
    setJsonError('');
    const result = parseSajuJson(text);
    if (!result.ok) {
      setJsonError(result.error);
      setSajuData(null);
      setSajuInfo(null);
      return;
    }
    setSajuData(result.data);
    setSajuInfo(extractInfo(result.data));
  }, []);

  const handleJsonFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const t = e.target?.result;
      if (typeof t === 'string') processJson(t);
    };
    reader.readAsText(file);
  }, [processJson]);

  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCompressing(true);
    try {
      const base64 = await compressImage(file);
      setCoverImage(base64);
    } catch { /* ignore */ } finally {
      setCompressing(false);
    }
  }, []);

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!selectedTier) return;
    const groups = getGroupedPartKeys(selectedTier);
    setExpandedGroups(new Set(groups.map((g) => g.group)));
  }, [selectedTier]);

  const collapseAll = useCallback(() => {
    setExpandedGroups(new Set());
  }, []);

  // ─── PDF 생성 ───

  const canGenerate = !!(selectedTier && sajuData && status !== 'rendering');

  const handleGenerate = useCallback(async () => {
    if (!selectedTier || !sajuData) return;
    setStatus('rendering');
    setErrorMessage(null);

    try {
      const { renderPdfOnClient } = await import('@/lib/utils/renderPdfClient');
      const clientInfo = extractInfo(sajuData);
      const clientName = clientInfo.name || 'Valued Guest';
      const birthInfo = `${clientInfo.birthDate} ${clientInfo.birthTime}`.trim();

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
      const msg = err instanceof Error ? err.message : 'PDF 생성 실패';
      setErrorMessage(msg);
      setStatus('error');
    }
  }, [selectedTier, sajuData, texts, coverImage, selectedTheme, personalQuestion, personalAnswer, showBrand, pdfBlobUrl]);

  const handleDownload = useCallback(() => {
    if (!pdfBlobUrl || !selectedTier || !sajuData) return;
    const clientInfo = extractInfo(sajuData);
    const clientName = clientInfo.name || 'Valued Guest';
    triggerDownload(pdfBlobUrl, `${clientName.replace(/\s+/g, '_')}_saju_${selectedTier}.pdf`);
  }, [pdfBlobUrl, selectedTier, sajuData]);

  const handleReset = useCallback(() => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setSelectedTier(null);
    setSelectedTheme('classic');
    setShowBrand(true);
    setSajuData(null);
    setSajuInfo(null);
    setCoverImage(null);
    setPersonalQuestion('');
    setPersonalAnswer('');
    dispatchTexts({ type: 'reset' });
    setStatus('idle');
    setErrorMessage(null);
    setPdfBlobUrl(null);
    setExpandedGroups(new Set());
    setJsonError('');
    setPasteText('');
  }, [pdfBlobUrl]);

  // ─── 그룹 데이터 ───

  const groups = selectedTier ? getGroupedPartKeys(selectedTier) : [];
  const filledCount = Object.values(texts).filter((v) => v.trim().length > 0).length;
  const totalCount = groups.reduce((sum, g) => sum + g.keys.length, 0);

  // ─── 렌더링 ───

  return (
    <main className="min-h-screen bg-[#0A0A0F] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 헤더 */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">수동 텍스트 PDF 생성기</h1>
          <p className="text-sm text-gray-400">직접 작성한 텍스트를 사주 PDF 템플릿에 적용합니다</p>
          <div className="flex justify-center gap-3 mt-4">
            <a
              href="/"
              className="inline-block px-5 py-2 text-sm font-medium text-purple-400 border border-purple-700/50 rounded-lg hover:bg-purple-900/20 transition"
            >
              AI 생성기로 돌아가기
            </a>
            <a
              href="/mailer"
              target="_blank"
              className="inline-block px-5 py-2 text-sm font-medium text-amber-400 border border-amber-700/50 rounded-lg hover:bg-amber-900/20 transition"
            >
              이메일 발송 도구
            </a>
          </div>
        </header>

        <div className={status === 'rendering' ? 'pointer-events-none opacity-50' : ''}>
          <div className="space-y-8">

            {/* 1단계: 상품 선택 */}
            <section className="w-full">
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">1단계 — 상품 선택</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TIER_ORDER.map((code) => {
                  const t = TIER_INFO[code];
                  const active = selectedTier === code;
                  return (
                    <button
                      key={code}
                      onClick={() => handleSelectTier(code)}
                      className={`rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${
                        active ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-[#1A1A2E] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <span className={`text-lg font-bold ${active ? 'text-purple-400' : 'text-white'}`}>{t.label}</span>
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

            {/* 2단계: JSON 입력 */}
            <section className="w-full">
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">2단계 — 사주 JSON 데이터 입력</h2>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setJsonMode('file')} className={`px-3 py-1 text-xs rounded-md transition ${jsonMode === 'file' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  파일 업로드
                </button>
                <button onClick={() => setJsonMode('paste')} className={`px-3 py-1 text-xs rounded-md transition ${jsonMode === 'paste' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  직접 붙여넣기
                </button>
              </div>

              {!sajuData ? (
                <>
                  {jsonMode === 'file' ? (
                    <div
                      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleJsonFile(f); }}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer"
                    >
                      <input type="file" accept=".json" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleJsonFile(f); }} className="hidden" id="manual-json-upload" />
                      <label htmlFor="manual-json-upload" className="cursor-pointer">
                        <p className="text-gray-400 mb-1">.json 파일을 여기에 끌어놓거나 클릭하여 선택하세요</p>
                        <p className="text-xs text-gray-600">사주 분석 JSON</p>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder="사주 JSON 데이터를 여기에 붙여넣으세요..."
                        rows={6}
                        className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none font-mono"
                      />
                      <button
                        onClick={() => { if (pasteText.trim()) processJson(pasteText.trim()); }}
                        disabled={!pasteText.trim()}
                        className="mt-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-purple-500 transition"
                      >
                        JSON 파싱
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#1A1A2E] border border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-400 font-medium">JSON 로드 완료</span>
                    </div>
                    <button onClick={() => { setSajuData(null); setSajuInfo(null); setJsonError(''); setPasteText(''); }} className="text-xs text-gray-500 hover:text-red-400 transition">
                      초기화
                    </button>
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

            {/* 3단계: 커버 이미지 */}
            <section className="w-full">
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
                3단계 — 커버 이미지 <span className="text-gray-600">(선택사항)</span>
              </h2>
              {!coverImage ? (
                <div
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-purple-500 transition cursor-pointer"
                >
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} className="hidden" id="manual-cover-upload" />
                  <label htmlFor="manual-cover-upload" className="cursor-pointer">
                    {compressing ? (
                      <p className="text-purple-400 text-sm">이미지 압축 중...</p>
                    ) : (
                      <>
                        <p className="text-gray-400 text-sm">이미지를 끌어놓거나 클릭하여 업로드</p>
                        <p className="text-xs text-gray-600 mt-1">PDF 표지 배경으로 사용됩니다 (자동 압축)</p>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <div className="relative inline-block">
                    <img src={coverImage} alt="커버 미리보기" className="w-32 h-44 object-cover rounded-lg border border-gray-700" />
                    <button onClick={() => setCoverImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500">X</button>
                  </div>
                  <span className="text-xs text-gray-600">{Math.round(coverImage.length / 1024)}KB</span>
                </div>
              )}
            </section>

            {/* 4단계: 테마 */}
            <section className="w-full">
              <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
                4단계 — PDF 테마
                {selectedTier === 'love' && <span className="ml-2 text-xs text-pink-400">(Love 티어는 자동 고정)</span>}
              </h2>
              <div className="flex gap-3 flex-wrap">
                {THEME_ORDER.map((code) => {
                  const theme = THEMES[code];
                  const active = selectedTheme === code;
                  const disabled = selectedTier === 'love' && code !== 'love';
                  return (
                    <button
                      key={code}
                      onClick={() => handleSelectTheme(code)}
                      disabled={disabled}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition ${
                        active ? 'border-purple-500 bg-purple-500/10'
                          : disabled ? 'border-gray-800 bg-gray-900 opacity-30 cursor-not-allowed'
                          : 'border-gray-700 bg-[#1A1A2E] hover:border-gray-500 cursor-pointer'
                      }`}
                    >
                      <div className="flex -space-x-1">
                        <span className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: theme.colors.primary }} />
                        <span className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: theme.colors.secondary }} />
                        <span className="w-4 h-4 rounded-full border border-gray-600" style={{ backgroundColor: theme.colors.accent }} />
                      </div>
                      <span className={`text-sm ${active ? 'text-white font-semibold' : 'text-gray-400'}`}>{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 브랜드 토글 */}
            <div className="flex items-center justify-between bg-[#1A1A2E] border border-[#2a2a45] rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-medium text-white">SajuMuse 브랜드 포함</p>
                <p className="text-xs text-gray-500 mt-1">외부 플랫폼 주문 시 OFF로 설정하세요</p>
              </div>
              <button
                type="button"
                onClick={() => setShowBrand(!showBrand)}
                className={`relative w-12 h-6 rounded-full transition cursor-pointer ${showBrand ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${showBrand ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* 5단계: 텍스트 입력 */}
            {selectedTier && (
              <section className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-400 tracking-widest">
                    5단계 — 텍스트 입력
                    <span className="ml-2 text-xs text-gray-600">({filledCount}/{totalCount} 입력됨)</span>
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={expandAll} className="text-xs text-purple-400 hover:text-purple-300 transition">모두 펼치기</button>
                    <button onClick={collapseAll} className="text-xs text-gray-500 hover:text-gray-300 transition">모두 접기</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {groups.map(({ group, groupLabel, keys }) => {
                    const expanded = expandedGroups.has(group);
                    const groupFilled = keys.filter((k) => (texts[k.key] || '').trim().length > 0).length;
                    return (
                      <div key={group} className="bg-[#1A1A2E] border border-[#2a2a45] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleGroup(group)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[#1f1f38] transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs transition-transform ${expanded ? 'rotate-90' : ''}`}>&#9654;</span>
                            <span className="text-sm font-medium text-white">{groupLabel}</span>
                          </div>
                          <span className={`text-xs ${groupFilled === keys.length ? 'text-green-400' : 'text-gray-500'}`}>
                            {groupFilled}/{keys.length}
                          </span>
                        </button>

                        {expanded && (
                          <div className="px-5 pb-4 space-y-4 border-t border-[#2a2a45]">
                            {keys.map((meta) => (
                              <div key={meta.key} className="pt-4">
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-xs text-purple-400 font-mono">{meta.label}</span>
                                  <span className="text-sm text-gray-300">{meta.title}</span>
                                  <span className="text-xs text-gray-600 font-mono ml-auto">{meta.key}</span>
                                </div>
                                <textarea
                                  value={texts[meta.key] || ''}
                                  onChange={(e) => dispatchTexts({ type: 'set', key: meta.key, value: e.target.value })}
                                  placeholder={`${meta.title} 내용을 입력하세요...`}
                                  rows={meta.type === 'callout' ? 3 : 8}
                                  className={`w-full bg-[#12121f] border rounded-lg p-3 text-sm text-gray-300 placeholder-gray-700 focus:outline-none resize-y font-mono leading-relaxed ${
                                    (texts[meta.key] || '').trim() ? 'border-green-800/50' : 'border-gray-700/50'
                                  } focus:border-purple-500`}
                                />
                                <div className="text-right">
                                  <span className="text-xs text-gray-700">{(texts[meta.key] || '').length}자</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Personal Q&A (선택) */}
            {selectedTier && (
              <section className="w-full">
                <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
                  6단계 — 개인 질문 & 답변 <span className="text-gray-600">(선택사항)</span>
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">고객 질문</label>
                    <textarea
                      value={personalQuestion}
                      onChange={(e) => setPersonalQuestion(e.target.value)}
                      placeholder="고객이 보낸 개인 질문..."
                      rows={2}
                      className="w-full bg-[#1A1A2E] border border-gray-700/50 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">답변</label>
                    <textarea
                      value={personalAnswer}
                      onChange={(e) => setPersonalAnswer(e.target.value)}
                      placeholder="질문에 대한 답변..."
                      rows={4}
                      className="w-full bg-[#1A1A2E] border border-gray-700/50 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-700 focus:border-purple-500 focus:outline-none resize-y"
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* 생성 버튼 */}
        <section className="w-full flex flex-col items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full max-w-md py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition text-base cursor-pointer"
          >
            {status === 'rendering' ? 'PDF 렌더링 중...' : '수동 텍스트로 PDF 생성'}
          </button>
          {canGenerate && filledCount === 0 && (
            <p className="text-xs text-amber-500">텍스트 미입력 시 더미 텍스트가 사용됩니다</p>
          )}
          {canGenerate && filledCount > 0 && filledCount < totalCount && (
            <p className="text-xs text-amber-500">{totalCount - filledCount}개 항목이 비어있습니다 (더미 텍스트로 대체됨)</p>
          )}
        </section>

        {/* 결과 */}
        {status === 'done' && (
          <section className="w-full bg-[#1A1A2E] border border-green-800 rounded-xl p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-green-400 font-medium">PDF가 성공적으로 생성되었습니다.</p>
              <div className="flex gap-3">
                {pdfBlobUrl && (
                  <button onClick={handleDownload} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition cursor-pointer">
                    PDF 다운로드
                  </button>
                )}
                <button onClick={handleReset} className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer">
                  새로 생성하기
                </button>
              </div>
            </div>
          </section>
        )}

        {status === 'error' && (
          <section className="w-full bg-[#1A1A2E] border border-red-800 rounded-xl p-6">
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
