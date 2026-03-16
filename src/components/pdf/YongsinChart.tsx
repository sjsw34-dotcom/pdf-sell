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
      {/* 타이틀 — 영어 우선 */}
      <Text style={[s.mainTitle, { color: colors.text }]}>Favorable Element Analysis</Text>
      <Text style={[s.mainTitleSub, { color: colors.textSecondary }]}>용신분석 · 用神分析</Text>
      <Text style={[s.subText, { color: colors.textSecondary }]}>Balance and Harmony of the Five Elements</Text>

      <View style={s.spacer16} />

      {/* 용신 배지 행 — 가로 배열 */}
      <View style={s.badgeRow}>
        {YONGSIN_LABELS.map((label) => {
          const element = yongsin[label.key] || '';
          const info = ELEMENT_INFO[element];
          const elColor = info ? info.color : '#999';
          const hanjaChar = info ? info.hanja : '—';

          return (
            <View key={label.key} style={s.badgeItem}>
              <Text style={[s.badgeLabel, { color: colors.textSecondary }]}>{label.en}</Text>
              <Text style={[s.badgeLabelSub, { color: colors.textSecondary }]}>({label.ko} · {label.hanja})</Text>
              <Text style={[s.badgeHanja, { color: elColor }]}>{hanjaChar}</Text>
            </View>
          );
        })}
      </View>

      <View style={s.spacer20} />

      {/* 상세 리스트 */}
      {YONGSIN_LABELS.map((label) => {
        const element = yongsin[label.key] || '';
        const info = ELEMENT_INFO[element];
        const elText = info ? `${info.classical} (${info.hanja})` : element || '—';
        const elColor = info ? info.color : '#999';
        const desc = info ? info.en : '';

        return (
          <View key={label.key} style={[s.row, { borderBottomColor: colors.border }]}>
            <View style={[s.bullet, { backgroundColor: elColor }]} />
            <View style={s.rowContent}>
              <Text style={[s.rowLabel, { color: colors.text }]}>
                {label.en} ({label.ko} · {label.hanja}):
              </Text>
              <Text style={[s.rowValue, { color: elColor }]}>{elText}</Text>
              {desc ? <Text style={[s.rowDesc, { color: colors.textSecondary }]}>{desc}</Text> : null}
            </View>
          </View>
        );
      })}

      <View style={s.spacer16} />

      {/* 용신 체계 이상 경고 — 모든 모순 조합 감지 */}
      {yongsin.yongsin && yongsin.gisin && yongsin.yongsin === yongsin.gisin && (
        <View style={[s.anomalyBox, { borderLeftColor: '#E67E22', backgroundColor: colors.surface }]}>
          <Text style={[s.anomalyTitle, { color: '#E67E22' }]}>Special Note</Text>
          <Text style={[s.anomalyText, { color: colors.text }]}>
            Your Favorable Element (용신 · 用神) and Unfavorable Element (기신 · 忌神) share the same element: {ELEMENT_INFO[yongsin.yongsin]?.classical || yongsin.yongsin} ({yongsin.yongsin}). This rare configuration means this element plays a dual role in your chart — it is both needed for balance and potentially disruptive when in excess. The detailed analysis sections explain how to navigate this unique energetic dynamic.
          </Text>
        </View>
      )}
      {yongsin.huisin && yongsin.gusin && yongsin.huisin === yongsin.gusin && (
        <View style={[s.anomalyBox, { borderLeftColor: '#E67E22', backgroundColor: colors.surface }]}>
          <Text style={[s.anomalyTitle, { color: '#E67E22' }]}>Special Note</Text>
          <Text style={[s.anomalyText, { color: colors.text }]}>
            Your Joyful Element (희신 · 喜神) and Antagonistic Element (구신 · 仇神) share the same element: {ELEMENT_INFO[yongsin.huisin]?.classical || yongsin.huisin} ({yongsin.huisin}). This unusual pairing indicates that this element can be both a subtle ally and a source of friction depending on its strength and timing. The analysis sections provide specific guidance on how to work with this duality.
          </Text>
        </View>
      )}

      {/* 해설 */}
      <View style={[s.noteBox, { backgroundColor: colors.surface }]}>
        <Text style={[s.note, { color: colors.text }]}>
          The Favorable Element (용신 · 用神) is the energy that brings balance to your chart. The Joyful Element (희신 · 喜神) supports it. When these elements are strong in your environment, career, or relationships, positive outcomes are more likely.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mainTitleSub: {
    fontFamily: FONT_CJK,
    fontSize: 12,
    marginBottom: 4,
  },
  subText: {
    fontFamily: FONT_BODY,
    fontSize: 12,
  },

  // 배지 행
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  badgeLabel: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    textAlign: 'center',
  },
  badgeLabelSub: {
    fontFamily: FONT_CJK,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeHanja: {
    fontFamily: FONT_CJK,
    fontSize: 30,
    fontWeight: 'bold',
  },

  // 상세 리스트
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: FONT_BODY,
    fontSize: 13,
    marginBottom: 2,
  },
  rowValue: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rowDesc: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    marginTop: 2,
  },

  anomalyBox: {
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    padding: 14,
    borderRadius: 4,
    marginBottom: 12,
  },
  anomalyTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  anomalyText: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    lineHeight: 1.6,
  },

  noteBox: {
    padding: 14,
    borderRadius: 4,
  },
  note: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 1.7,
  },

  spacer16: { height: 16 },
  spacer20: { height: 20 },
});
