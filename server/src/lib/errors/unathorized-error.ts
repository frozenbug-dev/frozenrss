import type {ErrorMessageName} from './_messages.js'
import {ServiceError} from './service-error.js'

/**
 * Thrown when there is no active session provided on the request.
 */
export class Unauthorized extends ServiceError {
  constructor() {
    super({
      status: 401,
      name: Unauthorized.name as ErrorMessageName,
    })
  }
}
