import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { Language } from '@/lib/types/language';
import type { NyununData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';
import { useLang } from './LanguageContext';
import { t } from '@/lib/i18n/pdf-strings';

const TEN_GOD_MAP: Record<string, { en: string; ko: string; hanja: string }> = {
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
};

const STAGE_MAP: Record<string, { en: string; ko: string; hanja: string }> = {
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

function tenGodFull(v: string, lang: Language): string {
  const info = TEN_GOD_MAP[v];
  if (!info) return v || '—';
  if (lang === 'ko') return `${info.ko}(${info.hanja})`;
  return `${info.en} (${info.ko} · ${info.hanja})`;
}

function stageFull(v: string, lang: Language): string {
  const info = STAGE_MAP[v];
  if (!info) return v || '—';
  if (lang === 'ko') return `${info.ko}(${info.hanja})`;
  return `${info.en} (${info.ko} · ${info.hanja})`;
}

interface NyununCardProps {
  theme: ThemeCode;
  nyunun: NyununData;
}

export function NyununCard({ theme, nyunun }: NyununCardProps) {
  const colors = THEMES[theme].colors;
  const lang = useLang();
  const sorted = [...nyunun.entries].sort((a, b) => a.year - b.year);
  const firstYear = sorted[0]?.year || '';
  const lastYear = sorted[sorted.length - 1]?.year || '';

  return (
    <View style={s.container}>
      <Text style={[s.title, { color: colors.primary }]}>
        {t('nyunun.title', lang, { first: String(firstYear), last: String(lastYear) })}
      </Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        {t('nyunun.subtitle', lang)}
      </Text>

      <View style={[s.divider, { backgroundColor: colors.border }]} />

      <View style={[s.table, { borderColor: colors.border }]}>
        {/* 헤더 */}
        <View style={[s.headerRow, { backgroundColor: colors.primary }]}>
          <Text style={[s.hYear, s.headerText]}>{t('nyunun.hYear', lang)}</Text>
          <Text style={[s.hStem, s.headerText]}>{t('nyunun.hStem', lang)}</Text>
          <Text style={[s.hStemBranch, s.headerText]}>{t('nyunun.hStemBranch', lang)}</Text>
          <Text style={[s.hBranch, s.headerText]}>{t('nyunun.hBranch', lang)}</Text>
          <Text style={[s.hStage, s.headerText]}>{t('nyunun.hStage', lang)}</Text>
        </View>

        {sorted.map((entry, idx) => {
          const bg = idx % 2 === 0 ? colors.background : colors.surface;
          const stemGod = tenGodFull(entry.stemTenGod, lang);
          const branchGod = tenGodFull(entry.branchTenGod, lang);
          const stage = stageFull(entry.twelveStage, lang);
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
  title: { fontFamily: FONT_TITLE, fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontFamily: FONT_BODY, fontSize: 11, marginBottom: 8 },
  divider: { width: '100%', height: 1, marginBottom: 12 },

  table: { borderWidth: 0.5, borderStyle: 'solid', borderRadius: 3, overflow: 'hidden' },

  headerRow: { flexDirection: 'row', paddingTop: 8, paddingBottom: 8 },
  headerText: { fontFamily: FONT_BODY, fontSize: 9, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', lineHeight: 1.3, paddingLeft: 4, paddingRight: 4 },

  dataRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomStyle: 'solid', paddingTop: 7, paddingBottom: 7, alignItems: 'center' },

  hYear: { width: 56, paddingLeft: 8 },
  hStem: { flex: 1, paddingLeft: 6, paddingRight: 4 },
  hStemBranch: { width: 40, textAlign: 'center' },
  hBranch: { flex: 1, paddingLeft: 6, paddingRight: 4 },
  hStage: { width: 82, paddingRight: 8 },

  yearText: { fontFamily: FONT_TITLE, fontSize: 11, fontWeight: 'bold' },
  ageText: { fontFamily: FONT_BODY, fontSize: 8 },
  cellText: { fontFamily: FONT_CJK, fontSize: 9, lineHeight: 1.3 },
  cellHanja: { fontFamily: FONT_CJK, fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
});
