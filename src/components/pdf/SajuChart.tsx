import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { PillarData, InfoData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

// ─── 용어 매핑 ───

const TEN_GOD_FULL: Record<string, { en: string; ko: string; hanja: string }> = {
  '비견': { en: 'Companion', ko: '비견', hanja: '比肩' },
  '겁재': { en: 'Rob Wealth', ko: '겁재', hanja: '劫財' },
  '식신': { en: 'Eating God', ko: '식신', hanja: '食神' },
  '상관': { en: 'Hurting Officer', ko: '상관', hanja: '傷官' },
  '편재': { en: 'Indirect Wealth', ko: '편재', hanja: '偏財' },
  '정재': { en: 'Direct Wealth', ko: '정재', hanja: '正財' },
  '편관': { en: 'Indirect Authority', ko: '편관', hanja: '偏官' },
  '정관': { en: 'Direct Authority', ko: '정관', hanja: '正官' },
  '편인': { en: 'Indirect Seal', ko: '편인', hanja: '偏印' },
  '정인': { en: 'Direct Seal', ko: '정인', hanja: '正印' },
  '일간(나)': { en: 'Day Master', ko: '일간', hanja: '日干' },
};

const STEM_INFO: Record<string, { roma: string; ko: string; hanja: string; yinyang: string; element: string }> = {
  '甲': { roma: 'Gap', ko: '갑', hanja: '甲', yinyang: 'Yang', element: 'Wood' },
  '乙': { roma: 'Eul', ko: '을', hanja: '乙', yinyang: 'Yin', element: 'Wood' },
  '丙': { roma: 'Byeong', ko: '병', hanja: '丙', yinyang: 'Yang', element: 'Fire' },
  '丁': { roma: 'Jeong', ko: '정', hanja: '丁', yinyang: 'Yin', element: 'Fire' },
  '戊': { roma: 'Mu', ko: '무', hanja: '戊', yinyang: 'Yang', element: 'Earth' },
  '己': { roma: 'Gi', ko: '기', hanja: '己', yinyang: 'Yin', element: 'Earth' },
  '庚': { roma: 'Gyeong', ko: '경', hanja: '庚', yinyang: 'Yang', element: 'Metal' },
  '辛': { roma: 'Sin', ko: '신', hanja: '辛', yinyang: 'Yin', element: 'Metal' },
  '壬': { roma: 'Im', ko: '임', hanja: '壬', yinyang: 'Yang', element: 'Water' },
  '癸': { roma: 'Gye', ko: '계', hanja: '癸', yinyang: 'Yin', element: 'Water' },
};

const BRANCH_INFO: Record<string, { roma: string; ko: string; hanja: string; animal: string; element: string }> = {
  '子': { roma: 'Ja', ko: '자', hanja: '子', animal: 'Rat', element: 'Water' },
  '丑': { roma: 'Chuk', ko: '축', hanja: '丑', animal: 'Ox', element: 'Earth' },
  '寅': { roma: 'In', ko: '인', hanja: '寅', animal: 'Tiger', element: 'Wood' },
  '卯': { roma: 'Myo', ko: '묘', hanja: '卯', animal: 'Rabbit', element: 'Wood' },
  '辰': { roma: 'Jin', ko: '진', hanja: '辰', animal: 'Dragon', element: 'Earth' },
  '巳': { roma: 'Sa', ko: '사', hanja: '巳', animal: 'Snake', element: 'Fire' },
  '午': { roma: 'O', ko: '오', hanja: '午', animal: 'Horse', element: 'Fire' },
  '未': { roma: 'Mi', ko: '미', hanja: '未', animal: 'Goat', element: 'Earth' },
  '申': { roma: 'Sin', ko: '신', hanja: '申', animal: 'Monkey', element: 'Metal' },
  '酉': { roma: 'Yu', ko: '유', hanja: '酉', animal: 'Rooster', element: 'Metal' },
  '戌': { roma: 'Sul', ko: '술', hanja: '戌', animal: 'Dog', element: 'Earth' },
  '亥': { roma: 'Hae', ko: '해', hanja: '亥', animal: 'Pig', element: 'Water' },
};

const STAGE_FULL: Record<string, { en: string; ko: string; hanja: string }> = {
  '장생': { en: 'Birth', ko: '장생', hanja: '長生' },
  '목욕': { en: 'Bath', ko: '목욕', hanja: '沐浴' },
  '관대': { en: 'Crown', ko: '관대', hanja: '冠帶' },
  '건록': { en: 'Prosperity', ko: '건록', hanja: '建祿' },
  '제왕': { en: 'Emperor', ko: '제왕', hanja: '帝旺' },
  '쇠': { en: 'Decline', ko: '쇠', hanja: '衰' },
  '병': { en: 'Illness', ko: '병', hanja: '病' },
  '사': { en: 'Death', ko: '사', hanja: '死' },
  '묘': { en: 'Tomb', ko: '묘', hanja: '墓' },
  '절': { en: 'Extinction', ko: '절', hanja: '絶' },
  '태': { en: 'Conception', ko: '태', hanja: '胎' },
  '양': { en: 'Nurturing', ko: '양', hanja: '養' },
};

// ─── 오행별 색상 ───
const ELEMENT_COLOR: Record<string, string> = {
  'Wood': '#2D8B46', 'Fire': '#D63031', 'Earth': '#C49B1A', 'Metal': '#7F8C8D', 'Water': '#2E86C1',
};

function getHanjaColor(hanja: string): string {
  const stem = STEM_INFO[hanja];
  if (stem) return ELEMENT_COLOR[stem.element] || '#333';
  const branch = BRANCH_INFO[hanja];
  if (branch) return ELEMENT_COLOR[branch.element] || '#333';
  return '#333';
}

// ─── 헬퍼 ───

function tenGodLabel(v: string): string {
  const info = TEN_GOD_FULL[v];
  if (!info) return v || '—';
  return `${info.en}\n(${info.ko} · ${info.hanja})`;
}

function stageLabel(v: string): string {
  const info = STAGE_FULL[v];
  if (!info) return v || '—';
  return `${info.en}\n(${info.ko} · ${info.hanja})`;
}

// ─── 컴포넌트 ───

interface SajuChartProps {
  theme: ThemeCode;
  pillar: PillarData;
  info: InfoData;
}

export function SajuChart({ theme, pillar, info }: SajuChartProps) {
  const colors = THEMES[theme].colors;
  const genderEn = info.gender === '남' ? 'Male' : 'Female';

  const cols = [
    { label: 'Hour Pillar', sub: '(시주 · 時柱)', data: pillar.hourPillar },
    { label: 'Day Pillar', sub: '(일주 · 日柱)', data: pillar.dayPillar },
    { label: 'Month Pillar', sub: '(월주 · 月柱)', data: pillar.monthPillar },
    { label: 'Year Pillar', sub: '(년주 · 年柱)', data: pillar.yearPillar },
  ];

  return (
    <View style={s.container}>
      {/* 타이틀 — 영어 우선 */}
      <Text style={[s.mainTitle, { color: colors.text }]}>Four Pillars Birth Chart</Text>
      <Text style={[s.mainTitleSub, { color: colors.textSecondary }]}>사주원국표 · 四柱原局表</Text>
      <Text style={[s.subTitle, { color: colors.textSecondary }]}>THE DESTINY CHART</Text>

      {/* 인적 정보 */}
      <View style={[s.infoBar, { backgroundColor: colors.surface }]}>
        <Text style={[s.infoName, { color: colors.text }]}>
          {info.name || 'Guest'} ({genderEn})
        </Text>
        <View style={s.infoDetails}>
          {info.solarDate && (
            <Text style={[s.infoText, { color: colors.textSecondary }]}>
              Solar: {info.solarDate}
            </Text>
          )}
          {info.lunarDate && (
            <Text style={[s.infoText, { color: colors.textSecondary }]}>
              Lunar: {info.lunarDate}
            </Text>
          )}
        </View>
      </View>

      {/* ─── 메인 테이블 ─── */}
      <View style={[s.table, { borderColor: colors.border }]}>

        {/* 헤더 행 */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { backgroundColor: colors.surface }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Category</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCell, { backgroundColor: colors.surface, borderLeftColor: colors.border }]}>
              <Text style={[s.headerLabel, { color: colors.text }]}>{col.label}</Text>
              <Text style={[s.headerSub, { color: colors.textSecondary }]}>{col.sub}</Text>
            </View>
          ))}
        </View>

        {/* Ten God — 십성 */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { borderBottomColor: colors.border }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Ten God</Text>
            <Text style={[s.catSub, { color: colors.textSecondary }]}>(십성 · 十星)</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCell, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
              <Text style={[s.cellText, { color: colors.text }]}>{tenGodLabel(col.data.stemTenGod)}</Text>
            </View>
          ))}
        </View>

        {/* Heavenly Stem — 천간 (큰 한자) */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { borderBottomColor: colors.border }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Heavenly Stem</Text>
            <Text style={[s.catSub, { color: colors.textSecondary }]}>(천간 · 天干)</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCellLarge, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
              <Text style={[s.hanjaLarge, { color: getHanjaColor(col.data.heavenlyStem) }]}>
                {col.data.heavenlyStem}
              </Text>
            </View>
          ))}
        </View>

        {/* Earthly Branch — 지지 (큰 한자) */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { borderBottomColor: colors.border }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Earthly Branch</Text>
            <Text style={[s.catSub, { color: colors.textSecondary }]}>(지지 · 地支)</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCellLarge, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
              <Text style={[s.hanjaLarge, { color: getHanjaColor(col.data.earthlyBranch) }]}>
                {col.data.earthlyBranch}
              </Text>
            </View>
          ))}
        </View>

        {/* Ten God (Branch) — 십성(지지) */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { borderBottomColor: colors.border }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Ten God</Text>
            <Text style={[s.catSub, { color: colors.textSecondary }]}>(Branch)</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCell, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
              <Text style={[s.cellText, { color: colors.text }]}>{tenGodLabel(col.data.branchTenGod)}</Text>
            </View>
          ))}
        </View>

        {/* Life Stage — 운성 */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { borderBottomColor: colors.border }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Life Stage</Text>
            <Text style={[s.catSub, { color: colors.textSecondary }]}>(운성 · 運星)</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCell, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
              <Text style={[s.cellText, { color: colors.text }]}>{stageLabel(col.data.twelveStage)}</Text>
            </View>
          ))}
        </View>

        {/* Naeum — 납음오행 */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { borderBottomColor: colors.border }]}>
            <Text style={[s.catLabel, { color: colors.textSecondary }]}>Naeum</Text>
            <Text style={[s.catSub, { color: colors.textSecondary }]}>(납음 · 納音)</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCell, { borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
              <Text style={[s.cellText, { color: colors.text }]}>{col.data.napEumOheng || '—'}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 20 },

  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  mainTitleSub: {
    fontFamily: FONT_CJK,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  subTitle: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 18,
  },

  // 인적 정보
  infoBar: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoName: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDetails: {
    flexDirection: 'row',
  },
  infoText: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    marginLeft: 8,
    marginRight: 8,
  },

  // 테이블
  table: {
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },

  catCell: {
    width: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  catLabel: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  catSub: {
    fontFamily: FONT_CJK,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },

  dataCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
    borderLeftWidth: 0.5,
    borderLeftStyle: 'solid',
  },
  dataCellLarge: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
    borderLeftWidth: 0.5,
    borderLeftStyle: 'solid',
  },

  headerLabel: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: FONT_CJK,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },

  hanjaLarge: {
    fontFamily: FONT_CJK,
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  cellText: {
    fontFamily: FONT_CJK,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 1.4,
  },
});
