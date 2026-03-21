import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import {
  ELEMENT_COLORS,
  FONT_BODY,
  FONT_CJK,
  ANTI_LIGATURE,
  DIAGRAM_CONTAINER,
  DIAGRAM_TITLE,
} from './diagramStyles';

/**
 * Five Elements Health Map
 * 5 horizontal cards showing element-organ-symptom associations
 */

const HEALTH_DATA = [
  { element: 'Wood'  as const, hanja: '\u6728', yinOrgan: 'Liver',   yangOrgan: 'Gallbladder',      bodyArea: 'Eyes, tendons, nails',              deficiency: 'Eye strain, muscle tension, irritability' },
  { element: 'Fire'  as const, hanja: '\u706B', yinOrgan: 'Heart',   yangOrgan: 'Small Intestine',   bodyArea: 'Blood vessels, tongue',             deficiency: 'Poor circulation, anxiety, insomnia' },
  { element: 'Earth' as const, hanja: '\u571F', yinOrgan: 'Spleen',  yangOrgan: 'Stomach',           bodyArea: 'Muscles, mouth, lips',              deficiency: 'Digestive issues, fatigue, overthinking' },
  { element: 'Metal' as const, hanja: '\u91D1', yinOrgan: 'Lungs',   yangOrgan: 'Large Intestine',   bodyArea: 'Skin, nose, respiratory tract',     deficiency: 'Skin problems, respiratory weakness, grief' },
  { element: 'Water' as const, hanja: '\u6C34', yinOrgan: 'Kidneys', yangOrgan: 'Bladder',           bodyArea: 'Bones, ears, lower back',           deficiency: 'Lower back pain, fear, low energy' },
] as const;

const CIRCLE_SIZE = 28;
const CARD_GAP = 4;

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 6,
    marginBottom: CARD_GAP,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  hanjaText: {
    fontFamily: FONT_CJK,
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoCol: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  labelText: {
    fontFamily: FONT_BODY,
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#1A1A2E',
    letterSpacing: ANTI_LIGATURE,
    width: 60,
  },
  valueText: {
    fontFamily: FONT_BODY,
    fontSize: 8.5,
    color: '#555555',
    letterSpacing: ANTI_LIGATURE,
    flex: 1,
  },
});

export function EbookHealthElementMap() {
  return (
    <View style={DIAGRAM_CONTAINER} wrap={false}>
      <Text style={DIAGRAM_TITLE}>Five Elements Health Map</Text>

      {HEALTH_DATA.map((item, idx) => {
        const color = ELEMENT_COLORS[item.element];
        return (
          <View
            key={item.element}
            style={[
              s.card,
              idx === HEALTH_DATA.length - 1 ? { marginBottom: 0 } : {},
            ]}
          >
            {/* Element circle */}
            <View style={[s.circle, { backgroundColor: color.bg }]}>
              <Text style={[s.hanjaText, { color: color.text }]}>
                {item.hanja}
              </Text>
            </View>

            {/* Info lines */}
            <View style={s.infoCol}>
              <View style={s.infoRow}>
                <Text style={s.labelText}>Yin Organ</Text>
                <Text style={s.valueText}>{item.yinOrgan}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.labelText}>Yang Organ</Text>
                <Text style={s.valueText}>{item.yangOrgan}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.labelText}>Body Area</Text>
                <Text style={s.valueText}>{item.bodyArea}</Text>
              </View>
              <View style={s.infoRow}>
                <Text style={s.labelText}>Deficiency</Text>
                <Text style={s.valueText}>{item.deficiency}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
