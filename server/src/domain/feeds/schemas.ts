import z from 'zod'

import {ISODateTime} from '../../lib/util/zod.ts'

export const Feed = z
  .object({
    id: z.uuidv7(),
    url: z.url(),

    lastPullAt: ISODateTime.nullable(),
    createdAt: ISODateTime,
  })
  .meta({
    id: 'Feed',
  })
