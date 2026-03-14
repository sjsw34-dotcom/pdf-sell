import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import type { PillarData, Pillar as PillarType, HiddenStemEntry } from '@/lib/types/saju';
import { THEMES } from '@/lib/constants/themes';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

// ─── 3-Layer 용어 매핑 (차트용: natural 축약 | original) ───

const TEN_GOD_EN: Record<string, string> = {
  '비견': 'Self & Indep.',
  '겁재': 'Competition',
  '식신': 'Creative Expr.',
  '상관': 'Bold Innov.',
  '편재': 'Unexp. Fortune',
  '정재': 'Steady Prosp.',
  '편관': 'Pressure',
  '정관': 'Honor & Resp.',
  '편인': 'Unconv. Wisdom',
  '정인': 'Knowledge',
  '일간(나)': 'Day Master',
};

const TWELVE_STAGE_EN: Record<string, string> = {
  '장생': 'Birth', '목욕': 'Bathing', '관대': 'Crowning',
  '건록': 'Prosperity', '제왕': 'Emperor', '쇠': 'Decline',
  '병': 'Illness', '사': 'Death', '묘': 'Tomb',
  '절': 'Extinction', '태': 'Conception', '양': 'Nurturing',
};

const STRENGTH_EN: Record<string, string> = {
  '극신약': 'Very Gentle', '신약': 'Gentle', '중화': 'Balanced',
  '신강': 'Strong', '극신강': 'Very Strong',
  '득지': 'Well-Rooted', '실지': 'Seeking Roots',
  '득령': 'In Season', '실령': 'Off-Season',
  '득세': 'Well-Supported', '실세': 'Seeking Allies',
};

interface SajuChartProps {
  theme: ThemeCode;
  pillar: PillarData;
}

