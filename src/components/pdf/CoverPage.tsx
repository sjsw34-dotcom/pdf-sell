import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';
import type { TierCode } from '@/lib/types/tier';

const TIER_LABELS: Record<TierCode, string> = {
  basic: 'Basic',
  love: 'Love Edition',
  full: 'Full Analysis',
  premium: 'Premium',
};

interface CoverPageProps {
  theme: ThemeCode;
  tier: TierCode;
  name: string;
  birthDate: string;
  coverImageBase64: string | null;
}

export function CoverPage({ theme, tier, name, birthDate, coverImageBase64 }: CoverPageProps) {
  const colors = THEMES[theme].colors;
  const hasImage = coverImageBase64 && coverImageBase64.startsWith('data:');

  return (
    <Page size="A4" style={s.page}>
      {/* 배경 이미지 (있는 경우) */}
      {hasImage && (
        <Image src={coverImageBase64} style={s.bgImage} />
      )}

      {/* 반투명 오버레이 (이미지 위에서 텍스트 가독성 확보) */}
      {hasImage && <View style={s.overlay} />}

      {/* 커버 내용 */}
      <View style={[s.content, hasImage ? {} : { backgroundColor: colors.primary }]}>

        {/* 상단: 브랜드 */}
        <View style={s.topSection}>
          <Text style={s.brandSmall}>SajuMuse</Text>
        </View>

        {/* 중앙: 메인 타이틀 */}
        <View style={s.centerSection}>
          <Text style={s.brandLarge}>SajuMuse</Text>

          <View style={s.line} />

          <Text style={s.subtitleKo}>사주팔자 · Four Pillars of Destiny</Text>

          <View style={s.spacer24} />

          <Text style={s.mainTitle}>DESTINY ANALYSIS</Text>
          <Text style={s.mainTitle}>REPORT</Text>

          <View style={s.spacer12} />

          <Text style={s.subtitleKo2}>운명 분석서</Text>

          <View style={s.line} />
        </View>

        {/* 하단: Prepared for + 이름 */}
        <View style={s.bottomSection}>
          <Text style={s.preparedFor}>Prepared for</Text>
          <Text style={s.clientName}>{name || 'Valued Guest'}</Text>

          <View style={s.spacer16} />

          <Text style={[s.tierLabel, { color: hasImage ? '#CCCCCC' : colors.secondary }]}>
            {TIER_LABELS[tier]} Report
          </Text>

          <View style={s.spacer24} />

          <View style={s.footerLine} />
          <Text style={s.footerText}>SajuMuse · SajuMuse</Text>
        </View>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    padding: 0,
    position: 'relative',
  },

  // 배경 이미지
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  // 전체 콘텐츠 래퍼
  content: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'space-between',
    position: 'relative',
  },

  // 상단
  topSection: {
    alignItems: 'flex-start',
  },
  brandSmall: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2,
    opacity: 0.7,
  },

  // 중앙
  centerSection: {
    alignItems: 'center',
  },
  brandLarge: {
    fontFamily: FONT_TITLE,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 16,
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginTop: 12,
    marginBottom: 12,
  },
  subtitleKo: {
    fontFamily: FONT_CJK,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 5,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  subtitleKo2: {
    fontFamily: FONT_CJK,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
  },

  // 하단
  bottomSection: {
    alignItems: 'center',
  },
  preparedFor: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  clientName: {
    fontFamily: FONT_TITLE,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  birthInfo: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  tierLabel: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footerLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 10,
  },
  footerText: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
  },

  // 유틸
  spacer12: { height: 12 },
  spacer16: { height: 16 },
  spacer24: { height: 24 },
});
