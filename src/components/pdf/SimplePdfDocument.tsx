import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { ThemeCode } from '@/lib/types/theme';
import { getThemeStyles } from './styles/themes';
import { THEMES } from '@/lib/constants/themes';
import { PageFooter } from './PageFooter';
import { BrandContext } from './BrandContext';
import { FONT_BODY, FONT_TITLE, FONT_CJK } from './styles/pdfStyles';

// ─── 마크다운 제거 ───

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .trim();
}

// ─── Props ───

export interface SimplePdfProps {
  clientName: string;
  sections: { title?: string; body: string }[];
  theme: ThemeCode;
  coverImage: string | null;
  showBrand?: boolean;
}

export function SimplePdfDocument({
  clientName,
  sections,
  theme,
  coverImage,
  showBrand = true,
}: SimplePdfProps) {
  const t = getThemeStyles(theme);
  const colors = THEMES[theme].colors;
  const hasImage = coverImage && coverImage.startsWith('data:');

  return (
    <BrandContext.Provider value={showBrand}>
      <Document
        title={`${clientName || 'Guest'} — Saju Reading`}
        author={showBrand ? 'SajuMuse' : 'Saju Destiny Analysis'}
        subject="Four Pillars Destiny Analysis"
      >
        {/* ══════ 커버 페이지 ══════ */}
        <Page size="A4" style={cover.page}>
          {hasImage && <Image src={coverImage} style={cover.bgImage} />}
          {hasImage && <View style={cover.overlay} />}
          <View style={[cover.content, hasImage ? {} : { backgroundColor: colors.primary }]}>
            <View style={cover.topSection}>
              {showBrand && <Text style={cover.brandSmall}>SajuMuse</Text>}
            </View>
            <View style={cover.centerSection}>
              {showBrand && <Text style={cover.brandLarge}>SajuMuse</Text>}
              <View style={cover.line} />
              <Text style={cover.subtitleKo}>사주팔자 · Four Pillars of Destiny</Text>
              <View style={cover.spacer} />
              <Text style={cover.mainTitle}>DESTINY ANALYSIS</Text>
              <Text style={cover.mainTitle}>REPORT</Text>
              <View style={{ height: 12 }} />
              <Text style={cover.subtitleKo2}>운명 분석서</Text>
              <View style={cover.line} />
            </View>
            <View style={cover.bottomSection}>
              <Text style={cover.preparedFor}>Prepared for</Text>
              <Text style={cover.clientName}>{clientName || 'Valued Guest'}</Text>
              <View style={{ height: 24 }} />
              <View style={cover.footerLine} />
              {showBrand && <Text style={cover.footerText}>SajuMuse · SajuMuse</Text>}
            </View>
          </View>
        </Page>

        {/* ══════ 본문 섹션 ══════ */}
        {sections.map((section, idx) => {
          const safeContent = stripMarkdown(section.body || '');
          const paragraphs = safeContent.split(/\n\n+/).filter((p) => p.trim() !== '');
          const title = section.title || (sections.length > 1 ? `Chapter ${idx + 1}` : undefined);

          return (
            <Page key={idx} size="A4" style={t.page} wrap>
              <View style={body.header}>
                {title && <Text style={t.title}>{title}</Text>}
                <View style={t.divider} />
              </View>
              <View style={body.content} wrap>
                {paragraphs.length > 0
                  ? paragraphs.map((p, i) => <Text key={i} style={t.body}>{p.trim()}</Text>)
                  : <Text style={t.body}> </Text>
                }
              </View>
              <PageFooter color={colors.textSecondary} />
            </Page>
          );
        })}

        {/* ══════ 클로징 페이지 ══════ */}
        <Page size="A4" style={[closing.page, { backgroundColor: colors.background }]}>
          <View style={closing.center}>
            <Text style={[closing.label, { color: colors.secondary }]}>Closing Thoughts</Text>
            <View style={[closing.line, { backgroundColor: colors.border }]} />
            <Text style={[closing.main, { color: colors.primary }]}>
              {clientName || 'Dear reader'}, your Saju analysis is now complete.
            </Text>
            <View style={{ height: 16 }} />
            <Text style={[closing.sub, { color: colors.text }]}>
              May this report serve as a guiding light on your journey.
            </Text>
            <View style={[closing.line, { backgroundColor: colors.border }]} />
            {showBrand && <Text style={[closing.brand, { color: colors.primary }]}>SajuMuse</Text>}
          </View>
          <View style={[closing.footer, { borderTopColor: colors.border }]}>
            <Text style={[closing.footerText, { color: colors.textSecondary }]}>{showBrand ? 'SajuMuse' : ' '}</Text>
          </View>
        </Page>

        {/* ══════ 뒷표지 ══════ */}
        <Page size="A4" style={{ padding: 0 }}>
          <View style={[backCover.wrap, { backgroundColor: colors.primary }]}>
            {showBrand && <Text style={backCover.brand}>SajuMuse</Text>}
            <View style={backCover.line} />
            <Text style={backCover.sub}>사주팔자 · Four Pillars of Destiny</Text>
            <View style={{ height: 24 }} />
            <Text style={backCover.title}>DESTINY ANALYSIS</Text>
            <Text style={backCover.title}>REPORT</Text>
            <View style={{ height: 12 }} />
            <Text style={backCover.subKo}>운명 분석서</Text>
            <View style={backCover.line} />
            <View style={{ height: 24 }} />
            <Text style={backCover.prepared}>Prepared for</Text>
            <Text style={backCover.name}>{clientName || 'Guest'}</Text>
            <View style={{ height: 24 }} />
            <View style={backCover.footerLine} />
            {showBrand && <Text style={backCover.footer}>SajuMuse</Text>}
          </View>
        </Page>
      </Document>
    </BrandContext.Provider>
  );
}

