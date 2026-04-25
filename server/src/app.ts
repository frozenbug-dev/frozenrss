import {join} from 'node:path'

import {serveStatic} from '@hono/node-server/serve-static'
import {Scalar} from '@scalar/hono-api-reference'

import {articleRoutes} from './domain/articles/routes.ts'
import {feedRoutes} from './domain/feeds/routes.ts'
import {ENV} from './env.ts'
import {auth} from './lib/auth.ts'
import {withErrorHandler} from './lib/middlewares/error.middleware.ts'
import {withRequestContext} from './lib/middlewares/req.middeware.ts'
import {createHono} from './lib/util/hono.ts'

const app = createHono()

app.openAPIRegistry.registerComponent('securitySchemes', 'session', {
  type: 'apiKey',
  in: 'cookie',
  name: 'frozenrss.session_token',
})

app.onError(withErrorHandler())
app.use('*', withRequestContext())

app
  .doc31('/api/openapi.json', {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'FrozenRSS API',
      description: ``,
    },
  })
  .get(
    '/api/openapi',
    Scalar({
      defaultHttpClient: {
        clientKey: 'curl',
        targetKey: 'js',
      },
      theme: 'default',
      hideModels: false,
      pageTitle: 'FrozenRSS API Documentation',
      sources: [{url: '/api/openapi.json', title: 'API'}],
    })
  )

app
  .use(
    '/api/assets/*',
    serveStatic({
      root: join(ENV.STORAGE.BASE_PATH),
      rewriteRequestPath: path => path.replace(/^\/api\/assets\//, ''),
    })
  )

  .on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))
  .route('/api/feeds', feedRoutes)
  .route('/api/articles', articleRoutes)

export {app}
