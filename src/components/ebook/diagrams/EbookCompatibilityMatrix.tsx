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
 * 5x5 Element Relationship Matrix
 * Shows producing, controlling, and same-element relationships
 */

type ElementKey = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

const ELEMENTS: ElementKey[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Relationship types and their background colors
const RELATION_COLORS = {
  Same:       '#F1F5F9',
  Produces:   '#DCFCE7',
  Controls:   '#FEE2E2',
  Produced:   '#DBEAFE',
  Controlled: '#FEF3C7',
} as const;

type Relation = keyof typeof RELATION_COLORS;

// Matrix[row][col] — what ROW element does to COL element
const MATRIX: Record<ElementKey, Record<ElementKey, Relation>> = {
  Wood:  { Wood: 'Same', Fire: 'Produces',   Earth: 'Controls',    Metal: 'Controlled', Water: 'Produced' },
  Fire:  { Wood: 'Produced', Fire: 'Same',    Earth: 'Produces',   Metal: 'Controls',   Water: 'Controlled' },
  Earth: { Wood: 'Controlled', Fire: 'Produced', Earth: 'Same',    Metal: 'Produces',   Water: 'Controls' },
  Metal: { Wood: 'Controls', Fire: 'Controlled', Earth: 'Produced', Metal: 'Same',      Water: 'Produces' },
  Water: { Wood: 'Produces', Fire: 'Controls', Earth: 'Controlled', Metal: 'Produced',  Water: 'Same' },
};

// Short labels for cells
const RELATION_LABELS: Record<Relation, string> = {
  Same:       'Same',
  Produces:   'Produces',
  Controls:   'Controls',
  Produced:   'Produced',
  Controlled: 'Controlled',
};

const CELL_SIZE = 48;
const HEADER_SIZE = 40;
const ROW_HEIGHT = 26;

const s = StyleSheet.create({
  tableContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cornerCell: {
    width: HEADER_SIZE,
    height: ROW_HEIGHT,
  },
  headerCell: {
    width: CELL_SIZE,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 2,
  },
  headerText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: ANTI_LIGATURE,
  },
  rowHeader: {
    width: HEADER_SIZE,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 2,
  },
  dataCell: {
    width: CELL_SIZE,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },
  cellText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#1A1A2E',
    letterSpacing: ANTI_LIGATURE,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 1,
    marginRight: 3,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },
  legendText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: '#888888',
    letterSpacing: ANTI_LIGATURE,
  },
});

export function EbookCompatibilityMatrix() {
  return (
    <View style={DIAGRAM_CONTAINER} wrap={false}>
      <Text style={DIAGRAM_TITLE}>Element Relationship Matrix</Text>

      <View style={s.tableContainer}>
        {/* Header row */}
        <View style={s.row}>
          <View style={s.cornerCell} />
          {ELEMENTS.map((el) => {
            const color = ELEMENT_COLORS[el];
            return (
              <View
                key={el}
                style={[s.headerCell, { backgroundColor: color.bg }]}
              >
                <Text style={[s.headerText, { color: color.text }]}>
                  {el}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Data rows */}
        {ELEMENTS.map((rowEl) => {
          const rowColor = ELEMENT_COLORS[rowEl];
          return (
            <View key={rowEl} style={s.row}>
              {/* Row header */}
              <View
                style={[s.rowHeader, { backgroundColor: rowColor.bg }]}
              >
                <Text style={[s.headerText, { color: rowColor.text }]}>
                  {rowEl}
                </Text>
              </View>

              {/* Data cells */}
              {ELEMENTS.map((colEl) => {
                const relation = MATRIX[rowEl][colEl];
                const bg = RELATION_COLORS[relation];
                return (
                  <View
                    key={colEl}
                    style={[s.dataCell, { backgroundColor: bg }]}
                  >
                    <Text style={s.cellText}>
                      {RELATION_LABELS[relation]}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={s.legendRow}>
        {(['Produces', 'Controls', 'Produced', 'Controlled', 'Same'] as Relation[]).map(
          (rel) => (
            <View key={rel} style={s.legendItem}>
              <View
                style={[
                  s.legendSwatch,
                  { backgroundColor: RELATION_COLORS[rel] },
                ]}
              />
              <Text style={s.legendText}>{rel}</Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
}