// ─── 스타일 ───

const cover = StyleSheet.create({
  page: { padding: 0, position: 'relative' },
  bgImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' },
  content: { flex: 1, paddingTop: 50, paddingBottom: 40, paddingLeft: 50, paddingRight: 50, justifyContent: 'space-between', position: 'relative' },
  topSection: { alignItems: 'flex-start' },
  brandSmall: { fontFamily: FONT_BODY, fontSize: 11, color: '#FFFFFF', letterSpacing: 2, opacity: 0.7 },
  centerSection: { alignItems: 'center' },
  brandLarge: { fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 3, marginBottom: 16 },
  line: { width: 60, height: 1, backgroundColor: 'rgba(255,255,255,0.4)', marginTop: 12, marginBottom: 12 },
  subtitleKo: { fontFamily: FONT_CJK, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  mainTitle: { fontFamily: FONT_TITLE, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 5, textAlign: 'center', lineHeight: 1.3 },
  subtitleKo2: { fontFamily: FONT_CJK, fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 2 },
  spacer: { height: 24 },
  bottomSection: { alignItems: 'center' },
  preparedFor: { fontFamily: FONT_BODY, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
  clientName: { fontFamily: FONT_TITLE, fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 0.5, textAlign: 'center', maxWidth: '100%' },
  footerLine: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 10 },
  footerText: { fontFamily: FONT_BODY, fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
});

const body = StyleSheet.create({
  header: { marginBottom: 16 },
  content: { flex: 1, paddingBottom: 30 },
});

const closing = StyleSheet.create({
  page: { paddingTop: 50, paddingBottom: 40, paddingLeft: 50, paddingRight: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontFamily: FONT_BODY, fontSize: 12, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 },
  line: { width: 50, height: 1, marginBottom: 24 },
  main: { fontFamily: FONT_TITLE, fontSize: 20, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.6 },
  sub: { fontFamily: FONT_BODY, fontSize: 14, textAlign: 'center', lineHeight: 1.7, marginBottom: 6 },
  brand: { fontFamily: FONT_TITLE, fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  footer: { alignItems: 'center', paddingTop: 10, borderTopWidth: 0.5, borderTopStyle: 'solid' },
  footerText: { fontFamily: FONT_BODY, fontSize: 9, letterSpacing: 1 },
});

const backCover = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  brand: { fontFamily: FONT_TITLE, fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 3, marginBottom: 12 },
  line: { width: 50, height: 1, backgroundColor: 'rgba(255,255,255,0.4)', marginTop: 10, marginBottom: 10 },
  sub: { fontFamily: FONT_CJK, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  title: { fontFamily: FONT_TITLE, fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 4, textAlign: 'center', lineHeight: 1.3 },
  subKo: { fontFamily: FONT_CJK, fontSize: 13, color: 'rgba(255,255,255,0.8)', letterSpacing: 2 },
  prepared: { fontFamily: FONT_BODY, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 },
  name: { fontFamily: FONT_TITLE, fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', maxWidth: '100%' },
  footerLine: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 8 },
  footer: { fontFamily: FONT_BODY, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
});
