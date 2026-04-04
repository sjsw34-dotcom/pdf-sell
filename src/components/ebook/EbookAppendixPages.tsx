import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { EBOOK_PAGE_SIZE, ebookStyles, FONT_BODY, FONT_TITLE, FONT_CJK, ANTI_LIGATURE, fixLigatures } from './styles/ebookStyles';
import { EbookPageFooter } from './EbookPageFooter';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_CYCLES } from '@/lib/constants/appendixTables';
import { GLOSSARY, GLOSSARY_CATEGORY_LABELS, type GlossaryEntry } from '@/lib/constants/glossary';

// ─── 공통 테이블 렌더러 ───

function AppendixTable({ headers, rows, altColor }: {
  headers: string[];
  rows: string[][];
  altColor?: string;
}) {
  const alt = altColor || '#FAFAFA';
  return (
    <View style={s.tableWrap}>
      <View style={s.tableHeaderRow}>
        {headers.map((h, i) => (
          <View key={i} style={[s.tableCell, { flex: 1 }]}>
            <Text style={s.tableHeaderText}>{h}</Text>
          </View>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={[s.tableRow, ri % 2 === 1 ? { backgroundColor: alt } : {}]}>
          {row.map((cell, ci) => (
            <View key={ci} style={[s.tableCell, { flex: 1 }]}>
              <Text style={s.tableCellText}>{fixLigatures(cell)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Appendix A: Quick Reference Tables ───

export function EbookAppendixA() {
  const stemsRows = HEAVENLY_STEMS.map(s => [s.hanja, s.romanization, s.element, s.polarity]);
  const branchRows = EARTHLY_BRANCHES.map(b => [b.hanja, b.romanization, b.element, b.animal, b.polarity]);
  const prodRows = ELEMENT_CYCLES.productive.map(c => [c.from, c.to, c.description]);
  const ctrlRows = ELEMENT_CYCLES.controlling.map(c => [c.from, c.to, c.description]);

  return (
    <Page size={EBOOK_PAGE_SIZE} style={ebookStyles.page} wrap>
      <Text style={ebookStyles.runningHead} fixed>APPENDIX</Text>

      <View style={s.appendixHeader}>
        <Text style={s.appendixLabel}>APPENDIX A</Text>
        <Text style={ebookStyles.h1}>Quick Reference Tables</Text>
        <View style={ebookStyles.dividerThick} />
      </View>

      {/* Heavenly Stems */}
      <Text style={ebookStyles.h3}>The Ten Heavenly Stems (天干)</Text>
      <AppendixTable
        headers={['Hanja', 'Romanization', 'Element', 'Polarity']}
        rows={stemsRows}
      />

      {/* Earthly Branches */}
      <Text style={[ebookStyles.h3, { marginTop: 20 }]}>The Twelve Earthly Branches (地支)</Text>
      <AppendixTable
        headers={['Hanja', 'Romanization', 'Element', 'Animal', 'Polarity']}
        rows={branchRows}
      />

      {/* Productive Cycle */}
      <Text style={[ebookStyles.h3, { marginTop: 20 }]}>Productive Cycle (相生)</Text>
      <AppendixTable
        headers={['From', 'To', 'Description']}
        rows={prodRows}
        altColor="#F0FDF4"
      />

      {/* Controlling Cycle */}
      <Text style={[ebookStyles.h3, { marginTop: 16 }]}>Controlling Cycle (相剋)</Text>
      <AppendixTable
        headers={['From', 'To', 'Description']}
        rows={ctrlRows}
        altColor="#FEF2F2"
      />

      <EbookPageFooter />
    </Page>
  );
}

// ─── Appendix B: Glossary ───

export function EbookAppendixB() {
  const categories = [...new Set(GLOSSARY.map(g => g.category))] as GlossaryEntry['category'][];

  return (
    <Page size={EBOOK_PAGE_SIZE} style={ebookStyles.page} wrap>
      <Text style={ebookStyles.runningHead} fixed>APPENDIX</Text>

      <View style={s.appendixHeader}>
        <Text style={s.appendixLabel}>APPENDIX B</Text>
        <Text style={ebookStyles.h1}>Glossary</Text>
        <View style={ebookStyles.dividerThick} />
      </View>

      {categories.map((cat) => {
        const entries = GLOSSARY.filter(g => g.category === cat);
        const label = GLOSSARY_CATEGORY_LABELS[cat];
        const rows = entries.map(e => [e.english, e.romanization, e.korean]);

        return (
          <View key={cat} style={s.glossarySection}>
            <Text style={ebookStyles.h3}>{label}</Text>
            <AppendixTable
              headers={['English', 'Romanization', 'Korean + Hanja']}
              rows={rows}
            />
          </View>
        );
      })}

      <EbookPageFooter />
    </Page>
  );
}

// ─── Appendix C: Recommended Resources ───

const RESOURCES = {
  books: [
    { title: 'The Four Pillars of Destiny', author: 'Lily Chung', note: 'Comprehensive English-language Four Pillars reference' },
    { title: 'BaZi — The Destiny Code', author: 'Joey Yap', note: 'Accessible introduction to Chinese Four Pillars' },
    { title: 'The Five Elements', author: 'Dondi Dahlin', note: 'Practical guide to element archetypes in daily life' },
    { title: 'Korean Fortune Telling (한국의 점복)', author: 'Various scholars', note: 'Academic perspectives on Korean divination traditions' },
  ],
  online: [
    { name: 'SajuMuse (sajumuse.com)', desc: 'Free birth chart calculator + AI-powered mini reading. Premium 60+ page reports by certified Saju masters.' },
    { name: 'Korean Saju Community Forums', desc: 'Discussion boards for practitioners and enthusiasts sharing chart analysis and interpretation techniques.' },
    { name: 'Ten Thousand Year Calendar (만세력)', desc: 'Essential tool for looking up Heavenly Stems and Earthly Branches for any date. Available as apps and online calculators.' },
  ],
  practice: [
    'Start by reading your own chart and the charts of family members you know well.',
    'Keep a Saju journal: track Grand Fortune and Annual Fortune shifts against real events.',
    'Practice identifying the Day Master and counting elements before attempting full interpretation.',
    'Compare your readings with those generated by sajumuse.com to calibrate your understanding.',
    'Join study groups or online communities to discuss charts and refine your skills.',
  ],
};

export function EbookAppendixC() {
  return (
    <Page size={EBOOK_PAGE_SIZE} style={ebookStyles.page} wrap>
      <Text style={ebookStyles.runningHead} fixed>APPENDIX</Text>

      <View style={s.appendixHeader}>
        <Text style={s.appendixLabel}>APPENDIX C</Text>
        <Text style={ebookStyles.h1}>Recommended Resources</Text>
        <View style={ebookStyles.dividerThick} />
      </View>

      {/* Books */}
      <Text style={ebookStyles.h2}>Books for Further Study</Text>
      {RESOURCES.books.map((book, i) => (
        <View key={i} style={s.resourceItem}>
          <Text style={s.resourceTitle}>{fixLigatures(book.title)}</Text>
          <Text style={s.resourceAuthor}>by {fixLigatures(book.author)}</Text>
          <Text style={ebookStyles.bodySmall}>{fixLigatures(book.note)}</Text>
        </View>
      ))}

      {/* Online */}
      <Text style={[ebookStyles.h2, { marginTop: 16 }]}>Online Resources</Text>
      {RESOURCES.online.map((res, i) => (
        <View key={i} style={s.resourceItem}>
          <Text style={s.resourceTitle}>{fixLigatures(res.name)}</Text>
          <Text style={ebookStyles.bodySmall}>{fixLigatures(res.desc)}</Text>
        </View>
      ))}

      {/* Practice Tips */}
      <Text style={[ebookStyles.h2, { marginTop: 16 }]}>Practice Tips</Text>
      {RESOURCES.practice.map((tip, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bulletDot}>{i + 1}.</Text>
          <Text style={[ebookStyles.body, s.bulletText]}>{fixLigatures(tip)}</Text>
        </View>
      ))}

      <EbookPageFooter />
    </Page>
  );
}

// ─── 스타일 ───

const s = StyleSheet.create({
  appendixHeader: {
    marginBottom: 16,
  },
  appendixLabel: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#7C3AED',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  // 테이블
  tableWrap: {
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 2,
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: ANTI_LIGATURE,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
  },
  tableCell: {
    paddingHorizontal: 4,
  },
  tableCellText: {
    fontFamily: FONT_BODY,
    fontSize: 8,
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 1.3,
    letterSpacing: ANTI_LIGATURE,
  },
  // Glossary
  glossarySection: {
    marginBottom: 12,
  },
  // Resources
  resourceItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  resourceTitle: {
    fontFamily: FONT_TITLE,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2D2D4E',
    letterSpacing: ANTI_LIGATURE,
  },
  resourceAuthor: {
    fontFamily: FONT_BODY,
    fontSize: 9,
    color: '#7C3AED',
    marginBottom: 2,
    letterSpacing: ANTI_LIGATURE,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 4,
  },
  bulletDot: {
    fontFamily: FONT_BODY,
    fontSize: 11,
    color: '#7C3AED',
    width: 18,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    marginBottom: 2,
  },
});
