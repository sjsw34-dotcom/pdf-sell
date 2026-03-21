import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ELEMENT_COLORS, BRAND, FONT_BODY, FONT_CJK, ANTI_LIGATURE, DIAGRAM_CONTAINER, DIAGRAM_TITLE } from './diagramStyles';

/**
 * Five Elements Correspondence Map
 * 5개 세로 카드가 나란히 배치된 대응표
 */

type ElementKey = keyof typeof ELEMENT_COLORS;

interface ElementData {
  name: ElementKey;
  hanja: string;
  correspondences: string[];
}

const ELEMENTS: ElementData[] = [
  { name: 'Wood',  hanja: '木', correspondences: ['Spring', 'East', 'Liver', 'Gallbladder', 'Anger', 'Sour', 'Sight'] },
  { name: 'Fire',  hanja: '火', correspondences: ['Summer', 'South', 'Heart', 'Sm. Intestine', 'Joy', 'Bitter', 'Taste'] },
  { name: 'Earth', hanja: '土', correspondences: ['Late Summer', 'Center', 'Spleen', 'Stomach', 'Worry', 'Sweet', 'Touch'] },
  { name: 'Metal', hanja: '金', correspondences: ['Autumn', 'West', 'Lungs', 'Lg. Intestine', 'Grief', 'Spicy', 'Smell'] },
  { name: 'Water', hanja: '水', correspondences: ['Winter', 'North', 'Kidneys', 'Bladder', 'Fear', 'Salty', 'Hearing'] },
];

const ROW_LABELS = ['Season', 'Direction', 'Yin Organ', 'Yang Organ', 'Emotion', 'Taste', 'Sense'];

const s = StyleSheet.create({
  container: {
    ...DIAGRAM_CONTAINER,
    height: 280,
  },
  title: {
    ...DIAGRAM_TITLE,
  },
  cardsRow: {
    flexDirection: 'row' as const,
    gap: 5,
  },
  card: {
    flex: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: BRAND.border,
    overflow: 'hidden' as const,
  },
  cardHeader: {
    paddingVertical: 5,
    paddingHorizontal: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  hanjaText: {
    fontFamily: FONT_CJK,
    fontSize: 13,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  elementName: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginTop: 1,
    letterSpacing: ANTI_LIGATURE,
  },
  cardBody: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row' as const,
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  rowLast: {
    flexDirection: 'row' as const,
    paddingVertical: 2.5,
  },
  label: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: BRAND.textLight,
    letterSpacing: ANTI_LIGATURE,
    marginBottom: 1,
  },
  value: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: BRAND.textDark,
    letterSpacing: ANTI_LIGATURE,
  },
});

export function EbookElementCorrespondence() {
  return (
    <View style={s.container} wrap={false}>
      <Text style={s.title}>Five Elements Correspondence System</Text>

      <View style={s.cardsRow}>
        {ELEMENTS.map((el) => {
          const colors = ELEMENT_COLORS[el.name];
          return (
            <View key={el.name} style={s.card}>
              {/* Header */}
              <View style={[s.cardHeader, { backgroundColor: colors.bg }]}>
                <Text style={[s.hanjaText, { color: colors.text }]}>{el.hanja}</Text>
                <Text style={[s.elementName, { color: colors.text }]}>{el.name}</Text>
              </View>

              {/* Correspondence rows */}
              <View style={s.cardBody}>
                {ROW_LABELS.map((label, i) => (
                  <View key={label} style={i < ROW_LABELS.length - 1 ? s.row : s.rowLast}>
                    <View>
                      <Text style={s.label}>{label}</Text>
                      <Text style={s.value}>{el.correspondences[i]}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default EbookElementCorrespondence;
