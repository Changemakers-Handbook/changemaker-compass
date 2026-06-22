import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const nextConfig: NextConfig = {};

export default withPayload(nextConfig, {
  configPath: path.resolve(dirname, './payload.config.ts'),
});
