import {createRoute, z} from '@hono/zod-openapi'

import {NotFound} from '../../lib/errors/not-found-error.ts'
import {Tag} from '../../lib/openapi.ts'
import {createHono} from '../../lib/util/hono.ts'
import {toSchema} from '../../lib/util/zod.ts'
import {ArticleWithContent} from './schemas.ts'
import {findArticleById} from './services.ts'

const Response = z.object({
  article: ArticleWithContent,
})

const defs = createRoute({
  method: 'get',
  path: '/{id}',
  operationId: 'getArticle',
  summary: 'Get article',
  tags: [Tag.Article.name],
  // middleware: [withAuthentication(), onlyAdmin()],
  request: {
    params: z.object({
      id: z.uuidv7(),
    }),
  },
  responses: {
    200: {
      description: 'Article details.',
      content: {
        'application/json': {
          schema: Response,
        },
      },
    },
  },
})

export const getArticleRoute = createHono().openapi(defs, async c => {
  const {id} = c.req.valid('param')

  const article = await findArticleById(id)

  if (!article) {
    throw new NotFound('Article')
  }

  return c.json(
    toSchema(Response, {
      article,
    })
  )
})
