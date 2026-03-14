'use client';

import { useCallback } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';

export function ImageUploader() {
  const coverImage = useGeneratorStore((s) => s.coverImage);
  const setCoverImage = useGeneratorStore((s) => s.setCoverImage);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') setCoverImage(result);
      };
      reader.readAsDataURL(file);
    },
    [setCoverImage],
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

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        3단계 — 커버 이미지 <span className="text-gray-600">(선택사항)</span>
      </h2>

      {!coverImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-purple-500 transition cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="cover-upload"
          />
          <label htmlFor="cover-upload" className="cursor-pointer">
            <p className="text-gray-400 text-sm">이미지를 끌어놓거나 클릭하여 업로드</p>
            <p className="text-xs text-gray-600 mt-1">PDF 표지 배경으로 사용됩니다</p>
          </label>
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={coverImage}
            alt="커버 미리보기"
            className="w-32 h-44 object-cover rounded-lg border border-gray-700"
          />
          <button
            onClick={() => setCoverImage(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500"
          >
            X
          </button>
        </div>
      )}
    </section>
  );
}
