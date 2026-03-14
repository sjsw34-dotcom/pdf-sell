import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE } from './styles/pdfStyles';

interface CoverPageProps {
  theme: ThemeCode;
  name: string;
  birthDate: string;
  coverImageBase64: string | null;
}

export function CoverPage({ theme, name, birthDate, coverImageBase64 }: CoverPageProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  if (coverImageBase64) {
    return (
      <Page size="A4" style={s.page}>
        <Image src={coverImageBase64} style={s.coverImage} />
        <View style={s.overlayBottom}>
          <Text style={s.nameOnImage}>{name}</Text>
          <Text style={s.dateOnImage}>{birthDate}</Text>
          <View style={s.brandBarOnImage}>
            <Text style={s.brandOnImage}>SajuMuse</Text>
          </View>
        </View>
      </Page>
    );
  }

  return (
    <Page size="A4" style={[s.page, { backgroundColor: colors.primary }]}>
      <View style={s.defaultCover}>
        <View style={s.accentLine} />
        <Text style={s.brandLabel}>SAJUMUSE</Text>
        <Text style={s.defaultTitle}>Your Destiny</Text>
        <Text style={s.defaultTitle}>Blueprint</Text>
        <View style={s.divider} />
        <Text style={s.defaultName}>{name}</Text>
        <Text style={s.defaultDate}>{birthDate}</Text>
        <View style={s.accentLine} />
      </View>
    </Page>
  );
}

function styles(colors: { primary: string; secondary: string; background: string; text: string; surface: string; border: string }) {
  return StyleSheet.create({
    page: {
      padding: 0,
      position: 'relative',
    },
    coverImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    overlayBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      paddingTop: 30,
      paddingBottom: 30,
      paddingLeft: 40,
      paddingRight: 40,
      alignItems: 'center',
    },
    nameOnImage: {
      fontFamily: FONT_TITLE,
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 6,
    },
    dateOnImage: {
      fontFamily: FONT_BODY,
      fontSize: 13,
      color: '#DDDDDD',
      marginBottom: 16,
    },
    brandBarOnImage: {
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.3)',
      borderTopStyle: 'solid',
      paddingTop: 12,
      width: '100%',
      alignItems: 'center',
    },
    brandOnImage: {
      fontFamily: FONT_BODY,
      fontSize: 11,
      color: '#BBBBBB',
      letterSpacing: 3,
    },

    // 기본 커버 (이미지 없음)
    defaultCover: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    },
    accentLine: {
      width: 60,
      height: 2,
      backgroundColor: colors.secondary,
      marginBottom: 24,
      marginTop: 24,
    },
    brandLabel: {
      fontFamily: FONT_BODY,
      fontSize: 11,
      color: colors.secondary,
      letterSpacing: 4,
      marginBottom: 32,
    },
    defaultTitle: {
      fontFamily: FONT_TITLE,
      fontSize: 36,
      fontWeight: 'bold',
      color: '#FFFFFF',
      lineHeight: 1.2,
      textAlign: 'center',
    },
    divider: {
      width: 40,
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.3)',
      marginTop: 28,
      marginBottom: 28,
    },
    defaultName: {
      fontFamily: FONT_BODY,
      fontSize: 18,
      color: '#FFFFFF',
      marginBottom: 6,
    },
    defaultDate: {
      fontFamily: FONT_BODY,
      fontSize: 12,
      color: colors.secondary,
    },
  });
}
