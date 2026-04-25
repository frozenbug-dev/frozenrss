import type {ErrorMessageName} from './_messages.js'
import {ServiceError} from './service-error.js'

/**
 * Thrown when a valid session exists but the actor does not have access to the
 * specific resource.
 */
export class Forbidden extends ServiceError {
  constructor() {
    super({
      status: 403,
      name: Forbidden.name as ErrorMessageName,
    })
  }
}
