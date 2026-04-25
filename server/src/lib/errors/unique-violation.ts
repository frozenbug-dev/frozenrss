import type {ErrorMessageName} from './_messages.ts'
import {ServiceError} from './service-error.ts'

export class UniqueViolation extends ServiceError<{resource: string}> {
  constructor(resource: string) {
    super({
      status: 404,
      name: UniqueViolation.name as ErrorMessageName,
      details: {resource},
    })
  }
}
