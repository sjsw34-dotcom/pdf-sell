import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { PillarData, Pillar as PillarType, HiddenStemEntry, InfoData } from '@/lib/types/saju';
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

const BRANCH_INFO: Record<string, { roma: string; ko: string; hanja: string; animal: string }> = {
  '子': { roma: 'Ja', ko: '자', hanja: '子', animal: 'Rat' },
  '丑': { roma: 'Chuk', ko: '축', hanja: '丑', animal: 'Ox' },
  '寅': { roma: 'In', ko: '인', hanja: '寅', animal: 'Tiger' },
  '卯': { roma: 'Myo', ko: '묘', hanja: '卯', animal: 'Rabbit' },
  '辰': { roma: 'Jin', ko: '진', hanja: '辰', animal: 'Dragon' },
  '巳': { roma: 'Sa', ko: '사', hanja: '巳', animal: 'Snake' },
  '午': { roma: 'O', ko: '오', hanja: '午', animal: 'Horse' },
  '未': { roma: 'Mi', ko: '미', hanja: '未', animal: 'Goat' },
  '申': { roma: 'Sin', ko: '신', hanja: '申', animal: 'Monkey' },
  '酉': { roma: 'Yu', ko: '유', hanja: '酉', animal: 'Rooster' },
  '戌': { roma: 'Sul', ko: '술', hanja: '戌', animal: 'Dog' },
  '亥': { roma: 'Hae', ko: '해', hanja: '亥', animal: 'Pig' },
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

// ─── 헬퍼 ───

function tenGodText(v: string): string {
  const info = TEN_GOD_FULL[v];
  if (!info) return v || '—';
  return `${info.en} (${info.ko} · ${info.hanja})`;
}

function stemText(v: string): string {
  const info = STEM_INFO[v];
  if (!info) return v || '—';
  return `${info.roma} (${info.ko} · ${info.hanja}) · ${info.yinyang} ${info.element}`;
}

function branchText(v: string): string {
  const info = BRANCH_INFO[v];
  if (!info) return v || '—';
  return `${info.roma} (${info.ko} · ${info.hanja}) · ${info.animal}`;
}

function stageText(v: string): string {
  const info = STAGE_FULL[v];
  if (!info) return v || '—';
  return `${info.en} (${info.ko} · ${info.hanja})`;
}

// ─── 컴포넌트 ───

interface SajuChartProps {
  theme: ThemeCode;
  pillar: PillarData;
  info: InfoData;
}

export function SajuChart({ theme, pillar, info }: SajuChartProps) {
  const colors = THEMES[theme].colors;

  const cols = [
    { label: 'Hour Pillar\n(시주 · 時柱)', data: pillar.hourPillar },
    { label: 'Day Pillar\n(일주 · 日柱)', data: pillar.dayPillar },
    { label: 'Month Pillar\n(월주 · 月柱)', data: pillar.monthPillar },
    { label: 'Year Pillar\n(년주 · 年柱)', data: pillar.yearPillar },
  ];

  const genderEn = info.gender === '남' ? 'Male' : 'Female';

  return (
    <View style={s.container}>
      {/* 타이틀 */}
      <Text style={[s.title, { color: colors.primary }]}>
        사주원국표 · Four Pillars Birth Chart — THE DESTINY CHART
      </Text>

      {/* 인적 정보 */}
      <View style={[s.infoBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[s.infoText, { color: colors.text }]}>
          {info.name || 'Guest'} ({genderEn})
        </Text>
        <Text style={[s.infoText, { color: colors.textSecondary }]}>
          {info.solarDate ? `Solar: ${info.solarDate}` : ''}
        </Text>
      </View>

      {/* 테이블 */}
      <View style={[s.table, { borderColor: colors.border }]}>

        {/* 헤더 행 */}
        <View style={s.tableRow}>
          <View style={[s.catCell, { backgroundColor: colors.primary }]}>
            <Text style={s.catText}>Category</Text>
          </View>
          {cols.map((col, i) => (
            <View key={i} style={[s.dataCell, { backgroundColor: colors.primary }]}>
              <Text style={s.headerText}>{col.label}</Text>
            </View>
          ))}
        </View>

        {/* Ten God */}
        {renderRow('Ten God', cols.map(c => tenGodText(c.data.stemTenGod)), colors, false)}

        {/* Heavenly Stem */}
        {renderRow('Heavenly\nStem', cols.map(c => stemText(c.data.heavenlyStem)), colors, true)}

        {/* Earthly Branch */}
        {renderRow('Earthly\nBranch', cols.map(c => branchText(c.data.earthlyBranch)), colors, false)}

        {/* Ten God (Branch) */}
        {renderRow('Ten God\n(Branch)', cols.map(c => tenGodText(c.data.branchTenGod)), colors, true)}

        {/* Life Stage */}
        {renderRow('Life\nStage', cols.map(c => stageText(c.data.twelveStage)), colors, false)}

        {/* Hidden Stems */}
        {renderRow('Hidden\nStems', cols.map(c => {
          const parts: string[] = [];
          if (c.data.hiddenStems.yeogi) parts.push(`${c.data.hiddenStems.yeogi.stem} ${c.data.hiddenStems.yeogi.tenGod}`);
          if (c.data.hiddenStems.junggi) parts.push(`${c.data.hiddenStems.junggi.stem} ${c.data.hiddenStems.junggi.tenGod}`);
          if (c.data.hiddenStems.bongi) parts.push(`${c.data.hiddenStems.bongi.stem} ${c.data.hiddenStems.bongi.tenGod}`);
          return parts.length > 0 ? parts.join('\n') : '—';
        }), colors, true)}

        {/* Naeum */}
        {renderRow('Naeum\n(납음오행)', cols.map(c => c.data.napEumOheng || '—'), colors, false)}

      </View>
    </View>
  );
}

function renderRow(
  label: string,
  values: string[],
  colors: { surface: string; background: string; text: string; textSecondary: string; border: string; primary: string },
  alt: boolean,
) {
  const bg = alt ? colors.surface : colors.background;
  return (
    <View style={s.tableRow}>
      <View style={[s.catCell, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[s.catLabel, { color: colors.primary }]}>{label}</Text>
      </View>
      {values.map((val, i) => (
        <View key={i} style={[s.dataCell, { backgroundColor: bg, borderBottomColor: colors.border, borderLeftColor: colors.border }]}>
          <Text style={[s.dataText, { color: colors.text }]}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 16 },

  title: {
    fontFamily: FONT_TITLE,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderRadius: 3,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: FONT_BODY,
    fontSize: 9,
  },

  table: {
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderRadius: 2,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },

  catCell: {
    width: 70,
    padding: 5,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  catText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  catLabel: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.3,
  },

  dataCell: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
    borderLeftWidth: 0.5,
    borderLeftStyle: 'solid',
  },
  headerText: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 1.3,
  },
  dataText: {
    fontFamily: FONT_CJK,
    fontSize: 7.5,
    textAlign: 'center',
    lineHeight: 1.4,
  },
});
