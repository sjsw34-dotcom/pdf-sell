import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { NyununData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

const TEN_GOD_FULL: Record<string, string> = {
  '비견': 'Companion (비견 · 比肩)', '겁재': 'Rob Wealth (겁재 · 劫財)',
  '식신': 'Eating God (식신 · 食神)', '상관': 'Hurting Officer (상관 · 傷官)',
  '편재': 'Indirect Wealth (편재 · 偏財)', '정재': 'Direct Wealth (정재 · 正財)',
  '편관': 'Indirect Authority (편관 · 偏官)', '정관': 'Direct Authority (정관 · 正官)',
  '편인': 'Indirect Seal (편인 · 偏印)', '정인': 'Direct Seal (정인 · 正印)',
};

const STAGE_FULL: Record<string, string> = {
  '장생': 'Birth (장생 · 長生)', '목욕': 'Bath (목욕 · 沐浴)', '관대': 'Crown (관대 · 冠帶)',
  '건록': 'Prosperity (건록 · 建祿)', '제왕': 'Emperor (제왕 · 帝旺)', '쇠': 'Decline (쇠 · 衰)',
  '병': 'Illness (병 · 病)', '사': 'Death (사 · 死)', '묘': 'Tomb (묘 · 墓)',
  '절': 'Extinction (절 · 絶)', '태': 'Conception (태 · 胎)', '양': 'Nurturing (양 · 養)',
};

interface NyununCardProps {
  theme: ThemeCode;
  nyunun: NyununData;
}

export function NyununCard({ theme, nyunun }: NyununCardProps) {
  const colors = THEMES[theme].colors;
  const sorted = [...nyunun.entries].sort((a, b) => a.year - b.year);
  const firstYear = sorted[0]?.year || '';
  const lastYear = sorted[sorted.length - 1]?.year || '';

  return (
    <View style={s.container}>
      <Text style={[s.title, { color: colors.primary }]}>
        Ten-Year Destiny Analysis — {firstYear}–{lastYear}
      </Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        Annual Fortune Analysis · 년운 분석
      </Text>

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      <View style={[s.table, { borderColor: colors.border }]}>
        {/* 헤더 */}
        <View style={[s.headerRow, { backgroundColor: colors.primary }]}>
          <Text style={[s.hYear, s.headerText]}>Year{'\n'}· Age</Text>
          <Text style={[s.hStem, s.headerText]}>Heavenly{'\n'}Stem</Text>
          <Text style={[s.hStemBranch, s.headerText]}>Stem /{'\n'}Branch</Text>
          <Text style={[s.hBranch, s.headerText]}>Earthly Branch{'\n'}Ten God</Text>
          <Text style={[s.hStage, s.headerText]}>12 Life{'\n'}Stage</Text>
        </View>

        {sorted.map((entry, idx) => {
          const bg = idx % 2 === 0 ? colors.background : colors.surface;
          const stemGod = TEN_GOD_FULL[entry.stemTenGod] || entry.stemTenGod || '—';
          const branchGod = TEN_GOD_FULL[entry.branchTenGod] || entry.branchTenGod || '—';
          const stage = STAGE_FULL[entry.twelveStage] || entry.twelveStage || '—';
          const stemBranch = `${entry.heavenlyStem || ''}${entry.earthlyBranch || ''}`;

          return (
            <View key={entry.year} style={[s.dataRow, { backgroundColor: bg, borderBottomColor: colors.border }]} wrap={false}>
              <View style={s.hYear}>
                <Text style={[s.yearText, { color: colors.primary }]}>{entry.year}</Text>
                <Text style={[s.ageText, { color: colors.textSecondary }]}>{entry.age || ''}</Text>
              </View>
              <Text style={[s.hStem, s.cellText, { color: colors.text }]}>{stemGod}</Text>
              <Text style={[s.hStemBranch, s.cellHanja, { color: colors.primary }]}>{stemBranch}</Text>
              <Text style={[s.hBranch, s.cellText, { color: colors.text }]}>{branchGod}</Text>
              <Text style={[s.hStage, s.cellText, { color: colors.text }]}>{stage}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 16 },
  title: { fontFamily: FONT_TITLE, fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontFamily: FONT_BODY, fontSize: 9, marginBottom: 6 },
  divider: { width: '100%', height: 1, marginBottom: 10 },

  table: { borderWidth: 0.5, borderStyle: 'solid', borderRadius: 2, overflow: 'hidden' },

  headerRow: { flexDirection: 'row', paddingTop: 6, paddingBottom: 6 },
  headerText: { fontFamily: FONT_BODY, fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', lineHeight: 1.3, paddingLeft: 3, paddingRight: 3 },

  dataRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomStyle: 'solid', paddingTop: 5, paddingBottom: 5, alignItems: 'center' },

  hYear: { width: 52, paddingLeft: 6 },
  hStem: { flex: 1, paddingLeft: 4, paddingRight: 2 },
  hStemBranch: { width: 36, textAlign: 'center' },
  hBranch: { flex: 1, paddingLeft: 4, paddingRight: 2 },
  hStage: { width: 78, paddingRight: 6 },

  yearText: { fontFamily: FONT_TITLE, fontSize: 9, fontWeight: 'bold' },
  ageText: { fontFamily: FONT_BODY, fontSize: 6 },
  cellText: { fontFamily: FONT_CJK, fontSize: 7, lineHeight: 1.3 },
  cellHanja: { fontFamily: FONT_CJK, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
});
