import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { ShinsalData, PillarPosition } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { getShinsalSentiment, SHINSAL_EN } from '@/lib/constants/terms';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

const PILLAR_LABELS: Record<PillarPosition, { en: string; ko: string }> = {
  hour: { en: 'Hour', ko: '시주' },
  day: { en: 'Day', ko: '일주' },
  month: { en: 'Month', ko: '월주' },
  year: { en: 'Year', ko: '년주' },
};

const POSITIONS: PillarPosition[] = ['hour', 'day', 'month', 'year'];

interface ShinsalTableProps {
  theme: ThemeCode;
  shinsal: ShinsalData;
}

export function ShinsalTable({ theme, shinsal }: ShinsalTableProps) {
  const colors = THEMES[theme].colors;

  const sentimentColor: Record<string, string> = {
    positive: colors.positive,
    neutral: colors.neutral,
    caution: colors.caution,
  };

  return (
    <View style={s.container}>
      <Text style={[s.chartTitle, { color: colors.text }]}>SPIRIT STARS</Text>
      <Text style={[s.chartSubtitle, { color: colors.textSecondary }]}>神殺 · Shinsal Analysis</Text>

      {/* 공망 / 천을귀인 / 월령 */}
      <View style={s.infoRow}>
        <View style={[s.infoItem, { backgroundColor: colors.surface }]}>
          <Text style={[s.infoLabel, { color: colors.primary }]}>Void (空亡)</Text>
          <Text style={[s.infoValue, { color: colors.text }]}>
            Year: {shinsal.gongmang.year.join('')}{'  '}
            Day: {shinsal.gongmang.day.join('')}
          </Text>
        </View>
        <View style={[s.infoItem, { backgroundColor: colors.surface }]}>
          <Text style={[s.infoLabel, { color: colors.primary }]}>Guardian Noble (天乙貴人)</Text>
          <Text style={[s.infoValue, { color: colors.text }]}>{shinsal.cheonEulGwiIn}</Text>
        </View>
        <View style={[s.infoItem, { backgroundColor: colors.surface }]}>
          <Text style={[s.infoLabel, { color: colors.primary }]}>Monthly Ruler (월령)</Text>
          <Text style={[s.infoValue, { color: colors.text }]}>{shinsal.wolryeong}</Text>
        </View>
      </View>

      {/* 12신살 + 세부신살 테이블 */}
      {/* 헤더 */}
      <View style={[s.tableRow, { backgroundColor: colors.primary }]}>
        <View style={s.tableHeaderLabel}>
          <Text style={s.headerText}> </Text>
        </View>
        {POSITIONS.map((pos) => (
          <View key={pos} style={s.tableHeaderCell}>
            <Text style={s.headerText}>{PILLAR_LABELS[pos].en}</Text>
            <Text style={s.headerSub}>{PILLAR_LABELS[pos].ko}</Text>
          </View>
        ))}
      </View>

      {/* 공망위치 */}
      {renderTableRow('Void Position', POSITIONS.map((pos) => {
        const val = shinsal.pillars[pos].gongmangPosition;
        return { text: val || '—', sentiment: 'neutral' };
      }), colors)}

      {/* 12신살 년지기준 */}
      {renderTableRow('12 Stars (Year)', POSITIONS.map((pos) => {
        const val = shinsal.pillars[pos].twelveShinsalByYear;
        return { text: val ? (SHINSAL_EN[val] ?? val) : '—', sub: val || '', sentiment: val ? getShinsalSentiment(val) : 'neutral' };
      }), colors)}

      {/* 12신살 일지기준 */}
      {renderTableRow('12 Stars (Day)', POSITIONS.map((pos) => {
        const val = shinsal.pillars[pos].twelveShinsalByDay;
        return { text: val ? (SHINSAL_EN[val] ?? val) : '—', sub: val || '', sentiment: val ? getShinsalSentiment(val) : 'neutral' };
      }), colors)}

      {/* 세부신살 */}
      <View style={s.detailSection}>
        <Text style={[s.detailTitle, { color: colors.primary }]}>DETAILED STARS BY PILLAR</Text>
        <View style={s.detailGrid}>
          {POSITIONS.filter((pos) => shinsal.pillars[pos].detailedShinsals.length > 0).map((pos) => {
            const shinsals = shinsal.pillars[pos].detailedShinsals;
            return (
              <View key={pos} style={s.detailCol}>
                <Text style={[s.detailColHeader, { color: colors.primary, borderBottomColor: colors.border }]}>
                  {PILLAR_LABELS[pos].en}
                </Text>
                {shinsals.map((name, i) => {
                  const sentiment = getShinsalSentiment(name);
                  return (
                    <View key={i} style={s.tag}>
                      <View style={[s.tagDot, { backgroundColor: sentimentColor[sentiment] }]} />
                      <View style={s.tagTextWrap}>
                        <Text style={[s.tagName, { color: sentimentColor[sentiment] }]}>
                          {SHINSAL_EN[name] ?? name}
                        </Text>
                        <Text style={[s.tagKo, { color: colors.textSecondary }]}>{name}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>

      {/* 범례 */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.positive }]} />
          <Text style={[s.legendText, { color: colors.textSecondary }]}>Positive</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.neutral }]} />
          <Text style={[s.legendText, { color: colors.textSecondary }]}>Neutral</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.caution }]} />
          <Text style={[s.legendText, { color: colors.textSecondary }]}>Caution</Text>
        </View>
      </View>
    </View>
  );
}

