import {createRoute, z} from '@hono/zod-openapi'

import {article} from '../../db/schema.ts'
import {Tag} from '../../lib/openapi.ts'
import {encodeCursor} from '../../lib/util/db.ts'
import {createHono} from '../../lib/util/hono.ts'
import {toSchema} from '../../lib/util/zod.ts'
import {Article} from './schemas.ts'
import {ARTICLE_SORT_COLUMNS, countArticles, listArticles} from './services.ts'

const Response = z.object({
  articles: z.array(Article),
  cursor: z.string().nullable(),
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
      cursor: z.string().optional(),
      dir: z.enum(['asc', 'desc']).default('desc'),
      sort: z.enum(['id', 'createdAt']).default('createdAt'),
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

  const lastArticle = articles.at(-1)
  const cursor =
    articles.length === query.limit && lastArticle
      ? encodeCursor(lastArticle, ARTICLE_SORT_COLUMNS[query.sort], article)
      : null

  return c.json(
    toSchema(Response, {
      articles,
      cursor,
      count,
    })
  )
})
