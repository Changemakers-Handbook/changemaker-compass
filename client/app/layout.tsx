import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import { Providers } from './providers';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import './globals.css';

export const metadata: Metadata = {
  title: "Changemaker's Compass",
  description: 'Find your direction with our surveys',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const colorScheme = (cookieStore.get('mantine-color-scheme')?.value ?? 'light') as 'light' | 'dark';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers colorScheme={colorScheme}>
          <AppHeader />
          <AnnouncementBanner />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
