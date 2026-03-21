import React from 'react';
import { View, Text, Svg, Circle, Line, G, Path, StyleSheet } from '@react-pdf/renderer';
import { BRAND, FONT_BODY, FONT_CJK, ANTI_LIGATURE, DIAGRAM_CONTAINER, DIAGRAM_TITLE } from './diagramStyles';

/**
 * 십이운성 순환도 (Twelve Life Stages Wheel)
 * View 기반 절대 위치 레이아웃 + SVG 도형
 */

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 115;

// Energy levels mapped to node radius and opacity
const ENERGY = {
  MAX:       { r: 10, opacity: 1.0 },
  VERY_HIGH: { r: 9.5, opacity: 0.92 },
  HIGH:      { r: 9, opacity: 0.85 },
  MEDIUM:    { r: 8, opacity: 0.7 },
  LOW:       { r: 7, opacity: 0.5 },
  VERY_LOW:  { r: 6.5, opacity: 0.35 },
  MINIMAL:   { r: 6, opacity: 0.25 },
  ZERO:      { r: 5.5, opacity: 0.15 },
} as const;

type Phase = 'rising' | 'falling' | 'renewal';

const PHASE_COLORS: Record<Phase, string> = {
  rising:  BRAND.purple,
  falling: '#94A3B8',
  renewal: BRAND.gold,
};

const RISING_SHADES = ['#7C3AED', '#8B5CF6', '#9B6FF7', '#A78BFA', '#B89FFC'];
const FALLING_SHADES = ['#94A3B8', '#7E8FA3', '#6B7A8E', '#576879', '#475569'];

interface Stage {
  name: string;
  korean: string;
  hanja: string;
  energy: keyof typeof ENERGY;
  phase: Phase;
  color: string;
}

const STAGES: Stage[] = [
  { name: 'Birth',       korean: '장생', hanja: '長生', energy: 'HIGH',      phase: 'rising',  color: RISING_SHADES[0] },
  { name: 'Bathing',     korean: '목욕', hanja: '沐浴', energy: 'MEDIUM',    phase: 'rising',  color: RISING_SHADES[1] },
  { name: 'Crown',       korean: '관대', hanja: '冠帶', energy: 'HIGH',      phase: 'rising',  color: RISING_SHADES[2] },
  { name: 'Prime',       korean: '건록', hanja: '建祿', energy: 'VERY_HIGH', phase: 'rising',  color: RISING_SHADES[3] },
  { name: 'Peak',        korean: '제왕', hanja: '帝旺', energy: 'MAX',       phase: 'rising',  color: RISING_SHADES[4] },
  { name: 'Decline',     korean: '쇠',   hanja: '衰',   energy: 'MEDIUM',    phase: 'falling', color: FALLING_SHADES[0] },
  { name: 'Sickness',    korean: '병',   hanja: '病',   energy: 'LOW',       phase: 'falling', color: FALLING_SHADES[1] },
  { name: 'Death',       korean: '사',   hanja: '死',   energy: 'VERY_LOW',  phase: 'falling', color: FALLING_SHADES[2] },
  { name: 'Tomb',        korean: '묘',   hanja: '墓',   energy: 'MINIMAL',   phase: 'falling', color: FALLING_SHADES[3] },
  { name: 'Extinction',  korean: '절',   hanja: '絶',   energy: 'ZERO',      phase: 'falling', color: FALLING_SHADES[4] },
  { name: 'Conception',  korean: '태',   hanja: '胎',   energy: 'LOW',       phase: 'renewal', color: BRAND.gold },
  { name: 'Nurture',     korean: '양',   hanja: '養',   energy: 'MEDIUM',    phase: 'renewal', color: BRAND.gold },
];

