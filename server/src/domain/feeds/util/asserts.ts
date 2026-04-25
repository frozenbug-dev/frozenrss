import {eq} from 'drizzle-orm'

import {db} from '../../../db/client.ts'
import {feed} from '../../../db/schema.ts'
import {UniqueViolation} from '../../../lib/errors/unique-violation.ts'

export async function assertUniqueFeedURL(url: string) {
  const feeds = await db.select().from(feed).where(eq(feed.url, url))
  if (feeds.length) throw new UniqueViolation('url')
}
