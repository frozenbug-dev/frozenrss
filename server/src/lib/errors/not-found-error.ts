import type {ErrorMessageName} from './_messages.js'
import {ServiceError} from './service-error.js'

export class NotFound extends ServiceError<{resource: string}> {
  constructor(resource: string) {
    super({
      status: 404,
      name: NotFound.name as ErrorMessageName,
      details: {resource},
    })
  }
}