export function SajuChart({ theme, pillar }: SajuChartProps) {
  const colors = THEMES[theme].colors;
  const s = styles(colors);

  const pillars: { label: string; labelEn: string; data: PillarType }[] = [
    { label: '시주', labelEn: 'Hour', data: pillar.hourPillar },
    { label: '일주', labelEn: 'Day', data: pillar.dayPillar },
    { label: '월주', labelEn: 'Month', data: pillar.monthPillar },
    { label: '년주', labelEn: 'Year', data: pillar.yearPillar },
  ];

  function hiddenStemText(entry: HiddenStemEntry | null): string {
    if (!entry) return '—';
    return `${entry.stem} ${TEN_GOD_EN[entry.tenGod] ?? entry.tenGod}`;
  }

  return (
    <View style={s.container}>
      <Text style={s.chartTitle}>THE DESTINY CHART</Text>
      <Text style={s.chartSubtitle}>四柱八字 · Four Pillars of Destiny</Text>

      {/* 헤더 행 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}> </Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.headerCol}>
            <Text style={s.headerMain}>{p.labelEn}</Text>
            <Text style={s.headerSub}>{p.label}</Text>
          </View>
        ))}
      </View>

      {/* 천간십성 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Stem God</Text>
          <Text style={s.labelSub}>천간십성</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellSmall}>{TEN_GOD_EN[p.data.stemTenGod] ?? p.data.stemTenGod}</Text>
            <Text style={s.cellTiny}>{p.data.stemTenGod}</Text>
          </View>
        ))}
      </View>

      {/* 천간 한자 (큰 글씨) */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Heaven</Text>
          <Text style={s.labelSub}>천간</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={[s.cell, s.cellHighlight]}>
            <Text style={s.cellLarge}>{p.data.heavenlyStem}</Text>
          </View>
        ))}
      </View>

      {/* 지지 한자 (큰 글씨) */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Earth</Text>
          <Text style={s.labelSub}>지지</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={[s.cell, s.cellHighlight]}>
            <Text style={s.cellLarge}>{p.data.earthlyBranch}</Text>
          </View>
        ))}
      </View>

      {/* 지지십성 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Branch God</Text>
          <Text style={s.labelSub}>지지십성</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellSmall}>{TEN_GOD_EN[p.data.branchTenGod] ?? p.data.branchTenGod}</Text>
            <Text style={s.cellTiny}>{p.data.branchTenGod}</Text>
          </View>
        ))}
      </View>

      {/* 십이운성 봉법 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Life Stage</Text>
          <Text style={s.labelSub}>운성(봉)</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellSmall}>{TWELVE_STAGE_EN[p.data.twelveStage] ?? p.data.twelveStage}</Text>
            <Text style={s.cellTiny}>{p.data.twelveStage}</Text>
          </View>
        ))}
      </View>

      {/* 십이운성 거법 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Life Stage</Text>
          <Text style={s.labelSub}>운성(거)</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellSmall}>{TWELVE_STAGE_EN[p.data.twelveStageReverse] ?? p.data.twelveStageReverse}</Text>
            <Text style={s.cellTiny}>{p.data.twelveStageReverse}</Text>
          </View>
        ))}
      </View>

      {/* 지장간 여기 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Hidden 1</Text>
          <Text style={s.labelSub}>여기</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellTiny}>{hiddenStemText(p.data.hiddenStems.yeogi)}</Text>
          </View>
        ))}
      </View>

      {/* 지장간 중기 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Hidden 2</Text>
          <Text style={s.labelSub}>중기</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellTiny}>{hiddenStemText(p.data.hiddenStems.junggi)}</Text>
          </View>
        ))}
      </View>

      {/* 지장간 본기 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Hidden 3</Text>
          <Text style={s.labelSub}>본기</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellTiny}>{hiddenStemText(p.data.hiddenStems.bongi)}</Text>
          </View>
        ))}
      </View>

      {/* 납음오행 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Naeum</Text>
          <Text style={s.labelSub}>납음오행</Text>
        </View>
        {pillars.map((p) => (
          <View key={p.labelEn} style={s.cell}>
            <Text style={s.cellTiny}>{p.data.napEumOheng}</Text>
          </View>
        ))}
      </View>

      {/* 강약 */}
      <View style={s.row}>
        <View style={s.labelCol}>
          <Text style={s.labelText}>Strength</Text>
          <Text style={s.labelSub}>강약</Text>
        </View>
        <View style={s.cell}>
          <Text style={s.cellSmall}>{STRENGTH_EN[pillar.strength] ?? pillar.strength}</Text>
          <Text style={s.cellTiny}>{pillar.strength}</Text>
        </View>
        <View style={s.cell}>
          <Text style={s.cellSmall}>{STRENGTH_EN[pillar.strengthDetails.deukji] ?? pillar.strengthDetails.deukji}</Text>
          <Text style={s.cellTiny}>{pillar.strengthDetails.deukji}</Text>
        </View>
        <View style={s.cell}>
          <Text style={s.cellSmall}>{STRENGTH_EN[pillar.strengthDetails.deukryeong] ?? pillar.strengthDetails.deukryeong}</Text>
          <Text style={s.cellTiny}>{pillar.strengthDetails.deukryeong}</Text>
        </View>
        <View style={s.cell}>
          <Text style={s.cellSmall}>{STRENGTH_EN[pillar.strengthDetails.deukse] ?? pillar.strengthDetails.deukse}</Text>
          <Text style={s.cellTiny}>{pillar.strengthDetails.deukse}</Text>
        </View>
      </View>
    </View>
  );
}

function styles(colors: { primary: string; secondary: string; background: string; surface: string; text: string; textSecondary: string; border: string }) {
  return StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    chartTitle: {
      fontFamily: FONT_TITLE,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 2,
    },
    chartSubtitle: {
      fontFamily: FONT_CJK,
      fontSize: 9,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
    },
    labelCol: {
      width: 72,
      backgroundColor: colors.primary,
      padding: 5,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
      borderBottomStyle: 'solid',
    },
    labelText: {
      fontFamily: FONT_BODY,
      fontSize: 7,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    labelSub: {
      fontFamily: FONT_CJK,
      fontSize: 6,
      color: colors.secondary,
    },
    headerCol: {
      flex: 1,
      backgroundColor: colors.primary,
      padding: 6,
      alignItems: 'center',
      borderLeftWidth: 1,
      borderLeftColor: colors.background,
      borderLeftStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
      borderBottomStyle: 'solid',
    },
    headerMain: {
      fontFamily: FONT_BODY,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    headerSub: {
      fontFamily: FONT_CJK,
      fontSize: 7,
      color: colors.secondary,
    },
    cell: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderBottomStyle: 'solid',
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
      borderLeftStyle: 'solid',
    },
    cellHighlight: {
      backgroundColor: colors.background,
      paddingTop: 8,
      paddingBottom: 8,
    },
    cellLarge: {
      fontFamily: FONT_CJK,
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    cellSmall: {
      fontFamily: FONT_BODY,
      fontSize: 7,
      color: colors.text,
      textAlign: 'center',
    },
    cellTiny: {
      fontFamily: FONT_CJK,
      fontSize: 6,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 1,
    },
  });
}
