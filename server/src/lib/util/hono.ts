import {OpenAPIHono} from '@hono/zod-openapi'

import {ValidationError} from '../errors/validation-error.ts'

export function createHono() {
  return new OpenAPIHono({
    defaultHook(result) {
      if (result.success === false) {
        throw new ValidationError(result.error.issues)
      }
    },
  })
}
