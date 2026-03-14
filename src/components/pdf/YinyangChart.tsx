import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { YinyangData, FiveElement, TenGodGroup } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

// ─── 오행 컬러 ───

const ELEMENT_COLORS: Record<FiveElement, string> = {
  '木': '#2D8B46',
  '火': '#D63031',
  '土': '#C49B1A',
  '金': '#7F8C8D',
  '水': '#2E86C1',
};

const ELEMENT_EN: Record<FiveElement, string> = {
  '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
};

// ─── 십신 그룹 영어 ───

const GOD_GROUP_EN: Record<TenGodGroup, string> = {
  '비겁': 'Self & Sibling',
  '식상': 'Expression',
  '재성': 'Wealth',
  '관성': 'Authority',
  '인성': 'Knowledge',
};

const GOD_GROUP_COLORS: Record<TenGodGroup, string> = {
  '비겁': '#3498DB',
  '식상': '#E67E22',
  '재성': '#F1C40F',
  '관성': '#E74C3C',
  '인성': '#2ECC71',
};

interface YinyangChartProps {
  theme: ThemeCode;
  yinyang: YinyangData;
}

export function YinyangChart({ theme, yinyang }: YinyangChartProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  const totalYinYang = yinyang.yin + yinyang.yang || 1;
  const yinPct = Math.round((yinyang.yin / totalYinYang) * 100);
  const yangPct = 100 - yinPct;

  const maxElementCount = Math.max(...yinyang.elements.map((e) => e.count), 1);
  const maxGodCount = Math.max(...yinyang.tenGodGroups.map((g) => g.count), 1);

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>ENERGY DISTRIBUTION</Text>
      <Text style={s.chartSubtitle}>陰陽五行 · Yin-Yang & Five Elements</Text>

      {/* ─── 음양 비율 바 ─── */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>YIN & YANG BALANCE</Text>
        <View style={s.yinyangBar}>
          {yinPct > 0 ? (
            <View style={[s.yinSegment, { width: `${yinPct}%` }]}>
              <Text style={s.yinyangText}>陰 Yin {yinyang.yin}</Text>
            </View>
          ) : null}
          {yangPct > 0 ? (
            <View style={[s.yangSegment, { width: `${yangPct}%` }]}>
              <Text style={s.yinyangText}>陽 Yang {yinyang.yang}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ─── 오행 분포 ─── */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>FIVE ELEMENTS</Text>
        {yinyang.elements.map((el) => {
          const pct = Math.round((el.count / maxElementCount) * 100);
          const barWidth = Math.max(pct, 8);
          return (
            <View key={el.element} style={s.barRow}>
              <View style={s.barLabelCol}>
                <Text style={[s.barHanja, { color: ELEMENT_COLORS[el.element] }]}>
                  {el.element}
                </Text>
                <Text style={s.barLabelEn}>{ELEMENT_EN[el.element]}</Text>
              </View>
              <View style={s.barTrack}>
                <View
                  style={[
                    s.barFill,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: ELEMENT_COLORS[el.element],
                    },
                  ]}
                >
                  <Text style={s.barValue}>{el.count}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── 십신 분포 ─── */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>TEN GODS DISTRIBUTION</Text>
        {yinyang.tenGodGroups.map((grp) => {
          const pct = Math.round((grp.count / maxGodCount) * 100);
          const barWidth = Math.max(pct, 8);
          return (
            <View key={grp.group} style={s.barRow}>
              <View style={s.barLabelCol}>
                <Text style={[s.barGroupLabel, { color: GOD_GROUP_COLORS[grp.group] }]}>
                  {GOD_GROUP_EN[grp.group]}
                </Text>
                <Text style={s.barLabelKo}>{grp.group}</Text>
              </View>
              <View style={s.barTrack}>
                <View
                  style={[
                    s.barFill,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: GOD_GROUP_COLORS[grp.group],
                    },
                  ]}
                >
                  <Text style={s.barValue}>{grp.count}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function styles(colors: { primary: string; text: string; textSecondary: string; border: string; surface: string }) {
  return StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    chartTitle: {
      fontFamily: FONT_TITLE,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 2,
    },
    chartSubtitle: {
      fontFamily: FONT_CJK,
      fontSize: 9,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 14,
    },
    section: {
      marginBottom: 16,
    },
    sectionLabel: {
      fontFamily: FONT_BODY,
      fontSize: 8,
      fontWeight: 'bold',
      color: colors.primary,
      letterSpacing: 2,
      marginBottom: 8,
    },

    // 음양 바
    yinyangBar: {
      flexDirection: 'row',
      height: 28,
      borderRadius: 4,
      overflow: 'hidden',
    },
    yinSegment: {
      backgroundColor: '#5B6A9A',
      justifyContent: 'center',
      alignItems: 'center',
    },
    yangSegment: {
      backgroundColor: '#E07C54',
      justifyContent: 'center',
      alignItems: 'center',
    },
    yinyangText: {
      fontFamily: FONT_CJK,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },

    // 막대 그래프 공통
    barRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    barLabelCol: {
      width: 90,
      paddingRight: 8,
    },
    barHanja: {
      fontFamily: FONT_CJK,
      fontSize: 12,
      fontWeight: 'bold',
    },
    barLabelEn: {
      fontFamily: FONT_BODY,
      fontSize: 7,
      color: colors.textSecondary,
    },
    barGroupLabel: {
      fontFamily: FONT_BODY,
      fontSize: 8,
      fontWeight: 'bold',
    },
    barLabelKo: {
      fontFamily: FONT_CJK,
      fontSize: 7,
      color: colors.textSecondary,
    },
    barTrack: {
      flex: 1,
      height: 18,
      backgroundColor: colors.surface,
      borderRadius: 3,
      overflow: 'hidden',
    },
    barFill: {
      height: 18,
      borderRadius: 3,
      justifyContent: 'center',
      paddingLeft: 6,
    },
    barValue: {
      fontFamily: FONT_BODY,
      fontSize: 8,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });
}
