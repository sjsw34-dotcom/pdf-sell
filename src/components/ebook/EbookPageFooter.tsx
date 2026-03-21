import React from 'react';
import { Text } from '@react-pdf/renderer';
import { ebookStyles } from './styles/ebookStyles';

interface EbookPageFooterProps {
  color?: string;
}

export function EbookPageFooter({ color }: EbookPageFooterProps) {
  return (
    <Text
      style={[ebookStyles.pageNumber, color ? { color } : {}]}
      render={({ pageNumber }) => `${pageNumber}`}
      fixed
    />
  );
}
