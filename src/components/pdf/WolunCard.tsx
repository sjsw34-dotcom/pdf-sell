import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { WolunData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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

interface WolunCardProps {
  theme: ThemeCode;
  wolun: WolunData;
}

export function WolunCard({ theme, wolun }: WolunCardProps) {
  const colors = THEMES[theme].colors;
  const sorted = [...wolun.entries].sort((a, b) => a.month - b.month);

  return (
    <View style={s.container}>
      <Text style={[s.title, { color: colors.primary }]}>
        Monthly Fortune — {wolun.year}
      </Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        Monthly Fortune Analysis · 월운 분석
      </Text>

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {/* 테이블 */}
      <View style={[s.table, { borderColor: colors.border }]}>
        {/* 헤더 */}
        <View style={[s.headerRow, { backgroundColor: colors.primary }]}>
          <Text style={[s.hMonth, s.headerText]}>Month</Text>
          <Text style={[s.hStemGod, s.headerText]}>Heavenly Stem{'\n'}Ten God</Text>
          <Text style={[s.hStemBranch, s.headerText]}>Stem /{'\n'}Branch</Text>
          <Text style={[s.hBranchGod, s.headerText]}>Earthly Branch{'\n'}Ten God</Text>
          <Text style={[s.hStage, s.headerText]}>12 Life{'\n'}Stage</Text>
        </View>

        {/* 행들 */}
        {sorted.map((entry, idx) => {
          const bg = idx % 2 === 0 ? colors.background : colors.surface;
          const monthName = MONTH_NAMES[entry.month] || `${entry.month}월`;
          const stemGod = TEN_GOD_FULL[entry.stemTenGod] || entry.stemTenGod || '—';
          const branchGod = TEN_GOD_FULL[entry.branchTenGod] || entry.branchTenGod || '—';
          const stage = STAGE_FULL[entry.twelveStage] || entry.twelveStage || '—';
          const stemBranch = `${entry.heavenlyStem || ''}${entry.earthlyBranch || ''}`;

          return (
            <View key={entry.month} style={[s.dataRow, { backgroundColor: bg, borderBottomColor: colors.border }]}>
              <View style={s.hMonth}>
                <Text style={[s.monthText, { color: colors.primary }]}>{monthName}</Text>
                <Text style={[s.monthYear, { color: colors.textSecondary }]}>{wolun.year}</Text>
              </View>
              <Text style={[s.hStemGod, s.cellText, { color: colors.text }]}>{stemGod}</Text>
              <Text style={[s.hStemBranch, s.cellHanja, { color: colors.primary }]}>{stemBranch}</Text>
              <Text style={[s.hBranchGod, s.cellText, { color: colors.text }]}>{branchGod}</Text>
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

  // 열 너비
  hMonth: { width: 62, paddingLeft: 6 },
  hStemGod: { flex: 1, paddingLeft: 4, paddingRight: 2 },
  hStemBranch: { width: 38, textAlign: 'center' },
  hBranchGod: { flex: 1, paddingLeft: 4, paddingRight: 2 },
  hStage: { width: 80, paddingRight: 6 },

  monthText: { fontFamily: FONT_TITLE, fontSize: 8, fontWeight: 'bold' },
  monthYear: { fontFamily: FONT_BODY, fontSize: 6 },
  cellText: { fontFamily: FONT_CJK, fontSize: 7, lineHeight: 1.3 },
  cellHanja: { fontFamily: FONT_CJK, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
});
