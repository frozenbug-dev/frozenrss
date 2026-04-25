import type {ErrorHandler} from 'hono'

import {log} from '../logger.ts'
import {ServiceError} from '../errors/service-error.js'

export function withErrorHandler(): ErrorHandler {
  return (error, c) => {
    if (error instanceof ServiceError) {
      const {status, ...json} = error.toJSON()
      return c.json(json, status)
    }

    const serviceError = new ServiceError<string | undefined>({
      name: 'InternalError',
      status: 500,
      details: error instanceof Error ? error.stack : undefined,
    })

    const {status, ...json} = serviceError.toJSON()

    log.error(error)
    return c.json(json, status)
  }
}
