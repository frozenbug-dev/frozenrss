import {createRoute, z} from '@hono/zod-openapi'

import {Tag} from '../../lib/openapi.ts'
import {createHono} from '../../lib/util/hono.ts'
import {toSchema} from '../../lib/util/zod.ts'
import {Feed} from './schemas.ts'
import {countFeeds, listFeeds} from './services.ts'

const Response = z.object({
  feeds: z.array(Feed),
  cursor: z.uuidv7().nullable(),
  count: z.number().int().nonnegative(),
})

const defs = createRoute({
  method: 'get',
  path: '/',
  operationId: 'listFeeds',
  summary: 'List feeds',
  tags: [Tag.Feed.name],
  // middleware: [withAuthentication(), onlyAdmin()],
  request: {
    query: z.object({
      limit: z.coerce.number().int().nonnegative().default(50),
      cursor: z.uuidv7().optional(),
      dir: z.enum(['asc', 'desc']).default('desc'),
    }),
  },
  responses: {
    200: {
      description: 'List of feeds.',
      content: {
        'application/json': {
          schema: Response,
        },
      },
    },
  },
})

export const listFeedsRoute = createHono().openapi(defs, async c => {
  const query = c.req.valid('query')

  const [feeds, count] = await Promise.all([listFeeds(query), countFeeds()])

  return c.json(
    toSchema(Response, {
      feeds,
      cursor: feeds.length === query.limit ? feeds.at(-1)!.id : null,
      count,
    })
  )
})
