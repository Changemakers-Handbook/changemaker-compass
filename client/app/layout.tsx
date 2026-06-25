import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import { Providers } from './providers';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import './globals.css';

export const metadata: Metadata = {
  title: "Changemaker's Compass",
  description: 'Find your direction with our surveys',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers>
          <AppHeader />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
