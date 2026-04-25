import {createHono} from '../../lib/util/hono.ts'
import {getArticleRoute} from './get-article.route.ts'
import {listArticlesRoute} from './list-articles.route.ts'

export const articleRoutes = createHono().route('/', listArticlesRoute).route('/', getArticleRoute)
