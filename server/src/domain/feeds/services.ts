import {count, eq} from 'drizzle-orm'

import {db} from '../../db/client.ts'
import {article, feed, type FeedInsertRow} from '../../db/schema.ts'
import {withCursor, type CursorFilters} from '../../lib/util/db.ts'

export async function findFeedById(id: string) {
  const [row] = await db.select().from(feed).where(eq(feed.id, id))

  return row
}

export async function createFeed(input: {url: string}) {
  const [row] = await db
    .insert(feed)
    .values({
      url: input.url,
      lastPullAt: new Date(),
    })
    .returning()

  return row
}

export async function listFeeds(filters: CursorFilters<string> = {}) {
  const query = db.select().from(feed).$dynamic()

  return withCursor(query, {
    columns: [{column: feed.id}],
    cursor: filters.cursor,
    dir: filters.dir ?? 'desc',
    limit: filters.limit ?? 50,
  })
}

export async function deleteFeed(id: string) {
  const feedRow = await db.transaction(async tx => {
    await tx.delete(article).where(eq(article.feedId, id))
    const [feedRow] = await tx.delete(feed).where(eq(feed.id, id)).returning()

    return feedRow
  })

  return feedRow
}

export async function countFeeds() {
  const [result] = await db.select({count: count()}).from(feed)

  return result?.count ?? 0
}

export async function updateFeed(id: string, input: Partial<Omit<FeedInsertRow, 'id'>>) {
  await db.update(feed).set(input).where(eq(feed.id, id))
}
