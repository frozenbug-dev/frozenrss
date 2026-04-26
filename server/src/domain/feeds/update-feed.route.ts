import {createRoute, z} from '@hono/zod-openapi'

import {NotFound} from '../../lib/errors/not-found-error.ts'
import {Tag} from '../../lib/openapi.ts'
import {createHono} from '../../lib/util/hono.ts'
import {toSchema} from '../../lib/util/zod.ts'
import {Feed} from './schemas.ts'
import {findFeedById, updateFeed} from './services.ts'

const Response = z.object({
  feed: Feed,
})

const defs = createRoute({
  method: 'patch',
  path: '/{id}',
  operationId: 'updateFeed',
  summary: 'Update feed',
  tags: [Tag.Feed.name],
  request: {
    params: z.object({
      id: z.uuidv7(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            url: z.url().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Feed updated.',
      content: {
        'application/json': {
          schema: Response,
        },
      },
    },
  },
})

export const updateFeedRoute = createHono().openapi(defs, async c => {
  const {id} = c.req.valid('param')
  const body = c.req.valid('json')

  const existing = await findFeedById(id)
  if (!existing) {
    throw new NotFound('Feed')
  }

  await updateFeed(id, body)

  const feed = await findFeedById(id)

  return c.json(toSchema(Response, {feed: feed!}))
})
