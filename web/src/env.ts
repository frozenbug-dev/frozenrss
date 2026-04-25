import {createEnv} from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
  server: {
    API_URL: z.url().optional().default('http://localhost:4000'),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
