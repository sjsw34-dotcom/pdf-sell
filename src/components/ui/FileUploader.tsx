'use client';

import { useState, useCallback } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';
import { parseSajuJson } from '@/lib/utils/parseJson';
import { extractInfo, type ExtractedInfo } from '@/lib/utils/extractInfo';
import { BirthInput } from './BirthInput';

export function FileUploader() {
  const sajuData = useGeneratorStore((s) => s.sajuData);
  const setSajuData = useGeneratorStore((s) => s.setSajuData);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<ExtractedInfo | null>(null);
  const [mode, setMode] = useState<'file' | 'paste' | 'calculate'>('calculate');
  const [pasteText, setPasteText] = useState('');

  const processJson = useCallback(
    (text: string) => {
      setError('');
      const result = parseSajuJson(text);
      if (!result.ok) {
        setError(result.error);
        setSajuData(null);
        setInfo(null);
        return;
      }
      setSajuData(result.data);
      setInfo(extractInfo(result.data));
    },
    [setSajuData],
  );

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') processJson(text);
      };
      reader.readAsText(file);
    },
    [processJson],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handlePaste = useCallback(() => {
    if (pasteText.trim()) processJson(pasteText.trim());
  }, [pasteText, processJson]);

  const handleClear = useCallback(() => {
    setSajuData(null);
    setInfo(null);
    setError('');
    setPasteText('');
  }, [setSajuData]);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        2단계 — 사주 JSON 데이터 입력
      </h2>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('file')}
          className={`px-3 py-1 text-xs rounded-md transition ${
            mode === 'file' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          파일 업로드
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`px-3 py-1 text-xs rounded-md transition ${
            mode === 'paste' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          직접 붙여넣기
        </button>
        <button
          onClick={() => setMode('calculate')}
          className={`px-3 py-1 text-xs rounded-md transition ${
            mode === 'calculate' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          생년월일 계산
        </button>
      </div>

      {mode === 'calculate' ? (
        <BirthInput />
      ) : !sajuData ? (
        <>
          {mode === 'file' ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer"
            >
              <input
                type="file"
                accept=".json"
                onChange={handleInputChange}
                className="hidden"
                id="json-upload"
              />
              <label htmlFor="json-upload" className="cursor-pointer">
                <p className="text-gray-400 mb-1">.json 파일을 여기에 끌어놓거나 클릭하여 선택하세요</p>
                <p className="text-xs text-gray-600">사주 분석 JSON (9개 탭)</p>
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
                onClick={handlePaste}
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
            <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-400 transition">
              초기화
            </button>
          </div>
          {info && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-500">이름</span>
                <p className="text-white font-medium">{info.name || '미입력'}</p>
              </div>
              <div>
                <span className="text-gray-500">성별</span>
                <p className="text-white font-medium">{info.gender === '남' ? '남성' : '여성'}</p>
              </div>
              <div>
                <span className="text-gray-500">생년월일</span>
                <p className="text-white font-medium">{info.birthDate}</p>
              </div>
              <div>
                <span className="text-gray-500">나이</span>
                <p className="text-white font-medium">만 {info.age}세</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </section>
  );
}
