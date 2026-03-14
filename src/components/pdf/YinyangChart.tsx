import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { YinyangData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

const ELEMENT_COLORS: Record<string, string> = {
  '木': '#2D8B46', '火': '#D63031', '土': '#C49B1A', '金': '#7F8C8D', '水': '#2E86C1',
};
const ELEMENT_EN: Record<string, string> = {
  '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
};

const GOD_GROUP_INFO: Record<string, { en: string; full: string; hanja: string; color: string; desc0: string; desc1: string; desc2: string; desc3: string }> = {
  '비겁': { en: 'Companion Group', full: '비겁 (비견 · 比肩 / 겁재 · 劫財)', hanja: '', color: '#3498DB',
    desc0: 'Represents the strength of the self, independence, and the drive to assert yourself.',
    desc1: 'A moderate presence suggests a balanced sense of self-identity.',
    desc2: 'A strong presence indicates assertiveness and competitive drive.',
    desc3: 'A dominant force — strong independence but watch for excessive self-focus.' },
  '식상': { en: 'Expression Group', full: '식상 (식신 · 食神 / 상관 · 傷官)', hanja: '', color: '#E67E22',
    desc0: 'Represents creative expression, verbal ability, and the power to showcase talents.',
    desc1: 'A moderate presence suggests balanced creative output.',
    desc2: 'A strong presence indicates a natural gift for communication and artistry.',
    desc3: 'Exceptional creative energy — channel it wisely to avoid scattered focus.' },
  '재성': { en: 'Wealth Group', full: '재성 (편재 · 偏財 / 정재 · 正財)', hanja: '', color: '#F1C40F',
    desc0: 'Represents practical sensibility, goal-achievement ability, and financial matters.',
    desc1: 'A moderate presence suggests balanced financial awareness.',
    desc2: 'A strong presence indicates natural financial acumen.',
    desc3: 'This energy is absent — developing financial awareness and practical habits will be especially valuable.' },
  '관성': { en: 'Authority Group', full: '관성 (편관 · 偏官 / 정관 · 正官)', hanja: '', color: '#E74C3C',
    desc0: 'Represents social responsibility, reputation, honor, and discipline.',
    desc1: 'A moderate presence suggests a balanced sense of duty.',
    desc2: 'A strong presence indicates deep commitment to responsibility.',
    desc3: 'A dominant force — learning to balance obligation with self-care is key.' },
  '인성': { en: 'Seal Group', full: '인성 (편인 · 偏印 / 정인 · 正印)', hanja: '', color: '#2ECC71',
    desc0: 'Represents wisdom, academic achievement, and the capacity to absorb knowledge.',
    desc1: 'A moderate presence suggests balanced intellectual curiosity.',
    desc2: 'A strong presence indicates deep appreciation for learning.',
    desc3: 'A dominant force — strong inner wisdom but avoid over-reliance on others.' },
};

function getGodDesc(group: string, count: number): string {
  const info = GOD_GROUP_INFO[group];
  if (!info) return '';
  if (count === 0) return info.desc3;
  if (count === 1) return info.desc1;
  if (count === 2) return info.desc2;
  return info.desc3;
}

interface YinyangChartProps {
  theme: ThemeCode;
  yinyang: YinyangData;
}

export function YinyangChart({ theme, yinyang }: YinyangChartProps) {
  const colors = THEMES[theme].colors;
  const total = yinyang.yin + yinyang.yang || 1;
  const yangPct = Math.round((yinyang.yang / total) * 100);
  const yinPct = 100 - yangPct;
  const maxEl = Math.max(...yinyang.elements.map(e => e.count), 1);

  return (
    <View style={s.container}>
      {/* ══════ 타이틀 ══════ */}
      <Text style={[s.title, { color: colors.primary }]}>
        Yin, Yang & Five Elements — The Energy Balance Within You
      </Text>

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {/* ══════ 음양 비율 ══════ */}
      <Text style={[s.sectionTitle, { color: colors.primary }]}>
        Yin and Yang Harmony (음양의 조화)
      </Text>

      <View style={s.yinyangRow}>
        <View style={s.yinyangItem}>
          <Text style={[s.yinyangLabel, { color: '#E07C54' }]}>Yang (양 · 陽)</Text>
          <Text style={[s.yinyangValue, { color: colors.text }]}>{yinyang.yang} elements ({yangPct}%)</Text>
        </View>
        <View style={s.yinyangItem}>
          <Text style={[s.yinyangLabel, { color: '#5B6A9A' }]}>Yin (음 · 陰)</Text>
          <Text style={[s.yinyangValue, { color: colors.text }]}>{yinyang.yin} elements ({yinPct}%)</Text>
        </View>
      </View>

      <View style={s.yinyangBar}>
        {yinyang.yang > 0 && (
          <View style={[s.yangSeg, { width: `${yangPct}%` }]}>
            <Text style={s.barText}>{yangPct}%</Text>
          </View>
        )}
        {yinyang.yin > 0 && (
          <View style={[s.yinSeg, { width: `${yinPct}%` }]}>
            <Text style={s.barText}>{yinPct}%</Text>
          </View>
        )}
      </View>

      <View style={s.spacer12} />

      {/* ══════ 오행 분포 테이블 ══════ */}
      <Text style={[s.sectionTitle, { color: colors.primary }]}>
        Five Elements Distribution (오행 분포도)
      </Text>

      {/* 테이블 헤더 */}
      <View style={[s.tableRow, { borderBottomColor: colors.primary, borderBottomWidth: 1.5 }]}>
        <Text style={[s.thCell, s.thElement, { color: colors.textSecondary }]}>Element</Text>
        <Text style={[s.thCell, s.thScore, { color: colors.textSecondary }]}>Score</Text>
        <Text style={[s.thCell, s.thCount, { color: colors.textSecondary }]}>Count</Text>
      </View>

      {yinyang.elements.map((el, idx) => {
        const score = maxEl > 0 ? Math.round((el.count / maxEl) * 100) : 0;
        const elColor = ELEMENT_COLORS[el.element] || '#999';
        return (
          <View key={el.element} style={[s.tableRow, { borderBottomColor: colors.border }]}>
            <View style={[s.tdCell, s.thElement, { flexDirection: 'row', alignItems: 'center' }]}>
              <View style={[s.elDot, { backgroundColor: elColor }]} />
              <Text style={[s.tdText, { color: colors.text }]}>{el.element} {ELEMENT_EN[el.element] || ''}</Text>
            </View>
            <View style={[s.tdCell, s.thScore]}>
              <View style={s.scoreBarTrack}>
                <View style={[s.scoreBarFill, { width: `${Math.max(score, 3)}%`, backgroundColor: elColor }]} />
              </View>
              <Text style={[s.scoreText, { color: colors.textSecondary }]}>{score}%</Text>
            </View>
            <Text style={[s.tdCell, s.thCount, s.tdText, { color: colors.text }]}>{el.count}</Text>
          </View>
        );
      })}

      {/* 노트 */}
      <Text style={[s.note, { color: colors.textSecondary }]}>
        Note: Each element is scored independently on a 0–100% scale based on its strength in your chart. These are not shares of a whole — they measure each element's individual influence.
      </Text>

      <View style={s.spacer12} />

      {/* ══════ 해설 박스 ══════ */}
      <View style={[s.infoBox, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
        <Text style={[s.infoTitle, { color: colors.primary }]}>What is Yin and Yang (음양 · 陰陽)?</Text>
        <Text style={[s.infoBody, { color: colors.text }]}>
          Yin and Yang are the two opposing forces that make up all things in the universe. Yang (양) represents light, outward expression, and active energy, while Yin (음) represents darkness, inward gathering, and calm, still energy.
        </Text>
      </View>

      <View style={s.spacer8} />

      <View style={[s.infoBox, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
        <Text style={[s.infoTitle, { color: colors.primary }]}>What are the Five Elements (오행 · 五行)?</Text>
        <Text style={[s.infoBody, { color: colors.text }]}>
          The Five Elements describe the distribution of Wood (木), Fire (火), Earth (土), Metal (金), and Water (水) within your chart. Elements that appear in greater strength reflect your core personality tendencies, while weaker elements point to areas that may benefit from conscious development.
        </Text>
      </View>
    </View>
  );
}

// ─── 십신 분포 (별도 export — PdfDocument에서 별도 Page에 배치) ───

interface TenGodsChartProps {
  theme: ThemeCode;
  yinyang: YinyangData;
}

export function TenGodsChart({ theme, yinyang }: TenGodsChartProps) {
  const colors = THEMES[theme].colors;

  return (
    <View style={s.container}>
      <Text style={[s.title, { color: colors.primary }]}>
        Ten Gods Distribution (십신(十神) 분포)
      </Text>
      <Text style={[s.note, { color: colors.textSecondary, marginBottom: 12 }]}>
        This analysis reflects the Five Element energies in your birth chart. The data indicates the relative strength of each innate trait — the higher the count, the greater that energy's influence on your life.
      </Text>

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {yinyang.tenGodGroups.map((grp) => {
        const info = GOD_GROUP_INFO[grp.group];
        if (!info) return (
          <View key={grp.group} style={s.godSection}>
            <Text style={[s.godTitle, { color: '#999' }]}>{grp.group}: {grp.count}</Text>
          </View>
        );

        return (
          <View key={grp.group} style={s.godSection}>
            <View style={s.godHeader}>
              <View style={[s.godDot, { backgroundColor: info.color }]} />
              <Text style={[s.godTitle, { color: colors.primary }]}>{info.en}</Text>
              <Text style={[s.godFull, { color: colors.textSecondary }]}> — {info.full}</Text>
            </View>
            <Text style={[s.godDesc, { color: colors.textSecondary }]}>{info.desc0}</Text>
            <View style={s.godCountRow}>
              <Text style={[s.godCountLabel, { color: colors.text }]}>Count: </Text>
              <Text style={[s.godCountValue, { color: info.color }]}>{grp.count}</Text>
            </View>
            <Text style={[s.godInterpret, { color: colors.text }]}>
              In your chart: {getGodDesc(grp.group, grp.count)}
            </Text>
            <View style={[s.godDivider, { backgroundColor: colors.border }]} />
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 16 },

  title: { fontFamily: FONT_TITLE, fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  sectionTitle: { fontFamily: FONT_TITLE, fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  divider: { width: '100%', height: 1, marginBottom: 12 },

  // 음양
  yinyangRow: { flexDirection: 'row', marginBottom: 8 },
  yinyangItem: { flex: 1 },
  yinyangLabel: { fontFamily: FONT_TITLE, fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  yinyangValue: { fontFamily: FONT_BODY, fontSize: 9 },
  yinyangBar: { flexDirection: 'row', height: 24, borderRadius: 4, overflow: 'hidden' },
  yangSeg: { backgroundColor: '#E07C54', justifyContent: 'center', alignItems: 'center' },
  yinSeg: { backgroundColor: '#5B6A9A', justifyContent: 'center', alignItems: 'center' },
  barText: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold', color: '#FFFFFF' },

  // 오행 테이블
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomStyle: 'solid', paddingTop: 5, paddingBottom: 5 },
  thCell: { fontFamily: FONT_BODY, fontSize: 8, fontWeight: 'bold' },
  thElement: { width: 90 },
  thScore: { flex: 1, paddingRight: 8 },
  thCount: { width: 40, textAlign: 'center' },
  tdCell: { justifyContent: 'center' },
  tdText: { fontFamily: FONT_CJK, fontSize: 9 },
  elDot: { width: 5, height: 5, borderRadius: 3, marginRight: 6 },
  scoreBarTrack: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 2, flex: 1, marginRight: 6 },
  scoreBarFill: { height: 8, borderRadius: 2 },
  scoreText: { fontFamily: FONT_BODY, fontSize: 7, width: 28 },

  note: { fontFamily: FONT_BODY, fontSize: 7.5, lineHeight: 1.5, marginTop: 6 },

  // 해설 박스
  infoBox: { borderLeftWidth: 3, borderLeftStyle: 'solid', padding: 10, borderRadius: 3 },
  infoTitle: { fontFamily: FONT_TITLE, fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  infoBody: { fontFamily: FONT_BODY, fontSize: 9, lineHeight: 1.6 },

  // 십신
  godSection: { marginBottom: 4 },
  godHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  godDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  godTitle: { fontFamily: FONT_TITLE, fontSize: 10, fontWeight: 'bold' },
  godFull: { fontFamily: FONT_CJK, fontSize: 8 },
  godDesc: { fontFamily: FONT_BODY, fontSize: 8.5, lineHeight: 1.5, marginBottom: 3, paddingLeft: 12 },
  godCountRow: { flexDirection: 'row', paddingLeft: 12, marginBottom: 2 },
  godCountLabel: { fontFamily: FONT_BODY, fontSize: 9 },
  godCountValue: { fontFamily: FONT_TITLE, fontSize: 11, fontWeight: 'bold' },
  godInterpret: { fontFamily: FONT_BODY, fontSize: 8.5, lineHeight: 1.5, paddingLeft: 12, marginBottom: 4 },
  godDivider: { height: 0.5, marginTop: 4, marginBottom: 8 },

  spacer8: { height: 8 },
  spacer12: { height: 12 },
});
