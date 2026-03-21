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
 * Ten Gods Identification Flowchart
 * View-based grid layout showing how element relationship + polarity → Ten God
 */

const CATEGORIES = [
  {
    key: 'Companion' as const,
    relationship: 'Same element',
    samePol: { en: 'Friend', kr: '비견' },
    diffPol: { en: 'Rob Wealth', kr: '겁재' },
  },
  {
    key: 'Output' as const,
    relationship: 'Day Master produces it',
    samePol: { en: 'Eating God', kr: '식신' },
    diffPol: { en: 'Hurting Officer', kr: '상관' },
  },
  {
    key: 'Wealth' as const,
    relationship: 'Day Master controls it',
    samePol: { en: 'Ind. Wealth', kr: '편재' },
    diffPol: { en: 'Dir. Wealth', kr: '정재' },
  },
  {
    key: 'Authority' as const,
    relationship: 'It controls Day Master',
    samePol: { en: 'Ind. Officer', kr: '편관' },
    diffPol: { en: 'Dir. Officer', kr: '정관' },
  },
  {
    key: 'Resource' as const,
    relationship: 'It produces Day Master',
    samePol: { en: 'Ind. Seal', kr: '편인' },
    diffPol: { en: 'Dir. Seal', kr: '정인' },
  },
] as const;

export function EbookTenGodsFlowchart() {
  return (
    <View style={[s.container, DIAGRAM_CONTAINER]} wrap={false}>
      {/* Title */}
      <Text style={DIAGRAM_TITLE}>How to Identify the Ten Gods</Text>
      <Text style={s.subtitle}>
        Step 1: Element relationship → Step 2: Polarity match → Result
      </Text>

      {/* Day Master badge */}
      <View style={s.dayMasterRow}>
        <View style={s.dayMasterBox}>
          <Text style={s.dayMasterLabel}>Your Day Master</Text>
          <Text style={s.dayMasterDesc}>
            (Heavenly Stem of Day Pillar)
          </Text>
        </View>
      </View>

      {/* Step indicators */}
      <View style={s.stepRow}>
        <View style={s.stepColLeft}>
          <Text style={s.stepLabel}>Step 1 — Relationship</Text>
        </View>
        <View style={s.stepColRight}>
          <Text style={s.stepLabel}>
            Step 2 — Polarity Match
          </Text>
        </View>
      </View>

      {/* Column headers */}
      <View style={s.headerRow}>
        <View style={s.colCategory}>
          <Text style={s.headerText}>Category</Text>
        </View>
        <View style={s.colRelationship}>
          <Text style={s.headerText}>Element Relationship</Text>
        </View>
        <View style={s.colResult}>
          <Text style={s.headerTextSub}>Same Polarity (偏)</Text>
        </View>
        <View style={s.colResult}>
          <Text style={s.headerTextSub}>Different Polarity (正)</Text>
        </View>
      </View>

      {/* Data rows */}
      {CATEGORIES.map((cat, i) => {
        const colors = TEN_GOD_COLORS[cat.key];
        const isLast = i === CATEGORIES.length - 1;
        return (
          <View
            key={cat.key}
            style={isLast ? [s.dataRow, s.dataRowLast] : [s.dataRow]}
          >
            {/* Colored left bar + Category name */}
            <View style={[s.colCategory, s.categoryCell]}>
              <View style={[s.colorBar, { backgroundColor: colors.bg }]} />
              <Text
                style={[s.categoryText, { color: colors.bg }]}
              >
                {cat.key}
              </Text>
            </View>

            {/* Relationship description */}
            <View style={[s.colRelationship, s.cellCenter]}>
              <Text style={s.relationshipText}>{cat.relationship}</Text>
            </View>

            {/* Same polarity result */}
            <View style={[s.colResult, s.cellCenter]}>
              <View style={[s.resultBox, { backgroundColor: colors.bg }]}>
                <Text style={[s.resultEn, { color: colors.text }]}>
                  {cat.samePol.en}
                </Text>
                <Text style={[s.resultKr, { color: colors.text }]}>
                  {cat.samePol.kr}
                </Text>
              </View>
            </View>

            {/* Different polarity result */}
            <View style={[s.colResult, s.cellCenter]}>
              <View
                style={[
                  s.resultBox,
                  {
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1.5,
                    borderColor: colors.bg,
                  },
                ]}
              >
                <Text style={[s.resultEn, { color: colors.bg }]}>
                  {cat.diffPol.en}
                </Text>
                <Text style={[s.resultKr, { color: colors.bg }]}>
                  {cat.diffPol.kr}
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={s.legendBoxFilled} />
          <Text style={s.legendText}>Filled = Same Polarity (Indirect / 偏)</Text>
        </View>
        <View style={s.legendItem}>
          <View style={s.legendBoxOutline} />
          <Text style={s.legendText}>Outline = Different Polarity (Direct / 正)</Text>
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
    fontSize: 7.5,
    color: BRAND.textMedium,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: ANTI_LIGATURE,
  },

  /* Day Master box */
  dayMasterRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dayMasterBox: {
    backgroundColor: BRAND.purple,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dayMasterLabel: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: ANTI_LIGATURE,
  },
  dayMasterDesc: {
    fontFamily: FONT_BODY,
    fontSize: 6.5,
    color: '#D4C4F7',
    marginTop: 1,
    letterSpacing: ANTI_LIGATURE,
  },

  /* Step indicators */
  stepRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4,
  },
  stepColLeft: {
    width: '45%',
    alignItems: 'center',
  },
  stepColRight: {
    width: '55%',
    alignItems: 'center',
  },
  stepLabel: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    fontWeight: 'bold',
    color: BRAND.purple,
    letterSpacing: ANTI_LIGATURE,
  },

  /* Header row */
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: BRAND.border,
    paddingBottom: 4,
    marginBottom: 2,
  },
  colCategory: {
    width: '18%',
    paddingLeft: 4,
  },
  colRelationship: {
    width: '27%',
    paddingHorizontal: 4,
  },
  colResult: {
    width: '27.5%',
    paddingHorizontal: 3,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    fontWeight: 'bold',
    color: BRAND.textDark,
    letterSpacing: ANTI_LIGATURE,
  },
  headerTextSub: {
    fontFamily: FONT_CJK,
    fontSize: 7,
    fontWeight: 'bold',
    color: BRAND.textDark,
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },

  /* Data rows */
  dataRow: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 4,
    alignItems: 'center',
  },
  dataRowLast: {
    borderBottomWidth: 0,
  },
  categoryCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  colorBar: {
    width: 3,
    height: 22,
    borderRadius: 1,
  },
  categoryText: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    fontWeight: 'bold',
    letterSpacing: ANTI_LIGATURE,
  },
  cellCenter: {
    justifyContent: 'center',
  },
  relationshipText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: BRAND.textMedium,
    letterSpacing: ANTI_LIGATURE,
  },

  /* Result boxes */
  resultBox: {
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  resultEn: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  resultKr: {
    fontFamily: FONT_CJK,
    fontSize: 7,
    textAlign: 'center',
    marginTop: 1,
    letterSpacing: ANTI_LIGATURE,
  },

  /* Legend */
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBoxFilled: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: BRAND.purple,
  },
  legendBoxOutline: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: BRAND.purple,
    backgroundColor: '#FFFFFF',
  },
  legendText: {
    fontFamily: FONT_CJK,
    fontSize: 6.5,
    color: BRAND.textLight,
    letterSpacing: ANTI_LIGATURE,
  },
});
