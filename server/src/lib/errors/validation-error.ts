import type * as z from 'zod'

import type {ErrorMessageName} from './_messages.js'
import {ServiceError} from './service-error.js'

export class ValidationError extends ServiceError<z.ZodError['issues']> {
  constructor(issues: z.ZodError['issues']) {
    super({
      status: 422,
      details: issues,
      name: ValidationError.name as ErrorMessageName,
    })
  }
}
