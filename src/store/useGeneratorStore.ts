import { create } from 'zustand';
import type { SajuData } from '@/lib/types/saju';
import type { TierCode } from '@/lib/types/tier';
import type { ThemeCode } from '@/lib/types/theme';

const MAX_ADDITIONAL_REQUEST = 500;

export type Status = 'idle' | 'generating' | 'rendering' | 'done' | 'error';

export interface Progress {
  current: number;
  total: number;
  label: string;
  failedParts: string[];
}

interface GeneratorState {
  selectedTier: TierCode | null;
  sajuData: SajuData | null;
  coverImage: string | null;
  selectedTheme: ThemeCode;
  additionalRequest: string;
  personalQuestion: string;
  personalAnswer: string;
  showBrand: boolean;
  generatedTexts: Record<string, string>;
  progress: Progress;
  status: Status;
  errorMessage: string | null;
  pdfBlobUrl: string | null;
  toastMessage: string | null;
}

interface GeneratorActions {
  setTier: (tier: TierCode | null) => void;
  setSajuData: (data: SajuData | null) => void;
  setCoverImage: (base64: string | null) => void;
  setTheme: (theme: ThemeCode) => void;
  setAdditionalRequest: (text: string) => void;
  setShowBrand: (show: boolean) => void;
  setPersonalQuestion: (text: string) => void;
  setPersonalAnswer: (text: string) => void;
  setGeneratedText: (partKey: string, text: string) => void;
  addFailedPart: (partKey: string) => void;
  setProgress: (progress: Partial<Progress>) => void;
  setStatus: (status: Status) => void;
  setError: (message: string | null) => void;
  setPdfBlobUrl: (url: string | null) => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
  reset: () => void;
}

const initialState: GeneratorState = {
  selectedTier: null,
  sajuData: null,
  coverImage: null,
  selectedTheme: 'classic',
  additionalRequest: '',
  showBrand: true,
  personalQuestion: '',
  personalAnswer: '',
  generatedTexts: {},
  progress: { current: 0, total: 0, label: '', failedParts: [] },
  status: 'idle',
  errorMessage: null,
  pdfBlobUrl: null,
  toastMessage: null,
};

export const useGeneratorStore = create<GeneratorState & GeneratorActions>()(
  (set, get) => ({
    ...initialState,

    setTier: (tier) =>
      set((state) => {
        if (tier === 'love') {
          return { selectedTier: tier, selectedTheme: 'love' as ThemeCode };
        }
        const theme = state.selectedTheme === 'love' ? 'classic' as ThemeCode : state.selectedTheme;
        return { selectedTier: tier, selectedTheme: theme };
      }),

    setSajuData: (data) =>
      set({ sajuData: data }),

    setCoverImage: (base64) =>
      set({ coverImage: base64 }),

    setTheme: (theme) =>
      set((state) => ({
        selectedTheme: state.selectedTier === 'love' ? 'love' : theme,
      })),

    setAdditionalRequest: (text) =>
      set({ additionalRequest: text.slice(0, MAX_ADDITIONAL_REQUEST) }),

    setShowBrand: (show) =>
      set({ showBrand: show }),

    setPersonalQuestion: (text) =>
      set({ personalQuestion: text.slice(0, 500) }),

    setPersonalAnswer: (text) =>
      set({ personalAnswer: text }),

    setGeneratedText: (partKey, text) =>
      set((state) => ({
        generatedTexts: { ...state.generatedTexts, [partKey]: text },
      })),

    addFailedPart: (partKey) =>
      set((state) => ({
        progress: {
          ...state.progress,
          failedParts: [...state.progress.failedParts, partKey],
        },
      })),

    setProgress: (progress) =>
      set((state) => ({
        progress: { ...state.progress, ...progress },
      })),

    setStatus: (status) =>
      set({ status, errorMessage: status === 'error' ? get().errorMessage : null }),

    setError: (message) =>
      set({ status: message ? 'error' : 'idle', errorMessage: message }),

    setPdfBlobUrl: (url) => {
      const prev = get().pdfBlobUrl;
      if (prev) URL.revokeObjectURL(prev);
      set({ pdfBlobUrl: url });
    },

    showToast: (message) => set({ toastMessage: message }),
    dismissToast: () => set({ toastMessage: null }),

    reset: () => {
      const prev = get().pdfBlobUrl;
      if (prev) URL.revokeObjectURL(prev);
      set({ ...initialState });
    },
  }),
);
