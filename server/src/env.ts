import {join} from 'node:path'

import * as z from 'zod'

import {Bool, defineEnvironment, Host, Port, Url} from './lib/util/env-builder.ts'

export const ENV = defineEnvironment($ => ({
  HOST: $('HOST', Host('127.0.0.1')),
  PORT: $('PORT', Port(4000)),
  NODE_ENV: $('NODE_ENV', z.enum(['development', 'production']).default('development')),

  /** must match the public url of the api, most usually common with the frontend url */
  BASE_URL: $('BASE_URL', Url('http://localhost:3000')),

  DATABASE: {
    URL: $('DATABASE_URL', Url('postgresql://frozenrss:frozenrss@localhost:5432/frozenrss')),
  },

  AUTH: {
    SECRET: $('AUTH_SECRET', z.string().default('changeme_71acfb87ea601a1fb9c69546d16a729f')),
  },

  SMTP: {
    HOST: $('SMTP_HOST', z.string().default('localhost')),
    PORT: $('SMTP_PORT', Port(1025)),
    USER: $('MAIL_USER', z.string().optional()),
    PASS: $('MAIL_PASS', z.string().optional()),
    SENDER: $('SENDER_MAIL', z.string().default('no-reply@ecopartsricambi.it')),
    ADMIN: $('ADMIN_MAIL', z.string().default('no-reply@ecopartsricambi.it')),
  },

  STORAGE: {
    BASE_PATH: $('STORAGE_BASE_PATH', z.string().default(join(process.cwd(), '.storage'))),

    S3_ENABLED: $('STORAGE_S3_ENABLED', Bool(false)),
    S3_ENDPOINT: $('STORAGE_S3_ENDPOINT', z.string().optional()),
    S3_REGION: $('STORAGE_S3_REGION', z.string().optional()),
    S3_BUCKET_NAME: $('STORAGE_S3_BUCKET_NAME', z.string().optional()),
    S3_ACCESS_KEY_ID: $('STORAGE_S3_ACCESS_KEY_ID', z.string().optional()),
    S3_SECRET_ACCESS_KEY: $('STORAGE_S3_SECRET_ACCESS_KEY', z.string().optional()),

    /** useful if using a cdn */
    ASSETS_PUBLIC_URL: $('ASSETS_PUBLIC_URL', z.string().optional()),
  },

  WORKERS: {
    CONCURRENCY: $('WORKERS_CONCURRENCY', z.coerce.number().default(5)),
  },

  PLAYWRIGHT_WS_URL: $('PLAYWRIGHT_WS_URL', z.url().default('ws://playwright:3000')),
}))
