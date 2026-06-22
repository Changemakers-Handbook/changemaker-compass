import { NotFoundPage } from '@payloadcms/next/views';
import config from '@payload-config';
import React from 'react';

export default function NotFound() {
  return <NotFoundPage config={config} />;
}
