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

// ─── 십신 그룹 정보 ───
const GOD_GROUP_HANJA: Record<string, string> = {
  '비겁': '比', '식상': '食', '재성': '財', '관성': '官', '인성': '印',
};
const GOD_GROUP_INFO: Record<string, { en: string; ko: string; sub: string; color: string; desc: string }> = {
  '비겁': { en: 'Companion Group', ko: '비겁', sub: 'Companion · Rob Wealth (비견 · 겁재)', color: '#3498DB',
    desc: 'Represents the strength of the self, independence, and the drive to assert yourself.' },
  '식상': { en: 'Expression Group', ko: '식상', sub: 'Eating God · Hurting Officer (식신 · 상관)', color: '#E67E22',
    desc: 'Represents creative expression, verbal ability, and the power to showcase talents.' },
  '재성': { en: 'Wealth Group', ko: '재성', sub: 'Indirect · Direct Wealth (편재 · 정재)', color: '#F1C40F',
    desc: 'Represents practical sensibility, goal-achievement ability, and financial matters.' },
  '관성': { en: 'Authority Group', ko: '관성', sub: 'Indirect · Direct Authority (편관 · 정관)', color: '#E74C3C',
    desc: 'Represents social responsibility, reputation, honor, and discipline.' },
  '인성': { en: 'Seal Group', ko: '인성', sub: 'Indirect · Direct Seal (편인 · 정인)', color: '#2ECC71',
    desc: 'Represents wisdom, academic achievement, and the capacity to absorb knowledge.' },
};

// ─── 음양 차트 ───

interface YinyangChartProps {
  theme: ThemeCode;
  yinyang: YinyangData;
}

export function YinyangChart({ theme, yinyang }: YinyangChartProps) {
  const colors = THEMES[theme].colors;
  const total = yinyang.yin + yinyang.yang || 1;
  const yangPct = Math.round((yinyang.yang / total) * 100);
  const yinPct = 100 - yangPct;
  const maxCount = Math.max(...yinyang.elements.map(e => e.count), 1);

  return (
    <View style={s.container}>
      {/* ══════ 타이틀 — 영어 우선 ══════ */}
      <Text style={[s.mainTitle, { color: colors.text }]}>Yin, Yang & Five Elements</Text>
      <Text style={[s.mainTitleSub, { color: colors.textSecondary }]}>음양오행 · 陰陽五行</Text>
      <Text style={[s.subText, { color: colors.textSecondary }]}>The Energy Balance Within You</Text>

      <View style={s.spacer16} />

      {/* ══════ 음양의 조화 ══════ */}
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[s.sectionTitle, { color: colors.text }]}>Yin and Yang Harmony (음양의 조화 · 陰陽)</Text>

        <View style={s.yinyangBar}>
          {yinyang.yang > 0 && (
            <View style={[s.yangSeg, { width: `${yangPct}%` }]}>
              <Text style={s.barText}>Yang 양 {yinyang.yang} ({yangPct}%)</Text>
            </View>
          )}
          {yinyang.yin > 0 && (
            <View style={[s.yinSeg, { width: `${yinPct}%` }]}>
              <Text style={s.barText}>Yin 음 {yinyang.yin} ({yinPct}%)</Text>
            </View>
          )}
        </View>
      </View>

      <View style={s.spacer16} />

      {/* ══════ 오행 분포도 ══════ */}
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[s.sectionTitle, { color: colors.text }]}>Five Elements Distribution (오행 분포도 · 五行)</Text>

        {yinyang.elements.map((el) => {
          const pct = maxCount > 0 ? Math.round((el.count / maxCount) * 100) : 0;
          const elColor = ELEMENT_COLORS[el.element] || '#999';
          const elEn = ELEMENT_EN[el.element] || '';

          return (
            <View key={el.element} style={s.elRow}>
              {/* 원형 한자 아이콘 */}
              <View style={[s.elCircle, { backgroundColor: elColor }]}>
                <Text style={s.elCircleText}>{el.element}</Text>
              </View>
              {/* 영문명 */}
              <Text style={[s.elName, { color: colors.text }]}>{elEn}</Text>
              {/* 바 차트 */}
              <View style={s.barTrack}>
                <View style={[s.barFill, { width: `${Math.max(pct, 5)}%`, backgroundColor: elColor }]}>
                  {pct >= 20 && <Text style={s.barPctInside}>{pct}%</Text>}
                </View>
                {pct < 20 && <Text style={[s.barPctOutside, { color: elColor }]}>{pct}%</Text>}
              </View>
              {/* 개수 */}
              <Text style={[s.elCount, { color: colors.text }]}>{el.count}</Text>
            </View>
          );
        })}
      </View>

      <View style={s.spacer16} />

      {/* ══════ 해설 박스 ══════ */}
      <View style={s.infoRow}>
        <View style={[s.infoBox, { backgroundColor: colors.surface }]}>
          <View style={s.infoHeader}>
            <View style={[s.infoDot, { backgroundColor: '#E07C54' }]} />
            <Text style={[s.infoTitle, { color: colors.text }]}>What is Yin and Yang (음양 · 陰陽)?</Text>
          </View>
          <Text style={[s.infoBody, { color: colors.text }]}>
            Yin and Yang are the two opposing forces that make up all things in the universe. Yang (陽) represents light, outward expression, and active energy, while Yin (陰) represents darkness, inward gathering, and calm energy.
          </Text>
        </View>
        <View style={s.infoSpacer} />
        <View style={[s.infoBox, { backgroundColor: colors.surface }]}>
          <View style={s.infoHeader}>
            <View style={[s.infoDot, { backgroundColor: '#2D8B46' }]} />
            <Text style={[s.infoTitle, { color: colors.text }]}>What are the Five Elements (오행 · 五行)?</Text>
          </View>
          <Text style={[s.infoBody, { color: colors.text }]}>
            The Five Elements describe the distribution of Wood (木), Fire (火), Earth (土), Metal (金), and Water (水). Elements in greater strength reflect your core personality, while weaker elements point to areas for conscious development.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── 십신 분포 ───

