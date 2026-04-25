import {resolve} from 'node:path'
import {loadEnvFile} from 'node:process'

import * as z from 'zod'

try {
  loadEnvFile(resolve('.env'))
} catch {}

export function defineEnvironment<T>(env: ($parser: typeof checker) => T) {
  return env(checker)
}

export const Port = (defaultValue: number) => z.coerce.number('A valid port must be provided.').default(defaultValue)
export const Host = (defaultValue: string) => z.string().default(defaultValue)
export const Bool = (defaultValue = false) =>
  z
    .enum(['true', 'false', 'yes', 'no', '1', '0'])
    .transform(str => ['1', 'true', 'yes'].includes(str))
    .default(defaultValue)
export const Url = (defaultUrl: string) => z.url().default(defaultUrl)

function checker<T extends z.ZodType>(key: string, schema: T) {
  const result = schema.safeParse(process.env[key])
  if (!result.success) {
    console.error(z.treeifyError(result.error).errors.join('\n'))
    process.exit(1)
  }
  return result.data
}
