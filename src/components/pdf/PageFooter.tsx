import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { FONT_BODY } from './styles/pdfStyles';

interface PageFooterProps {
  color?: string;
}

/**
 * 모든 페이지 하단에 fixed로 배치되는 브랜드 푸터 + 페이지 번호.
 * <Page> 안에 넣으면 됨.
 * "SajuMuse                              3"
 */
export function PageFooter({ color = '#AAAAAA' }: PageFooterProps) {
  return (
    <View style={s.footer} fixed>
      <Text style={[s.brand, { color }]}>SajuMuse</Text>
      <Text
        style={[s.pageNum, { color }]}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    borderTopStyle: 'solid',
    paddingTop: 6,
  },
  brand: {
    fontFamily: FONT_BODY,
    fontSize: 7,
    letterSpacing: 1,
  },
  pageNum: {
    fontFamily: FONT_BODY,
    fontSize: 7,
  },
});
