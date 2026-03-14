import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { WolunData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { TEN_GOD_EN, TWELVE_STAGE_EN } from '@/lib/constants/terms';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface WolunCardProps {
  theme: ThemeCode;
  wolun: WolunData;
}

export function WolunCard({ theme, wolun }: WolunCardProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  // 월 순으로 정렬 (1월 → 12월)
  const sorted = [...wolun.entries].sort((a, b) => a.month - b.month);

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>MONTHLY FORTUNE — {wolun.year}</Text>
      <Text style={s.chartSubtitle}>月運 · Wolun (Monthly Luck)</Text>

      {/* 2열 그리드 (6 × 2) */}
      <View style={s.grid}>
        {sorted.map((entry, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <View key={entry.month} style={[s.cell, isEven ? s.cellDefault : s.cellAlt]}>
              <View style={s.monthHeader}>
                <Text style={s.monthName}>{MONTH_NAMES[entry.month] ?? ''}</Text>
                <Text style={s.monthNum}>{entry.month}월</Text>
              </View>

              <View style={s.stemRow}>
                <Text style={s.hanja}>{entry.heavenlyStem}{entry.earthlyBranch}</Text>
              </View>

              <Text style={s.godText}>
                {TEN_GOD_EN[entry.stemTenGod] ?? entry.stemTenGod}
              </Text>
              <Text style={s.godSub}>{entry.stemTenGod} / {entry.branchTenGod}</Text>

              <View style={s.stageRow}>
                <Text style={s.stageText}>
                  {TWELVE_STAGE_EN[entry.twelveStage] ?? entry.twelveStage}
                </Text>
                <Text style={s.stageSub}>{entry.twelveStage}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function styles(colors: { primary: string; secondary: string; surface: string; text: string; textSecondary: string; border: string; background: string }) {
  return StyleSheet.create({
    container: { marginBottom: 20 },
    chartTitle: {
      fontFamily: FONT_TITLE, fontSize: 16, fontWeight: 'bold',
      color: colors.primary, textAlign: 'center', marginBottom: 2,
    },
    chartSubtitle: {
      fontFamily: FONT_CJK, fontSize: 9,
      color: colors.textSecondary, textAlign: 'center', marginBottom: 14,
    },

    grid: { flexDirection: 'row', flexWrap: 'wrap' },

    cell: {
      width: '48%', borderRadius: 4, padding: 8, marginBottom: 6, marginRight: '2%',
      borderWidth: 1, borderColor: colors.border, borderStyle: 'solid',
      alignItems: 'center',
    },
    cellDefault: { backgroundColor: colors.background },
    cellAlt: { backgroundColor: colors.surface },

    monthHeader: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
    monthName: { fontFamily: FONT_BODY, fontSize: 11, fontWeight: 'bold', color: colors.primary, marginRight: 4 },
    monthNum: { fontFamily: FONT_CJK, fontSize: 7, color: colors.textSecondary },

    stemRow: { marginBottom: 4 },
    hanja: { fontFamily: FONT_CJK, fontSize: 16, fontWeight: 'bold', color: colors.text },

    godText: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
    godSub: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary, marginTop: 1, marginBottom: 4 },

    stageRow: { flexDirection: 'row', alignItems: 'center' },
    stageText: { fontFamily: FONT_BODY, fontSize: 7, color: colors.secondary, marginRight: 4 },
    stageSub: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary },
  });
}
