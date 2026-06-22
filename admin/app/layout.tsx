import type { Metadata } from 'next';
import '@payloadcms/next/css';
import { RootLayout } from '@payloadcms/next/layouts';
import config from '@payload-config';
import React from 'react';
import { importMap } from './(payload)/admin/importMap';
import { serverFunction } from './(payload)/admin/serverFunctions';

export const metadata: Metadata = {
  title: 'Compass Admin',
};

type Args = {
  children: React.ReactNode;
};

export default function Layout({ children }: Args) {
  return RootLayout({ config, children, importMap, serverFunction });
}
