import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Users } from './collections/Users';
import { Surveys } from './collections/Surveys';
import { Responses } from './collections/Responses';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Compass Admin',
    },
  },
  collections: [Users, Surveys, Responses],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
