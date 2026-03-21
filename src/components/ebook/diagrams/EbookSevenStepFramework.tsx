import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import {
  BRAND,
  FONT_BODY,
  ANTI_LIGATURE,
  DIAGRAM_CONTAINER,
  DIAGRAM_TITLE,
} from './diagramStyles';

/**
 * Seven-Step Saju Interpretation Framework
 * Vertical flowchart showing the sequential reading process
 */

const STEPS = [
  { num: 1, label: 'Day Master', question: 'Who are you?', ref: 'Ch. 4' },
  { num: 2, label: 'Day Master Strength', question: 'How strong are you?', ref: 'Ch. 4, 7' },
  { num: 3, label: 'Five Elements', question: 'What fills your world?', ref: 'Ch. 5, 6' },
  { num: 4, label: 'Useful God', question: 'What do you need most?', ref: 'Ch. 7' },
  { num: 5, label: 'Ten Gods', question: 'What roles surround you?', ref: 'Ch. 9\u201315' },
  { num: 6, label: 'Life Stages', question: 'What phase are you in?', ref: 'Ch. 16\u201318' },
  { num: 7, label: 'Fortune Cycles', question: 'When does it change?', ref: 'Ch. 19\u201321' },
] as const;

const CIRCLE_SIZE = 18;
const BOX_HEIGHT = 30;
const GAP = 8;
const ARROW_HEIGHT = 8;
const INDENT_STEP = 6;

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BOX_HEIGHT,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '85%',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: BRAND.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  circleText: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: ANTI_LIGATURE,
  },
  labelText: {
    fontFamily: FONT_BODY,
    fontSize: 8.5,
    fontWeight: 'bold',
    color: BRAND.textDark,
    letterSpacing: ANTI_LIGATURE,
    marginRight: 4,
  },
  questionText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: BRAND.textMedium,
    letterSpacing: ANTI_LIGATURE,
    flex: 1,
  },
  refText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: BRAND.textLight,
    letterSpacing: ANTI_LIGATURE,
    marginLeft: 4,
  },
  arrowContainer: {
    height: ARROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLine: {
    width: 1.5,
    height: ARROW_HEIGHT - 3,
    backgroundColor: BRAND.purple,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BRAND.purple,
  },
});

export function EbookSevenStepFramework() {
  return (
    <View style={[s.container, DIAGRAM_CONTAINER]} wrap={false}>
      <Text style={DIAGRAM_TITLE}>The Seven-Step Reading Framework</Text>

      {STEPS.map((step, idx) => (
        <React.Fragment key={step.num}>
          {/* Step box with progressive indent */}
          <View
            style={[
              s.stepRow,
              { marginLeft: idx * INDENT_STEP },
            ]}
          >
            {/* Numbered circle */}
            <View style={s.circle}>
              <Text style={s.circleText}>{String(step.num)}</Text>
            </View>

            {/* Label */}
            <Text style={s.labelText}>{step.label}</Text>

            {/* Question */}
            <Text style={s.questionText}>{`\u201C${step.question}\u201D`}</Text>

            {/* Chapter reference */}
            <Text style={s.refText}>{step.ref}</Text>
          </View>

          {/* Downward arrow between steps */}
          {idx < STEPS.length - 1 && (
            <View style={[s.arrowContainer, { marginLeft: idx * INDENT_STEP }]}>
              <View style={s.arrowLine} />
              <View style={s.arrowHead} />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
