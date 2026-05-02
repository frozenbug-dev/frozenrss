import {count, eq, and, getTableColumns} from 'drizzle-orm'

import {db} from '../../db/client.ts'
import {article, feed, type ArticleInsertRow} from '../../db/schema.ts'
import {withCursor, type CursorFilters, type ColumnConfig} from '../../lib/util/db.ts'

export const ARTICLE_SORT_COLUMNS: Record<'id' | 'createdAt', ColumnConfig[]> = {
  id: [{column: article.id}],
  createdAt: [{column: article.createdAt}, {column: article.id}],
}

export async function findArticleById(id: string) {
  const [row] = await db
    .select({
      ...getTableColumns(article),
      feed: {
        id: feed.id,
        title: feed.title,
        url: feed.url,
        iconUrl: feed.iconUrl,
      },
    })
    .from(article)
    .leftJoin(feed, eq(article.feedId, feed.id))
    .where(eq(article.id, id))

  return row
}

export async function findArticleByUrl(url: string, feedId: string) {
  const [row] = await db
    .select()
    .from(article)
    .where(and(eq(article.url, url), eq(article.feedId, feedId)))

  return row
}

export async function listArticles(filters: CursorFilters<string> & {sort?: 'id' | 'createdAt'} = {}) {
  const sort = filters.sort ?? 'createdAt'
  const columns = ARTICLE_SORT_COLUMNS[sort]

  const query = db
    .select({
      id: article.id,
      feedId: article.feedId,
      url: article.url,
      title: article.title,
      description: article.description,
      author: article.author,
      imageUrl: article.imageUrl,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      feed: {
        id: feed.id,
        title: feed.title,
        url: feed.url,
        iconUrl: feed.iconUrl,
      },
    })
    .from(article)
    .leftJoin(feed, eq(article.feedId, feed.id))
    .$dynamic()

  return withCursor(query, {
    columns: columns as [ColumnConfig, ...ColumnConfig[]],
    cursor: filters.cursor,
    dir: filters.dir ?? 'desc',
    limit: filters.limit ?? 50,
  })
}

export async function createArticle(input: ArticleInsertRow) {
  const [row] = await db.insert(article).values(input).returning()

  return row
}

export async function updateArticle(id: string, input: Partial<ArticleInsertRow>) {
  await db.update(article).set(input).where(eq(article.id, id))
}

export async function countArticles() {
  const [result] = await db.select({count: count()}).from(article)

  return result?.count ?? 0
}
