import z from 'zod'

import {ISODateTime} from '../../lib/util/zod.ts'

export const Feed = z
  .object({
    id: z.uuidv7(),
    url: z.url(),
    title: z.string().nullable(),

    description: z.string().nullable(),
    iconUrl: z.string().nullable(),
    language: z.string().nullable(),
    error: z.string().nullable(),

    lastPullAt: ISODateTime.nullable(),
    createdAt: ISODateTime,
  })
  .meta({
    id: 'Feed',
  })
