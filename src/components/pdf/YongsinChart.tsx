import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { YongsinData, FiveElement } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

// ─── 오행 컬러 (fallback 포함) ───

const ELEMENT_COLORS: Record<string, string> = {
  '木': '#2D8B46', '火': '#D63031', '土': '#C49B1A', '金': '#7F8C8D', '水': '#2E86C1',
};

const ELEMENT_BG: Record<string, string> = {
  '木': '#E8F5E9', '火': '#FFEBEE', '土': '#FFF8E1', '金': '#F5F5F5', '水': '#E3F2FD',
};

const ELEMENT_EN: Record<string, { natural: string; classical: string }> = {
  '木': { natural: 'Growth & Flexibility', classical: 'Wood' },
  '火': { natural: 'Passion & Energy', classical: 'Fire' },
  '土': { natural: 'Stability & Trust', classical: 'Earth' },
  '金': { natural: 'Precision & Strength', classical: 'Metal' },
  '水': { natural: 'Wisdom & Adaptability', classical: 'Water' },
};

const FALLBACK_COLOR = '#999999';
const FALLBACK_BG = '#F0F0F0';
const FALLBACK_EN = { natural: 'Unknown', classical: '?' };

function elColor(el: string) { return ELEMENT_COLORS[el] || FALLBACK_COLOR; }
function elBg(el: string) { return ELEMENT_BG[el] || FALLBACK_BG; }
function elEn(el: string) { return ELEMENT_EN[el] || FALLBACK_EN; }

const YONGSIN_LABELS = [
  { key: 'yongsin' as const, korean: '용신', natural: 'Your Key Balancer', hanja: '用神' },
  { key: 'huisin' as const, korean: '희신', natural: 'Your Lucky Support', hanja: '喜神' },
  { key: 'gisin' as const, korean: '기신', natural: 'Your Challenge', hanja: '忌神' },
  { key: 'gusin' as const, korean: '구신', natural: 'Hidden Obstacle', hanja: '仇神' },
  { key: 'hansin' as const, korean: '한신', natural: 'Neutral Energy', hanja: '閑神' },
] as const;

interface YongsinChartProps {
  theme: ThemeCode;
  yongsin: YongsinData;
}

export function YongsinChart({ theme, yongsin }: YongsinChartProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>ELEMENTAL BALANCE</Text>
      <Text style={s.chartSubtitle}>用神 體系 · Yongsin System</Text>

      {YONGSIN_LABELS.map((label) => {
        const element = yongsin[label.key] || '?';
        const ec = elColor(element);
        const eb = elBg(element);
        const ee = elEn(element);

        return (
          <View key={label.key} style={s.row}>
            <View style={s.labelCol}>
              <Text style={s.labelNatural}>{label.natural}</Text>
              <Text style={s.labelOriginal}>{label.hanja} {label.korean}</Text>
            </View>

            <View style={[s.elementCol, { backgroundColor: eb }]}>
              <View style={s.elementInner}>
                <View style={[s.elementDot, { backgroundColor: ec }]}>
                  <Text style={s.elementHanja}>{element}</Text>
                </View>
                <View style={s.elementText}>
                  <Text style={[s.elementNatural, { color: ec }]}>{ee.natural}</Text>
                  <Text style={s.elementClassical}>{ee.classical}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function styles(colors: { primary: string; textSecondary: string; border: string; surface: string }) {
  return StyleSheet.create({
    container: { marginBottom: 20 },
    chartTitle: { fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 2 },
    chartSubtitle: { fontFamily: FONT_CJK, fontSize: 9, color: colors.textSecondary, textAlign: 'center', marginBottom: 14 },
    row: { flexDirection: 'row', marginBottom: 6 },
    labelCol: { width: 130, justifyContent: 'center', paddingRight: 10 },
    labelNatural: { fontFamily: FONT_BODY, fontSize: 9, fontWeight: 'bold', color: colors.primary },
    labelOriginal: { fontFamily: FONT_CJK, fontSize: 7, color: colors.textSecondary, marginTop: 1 },
    elementCol: { flex: 1, borderRadius: 4, padding: 8 },
    elementInner: { flexDirection: 'row', alignItems: 'center' },
    elementDot: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    elementHanja: { fontFamily: FONT_CJK, fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
    elementText: { flex: 1 },
    elementNatural: { fontFamily: FONT_BODY, fontSize: 9, fontWeight: 'bold' },
    elementClassical: { fontFamily: FONT_BODY, fontSize: 7, color: colors.textSecondary, marginTop: 1 },
  });
}
