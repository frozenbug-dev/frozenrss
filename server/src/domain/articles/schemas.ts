import z from 'zod'

import {ISODateTime} from '../../lib/util/zod.ts'

export const Article = z
  .object({
    id: z.uuidv7(),
    feedId: z.uuidv7().nullable(),
    url: z.url(),
    title: z.string(),
    description: z.string().nullable(),
    author: z.string().nullable(),
    imageUrl: z.string().nullable(),
    createdAt: ISODateTime,
    updatedAt: ISODateTime.nullable(),
  })
  .meta({
    id: 'Article',
  })

export const ArticleWithContent = Article.extend({
  content: z.string().nullable(),
  wordsCount: z.number().int().nullable(),
}).meta({
  id: 'ArticleWithContent',
})
