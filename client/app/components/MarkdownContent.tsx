'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypographyStylesProvider } from '@mantine/core';

export function MarkdownContent({ children }: { children: string }) {
  return (
    <TypographyStylesProvider p={0} m={0}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </TypographyStylesProvider>
  );
}
