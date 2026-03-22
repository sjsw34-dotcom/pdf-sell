import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import {
  TEN_GOD_COLORS,
  BRAND,
  FONT_BODY,
  FONT_CJK,
  ANTI_LIGATURE,
  DIAGRAM_CONTAINER,
  DIAGRAM_TITLE,
} from './diagramStyles';

/**
 * Ten Gods Distribution Heatmap
 * 6 charts × 5 god pairs matrix with intensity-based cell coloring
 */

type GodPair = 'Companion' | 'Output' | 'Wealth' | 'Authority' | 'Resource';

const GOD_PAIRS: GodPair[] = ['Companion', 'Output', 'Wealth', 'Authority', 'Resource'];

interface ChartRow {
  code: string;
  dm: string;
  counts: Record<GodPair, number>;
}

const CHART_DATA: ChartRow[] = [
  { code: 'A', dm: '\u4E59', counts: { Companion: 1, Output: 1, Wealth: 0, Authority: 3, Resource: 2 } },
  { code: 'B', dm: '\u4E59', counts: { Companion: 0, Output: 3, Wealth: 2, Authority: 1, Resource: 1 } },
  { code: 'C', dm: '\u7678', counts: { Companion: 0, Output: 0, Wealth: 4, Authority: 3, Resource: 0 } },
  { code: 'D', dm: '\u58EC', counts: { Companion: 1, Output: 3, Wealth: 0, Authority: 0, Resource: 2 } },
  { code: 'E', dm: '\u620A', counts: { Companion: 1, Output: 4, Wealth: 0, Authority: 0, Resource: 0 } },
  { code: 'F', dm: '\u5E9A', counts: { Companion: 1, Output: 1, Wealth: 0, Authority: 3, Resource: 0 } },
];

/* Intensity levels: 0=white, 1=light, 2=medium, 3=strong, 4+=full */
function cellBg(god: GodPair, count: number): string {
  if (count === 0) return '#FFFFFF';
  const base = TEN_GOD_COLORS[god].bg;
  if (count >= 4) return base;
  // opacity mapping: 1→0.18, 2→0.40, 3→0.70
  const opacityMap: Record<number, number> = { 1: 0.18, 2: 0.40, 3: 0.70 };
  const opacity = opacityMap[count] ?? 1;
  return hexWithOpacity(base, opacity);
}

function hexWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const blendedR = Math.round(r * opacity + 255 * (1 - opacity));
  const blendedG = Math.round(g * opacity + 255 * (1 - opacity));
  const blendedB = Math.round(b * opacity + 255 * (1 - opacity));
  return `#${blendedR.toString(16).padStart(2, '0')}${blendedG.toString(16).padStart(2, '0')}${blendedB.toString(16).padStart(2, '0')}`;
}

function cellTextColor(god: GodPair, count: number): string {
  if (count === 0) return BRAND.textLight;
  if (count >= 3) return TEN_GOD_COLORS[god].text;
  return BRAND.textDark;
}

const COL_W = 52;
const ROW_H = 22;
const LABEL_W = 40;

const s = StyleSheet.create({
  container: {
    ...DIAGRAM_CONTAINER,
    padding: 12,
  },
  title: {
    ...DIAGRAM_TITLE,
    marginBottom: 8,
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLabel: {
    width: LABEL_W,
    height: ROW_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    width: COL_W,
    height: ROW_H,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  headerText: {
    fontFamily: FONT_BODY,
    fontSize: 6.5,
    fontWeight: 'bold',
    letterSpacing: ANTI_LIGATURE,
  },
  rowLabel: {
    width: LABEL_W,
    height: ROW_H,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BRAND.purpleLight,
    borderWidth: 0.5,
    borderColor: BRAND.border,
  },
  rowLabelCode: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    fontWeight: 'bold',
    color: BRAND.purple,
    letterSpacing: ANTI_LIGATURE,
  },
  rowLabelDm: {
    fontFamily: FONT_CJK,
    fontSize: 7,
    color: BRAND.textMedium,
    marginLeft: 2,
  },
  cell: {
    width: COL_W,
    height: ROW_H,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: BRAND.border,
  },
  cellText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: ANTI_LIGATURE,
  },
});

export function EbookTenGodsDistribution() {
  return (
    <View style={s.container} wrap={false}>
      <Text style={s.title}>Ten Gods Distribution Across Sample Charts</Text>

      <View style={s.grid}>
        {/* Header row */}
        <View style={s.row}>
          <View style={s.headerLabel} />
          {GOD_PAIRS.map((god) => (
            <View
              key={god}
              style={[s.headerCell, { backgroundColor: TEN_GOD_COLORS[god].bg }]}
            >
              <Text style={[s.headerText, { color: TEN_GOD_COLORS[god].text }]}>
                {god}
              </Text>
            </View>
          ))}
        </View>

        {/* Data rows */}
        {CHART_DATA.map((chart) => (
          <View key={chart.code} style={s.row}>
            <View style={s.rowLabel}>
              <Text style={s.rowLabelCode}>{chart.code}</Text>
              <Text style={s.rowLabelDm}>{chart.dm}</Text>
            </View>
            {GOD_PAIRS.map((god) => {
              const count = chart.counts[god];
              return (
                <View
                  key={god}
                  style={[s.cell, { backgroundColor: cellBg(god, count) }]}
                >
                  <Text style={[s.cellText, { color: cellTextColor(god, count) }]}>
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export default EbookTenGodsDistribution;
