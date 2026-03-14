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
  const s = styles(colors);

  const sentimentColor: Record<string, string> = {
    positive: colors.positive,
    neutral: colors.neutral,
    caution: colors.caution,
  };

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>SPIRIT STARS</Text>
      <Text style={s.chartSubtitle}>神殺 · Shinsal Analysis</Text>

      {/* 공망 / 천을귀인 / 월령 */}
      <View style={s.infoRow}>
        <View style={s.infoItem}>
          <Text style={s.infoLabel}>Void (空亡)</Text>
          <Text style={s.infoValue}>
            Year: {shinsal.gongmang.year.join('')}{'  '}
            Day: {shinsal.gongmang.day.join('')}
          </Text>
        </View>
        <View style={s.infoItem}>
          <Text style={s.infoLabel}>Guardian Noble (天乙貴人)</Text>
          <Text style={s.infoValue}>{shinsal.cheonEulGwiIn}</Text>
        </View>
        <View style={s.infoItem}>
          <Text style={s.infoLabel}>Monthly Ruler (월령)</Text>
          <Text style={s.infoValue}>{shinsal.wolryeong}</Text>
        </View>
      </View>

      {/* 12신살 + 세부신살 테이블 */}
      {/* 헤더 */}
      <View style={s.tableRow}>
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
      <View style={s.tableRow}>
        <View style={s.rowLabel}>
          <Text style={s.rowLabelText}>Void Position</Text>
        </View>
        {POSITIONS.map((pos) => {
          const val = shinsal.pillars[pos].gongmangPosition;
          return (
            <View key={pos} style={s.cell}>
              {val ? (
                <Text style={[s.cellText, { color: sentimentColor.neutral }]}>{val}</Text>
              ) : (
                <Text style={s.cellEmpty}>—</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* 12신살 년지기준 */}
      <View style={s.tableRow}>
        <View style={s.rowLabel}>
          <Text style={s.rowLabelText}>12 Stars (Year)</Text>
        </View>
        {POSITIONS.map((pos) => {
          const val = shinsal.pillars[pos].twelveShinsalByYear;
          const sentiment = val ? getShinsalSentiment(val) : 'neutral';
          return (
            <View key={pos} style={s.cell}>
              <Text style={[s.cellText, { color: sentimentColor[sentiment] }]}>
                {(SHINSAL_EN[val] ?? val) || '—'}
              </Text>
              {val && <Text style={s.cellSub}>{val}</Text>}
            </View>
          );
        })}
      </View>

      {/* 12신살 일지기준 */}
      <View style={s.tableRow}>
        <View style={s.rowLabel}>
          <Text style={s.rowLabelText}>12 Stars (Day)</Text>
        </View>
        {POSITIONS.map((pos) => {
          const val = shinsal.pillars[pos].twelveShinsalByDay;
          const sentiment = val ? getShinsalSentiment(val) : 'neutral';
          return (
            <View key={pos} style={s.cell}>
              <Text style={[s.cellText, { color: sentimentColor[sentiment] }]}>
                {(SHINSAL_EN[val] ?? val) || '—'}
              </Text>
              {val && <Text style={s.cellSub}>{val}</Text>}
            </View>
          );
        })}
      </View>

      {/* 세부신살 */}
      <View style={s.detailSection}>
        <Text style={s.detailTitle}>DETAILED STARS BY PILLAR</Text>
        <View style={s.detailGrid}>
          {POSITIONS.filter((pos) => shinsal.pillars[pos].detailedShinsals.length > 0).map((pos) => {
            const shinsals = shinsal.pillars[pos].detailedShinsals;
            return (
              <View key={pos} style={s.detailCol}>
                <Text style={s.detailColHeader}>{PILLAR_LABELS[pos].en}</Text>
                {shinsals.map((name, i) => {
                  const sentiment = getShinsalSentiment(name);
                  return (
                    <View key={i} style={s.tag}>
                      <View style={[s.tagDot, { backgroundColor: sentimentColor[sentiment] }]} />
                      <View style={s.tagTextWrap}>
                        <Text style={[s.tagName, { color: sentimentColor[sentiment] }]}>
                          {SHINSAL_EN[name] ?? name}
                        </Text>
                        <Text style={s.tagKo}>{name}</Text>
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
          <Text style={s.legendText}>Positive</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.neutral }]} />
          <Text style={s.legendText}>Neutral</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: colors.caution }]} />
          <Text style={s.legendText}>Caution</Text>
        </View>
      </View>
    </View>
  );
}

function styles(colors: { primary: string; secondary: string; surface: string; text: string; textSecondary: string; border: string; background: string; positive: string; neutral: string; caution: string }) {
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

    // 상단 요약
    infoRow: { flexDirection: 'row', marginBottom: 12 },
    infoItem: { flex: 1, backgroundColor: colors.surface, borderRadius: 4, padding: 8, marginRight: 6 },
    infoLabel: { fontFamily: FONT_BODY, fontSize: 7, fontWeight: 'bold', color: colors.primary, marginBottom: 3 },
    infoValue: { fontFamily: FONT_CJK, fontSize: 9, color: colors.text },

    // 테이블
    tableRow: { flexDirection: 'row' },
    tableHeaderLabel: {
      width: 90, backgroundColor: colors.primary, padding: 5,
      borderBottomWidth: 1, borderBottomColor: colors.background, borderBottomStyle: 'solid',
    },
    tableHeaderCell: {
      flex: 1, backgroundColor: colors.primary, padding: 5, alignItems: 'center',
      borderLeftWidth: 1, borderLeftColor: colors.background, borderLeftStyle: 'solid',
      borderBottomWidth: 1, borderBottomColor: colors.background, borderBottomStyle: 'solid',
    },
    headerText: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: '#FFFFFF' },
    headerSub: { fontFamily: FONT_CJK, fontSize: 6, color: colors.secondary },
    rowLabel: {
      width: 90, backgroundColor: colors.surface, padding: 5, justifyContent: 'center',
      borderBottomWidth: 1, borderBottomColor: colors.border, borderBottomStyle: 'solid',
    },
    rowLabelText: { fontFamily: FONT_BODY, fontSize: 7, fontWeight: 'bold', color: colors.text },
    cell: {
      flex: 1, padding: 5, alignItems: 'center', justifyContent: 'center',
      borderBottomWidth: 1, borderBottomColor: colors.border, borderBottomStyle: 'solid',
      borderLeftWidth: 1, borderLeftColor: colors.border, borderLeftStyle: 'solid',
    },
    cellText: { fontFamily: FONT_BODY, fontSize: 7, fontWeight: 'bold', textAlign: 'center' },
    cellSub: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary, marginTop: 1 },
    cellEmpty: { fontFamily: FONT_BODY, fontSize: 7, color: colors.border },

    // 세부 신살
    detailSection: { marginTop: 14 },
    detailTitle: {
      fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold',
      color: colors.primary, letterSpacing: 2, marginBottom: 8,
    },
    detailGrid: { flexDirection: 'row' },
    detailCol: { flex: 1, marginRight: 6 },
    detailColHeader: {
      fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold',
      color: colors.primary, marginBottom: 5,
      borderBottomWidth: 1, borderBottomColor: colors.border, borderBottomStyle: 'solid',
      paddingBottom: 3,
    },
    tag: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
    tagDot: { width: 5, height: 5, borderRadius: 3, marginRight: 4 },
    tagTextWrap: { flex: 1 },
    tagName: { fontFamily: FONT_BODY, fontSize: 7, fontWeight: 'bold' },
    tagKo: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary },

    // 범례
    legend: { flexDirection: 'row', marginTop: 12, justifyContent: 'center' },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    legendDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
    legendText: { fontFamily: FONT_BODY, fontSize: 7, color: colors.textSecondary },
  });
}
