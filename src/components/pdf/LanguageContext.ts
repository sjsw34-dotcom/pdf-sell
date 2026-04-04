'use client';

import { createContext, useContext } from 'react';
import type { Language } from '@/lib/types/language';

export const LanguageContext = createContext<Language>('en');

export function useLang(): Language {
  return useContext(LanguageContext);
}
