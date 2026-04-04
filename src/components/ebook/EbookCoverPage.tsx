import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_TITLE, FONT_CJK, EBOOK_PAGE_SIZE } from './styles/ebookStyles';
import type { EbookEdition } from '@/lib/types/ebook';
import { EDITION_INFO } from '@/lib/types/ebook';

interface EbookCoverPageProps {
  edition: EbookEdition;
}

export function EbookCoverPage({ edition }: EbookCoverPageProps) {
  const info = EDITION_INFO[edition];

  return (
    <Page size={EBOOK_PAGE_SIZE} style={s.page}>
      <View style={s.content}>
        {/* 상단: 장식 */}
        <View style={s.topSection}>
          <Text style={s.topDeco}>四柱</Text>
          <View style={s.topLine} />
        </View>

        {/* 중앙: 타이틀 */}
        <View style={s.centerSection}>
          {edition === 'workbook' && (
            <View style={s.freeBadge}>
              <Text style={s.freeBadgeText}>FREE WORKBOOK</Text>
            </View>
          )}
          <Text style={s.mainTitle}>{info.title}</Text>
          <View style={s.titleLine} />
          <Text style={s.subtitle}>{info.subtitle}</Text>
        </View>

        {/* 하단: 저자 */}
        <View style={s.bottomSection}>
          <View style={s.authorLine} />
          <Text style={s.authorLabel}>Written by</Text>
          <Text style={s.authorName}>Ksaju Kim</Text>
          <Text style={s.authorDesc}>Certified Korean Saju Counselor</Text>
          <Text style={s.authorDesc}>15+ Years of Practice</Text>
          <View style={s.spacer} />
          <Text style={s.brand}>SajuMuse</Text>
        </View>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#1A1A2E',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    justifyContent: 'space-between',
  },

  // 상단
  topSection: {
    alignItems: 'center',
  },
  topDeco: {
    fontFamily: FONT_CJK,
    fontSize: 36,
    color: 'rgba(124, 58, 237, 0.3)',
    letterSpacing: 8,
    marginBottom: 12,
  },
  topLine: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.4)',
  },

  // 중앙
  centerSection: {
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 1.3,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  titleLine: {
    width: 80,
    height: 2,
    backgroundColor: '#F59E0B',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 1.5,
    letterSpacing: 0.3,
  },

  // 하단
  bottomSection: {
    alignItems: 'center',
  },
  authorLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 14,
  },
  authorLabel: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  authorName: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  authorDesc: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  spacer: {
    height: 20,
  },
  brand: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: 'rgba(124, 58, 237, 0.6)',
    letterSpacing: 3,
  },
  freeBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 14,
    alignSelf: 'center',
  },
  freeBadgeText: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1A1A2E',
    letterSpacing: 2,
  },
});
