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

  const sentimentColor: Record<string, string> = {
    positive: colors.positive,
    neutral: colors.neutral,
    caution: colors.caution,
  };

  const sorted = [...daeun.entries].sort((a, b) => a.startAge - b.startAge);

  return (
    <View style={s.container}>
      <Text style={[s.chartTitle, { color: colors.text }]}>MAJOR LUCK CYCLES</Text>
      <Text style={[s.chartSubtitle, { color: colors.textSecondary }]}>大運 · Daeun (10-Year Periods)</Text>

      {sorted.map((entry, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <View key={entry.startAge} style={s.entryRow} wrap={false}>
            {/* 타임라인 도트 + 라인 */}
            <View style={s.timeline}>
              <View style={[s.dot, { backgroundColor: colors.primary }]} />
              {idx < sorted.length - 1 && <View style={[s.line, { backgroundColor: colors.border }]} />}
            </View>

            {/* 카드 */}
            <View style={[s.card, { backgroundColor: isEven ? colors.background : colors.surface, borderColor: colors.border }]}>
              <View style={s.cardHeader}>
                {/* 나이 */}
                <View style={s.ageBox}>
                  <Text style={[s.ageText, { color: colors.primary }]}>{entry.startAge}</Text>
                  <Text style={[s.ageSuffix, { color: colors.textSecondary }]}>~{entry.startAge + 9}</Text>
                </View>

                {/* 한자 */}
                <View style={s.stemBranch}>
                  <Text style={[s.hanjaLarge, { color: colors.text }]}>{entry.heavenlyStem}{entry.earthlyBranch}</Text>
                </View>

                {/* 십신 */}
                <View style={s.godInfo}>
                  <Text style={[s.godLabel, { color: colors.text }]}>{TEN_GOD_EN[entry.stemTenGod] ?? entry.stemTenGod}</Text>
                  <Text style={[s.godSub, { color: colors.textSecondary }]}>{entry.stemTenGod} / {entry.branchTenGod}</Text>
                </View>

                {/* 운성 */}
                <View style={s.stageInfo}>
                  <Text style={[s.stageLabel, { color: colors.secondary }]}>{TWELVE_STAGE_EN[entry.twelveStage] ?? entry.twelveStage}</Text>
                  <Text style={[s.stageSub, { color: colors.textSecondary }]}>{entry.twelveStage}</Text>
                </View>
              </View>

              {/* 신살 태그 */}
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

  entryRow: { flexDirection: 'row', marginBottom: 0 },

  // 타임라인
  timeline: { width: 24, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 10 },
  line: { width: 2, flex: 1 },

  // 카드
  card: {
    flex: 1, marginLeft: 10, marginBottom: 8,
    borderRadius: 6, padding: 12,
    borderWidth: 1, borderStyle: 'solid',
  },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },

  ageBox: { flexDirection: 'row', alignItems: 'baseline', width: 60 },
  ageText: { fontFamily: FONT_BODY, fontSize: 18, fontWeight: 'bold' },
  ageSuffix: { fontFamily: FONT_BODY, fontSize: 10, marginLeft: 2 },

  stemBranch: { width: 42, alignItems: 'center' },
  hanjaLarge: { fontFamily: FONT_CJK, fontSize: 16, fontWeight: 'bold' },

  godInfo: { flex: 1, marginLeft: 10 },
  godLabel: { fontFamily: FONT_BODY, fontSize: 10, fontWeight: 'bold' },
  godSub: { fontFamily: FONT_CJK, fontSize: 8, marginTop: 1 },

  stageInfo: { width: 70, alignItems: 'flex-end' },
  stageLabel: { fontFamily: FONT_BODY, fontSize: 10 },
  stageSub: { fontFamily: FONT_CJK, fontSize: 8 },

  // 신살 태그
  tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    borderWidth: 1, borderStyle: 'solid', borderRadius: 4,
    paddingTop: 3, paddingBottom: 3, paddingLeft: 7, paddingRight: 7,
    marginRight: 5, marginBottom: 3,
  },
  tagText: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold' },
});
