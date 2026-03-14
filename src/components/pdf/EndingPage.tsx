import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE } from './styles/pdfStyles';

interface EndingPageProps {
  theme: ThemeCode;
  name: string;
}

export function EndingPage({ theme, name }: EndingPageProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  return (
    <Page size="A4" style={s.page}>
      <View style={s.container}>
        <View style={s.line} />
        <Text style={s.message}>
          Thank you for exploring your destiny, {name}.
        </Text>
        <Text style={s.sub}>
          May the stars guide your path forward.
        </Text>
        <View style={s.line} />
        <Text style={s.brand}>SajuMuse</Text>
        <Text style={s.url}>sajumuse.com</Text>
        <Text style={s.disclaimer}>
          This report is for entertainment and self-reflection purposes only.
        </Text>
      </View>
    </Page>
  );
}

function styles(colors: { primary: string; secondary: string; background: string; textSecondary: string }) {
  return StyleSheet.create({
    page: {
      padding: 0,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    },
    line: {
      width: 50,
      height: 2,
      backgroundColor: colors.secondary,
      marginTop: 24,
      marginBottom: 24,
    },
    message: {
      fontFamily: FONT_TITLE,
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: 1.5,
    },
    sub: {
      fontFamily: FONT_BODY,
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    brand: {
      fontFamily: FONT_TITLE,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      letterSpacing: 3,
      marginBottom: 4,
    },
    url: {
      fontFamily: FONT_BODY,
      fontSize: 10,
      color: colors.secondary,
      marginBottom: 24,
    },
    disclaimer: {
      fontFamily: FONT_BODY,
      fontSize: 8,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}
