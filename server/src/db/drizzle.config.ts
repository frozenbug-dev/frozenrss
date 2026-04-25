import {join, resolve} from 'node:path'

import {defineConfig} from 'drizzle-kit'

import {ENV} from '../env.ts'

export default defineConfig({
  out: 'drizzle',
  schema: resolve(join('src', 'db', 'schema.ts')),
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE.URL,
  },
})
