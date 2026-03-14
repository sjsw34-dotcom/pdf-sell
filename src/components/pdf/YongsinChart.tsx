import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { YongsinData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

// ─── 오행 매핑 ───

const ELEMENT_INFO: Record<string, { en: string; classical: string; hanja: string; color: string }> = {
  '木': { en: 'Growth & Flexibility', classical: 'Wood', hanja: '木', color: '#2D8B46' },
  '火': { en: 'Passion & Energy', classical: 'Fire', hanja: '火', color: '#D63031' },
  '土': { en: 'Stability & Trust', classical: 'Earth', hanja: '土', color: '#C49B1A' },
  '金': { en: 'Precision & Strength', classical: 'Metal', hanja: '金', color: '#7F8C8D' },
  '水': { en: 'Wisdom & Adaptability', classical: 'Water', hanja: '水', color: '#2E86C1' },
};

const YONGSIN_LABELS = [
  { key: 'yongsin' as const, en: 'Favorable Element', ko: '용신', hanja: '用神' },
  { key: 'huisin' as const, en: 'Joyful Element', ko: '희신', hanja: '喜神' },
  { key: 'gisin' as const, en: 'Unfavorable Element', ko: '기신', hanja: '忌神' },
  { key: 'gusin' as const, en: 'Antagonistic Element', ko: '구신', hanja: '仇神' },
  { key: 'hansin' as const, en: 'Neutral Element', ko: '한신', hanja: '閑神' },
] as const;

interface YongsinChartProps {
  theme: ThemeCode;
  yongsin: YongsinData;
}

export function YongsinChart({ theme, yongsin }: YongsinChartProps) {
  const colors = THEMES[theme].colors;

  return (
    <View style={s.container}>
      {/* 타이틀 */}
      <Text style={[s.title, { color: colors.primary }]}>
        Favorable Element Analysis (용신분석 · 用神分析)
      </Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        Balance and Harmony of the Five Elements (오행 · 五行)
      </Text>

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {/* 용신 리스트 */}
      {YONGSIN_LABELS.map((label) => {
        const element = yongsin[label.key] || '';
        const info = ELEMENT_INFO[element];
        const elText = info ? `${info.classical} (${info.hanja})` : element || '—';
        const elColor = info ? info.color : '#999';

        return (
          <View key={label.key} style={s.row}>
            <View style={[s.bullet, { backgroundColor: elColor }]} />
            <View style={s.rowContent}>
              <Text style={[s.rowLabel, { color: colors.text }]}>
                {label.en} ({label.ko} · {label.hanja}):
              </Text>
              <Text style={[s.rowValue, { color: elColor }]}> {elText}</Text>
            </View>
          </View>
        );
      })}

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {/* 해설 */}
      <Text style={[s.note, { color: colors.textSecondary }]}>
        The Favorable Element (용신) is the energy that brings balance to your chart. The Joyful Element (희신) supports it. When these elements are strong in your environment, career, or relationships, positive outcomes are more likely.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontFamily: FONT_TITLE,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    marginTop: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  rowContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  rowLabel: {
    fontFamily: FONT_CJK,
    fontSize: 10,
  },
  rowValue: {
    fontFamily: FONT_TITLE,
    fontSize: 10,
    fontWeight: 'bold',
  },
  note: {
    fontFamily: FONT_BODY,
    fontSize: 8.5,
    lineHeight: 1.6,
    paddingLeft: 4,
  },
});
