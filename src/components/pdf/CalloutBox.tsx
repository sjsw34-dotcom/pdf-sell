import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, ANTI_LIGATURE, fixLigatures } from './styles/pdfStyles';

interface CalloutBoxProps {
  theme: ThemeCode;
  text: string;
  label?: string;
  variant?: 'default' | 'highlight' | 'question';
}

export function CalloutBox({ theme, text, label, variant = 'default' }: CalloutBoxProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  const variantStyles = {
    default: { bg: colors.surface, border: colors.secondary, labelColor: colors.secondary },
    highlight: { bg: colors.surface, border: colors.accent, labelColor: colors.accent },
    question: { bg: colors.surface, border: colors.primary, labelColor: colors.primary },
  };

  const v = variantStyles[variant];

  return (
    <View
      style={[
        s.container,
        { backgroundColor: v.bg, borderLeftColor: v.border },
      ]}
      wrap={false}
    >
      {label && (
        <Text style={[s.label, { color: v.labelColor }]}>{label}</Text>
      )}
      <Text style={s.text}>{fixLigatures(text || ' ')}</Text>
    </View>
  );
}

function styles(colors: { text: string; textSecondary: string }) {
  return StyleSheet.create({
    container: {
      borderLeftWidth: 4,
      borderLeftStyle: 'solid',
      borderRadius: 4,
      padding: 14,
      marginBottom: 14,
    },
    label: {
      fontFamily: FONT_BODY,
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    text: {
      fontFamily: FONT_BODY,
      fontSize: 14,
      color: colors.text,
      lineHeight: 1.6,
      letterSpacing: ANTI_LIGATURE,
    },
  });
}