interface TenGodsChartProps {
  theme: ThemeCode;
  yinyang: YinyangData;
}

export function TenGodsChart({ theme, yinyang }: TenGodsChartProps) {
  const colors = THEMES[theme].colors;

  return (
    <View style={s.container}>
      {/* 타이틀 — 영어 우선 */}
      <Text style={[s.mainTitle, { color: colors.text }]}>Ten Gods Distribution</Text>
      <Text style={[s.mainTitleSub, { color: colors.textSecondary }]}>십신(十神) 분포</Text>
      <Text style={[s.subText, { color: colors.textSecondary }]}>TEN GODS DISTRIBUTION</Text>

      <View style={s.spacer12} />

      {/* 설명 박스 */}
      <View style={[s.noteBox, { backgroundColor: colors.surface }]}>
        <Text style={[s.noteText, { color: colors.text }]}>
          This analysis reflects the Five Element energies in your birth chart. The data indicates the relative strength of each innate trait — the higher the count, the greater that energy's influence on your life.
        </Text>
      </View>

      <View style={s.spacer16} />

      {/* 십신 그룹별 카드 */}
      {yinyang.tenGodGroups.map((grp) => {
        const info = GOD_GROUP_INFO[grp.group];
        if (!info) return null;
        const hanja = GOD_GROUP_HANJA[grp.group] || '';

        return (
          <View key={grp.group} style={[s.godCard, { borderBottomColor: colors.border }]} wrap={false}>
            {/* 왼쪽: 원형 한자 아이콘 */}
            <View style={s.godLeft}>
              <View style={[s.godCircle, { borderColor: info.color }]}>
                <Text style={[s.godCircleText, { color: info.color }]}>{hanja}</Text>
              </View>
            </View>

            {/* 중앙: 설명 — 영어 우선 */}
            <View style={s.godCenter}>
              <Text style={[s.godName, { color: colors.text }]}>
                {info.en} ({info.ko})
              </Text>
              <Text style={[s.godSub, { color: colors.textSecondary }]}>{info.sub}</Text>
              <Text style={[s.godDesc, { color: colors.textSecondary }]}>{info.desc}</Text>
            </View>

            {/* 오른쪽: 개수 */}
            <View style={s.godRight}>
              <Text style={[s.godCount, { color: info.color }]}>{grp.count}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 16 },

  mainTitle: { fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  mainTitleSub: { fontFamily: FONT_CJK, fontSize: 12, marginBottom: 4 },
  subText: { fontFamily: FONT_BODY, fontSize: 12, marginBottom: 4 },
  sectionTitle: { fontFamily: FONT_TITLE, fontSize: 14, fontWeight: 'bold', marginBottom: 14 },

  // 카드
  card: {
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderRadius: 6,
    padding: 18,
  },

  // 음양 바
  yinyangBar: { flexDirection: 'row', height: 38, borderRadius: 6, overflow: 'hidden' },
  yangSeg: { backgroundColor: '#E07C54', justifyContent: 'center', paddingLeft: 12 },
  yinSeg: { backgroundColor: '#5B6A9A', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 12 },
  barText: { fontFamily: FONT_BODY, fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },

  // 오행 행
  elRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  elCircle: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  elCircleText: { fontFamily: FONT_CJK, fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  elName: { fontFamily: FONT_BODY, fontSize: 13, width: 50, textAlign: 'center', marginLeft: 8 },
  barTrack: {
    flex: 1, height: 26, backgroundColor: '#EBEBEB', borderRadius: 4,
    marginLeft: 10, marginRight: 10,
    flexDirection: 'row', alignItems: 'center',
  },
  barFill: { height: 26, borderRadius: 4, justifyContent: 'center', paddingLeft: 8 },
  barPctInside: { fontFamily: FONT_BODY, fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' },
  barPctOutside: { fontFamily: FONT_BODY, fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
  elCount: { fontFamily: FONT_BODY, fontSize: 13, width: 28, textAlign: 'right' },

  // 해설 박스
  infoRow: { flexDirection: 'row' },
  infoBox: { flex: 1, padding: 14, borderRadius: 4 },
  infoSpacer: { width: 10 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  infoTitle: { fontFamily: FONT_TITLE, fontSize: 12, fontWeight: 'bold' },
  infoBody: { fontFamily: FONT_BODY, fontSize: 11, lineHeight: 1.7 },

  // 십신 노트 박스
  noteBox: { padding: 16, borderRadius: 4 },
  noteText: { fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.7 },

  // 십신 그룹 카드
  godCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  godLeft: { width: 60, alignItems: 'center' },
  godCircle: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 2, borderStyle: 'solid',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  godCircleText: { fontFamily: FONT_CJK, fontSize: 24, fontWeight: 'bold' },
  godCenter: { flex: 1, marginLeft: 10 },
  godName: { fontFamily: FONT_TITLE, fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  godSub: { fontFamily: FONT_BODY, fontSize: 10, marginBottom: 4 },
  godDesc: { fontFamily: FONT_BODY, fontSize: 11, lineHeight: 1.5 },
  godRight: { width: 50, alignItems: 'flex-end' },
  godCount: { fontFamily: FONT_TITLE, fontSize: 30, fontWeight: 'bold' },

  spacer12: { height: 12 },
  spacer16: { height: 16 },
});
