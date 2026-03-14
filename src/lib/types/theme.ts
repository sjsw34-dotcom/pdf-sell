export const THEME_CODES = ['classic', 'modern', 'minimal', 'elegant', 'love'] as const;
export type ThemeCode = (typeof THEME_CODES)[number];

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  positive: string;
  neutral: string;
  caution: string;
}

export interface ThemeTypography {
  titleFont: string;
  bodyFont: string;
  titleSize: number;
  subtitleSize: number;
  bodySize: number;
  captionSize: number;
}

export interface ThemeConfig {
  code: ThemeCode;
  label: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  coverStyle: 'dark' | 'light' | 'gradient';
}
