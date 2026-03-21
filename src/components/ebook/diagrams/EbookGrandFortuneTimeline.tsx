import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import {
  BRAND,
  FONT_BODY,
  FONT_CJK,
  ANTI_LIGATURE,
  DIAGRAM_CONTAINER,
  DIAGRAM_TITLE,
} from './diagramStyles';

/**
 * Grand Fortune Timeline (대운 타임라인)
 * Chart A: 乙 Yin Wood Day Master
 * View-based horizontal timeline of 10-year blocks, two rows of 5.
 */

type Rating = 'favorable' | 'unfavorable' | 'neutral';

interface GrandFortunePeriod {
  age: string;
  pillar: string;
  stage: string;
  rating: Rating;
  energy: number; // 0–10 scale for bar height
}

const PERIODS: GrandFortunePeriod[] = [
  { age: '1–10',   pillar: '\u620A\u5BC5', stage: 'Peak',        rating: 'neutral',      energy: 10 },
  { age: '11–20',  pillar: '\u4E01\u4E11', stage: 'Decline',     rating: 'unfavorable',  energy: 7 },
  { age: '21–30',  pillar: '\u4E19\u5B50', stage: 'Sickness',    rating: 'neutral',      energy: 5 },
  { age: '31–40',  pillar: '\u4E59\u4EA5', stage: 'Death',       rating: 'favorable',    energy: 3 },
  { age: '41–50',  pillar: '\u7532\u620C', stage: 'Tomb',        rating: 'favorable',    energy: 2 },
  { age: '51–60',  pillar: '\u7678\u9149', stage: 'Extinction',  rating: 'unfavorable',  energy: 1 },
  { age: '61–70',  pillar: '\u58EC\u7533', stage: 'Conception',  rating: 'unfavorable',  energy: 3 },
  { age: '71–80',  pillar: '\u8F9B\u672A', stage: 'Nurture',     rating: 'unfavorable',  energy: 5 },
  { age: '81–90',  pillar: '\u5E9A\u5348', stage: 'Birth',       rating: 'unfavorable',  energy: 7 },
  { age: '91–100', pillar: '\u5DF1\u5DF3', stage: 'Bathing',     rating: 'neutral',      energy: 6 },
];

const RATING_COLORS: Record<Rating, { bg: string; border: string }> = {
  favorable:   { bg: '#DCFCE7', border: '#86EFAC' },
  unfavorable: { bg: '#FEE2E2', border: '#FCA5A5' },
  neutral:     { bg: '#F1F5F9', border: '#CBD5E1' },
};

const MAX_BAR_HEIGHT = 20;

function FortuneBlock({ period }: { period: GrandFortunePeriod }) {
  const colors = RATING_COLORS[period.rating];
  const barH = Math.max(2, (period.energy / 10) * MAX_BAR_HEIGHT);

  return (
    <View style={[s.block, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      {/* Age range */}
      <Text style={s.ageText}>{period.age}</Text>
      {/* Pillar (CJK) */}
      <Text style={s.pillarText}>{period.pillar}</Text>
      {/* Life stage */}
      <Text style={s.stageText}>{period.stage}</Text>
      {/* Energy bar */}
      <View style={s.barContainer}>
        <View
          style={[
            s.bar,
            {
              height: barH,
              backgroundColor:
                period.rating === 'favorable'
                  ? '#22C55E'
                  : period.rating === 'unfavorable'
                    ? '#EF4444'
                    : '#94A3B8',
            },
          ]}
        />
      </View>
    </View>
  );
}

export function EbookGrandFortuneTimeline() {
  const row1 = PERIODS.slice(0, 5);
  const row2 = PERIODS.slice(5, 10);

  return (
    <View style={[s.container, DIAGRAM_CONTAINER]} wrap={false}>
      {/* Title */}
      <Text style={DIAGRAM_TITLE}>Chart A Grand Fortune Timeline</Text>
      <Text style={s.subtitle}>Yin Wood Day Master, Useful God = Wood</Text>

      {/* Row 1: Ages 1–50 */}
      <View style={s.row}>
        {row1.map((p) => (
          <FortuneBlock key={p.age} period={p} />
        ))}
      </View>

      {/* Row 2: Ages 51–100 */}
      <View style={s.row}>
        {row2.map((p) => (
          <FortuneBlock key={p.age} period={p} />
        ))}
      </View>

      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }]} />
          <Text style={s.legendText}>Favorable</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]} />
          <Text style={s.legendText}>Challenging</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]} />
          <Text style={s.legendText}>Mixed</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: BRAND.textMedium,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: ANTI_LIGATURE,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 6,
  },
  block: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: 'center',
  },
  ageText: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    fontWeight: 'bold',
    color: BRAND.textDark,
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: ANTI_LIGATURE,
  },
  pillarText: {
    fontFamily: FONT_CJK,
    fontSize: 10,
    color: BRAND.textDark,
    textAlign: 'center',
    marginBottom: 1,
    letterSpacing: ANTI_LIGATURE,
  },
  stageText: {
    fontFamily: FONT_BODY,
    fontSize: 6.5,
    color: BRAND.textMedium,
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: ANTI_LIGATURE,
  },
  barContainer: {
    width: '80%',
    height: MAX_BAR_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 1.5,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 1,
  },
  legendText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: BRAND.textMedium,
    letterSpacing: ANTI_LIGATURE,
  },
});
