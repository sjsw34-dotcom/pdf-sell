import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_CJK, ANTI_LIGATURE } from './styles/ebookStyles';

/**
 * eBook 본문 내 사주 차트 표시 컴포넌트
 * writing-rules.md의 ASCII 차트 형식을 PDF로 렌더링
 *
 * 예시 입력:
 * pillars = [
 *   { position: 'Hour', stem: '丁', stemElement: 'Yin Fire', stemGod: 'Eating God',
 *     branch: '丑', branchAnimal: 'Ox', branchGod: 'Ind. Wealth' },
 *   ...
 * ]
 */

export interface ChartPillar {
  position: string;      // Hour, Day, Month, Year
  stem: string;          // 한자 천간 (甲乙丙丁...)
  stemElement: string;   // Yin Fire, Yang Wood, etc.
  stemGod: string;       // Ten God (Eating God, Day Master, etc.)
  branch: string;        // 한자 지지 (子丑寅卯...)
  branchAnimal: string;  // Rat, Ox, Tiger, etc.
  branchGod: string;     // Ten God for branch
}

interface EbookSajuChartProps {
  pillars: ChartPillar[];
  label?: string;        // "Chart B — Ms. S (born 1996)"
  compact?: boolean;     // 콤팩트 모드 (인라인용)
}

export function EbookSajuChart({ pillars, label, compact }: EbookSajuChartProps) {
  return (
    <View style={compact ? s.containerCompact : s.container}>
      {/* 라벨 */}
      {label && <Text style={s.label}>{label}</Text>}

      {/* 테이블 */}
      <View style={s.table}>
        {/* 헤더 행: 기둥 위치 */}
        <View style={s.headerRow}>
          {pillars.map((p, i) => (
            <View key={i} style={s.cell}>
              <Text style={s.headerText}>{p.position}</Text>
            </View>
          ))}
        </View>

        {/* 천간 행: 한자 + 오행 */}
        <View style={s.stemRow}>
          {pillars.map((p, i) => (
            <View key={i} style={s.cell}>
              <Text style={s.stemHanja}>{p.stem}</Text>
              <Text style={s.stemElement}>{p.stemElement}</Text>
              <Text style={s.godLabel}>({p.stemGod})</Text>
            </View>
          ))}
        </View>

        {/* 구분선 */}
        <View style={s.divider} />

        {/* 지지 행: 한자 + 동물 */}
        <View style={s.branchRow}>
          {pillars.map((p, i) => (
            <View key={i} style={s.cell}>
              <Text style={s.branchHanja}>{p.branch}</Text>
              <Text style={s.branchAnimal}>{p.branchAnimal}</Text>
              <Text style={s.godLabel}>({p.branchGod})</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 12,
    marginBottom: 14,
    marginTop: 10,
  },
  containerCompact: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
    marginTop: 6,
  },
  label: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 8,
    letterSpacing: ANTI_LIGATURE,
  },
  table: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'solid',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
  },
  stemRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  branchRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F6FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#D0D0D0',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRightWidth: 0.5,
    borderRightColor: '#E0E0E0',
    borderRightStyle: 'solid',
  },
  headerText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  stemHanja: {
    fontFamily: FONT_CJK,
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 2,
  },
  stemElement: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    color: '#555555',
    letterSpacing: ANTI_LIGATURE,
  },
  godLabel: {
    fontFamily: FONT_BODY,
    fontSize: 6.5,
    color: '#888888',
    marginTop: 2,
    letterSpacing: ANTI_LIGATURE,
  },
  branchHanja: {
    fontFamily: FONT_CJK,
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 2,
  },
  branchAnimal: {
    fontFamily: FONT_BODY,
    fontSize: 7.5,
    color: '#555555',
    letterSpacing: ANTI_LIGATURE,
  },
});
