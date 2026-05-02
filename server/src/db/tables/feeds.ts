import {sql, type InferInsertModel, type InferSelectModel} from 'drizzle-orm'
import {integer, pgTable, text, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

export const feed = pgTable('feed', {
  id: uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),

  url: text('url').notNull(),
  title: text('title').notNull().default('unknown'),

  /** <description> tag on website or custom by user */
  description: text('description'),
  /** favicon or custom set by user */
  iconUrl: text('icon_url'),
  /** e.g. en-US, ro, de, from website or custom */
  language: varchar('language', {length: 5}),

  lastPullAt: timestamp('last_pull_at'),

  error: text('error'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export interface FeedRow extends InferSelectModel<typeof feed> {}
export interface FeedInsertRow extends InferInsertModel<typeof feed> {}

export const article = pgTable('article', {
  id: uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),

  feedId: uuid('feed_id').references(() => feed.id, {onDelete: 'set null'}),

  /** url of the article from rss feed */
  url: text('url').notNull(),
  /** title from rss feed */
  title: text('title').notNull(),
  /** short description from rss feed */
  description: text('description'),
  /** author from rss feed */
  author: text('author'),

  /** markdown extracted from the content via Defuddle */
  content: text('content'),
  /** extracted by defuddle if possible */
  wordsCount: integer('words_count'),

  /** og-image/twitter-card/etc. */
  imageUrl: text('image_url'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at').notNull(),
  updatedAt: timestamp('updated_at'),
})

export interface ArticleRow extends InferSelectModel<typeof article> {}
export interface ArticleInsertRow extends InferInsertModel<typeof article> {}
