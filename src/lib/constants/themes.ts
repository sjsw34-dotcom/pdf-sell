import type { ThemeCode, ThemeColors } from '@/lib/types/theme';

export interface ThemeDefinition {
  readonly code: ThemeCode;
  readonly label: string;
  readonly colors: ThemeColors;
  readonly coverStyle: 'dark' | 'light' | 'gradient';
}

export const THEMES = {
  classic: {
    code: 'classic',
    label: 'Classic',
    colors: {
      primary: '#1E3A5F',       // 남색 (네이비)
      secondary: '#C9A96E',     // 골드
      accent: '#8B0000',        // 다크 레드
      background: '#FFFFF5',    // 아이보리
      surface: '#F5F0E8',       // 베이지
      text: '#1A1A1A',
      textSecondary: '#5A5A5A',
      border: '#D4C5A9',
      positive: '#2D7D46',
      neutral: '#4A6FA5',
      caution: '#C4652A',
    },
    coverStyle: 'dark',
  },
  modern: {
    code: 'modern',
    label: 'Modern',
    colors: {
      primary: '#6C3CE0',       // 바이올렛
      secondary: '#00C9A7',     // 민트
      accent: '#FF6B6B',        // 코랄
      background: '#FFFFFF',
      surface: '#F4F4F8',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      positive: '#10B981',
      neutral: '#6366F1',
      caution: '#F59E0B',
    },
    coverStyle: 'dark',
  },
  minimal: {
    code: 'minimal',
    label: 'Minimal',
    colors: {
      primary: '#111111',       // 블랙
      secondary: '#555555',     // 그레이
      accent: '#000000',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#111111',
      textSecondary: '#777777',
      border: '#E0E0E0',
      positive: '#2E7D32',
      neutral: '#455A64',
      caution: '#E65100',
    },
    coverStyle: 'light',
  },
  elegant: {
    code: 'elegant',
    label: 'Elegant',
    colors: {
      primary: '#2C1810',       // 다크 브라운
      secondary: '#B8860B',     // 다크 골든로드
      accent: '#722F37',        // 와인
      background: '#FFF8F0',    // 크림
      surface: '#F5EDE3',
      text: '#2C1810',
      textSecondary: '#6B5B4E',
      border: '#D4C4B0',
      positive: '#3A7D44',
      neutral: '#5B6A9A',
      caution: '#BF5B3D',
    },
    coverStyle: 'gradient',
  },
  love: {
    code: 'love',
    label: 'Love',
    colors: {
      primary: '#E8548C',       // 로즈 핑크
      secondary: '#F2A6C6',     // 파스텔 핑크
      accent: '#C44569',        // 딥 로즈
      background: '#FFF5F9',    // 라이트 핑크 배경
      surface: '#FFE8F0',       // 파스텔 핑크 서피스
      text: '#3D1F2E',          // 다크 로즈 브라운
      textSecondary: '#8C6278', // 뮤트 로즈
      border: '#F5C6D8',        // 라이트 로즈 보더
      positive: '#E8548C',
      neutral: '#B47EB5',       // 라벤더
      caution: '#E07C54',       // 소프트 코랄
    },
    coverStyle: 'gradient',
  },
  amormuse: {
    code: 'amormuse',
    label: 'AmorMuse',
    colors: {
      primary: '#B89FFA',         // 라벤더 퍼플
      secondary: '#7C5CBF',       // 딥 퍼플
      accent: '#F59E0B',          // 골드 액센트
      background: '#0F0D1A',      // 다크 배경
      surface: '#1A1630',         // 다크 서피스
      text: '#E8E0F0',            // 라이트 퍼플 화이트
      textSecondary: '#9A8BC2',   // 뮤트 퍼플
      border: '#2A2545',          // 다크 퍼플 보더
      positive: '#A78BFA',        // 소프트 퍼플
      neutral: '#60A5FA',         // 블루
      caution: '#F59E0B',         // 골드
    },
    coverStyle: 'dark',
  },
} as const satisfies Record<ThemeCode, ThemeDefinition>;

/** Love 티어는 love 테마, Monthly 티어는 amormuse 테마 강제 */
export function getThemeForTier(
  selectedTheme: ThemeCode,
  tier: string,
): ThemeCode {
  if (tier === 'love') return 'love';
  if (tier === 'monthly') return 'amormuse';
  return selectedTheme;
}
