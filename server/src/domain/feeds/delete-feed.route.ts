import {createRoute, z} from '@hono/zod-openapi'

import {NotFound} from '../../lib/errors/not-found-error.ts'
import {Tag} from '../../lib/openapi.ts'
import {createHono} from '../../lib/util/hono.ts'
import {deleteFeed} from './services.ts'

const defs = createRoute({
  method: 'delete',
  path: '/{id}',
  operationId: 'deleteFeed',
  summary: 'Delete feed',
  tags: [Tag.Feed.name],
  // middleware: [withAuthentication(), onlyAdmin()],
  request: {
    params: z.object({
      id: z.uuidv7(),
    }),
  },
  responses: {
    204: {
      description: 'Feed deleted.',
    },
  },
})

export const deleteFeedRoute = createHono().openapi(defs, async c => {
  const {id} = c.req.valid('param')

  const deleted = await deleteFeed(id)

  if (!deleted) {
    throw new NotFound('Feed')
  }

  return c.newResponse(null, 204)
})
