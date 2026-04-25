import type {ContentfulStatusCode, StatusCode} from 'hono/utils/http-status'
import * as z from 'zod'

import {ErrorMessage, type ErrorMessageName} from './_messages.js'

export class ServiceError<T extends unknown = undefined> extends Error {
  status: StatusCode
  name!: ErrorMessageName
  details?: T | undefined

  constructor(args: {name: ErrorMessageName; status: StatusCode; details?: T}) {
    super(ErrorMessage[args.name])
    this.name = args.name
    this.details = args.details
    this.status = args.status
  }

  /**
   * Used on the server to serialize the error.
   * @internal
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
      status: this.status as ContentfulStatusCode,
    }
  }

  /**
   * Used to convert a JSON object received from an HTTP call to an instance of the `ServiceError` class.
   *
   * Useful when the client wants to have type-safe error handling.
   */
  public static fromResponse(response: unknown) {
    const object = z
      .object({
        name: z.string(),
        details: z.any(),
        status: z.number(),
      })
      .partial()
      .parse(response)

    return new ServiceError({
      name: object.name as ServiceError['name'],
      status: (object.status as StatusCode) || 0,
      details: object.details,
    })
  }
}