/** Get position on circle for a given index (0=top, clockwise) */
function getPos(index: number, radius: number) {
  const angle = -90 + (index * 360) / 12;
  const rad = (angle * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

/** Build an arc path between two angle positions (clockwise) */
function arcPath(fromIdx: number, toIdx: number, radius: number): string {
  const startAngle = -90 + (fromIdx * 360) / 12;
  const endAngle = -90 + (toIdx * 360) / 12;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = CX + radius * Math.cos(startRad);
  const y1 = CY + radius * Math.sin(startRad);
  const x2 = CX + radius * Math.cos(endRad);
  const y2 = CY + radius * Math.sin(endRad);
  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
}

/** Arrow head path */
function arrowHead(x: number, y: number, angle: number, size: number = 5): string {
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  return `M ${x} ${y} L ${x + size * Math.cos(a1)} ${y + size * Math.sin(a1)} M ${x} ${y} L ${x + size * Math.cos(a2)} ${y + size * Math.sin(a2)}`;
}

/** Label anchor position outside the circle */
function getLabelPos(index: number) {
  const angle = -90 + (index * 360) / 12;
  const rad = (angle * Math.PI) / 180;
  const labelR = R_OUTER + 22;
  return {
    x: CX + labelR * Math.cos(rad),
    y: CY + labelR * Math.sin(rad),
    angle,
  };
}

export function EbookLifeStagesWheel() {
  // Arrow arcs: draw small clockwise arrows between consecutive nodes
  const arrowArcs = STAGES.map((_, i) => {
    const fromAngle = -90 + (i * 360) / 12;
    const toAngle = -90 + (((i + 1) % 12) * 360) / 12;

    const gapDeg = 12; // gap near nodes
    const arcStartDeg = fromAngle + gapDeg;
    const arcEndDeg = toAngle - gapDeg;

    const arcStartRad = (arcStartDeg * Math.PI) / 180;
    const arcEndRad = (arcEndDeg * Math.PI) / 180;
    const arcR = R_OUTER - 20;

    const sx = CX + arcR * Math.cos(arcStartRad);
    const sy = CY + arcR * Math.sin(arcStartRad);
    const ex = CX + arcR * Math.cos(arcEndRad);
    const ey = CY + arcR * Math.sin(arcEndRad);

    const d = `M ${sx} ${sy} A ${arcR} ${arcR} 0 0 1 ${ex} ${ey}`;
    const headAngle = arcEndRad + Math.PI / 2; // tangent direction (clockwise)

    return { d, ex, ey, headAngle };
  });

  return (
    <View style={[s.container, DIAGRAM_CONTAINER]} wrap={false}>
      <Text style={DIAGRAM_TITLE}>The Twelve Life Stages</Text>

      <View style={s.diagramWrap}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Clockwise arrow arcs between nodes */}
          {arrowArcs.map((arc, i) => (
            <G key={`arc-${i}`}>
              <Path d={arc.d} stroke="#CCCCCC" strokeWidth={0.8} fill="none" />
              <Path d={arrowHead(arc.ex, arc.ey, arc.headAngle, 3.5)} stroke="#CCCCCC" strokeWidth={0.8} />
            </G>
          ))}

          {/* Stage node circles */}
          {STAGES.map((stage, i) => {
            const pos = getPos(i, R_OUTER);
            const en = ENERGY[stage.energy];
            return (
              <Circle
                key={stage.name}
                cx={pos.x}
                cy={pos.y}
                r={en.r}
                fill={stage.color}
                opacity={en.opacity}
              />
            );
          })}
        </Svg>

        {/* Text overlay: English name + Korean (hanja) */}
        {STAGES.map((stage, i) => {
          const lbl = getLabelPos(i);
          const angle = lbl.angle;
          const labelW = 52;
          const labelH = 22;

          // Adjust alignment based on position around the circle
          let alignX = lbl.x - labelW / 2;
          let alignY = lbl.y - labelH / 2;

          // Fine-tune for top/bottom/sides
          if (angle > -100 && angle < -80) {
            // top
            alignY = lbl.y - labelH - 2;
          } else if (angle > 80 && angle < 100) {
            // bottom
            alignY = lbl.y + 2;
          } else if (angle >= -80 && angle <= 80) {
            // right side
            alignX = lbl.x + 2;
            alignY = lbl.y - labelH / 2;
          } else {
            // left side
            alignX = lbl.x - labelW - 2;
            alignY = lbl.y - labelH / 2;
          }

          return (
            <View
              key={`lbl-${stage.name}`}
              style={[
                s.labelWrap,
                { left: alignX, top: alignY, width: labelW, height: labelH },
              ]}
            >
              <Text style={[s.labelEn, { color: stage.color }]}>{stage.name}</Text>
              <Text style={s.labelKo}>{stage.korean} {stage.hanja}</Text>
            </View>
          );
        })}

        {/* Stage number inside node */}
        {STAGES.map((stage, i) => {
          const pos = getPos(i, R_OUTER);
          const en = ENERGY[stage.energy];
          const boxSize = en.r * 2;
          return (
            <View
              key={`num-${i}`}
              style={[
                s.nodeNumber,
                { left: pos.x - boxSize / 2, top: pos.y - boxSize / 2, width: boxSize, height: boxSize },
              ]}
            >
              <Text style={s.nodeNumberText}>{i + 1}</Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: BRAND.purple }]} />
          <Text style={s.legendText}>Rising (Birth ~ Peak)</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: '#94A3B8' }]} />
          <Text style={s.legendText}>Falling (Decline ~ Extinction)</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: BRAND.gold }]} />
          <Text style={s.legendText}>Renewal (Conception ~ Nurture)</Text>
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
  labelWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelEn: {
    fontFamily: FONT_BODY,
    fontSize: 6.5,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  labelKo: {
    fontFamily: FONT_CJK,
    fontSize: 5.5,
    color: BRAND.textLight,
    textAlign: 'center',
    marginTop: -0.5,
    letterSpacing: ANTI_LIGATURE,
  },
  nodeNumber: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNumberText: {
    fontFamily: FONT_BODY,
    fontSize: 6,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
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
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    color: BRAND.textMedium,
    letterSpacing: ANTI_LIGATURE,
  },
});
