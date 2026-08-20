import type { Metadata } from 'next';
import '@payloadcms/next/css';
import { RootLayout } from '@payloadcms/next/layouts';
import config from '@payload-config';
import { importMap } from './(payload)/admin/importMap.js';
import { serverFunction } from './(payload)/admin/serverFunctions';

export const metadata: Metadata = {
  title: 'Compass Admin',
};

type Args = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