function renderTableRow(
  label: string,
  cells: { text: string; sub?: string; sentiment: string }[],
  colors: { surface: string; border: string; text: string; textSecondary: string; positive: string; neutral: string; caution: string },
) {
  const sentimentColor: Record<string, string> = {
    positive: colors.positive, neutral: colors.neutral, caution: colors.caution,
  };
  return (
    <View style={[s.tableRow, { borderBottomColor: colors.border }]}>
      <View style={[s.rowLabel, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[s.rowLabelText, { color: colors.text }]}>{label}</Text>
      </View>
      {cells.map((cell, i) => (
        <View key={i} style={[s.cell, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
          <Text style={[s.cellText, { color: sentimentColor[cell.sentiment] || colors.text }]}>
            {cell.text}
          </Text>
          {cell.sub ? <Text style={[s.cellSub, { color: colors.textSecondary }]}>{cell.sub}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 20 },
  chartTitle: {
    fontFamily: FONT_TITLE, fontSize: 18, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 2,
  },
  chartSubtitle: {
    fontFamily: FONT_CJK, fontSize: 11,
    textAlign: 'center', marginBottom: 16,
  },

  // 상단 요약
  infoRow: { flexDirection: 'row', marginBottom: 16 },
  infoItem: { flex: 1, borderRadius: 4, padding: 10, marginRight: 6 },
  infoLabel: { fontFamily: FONT_BODY, fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  infoValue: { fontFamily: FONT_CJK, fontSize: 11 },

  // 테이블
  tableRow: { flexDirection: 'row' },
  tableHeaderLabel: {
    width: 100, padding: 8,
    borderBottomWidth: 1, borderBottomColor: '#FFFFFF22', borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    flex: 1, padding: 8, alignItems: 'center',
    borderLeftWidth: 1, borderLeftColor: '#FFFFFF22', borderLeftStyle: 'solid',
    borderBottomWidth: 1, borderBottomColor: '#FFFFFF22', borderBottomStyle: 'solid',
  },
  headerText: { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },
  headerSub: { fontFamily: FONT_CJK, fontSize: 8, color: '#FFFFFFBB', marginTop: 1 },
  rowLabel: {
    width: 100, padding: 8, justifyContent: 'center',
    borderBottomWidth: 1, borderBottomStyle: 'solid',
  },
  rowLabelText: { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 'bold' },
  cell: {
    flex: 1, padding: 8, alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomStyle: 'solid',
    borderLeftWidth: 1, borderLeftStyle: 'solid',
  },
  cellText: { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  cellSub: { fontFamily: FONT_CJK, fontSize: 8, marginTop: 2 },

  // 세부 신살
  detailSection: { marginTop: 16 },
  detailTitle: {
    fontFamily: FONT_BODY, fontSize: 11, fontWeight: 'bold',
    letterSpacing: 2, marginBottom: 10,
  },
  detailGrid: { flexDirection: 'row' },
  detailCol: { flex: 1, marginRight: 8 },
  detailColHeader: {
    fontFamily: FONT_BODY, fontSize: 10, fontWeight: 'bold',
    marginBottom: 6,
    borderBottomWidth: 1, borderBottomStyle: 'solid',
    paddingBottom: 4,
  },
  tag: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  tagDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  tagTextWrap: { flex: 1 },
  tagName: { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 'bold' },
  tagKo: { fontFamily: FONT_CJK, fontSize: 8 },

  // 범례
  legend: { flexDirection: 'row', marginTop: 14, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontFamily: FONT_BODY, fontSize: 10 },
});
