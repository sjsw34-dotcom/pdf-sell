import React from 'react';
import { View, Text, Svg, Circle, Line, G, Path, StyleSheet } from '@react-pdf/renderer';
import { ELEMENT_COLORS, BRAND, FONT_BODY, FONT_CJK, ANTI_LIGATURE, DIAGRAM_CONTAINER, DIAGRAM_TITLE } from './diagramStyles';

/**
 * 오행 순환도 (Five Elements Cycle)
 * View 기반 절대 위치 레이아웃 + SVG 화살표
 */

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 100;
const R_NODE = 22;

const ELEMENTS = [
  { name: 'Fire',  hanja: '火', angle: -90 },
  { name: 'Earth', hanja: '土', angle: -90 + 72 },
  { name: 'Metal', hanja: '金', angle: -90 + 144 },
  { name: 'Water', hanja: '水', angle: -90 + 216 },
  { name: 'Wood',  hanja: '木', angle: -90 + 288 },
] as const;

const PRODUCTIVE = [
  { from: 4, to: 0, label: 'feeds' },
  { from: 0, to: 1, label: 'creates' },
  { from: 1, to: 2, label: 'bears' },
  { from: 2, to: 3, label: 'collects' },
  { from: 3, to: 4, label: 'nourishes' },
];

const CONTROLLING = [
  { from: 4, to: 1, label: 'parts' },
  { from: 1, to: 3, label: 'dams' },
  { from: 3, to: 0, label: 'extinguishes' },
  { from: 0, to: 2, label: 'melts' },
  { from: 2, to: 4, label: 'chops' },
];

function getPos(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function getEdgePoints(fromIdx: number, toIdx: number) {
  const from = getPos(ELEMENTS[fromIdx].angle, R_OUTER);
  const to = getPos(ELEMENTS[toIdx].angle, R_OUTER);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: from.x + ux * (R_NODE + 2),
    y1: from.y + uy * (R_NODE + 2),
    x2: to.x - ux * (R_NODE + 8),
    y2: to.y - uy * (R_NODE + 8),
  };
}

function arrowHead(x2: number, y2: number, x1: number, y1: number, size: number = 5) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  return `M ${x2} ${y2} L ${x2 + size * Math.cos(a1)} ${y2 + size * Math.sin(a1)} M ${x2} ${y2} L ${x2 + size * Math.cos(a2)} ${y2 + size * Math.sin(a2)}`;
}

function getMidPoint(fromIdx: number, toIdx: number, bulge: number = 18) {
  const from = getPos(ELEMENTS[fromIdx].angle, R_OUTER);
  const to = getPos(ELEMENTS[toIdx].angle, R_OUTER);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = mx - CX;
  const dy = my - CY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: mx + (dx / dist) * bulge, y: my + (dy / dist) * bulge };
}

export function EbookFiveElementsCycle() {
  return (
    <View style={[s.container, DIAGRAM_CONTAINER]} wrap={false}>
      <Text style={DIAGRAM_TITLE}>The Five Elements Cycle</Text>

      {/* SVG 화살표 레이어 */}
      <View style={s.diagramWrap}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* 상생 화살표 (실선) */}
          {PRODUCTIVE.map((rel, i) => {
            const pts = getEdgePoints(rel.from, rel.to);
            return (
              <G key={`p${i}`}>
                <Line x1={pts.x1} y1={pts.y1} x2={pts.x2} y2={pts.y2} stroke={BRAND.purple} strokeWidth={1.5} />
                <Path d={arrowHead(pts.x2, pts.y2, pts.x1, pts.y1, 5)} stroke={BRAND.purple} strokeWidth={1.5} />
              </G>
            );
          })}
          {/* 상극 화살표 (점선) */}
          {CONTROLLING.map((rel, i) => {
            const pts = getEdgePoints(rel.from, rel.to);
            return (
              <G key={`c${i}`}>
                <Line x1={pts.x1} y1={pts.y1} x2={pts.x2} y2={pts.y2} stroke="#AAAAAA" strokeWidth={1} strokeDasharray="4,3" />
                <Path d={arrowHead(pts.x2, pts.y2, pts.x1, pts.y1, 4)} stroke="#AAAAAA" strokeWidth={1} />
              </G>
            );
          })}
          {/* 오행 원 노드 */}
          {ELEMENTS.map((el) => {
            const pos = getPos(el.angle, R_OUTER);
            const colors = ELEMENT_COLORS[el.name];
            return <Circle key={el.name} cx={pos.x} cy={pos.y} r={R_NODE} fill={colors.bg} />;
          })}
        </Svg>

        {/* View 기반 텍스트 오버레이 (절대 위치) */}
        {ELEMENTS.map((el) => {
          const pos = getPos(el.angle, R_OUTER);
          const colors = ELEMENT_COLORS[el.name];
          return (
            <View key={`t-${el.name}`} style={[s.nodeText, { left: pos.x - R_NODE, top: pos.y - R_NODE, width: R_NODE * 2, height: R_NODE * 2 }]}>
              <Text style={[s.hanjaText, { color: colors.text }]}>{el.hanja}</Text>
              <Text style={[s.nameText, { color: colors.text }]}>{el.name}</Text>
            </View>
          );
        })}

        {/* 상생 레이블 (View 기반) */}
        {PRODUCTIVE.map((rel, i) => {
          const mid = getMidPoint(rel.from, rel.to, 20);
          return (
            <View key={`pl-${i}`} style={[s.arrowLabel, { left: mid.x - 22, top: mid.y - 5 }]}>
              <Text style={s.arrowLabelText}>{rel.label}</Text>
            </View>
          );
        })}

        {/* 상극 레이블 (View 기반) */}
        {CONTROLLING.map((rel, i) => {
          const pts = getEdgePoints(rel.from, rel.to);
          const mx = (pts.x1 + pts.x2) / 2;
          const my = (pts.y1 + pts.y2) / 2;
          const lx = mx + (CX - mx) * 0.3;
          const ly = my + (CY - my) * 0.3;
          return (
            <View key={`cl-${i}`} style={[s.arrowLabel, { left: lx - 24, top: ly - 5 }]}>
              <Text style={s.ctrlLabelText}>{rel.label}</Text>
            </View>
          );
        })}
      </View>

      {/* 범례 */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendLine, { backgroundColor: BRAND.purple }]} />
          <Text style={s.legendText}>Productive (generates)</Text>
        </View>
        <View style={s.legendItem}>
          <View style={s.legendLineDashed} />
          <Text style={s.legendText}>Controlling (restrains)</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  diagramWrap: {
    width: SIZE,
    height: SIZE,
    position: 'relative',
  },
  nodeText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hanjaText: {
    fontFamily: FONT_CJK,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  nameText: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    textAlign: 'center',
    marginTop: -1,
    letterSpacing: ANTI_LIGATURE,
  },
  arrowLabel: {
    position: 'absolute',
    width: 44,
  },
  arrowLabelText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: BRAND.purple,
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  ctrlLabelText: {
    fontFamily: FONT_BODY,
    fontSize: 6,
    color: '#AAAAAA',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendLine: {
    width: 16,
    height: 2,
  },
  legendLineDashed: {
    width: 16,
    height: 0,
    borderBottomWidth: 1,
    borderColor: '#AAAAAA',
    borderStyle: 'dashed',
  },
  legendText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: BRAND.textMedium,
    letterSpacing: ANTI_LIGATURE,
  },
});
