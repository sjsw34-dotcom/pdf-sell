import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, EBOOK_PAGE_SIZE } from './styles/ebookStyles';
import { EbookPageFooter } from './EbookPageFooter';
import type { EbookEdition } from '@/lib/types/ebook';

interface EbookEndingPageProps {
  edition: EbookEdition;
}

export function EbookEndingPage({ edition }: EbookEndingPageProps) {
  const isKdp = edition === 'kdp';
  const isWorkbook = edition === 'workbook';

  return (
    <Page size={EBOOK_PAGE_SIZE} style={s.page}>
      <View style={s.content}>
        <View style={s.topSpace} />

        {isWorkbook ? (
          // Workbook: 3단계 CTA
          <>
            <Text style={s.mainTitle}>You Built Your Chart!</Text>
            <Text style={s.mainSubtitle}>Now take the next step on your Saju journey</Text>
            <View style={s.divider} />

            <View style={s.ctaBox}>
              <Text style={s.ctaMain}>Get Your Chart Read by a Master</Text>
              <Text style={s.ctaSub}>
                A certified Saju counselor will analyze your complete birth chart in a personalized 60+ page Premium Report.
              </Text>
              <Text style={s.ctaUrl}>sajumuse.com/order</Text>
            </View>

            <View style={s.ctaBox}>
              <Text style={s.ctaMain}>Go Deeper with the Theory</Text>
              <Text style={s.ctaSub}>
                Korean Saju Decoded (Kindle Edition) — 15 chapters of foundations, elements, and Ten Gods. Korean Saju Decoded (Master Edition) — all 28 chapters including fortune cycles, chart reading, and advanced topics.
              </Text>
              <Text style={s.ctaUrl}>sajumuse.com/ebook</Text>
            </View>

            <View style={s.authorBox}>
              <Text style={s.authorName}>Ksaju Kim</Text>
              <Text style={s.authorDesc}>Certified Korean Saju Counselor</Text>
              <Text style={s.authorDesc}>15+ Years of Practice</Text>
              <View style={{ height: 8 }} />
              <Text style={s.authorDesc}>Instagram & Threads: @sajumuse</Text>
            </View>
          </>
        ) : isKdp ? (
          // KDP: "What's Next?" 업그레이드 CTA
          <>
            <Text style={s.mainTitle}>What{`'`}s Next?</Text>
            <Text style={s.mainSubtitle}>Your Journey Has Just Begun</Text>
            <View style={s.divider} />

            <Text style={s.sectionLabel}>WHAT YOU{`'`}VE LEARNED</Text>
            <View style={s.checkList}>
              {[
                'The foundations and history of Saju',
                'The Five Elements and their interactions',
                'How to find your Useful God (用神)',
                'All 10 Ten Gods — complete profiles',
              ].map((item, i) => (
                <View key={i} style={s.checkRow}>
                  <Text style={s.checkMark}>✓</Text>
                  <Text style={s.checkText}>{item}</Text>
                </View>
              ))}
            </View>

            <Text style={s.sectionLabel}>WHAT AWAITS IN THE FULL EDITION</Text>
            <View style={s.lockList}>
              {[
                'Twelve Life Stages — your energy cycle',
                'Grand Fortune, Annual & Monthly Fortune — timing your life',
                'Complete chart reading — start to finish',
                'Love compatibility analysis',
                '3 Full Case Studies with real charts',
              ].map((item, i) => (
                <View key={i} style={s.lockRow}>
                  <Text style={s.lockIcon}>→</Text>
                  <Text style={s.lockText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={s.ctaBox}>
              <Text style={s.ctaMain}>Get the Master Edition</Text>
              <Text style={s.ctaUrl}>sajumuse.com/ebook</Text>
              <View style={s.ctaDivider} />
              <Text style={s.ctaSub}>Or get YOUR chart read by a certified master</Text>
              <Text style={s.ctaUrl}>sajumuse.com/order</Text>
            </View>
          </>
        ) : (
          // Full Edition: 감사 + 개인 리포트 CTA
          <>
            <Text style={s.mainTitle}>Thank You</Text>
            <Text style={s.mainSubtitle}>for reading Korean Saju Decoded</Text>
            <View style={s.divider} />

            <Text style={s.bodyText}>
              You now have the knowledge to read and interpret any Saju chart. The Four Pillars hold centuries of Korean wisdom — a system that has guided millions of lives.
            </Text>

            <Text style={s.bodyText}>
              Remember: Saju does not dictate your fate. It illuminates your tendencies, timing, and potential. What you do with that knowledge is entirely up to you.
            </Text>

            <View style={s.ctaBox}>
              <Text style={s.ctaMain}>Want an Expert to Read YOUR Chart?</Text>
              <Text style={s.ctaSub}>
                Get a personalized 60+ page Premium Report, crafted by a certified Saju master with 15+ years of experience.
              </Text>
              <Text style={s.ctaUrl}>sajumuse.com/order</Text>
            </View>

            <View style={s.authorBox}>
              <Text style={s.authorName}>Ksaju Kim</Text>
              <Text style={s.authorDesc}>Certified Korean Saju Counselor</Text>
              <Text style={s.authorDesc}>Hundreds of verified readings</Text>
            </View>
          </>
        )}
      </View>

      <EbookPageFooter />
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: '#FAFAFA',
    paddingTop: 43,
    paddingBottom: 40,
    paddingLeft: 54,
    paddingRight: 36,
  },
  content: { flex: 1 },
  topSpace: { height: 60 },

  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  mainSubtitle: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    color: '#666666',
    marginBottom: 8,
    letterSpacing: ANTI_LIGATURE,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#7C3AED',
    marginBottom: 20,
  },

  sectionLabel: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#999999',
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 14,
  },

  // 체크리스트 (배운 것)
  checkList: { marginBottom: 8 },
  checkRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 4 },
  checkMark: { fontFamily: FONT_BODY, fontSize: 10, color: '#22C55E', width: 16 },
  checkText: { fontFamily: FONT_BODY, fontSize: 9.5, color: '#444444', flex: 1, letterSpacing: ANTI_LIGATURE },

  // 잠금 리스트 (아직 안 배운 것)
  lockList: { marginBottom: 12 },
  lockRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 4 },
  lockIcon: { fontFamily: FONT_BODY, fontSize: 10, color: '#7C3AED', width: 16 },
  lockText: { fontFamily: FONT_BODY, fontSize: 9.5, color: '#555555', flex: 1, letterSpacing: ANTI_LIGATURE },

  // CTA 박스
  ctaBox: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderStyle: 'solid',
    borderRadius: 6,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  ctaMain: {
    fontFamily: FONT_TITLE,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 6,
  },
  ctaSub: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 1.5,
    letterSpacing: ANTI_LIGATURE,
  },
  ctaUrl: {
    fontFamily: FONT_BODY,
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  ctaDivider: {
    width: 30,
    height: 0.5,
    backgroundColor: '#D0D0E0',
    marginVertical: 8,
  },

  // 본문
  bodyText: {
    fontFamily: FONT_BODY,
    fontSize: 10.5,
    color: '#444444',
    lineHeight: 1.7,
    marginBottom: 10,
    letterSpacing: ANTI_LIGATURE,
  },

  // 저자 박스
  authorBox: {
    alignItems: 'center',
    marginTop: 10,
  },
  authorName: {
    fontFamily: FONT_TITLE,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  authorDesc: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#888888',
    marginBottom: 2,
  },
});
