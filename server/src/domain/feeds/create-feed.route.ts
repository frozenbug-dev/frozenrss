import {createRoute, z} from '@hono/zod-openapi'

import {processArticle} from '../../jobs/process-article.job.ts'
import {pullFeedMetadata} from '../../jobs/pull-feed-metadata.job.ts'
import {Tag} from '../../lib/openapi.ts'
import {createHono} from '../../lib/util/hono.ts'
import {toSchema} from '../../lib/util/zod.ts'
import {Feed} from './schemas.ts'
import {createFeed} from './services.ts'
import {assertUniqueFeedURL} from './util/asserts.ts'
import {readFeed} from './util/read-feed.ts'

const Response = z.object({
  feed: Feed,
})

const defs = createRoute({
  method: 'post',
  path: '/',
  operationId: 'createFeed',
  summary: 'Create feed',
  tags: [Tag.Feed.name],
  // middleware: [withAuthentication(), onlyAdmin()],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            url: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Feed created & validated.',
      content: {
        'application/json': {
          schema: Response,
        },
      },
    },
  },
})

export const createFeedRoute = createHono().openapi(defs, async c => {
  const body = c.req.valid('json')
  await assertUniqueFeedURL(body.url)

  const feedItems = await readFeed(body.url)
  const feed = await createFeed({url: body.url})

  await pullFeedMetadata(feed.id)
  await Promise.allSettled(feedItems.map(item => processArticle(feed.id, item)))

  return c.json(
    toSchema(Response, {
      feed,
    })
  )
})
