import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { YongsinData } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';
import { useLang } from './LanguageContext';
import { t } from '@/lib/i18n/pdf-strings';

// ─── 오행 매핑 ───

const ELEMENT_INFO: Record<string, { en: string; classical: string; hanja: string; color: string }> = {
  '木': { en: 'Growth & Flexibility', classical: 'Wood', hanja: '木', color: '#2D8B46' },
  '火': { en: 'Passion & Energy', classical: 'Fire', hanja: '火', color: '#D63031' },
  '土': { en: 'Stability & Trust', classical: 'Earth', hanja: '土', color: '#C49B1A' },
  '金': { en: 'Precision & Strength', classical: 'Metal', hanja: '金', color: '#7F8C8D' },
  '水': { en: 'Wisdom & Adaptability', classical: 'Water', hanja: '水', color: '#2E86C1' },
};

const YONGSIN_LABELS = [
  { key: 'yongsin' as const, en: 'Favorable Element', ko: '용신', hanja: '用神' },
  { key: 'huisin' as const, en: 'Joyful Element', ko: '희신', hanja: '喜神' },
  { key: 'gisin' as const, en: 'Unfavorable Element', ko: '기신', hanja: '忌神' },
  { key: 'gusin' as const, en: 'Antagonistic Element', ko: '구신', hanja: '仇神' },
  { key: 'hansin' as const, en: 'Neutral Element', ko: '한신', hanja: '閑神' },
] as const;

const YONGSIN_I18N_KEY: Record<string, string> = {
  yongsin: 'yongsin.favorable', huisin: 'yongsin.joyful', gisin: 'yongsin.unfavorable', gusin: 'yongsin.antagonistic', hansin: 'yongsin.neutral',
};

const ELEMENT_DESC_KEY: Record<string, string> = {
  '木': 'el.wood', '火': 'el.fire', '土': 'el.earth', '金': 'el.metal', '水': 'el.water',
};

interface YongsinChartProps {
  theme: ThemeCode;
  yongsin: YongsinData;
}

export function YongsinChart({ theme, yongsin }: YongsinChartProps) {
  const colors = THEMES[theme].colors;
  const lang = useLang();

  return (
    <View style={s.container}>
      {/* 타이틀 */}
      <Text style={[s.mainTitle, { color: colors.text }]}>{t('yongsin.title', lang)}</Text>
      <Text style={[s.mainTitleSub, { color: colors.textSecondary }]}>{t('yongsin.subtitle', lang)}</Text>
      <Text style={[s.subText, { color: colors.textSecondary }]}>{t('yongsin.subText', lang)}</Text>

      <View style={s.spacer16} />

      {/* 용신 배지 행 — 가로 배열 */}
      <View style={s.badgeRow}>
        {YONGSIN_LABELS.map((label) => {
          const element = yongsin[label.key] || '';
          const info = ELEMENT_INFO[element];
          const elColor = info ? info.color : '#999';
          const hanjaChar = info ? info.hanja : '—';
          const badgeSub = lang === 'ko' ? `(${label.hanja})` : `(${label.ko} · ${label.hanja})`;

          return (
            <View key={label.key} style={s.badgeItem}>
              <Text style={[s.badgeLabel, { color: colors.textSecondary }]}>{t(YONGSIN_I18N_KEY[label.key], lang)}</Text>
              <Text style={[s.badgeLabelSub, { color: colors.textSecondary }]}>{badgeSub}</Text>
              <Text style={[s.badgeHanja, { color: elColor }]}>{hanjaChar}</Text>
            </View>
          );
        })}
      </View>

      <View style={s.spacer20} />

      {/* 상세 리스트 */}
      {YONGSIN_LABELS.map((label) => {
        const element = yongsin[label.key] || '';
        const info = ELEMENT_INFO[element];
        const elText = info ? `${info.classical} (${info.hanja})` : element || '—';
        const elColor = info ? info.color : '#999';
        const desc = info ? t(ELEMENT_DESC_KEY[element] || '', lang) : '';
        const rowLabelSub = lang === 'ko' ? `(${label.hanja})` : `(${label.ko} · ${label.hanja})`;

        return (
          <View key={label.key} style={[s.row, { borderBottomColor: colors.border }]}>
            <View style={[s.bullet, { backgroundColor: elColor }]} />
            <View style={s.rowContent}>
              <Text style={[s.rowLabel, { color: colors.text }]}>
                {t(YONGSIN_I18N_KEY[label.key], lang)} {rowLabelSub}:
              </Text>
              <Text style={[s.rowValue, { color: elColor }]}>{elText}</Text>
              {desc ? <Text style={[s.rowDesc, { color: colors.textSecondary }]}>{desc}</Text> : null}
            </View>
          </View>
        );
      })}

      <View style={s.spacer16} />

      {/* 용신 체계 이상 경고 — 모든 모순 조합 감지 */}
      {yongsin.yongsin && yongsin.gisin && yongsin.yongsin === yongsin.gisin && (
        <View style={[s.anomalyBox, { borderLeftColor: '#E67E22', backgroundColor: colors.surface }]}>
          <Text style={[s.anomalyTitle, { color: '#E67E22' }]}>{t('yongsin.specialNote', lang)}</Text>
          <Text style={[s.anomalyText, { color: colors.text }]}>
            {t('yongsin.anomalyYongGi', lang, { element: ELEMENT_INFO[yongsin.yongsin]?.classical || yongsin.yongsin, hanja: yongsin.yongsin })}
          </Text>
        </View>
      )}
      {yongsin.huisin && yongsin.gusin && yongsin.huisin === yongsin.gusin && (
        <View style={[s.anomalyBox, { borderLeftColor: '#E67E22', backgroundColor: colors.surface }]}>
          <Text style={[s.anomalyTitle, { color: '#E67E22' }]}>{t('yongsin.specialNote', lang)}</Text>
          <Text style={[s.anomalyText, { color: colors.text }]}>
            {t('yongsin.anomalyHuiGu', lang, { element: ELEMENT_INFO[yongsin.huisin]?.classical || yongsin.huisin, hanja: yongsin.huisin })}
          </Text>
        </View>
      )}

      {/* 해설 */}
      <View style={[s.noteBox, { backgroundColor: colors.surface }]}>
        <Text style={[s.note, { color: colors.text }]}>
          {t('yongsin.noteText', lang)}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mainTitleSub: {
    fontFamily: FONT_CJK,
    fontSize: 12,
    marginBottom: 4,
  },
  subText: {
    fontFamily: FONT_BODY,
    fontSize: 12,
  },

  // 배지 행
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  badgeLabel: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    textAlign: 'center',
  },
  badgeLabelSub: {
    fontFamily: FONT_CJK,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeHanja: {
    fontFamily: FONT_CJK,
    fontSize: 30,
    fontWeight: 'bold',
  },

  // 상세 리스트
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomStyle: 'solid',
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: FONT_BODY,
    fontSize: 13,
    marginBottom: 2,
  },
  rowValue: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rowDesc: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    marginTop: 2,
  },

  anomalyBox: {
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    padding: 14,
    borderRadius: 4,
    marginBottom: 12,
  },
  anomalyTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  anomalyText: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    lineHeight: 1.6,
  },

  noteBox: {
    padding: 14,
    borderRadius: 4,
  },
  note: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 1.7,
  },

  spacer16: { height: 16 },
  spacer20: { height: 20 },
});
