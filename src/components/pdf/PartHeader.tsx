import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE } from './styles/pdfStyles';

interface PartHeaderProps {
  theme: ThemeCode;
  partNumber: number;
  title: string;
  subtitle?: string;
}

export function PartHeader({ theme, partNumber, title, subtitle }: PartHeaderProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  return (
    <Page size="A4" style={s.page}>
      <View style={s.container}>
        <View style={s.line} />
        <Text style={s.partLabel}>PART {partNumber}</Text>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        <View style={s.line} />
      </View>
    </Page>
  );
}

function styles(colors: { primary: string; secondary: string }) {
  return StyleSheet.create({
    page: {
      padding: 0,
    },
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    },
    line: {
      width: 50,
      height: 2,
      backgroundColor: colors.secondary,
      marginTop: 20,
      marginBottom: 20,
    },
    partLabel: {
      fontFamily: FONT_BODY,
      fontSize: 13,
      color: colors.secondary,
      letterSpacing: 4,
      marginBottom: 16,
    },
    title: {
      fontFamily: FONT_TITLE,
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: FONT_BODY,
      fontSize: 14,
      color: colors.secondary,
      textAlign: 'center',
    },
  });
}
