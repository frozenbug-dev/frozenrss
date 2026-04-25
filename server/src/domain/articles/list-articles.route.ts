import {createRoute, z} from '@hono/zod-openapi'

import {Tag} from '../../lib/openapi.ts'
import {createHono} from '../../lib/util/hono.ts'
import {toSchema} from '../../lib/util/zod.ts'
import {Article} from './schemas.ts'
import {countArticles, listArticles} from './services.ts'

const Response = z.object({
  articles: z.array(Article),
  cursor: z.uuidv7().nullable(),
  count: z.number().int().nonnegative(),
})

const defs = createRoute({
  method: 'get',
  path: '/',
  operationId: 'listArticles',
  summary: 'List articles',
  tags: [Tag.Article.name],
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
      description: 'List of articles.',
      content: {
        'application/json': {
          schema: Response,
        },
      },
    },
  },
})

export const listArticlesRoute = createHono().openapi(defs, async c => {
  const query = c.req.valid('query')

  const [articles, count] = await Promise.all([listArticles(query), countArticles()])

  return c.json(
    toSchema(Response, {
      articles,
      cursor: null,
      count,
    })
  )
})
