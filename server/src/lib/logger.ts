import pino, {type LoggerOptions} from 'pino'
import pretty from 'pino-pretty'

import {ENV} from '../env.ts'

const options =
  ENV.NODE_ENV === 'development'
    ? pretty({
        colorize: true,
        colorizeObjects: true,
        timestampKey: 'ts',
        sync: true,
        hideObject: true,
      })
    : ({
        errorKey: 'error',
        redact: {
          paths: ['password', 'email', 'secret'],
          censor: '[REDACTED]',
        },
      } as LoggerOptions)

export const log = pino(options)
