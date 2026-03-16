'use client';

import { useCallback, useState } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';

const MAX_WIDTH = 800;
const MAX_HEIGHT = 1100;
const JPEG_QUALITY = 0.6;
const MAX_BASE64_KB = 200;

/**
 * 이미지를 Canvas로 리사이즈 + JPEG 압축하여 base64로 변환.
 * 결과 base64가 MAX_BASE64_KB 이하가 되도록 품질을 조절.
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // 비율 유지 리사이즈
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

      // 품질 단계별로 줄여가며 크기 맞추기
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

export function ImageUploader() {
  const coverImage = useGeneratorStore((s) => s.coverImage);
  const setCoverImage = useGeneratorStore((s) => s.setCoverImage);
  const [compressing, setCompressing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setCompressing(true);
      try {
        const base64 = await compressImage(file);
        setCoverImage(base64);
      } catch (err) {
        console.error('Image compression failed:', err);
      } finally {
        setCompressing(false);
      }
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

  const sizeKB = coverImage ? Math.round(coverImage.length / 1024) : 0;

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
          <span className="text-xs text-gray-600">{sizeKB}KB</span>
        </div>
      )}
    </section>
  );
}
