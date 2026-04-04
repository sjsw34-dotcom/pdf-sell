import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, EBOOK_PAGE_SIZE } from './styles/ebookStyles';
import { EbookPageFooter } from './EbookPageFooter';
import type { EbookEdition } from '@/lib/types/ebook';
import { EBOOK_PARTS, EBOOK_CHAPTERS, WORKBOOK_PARTS, WORKBOOK_CHAPTERS, EDITION_INFO } from '@/lib/types/ebook';

interface EbookTocPageProps {
  edition: EbookEdition;
}

export function EbookTocPage({ edition }: EbookTocPageProps) {
  const includedChapters = EDITION_INFO[edition].chapters;
  const isKdp = edition === 'kdp';
  const isWorkbook = edition === 'workbook';
  const parts = isWorkbook ? WORKBOOK_PARTS : EBOOK_PARTS;
  const allChapters = isWorkbook ? WORKBOOK_CHAPTERS : EBOOK_CHAPTERS;

  return (
    <Page size={EBOOK_PAGE_SIZE} style={s.page} wrap>
      {/* 헤더 */}
      <View style={s.header}>
        <Text style={s.tocTitle}>Contents</Text>
        <View style={s.divider} />
      </View>

      {/* 파트별 챕터 목록 */}
      {parts.map((part) => {
        const partChapters = allChapters.filter(
          (ch) => part.chapters.includes(ch.number) && includedChapters.includes(ch.number),
        );
        if (partChapters.length === 0) return null;

        return (
          <View key={part.number} style={s.partGroup} wrap={false}>
            <View style={s.partRow}>
              <Text style={s.partLabel}>Part {part.number}</Text>
              <Text style={s.partTitle}>{part.title}</Text>
            </View>
            {partChapters.map((ch) => (
              <View key={ch.number} style={s.chapterRow}>
                <Text style={s.chapterNumber}>{ch.number}.</Text>
                <Text style={s.chapterTitle}>{ch.title}</Text>
              </View>
            ))}
          </View>
        );
      })}

      {/* KDP: 잠긴 파트 미리보기 */}
      {isKdp && (
        <View style={s.lockedSection} wrap={false}>
          <View style={s.dividerThin} />
          <Text style={s.lockedLabel}>AVAILABLE IN THE FULL EDITION</Text>
          {EBOOK_PARTS.filter(p => !includedChapters.includes(p.chapters[0])).map((part) => (
            <View key={part.number} style={s.lockedRow}>
              <Text style={s.lockedIcon}>🔒</Text>
              <Text style={s.lockedText}>Part {part.number}: {part.title}</Text>
            </View>
          ))}
          <Text style={s.lockedCta}>→ sajumuse.com/ebook</Text>
        </View>
      )}

      {/* Appendix (워크북 제외) */}
      {!isWorkbook && (
        <View style={s.partGroup} wrap={false}>
          <View style={s.partRow}>
            <Text style={s.partLabel}> </Text>
            <Text style={s.partTitle}>Appendix</Text>
          </View>
          <View style={s.chapterRow}>
            <Text style={s.chapterNumber}>A.</Text>
            <Text style={s.chapterTitle}>Quick Reference Tables</Text>
          </View>
          <View style={s.chapterRow}>
            <Text style={s.chapterNumber}>B.</Text>
            <Text style={s.chapterTitle}>Glossary</Text>
          </View>
          <View style={s.chapterRow}>
            <Text style={s.chapterNumber}>C.</Text>
            <Text style={s.chapterTitle}>Recommended Resources</Text>
          </View>
        </View>
      )}

      <EbookPageFooter />
    </Page>
  );
}

const s = StyleSheet.create({
  page: {
    fontFamily: FONT_BODY,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 40,
    paddingLeft: 54,
    paddingRight: 36,
  },
  header: {
    marginBottom: 20,
  },
  tocTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
    letterSpacing: 1,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#7C3AED',
  },

  // Part 그룹
  partGroup: {
    marginBottom: 14,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    marginTop: 6,
  },
  partLabel: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#7C3AED',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    width: 40,
  },
  partTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D2D4E',
    letterSpacing: ANTI_LIGATURE,
  },

  // 챕터
  chapterRow: {
    flexDirection: 'row',
    paddingLeft: 40,
    marginBottom: 3,
  },
  chapterNumber: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#888888',
    width: 22,
    letterSpacing: ANTI_LIGATURE,
  },
  chapterTitle: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#444444',
    flex: 1,
    letterSpacing: ANTI_LIGATURE,
  },

  // 잠긴 섹션 (KDP)
  lockedSection: {
    marginTop: 14,
    marginBottom: 14,
  },
  dividerThin: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  lockedLabel: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#999999',
    letterSpacing: 2,
    marginBottom: 8,
  },
  lockedRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  lockedIcon: {
    fontSize: 8,
    width: 16,
  },
  lockedText: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#AAAAAA',
    letterSpacing: ANTI_LIGATURE,
  },
  lockedCta: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#7C3AED',
    marginTop: 8,
    paddingLeft: 8,
  },
});
