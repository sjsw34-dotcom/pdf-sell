'use client';

import { useEffect } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';

export function Toast() {
  const toastMessage = useGeneratorStore((s) => s.toastMessage);
  const dismissToast = useGeneratorStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(dismissToast, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage, dismissToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-center gap-3 bg-red-900/90 border border-red-700 text-red-100 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm max-w-md">
        <span className="text-sm">{toastMessage}</span>
        <button
          onClick={dismissToast}
          className="ml-2 text-red-300 hover:text-white text-lg leading-none"
        >
          x
        </button>
      </div>
    </div>
  );
}
