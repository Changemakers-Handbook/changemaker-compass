'use client';

import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'sans-serif',
});

const colorSchemeManager = localStorageColorSchemeManager();

export function Providers({
  children,
  colorScheme,
}: {
  children: React.ReactNode;
  colorScheme: 'light' | 'dark';
}) {
  return (
    <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager} defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
}
