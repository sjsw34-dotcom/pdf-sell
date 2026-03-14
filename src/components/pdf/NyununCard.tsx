import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { NyununData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { TEN_GOD_EN, TWELVE_STAGE_EN, getShinsalSentiment, SHINSAL_EN } from '@/lib/constants/terms';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

interface NyununCardProps {
  theme: ThemeCode;
  nyunun: NyununData;
}

export function NyununCard({ theme, nyunun }: NyununCardProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  const sentimentColor: Record<string, string> = {
    positive: colors.positive,
    neutral: colors.neutral,
    caution: colors.caution,
  };

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>ANNUAL FORTUNE</Text>
      <Text style={s.chartSubtitle}>年運 · Nyunun (Yearly Luck)</Text>

      {nyunun.entries.map((entry, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <View key={entry.year} style={[s.card, isEven ? s.cardDefault : s.cardAlt]} wrap={false}>
            <View style={s.cardTop}>
              {/* 년도 + 나이 */}
              <View style={s.yearCol}>
                <Text style={s.yearText}>{entry.year}</Text>
                <Text style={s.ageText}>{entry.age}</Text>
              </View>

              {/* 천간/지지 */}
              <View style={s.stemCol}>
                <Text style={s.hanja}>{entry.heavenlyStem}{entry.earthlyBranch}</Text>
              </View>

              {/* 십성 */}
              <View style={s.godCol}>
                <Text style={s.godEn}>{TEN_GOD_EN[entry.stemTenGod] ?? entry.stemTenGod}</Text>
                <Text style={s.godKo}>{entry.stemTenGod} / {entry.branchTenGod}</Text>
              </View>

              {/* 운성 */}
              <View style={s.stageCol}>
                <Text style={s.stageEn}>{TWELVE_STAGE_EN[entry.twelveStage] ?? entry.twelveStage}</Text>
                <Text style={s.stageKo}>{entry.twelveStage}</Text>
              </View>
            </View>

            {/* 신살 */}
            <View style={s.tagRow}>
              {[entry.shinsals.byYear, entry.shinsals.byDay, ...entry.shinsals.auxiliary]
                .filter((n) => n && n !== '-')
                .slice(0, 6)
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

    card: {
      borderRadius: 4, padding: 8, marginBottom: 5,
      borderWidth: 1, borderColor: colors.border, borderStyle: 'solid',
    },
    cardDefault: { backgroundColor: colors.background },
    cardAlt: { backgroundColor: colors.surface },

    cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },

    yearCol: { width: 50 },
    yearText: { fontFamily: FONT_BODY, fontSize: 14, fontWeight: 'bold', color: colors.primary },
    ageText: { fontFamily: FONT_BODY, fontSize: 7, color: colors.textSecondary },

    stemCol: { width: 36, alignItems: 'center' },
    hanja: { fontFamily: FONT_CJK, fontSize: 13, fontWeight: 'bold', color: colors.text },

    godCol: { flex: 1, marginLeft: 8 },
    godEn: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: colors.text },
    godKo: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary, marginTop: 1 },

    stageCol: { width: 60, alignItems: 'flex-end' },
    stageEn: { fontFamily: FONT_BODY, fontSize: 7, color: colors.secondary },
    stageKo: { fontFamily: FONT_CJK, fontSize: 6, color: colors.textSecondary },

    tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: {
      borderWidth: 1, borderStyle: 'solid', borderRadius: 3,
      paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5,
      marginRight: 4, marginBottom: 2,
    },
    tagText: { fontFamily: FONT_BODY, fontSize: 6, fontWeight: 'bold' },
  });
}
