import {count, eq} from 'drizzle-orm'

import {db} from '../../db/client.ts'
import {article, type ArticleInsertRow} from '../../db/schema.ts'
import {withCursor, type CursorFilters} from '../../lib/util/db.ts'

export async function findArticleById(id: string) {
  const [row] = await db.select().from(article).where(eq(article.id, id))

  return row
}

export async function findArticleByUrl(url: string) {
  const [row] = await db.select().from(article).where(eq(article.url, url))

  return row
}

export async function listArticles(filters: CursorFilters<string> = {}) {
  const query = db
    .select({
      id: article.id,
      feedId: article.feedId,
      url: article.url,
      title: article.title,
      description: article.description,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    })
    .from(article)
    .$dynamic()

  return withCursor(query, {
    column: article.id,
    cursor: filters.cursor,
    dir: filters.dir ?? 'desc',
    limit: filters.limit ?? 50,
  })
}

export async function createArticle(input: ArticleInsertRow) {
  const [row] = await db.insert(article).values({
    title: input.title,
    url: input.url,
    content: input.content,
    feedId: input.feedId,
    description: input.description,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  }).returning()

  return row
}

export async function updateArticle(id: string, input: Partial<ArticleInsertRow>) {
  await db
    .update(article)
    .set(input)
    .where(eq(article.id, id))
}

export async function countArticles() {
  const [result] = await db.select({count: count()}).from(article)

  return result?.count ?? 0
}
