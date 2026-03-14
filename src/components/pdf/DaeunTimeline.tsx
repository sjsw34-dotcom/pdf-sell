import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { DaeunData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { TEN_GOD_EN, TWELVE_STAGE_EN, getShinsalSentiment, SHINSAL_EN } from '@/lib/constants/terms';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

interface DaeunTimelineProps {
  theme: ThemeCode;
  daeun: DaeunData;
}

export function DaeunTimeline({ theme, daeun }: DaeunTimelineProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  const sentimentColor: Record<string, string> = {
    positive: colors.positive,
    neutral: colors.neutral,
    caution: colors.caution,
  };

  // 나이순 정렬 (9세 → 99세)
  const sorted = [...daeun.entries].sort((a, b) => a.startAge - b.startAge);

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>MAJOR LUCK CYCLES</Text>
      <Text style={s.chartSubtitle}>大運 · Daeun (10-Year Periods)</Text>

      {sorted.map((entry, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <View key={entry.startAge} style={s.entryRow} wrap={false}>
            {/* 타임라인 도트 + 라인 */}
            <View style={s.timeline}>
              <View style={[s.dot, { backgroundColor: colors.primary }]} />
              {idx < sorted.length - 1 ? <View style={s.line} /> : null}
            </View>

            {/* 카드 */}
            <View style={[s.card, isEven ? s.cardDefault : s.cardAlt]}>
              {/* 상단: 나이 + 천간/지지 */}
              <View style={s.cardHeader}>
                <View style={s.ageBox}>
                  <Text style={s.ageText}>{entry.startAge}</Text>
                  <Text style={s.ageSuffix}>~{entry.startAge + 9}</Text>
                </View>
                <View style={s.stemBranch}>
                  <Text style={s.hanjaLarge}>{entry.heavenlyStem}{entry.earthlyBranch}</Text>
                </View>
                <View style={s.godInfo}>
                  <Text style={s.godLabel}>{TEN_GOD_EN[entry.stemTenGod] ?? entry.stemTenGod}</Text>
                  <Text style={s.godSub}>{entry.stemTenGod} / {entry.branchTenGod}</Text>
                </View>
                <View style={s.stageInfo}>
                  <Text style={s.stageLabel}>{TWELVE_STAGE_EN[entry.twelveStage] ?? entry.twelveStage}</Text>
                  <Text style={s.stageSub}>{entry.twelveStage}</Text>
                </View>
              </View>

              {/* 하단: 주요 신살 태그 */}
              <View style={s.tagRow}>
                {[entry.shinsals.byYear, entry.shinsals.byDay, ...entry.shinsals.auxiliary]
                  .filter((n) => n && n !== '-')
                  .slice(0, 5)
                  .map((name, i) => {
                    const sentiment = getShinsalSentiment(name);
                    return (
                      <View key={i} style={[s.tag, { borderColor: sentimentColor[sentiment] }]}>
                        <Text style={[s.tagText, { color: sentimentColor[sentiment] }]}>
                          {SHINSAL_EN[name] ?? name}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        );
      })}
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

    entryRow: { flexDirection: 'row', marginBottom: 0 },

    // 타임라인
    timeline: { width: 20, alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
    line: { width: 2, flex: 1, backgroundColor: colors.border },

    // 카드
    card: {
      flex: 1, marginLeft: 8, marginBottom: 6,
      borderRadius: 4, padding: 8,
      borderWidth: 1, borderColor: colors.border, borderStyle: 'solid',
    },
    cardDefault: { backgroundColor: colors.background },
    cardAlt: { backgroundColor: colors.surface },

    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },

    ageBox: { flexDirection: 'row', alignItems: 'baseline', width: 55 },
    ageText: { fontFamily: FONT_BODY, fontSize: 16, fontWeight: 'bold', color: colors.primary },
    ageSuffix: { fontFamily: FONT_BODY, fontSize: 8, color: colors.textSecondary, marginLeft: 1 },

    stemBranch: { width: 36, alignItems: 'center' },
    hanjaLarge: { fontFamily: FONT_CJK, fontSize: 14, fontWeight: 'bold', color: colors.text },

    godInfo: { flex: 1, marginLeft: 8 },
    godLabel: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: colors.text },
    godSub: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary, marginTop: 1 },

    stageInfo: { width: 60, alignItems: 'flex-end' },
    stageLabel: { fontFamily: FONT_BODY, fontSize: 7, color: colors.secondary },
    stageSub: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary },

    // 신살 태그
    tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: {
      borderWidth: 1, borderStyle: 'solid', borderRadius: 3,
      paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5,
      marginRight: 4, marginBottom: 2,
    },
    tagText: { fontFamily: FONT_BODY, fontSize: 6, fontWeight: 'bold' },
  });
}
