import {Defuddle} from 'defuddle/node'
import type FeedParser from 'feedparser'
import {parseHTML} from 'linkedom'
import {defineWorkflow} from 'openworkflow'
import slugify from 'slugify'
import z from 'zod'

import {createArticle, findArticleByUrl, updateArticle} from '../domain/articles/services.ts'
import {log} from '../lib/logger.ts'
import {storage} from '../lib/storage.ts'
import {fetchPage} from '../lib/util/fetch-page.ts'
import {ow} from '../lib/workflows.ts'

const job = defineWorkflow(
  {
    name: 'process-article',
    schema: z.object({
      feedId: z.uuidv7(),
      article: z.looseObject({
        title: z.string(),
        description: z.string().nullable(),
        author: z.string().nullable().optional(),
        link: z.url(),
        date: z.iso.datetime().nullable().optional(),
        pubdate: z.iso.datetime().nullable().optional(),
      }),
    }),
  },
  async ({input, step}) => {
    log.info(`processing article: ${input.article.link}`)

    const prefix = slugify(input.article.title, {lower: true, trim: true, remove: /[*+~.()&#'"!:@\\]/g})
      .substring(0, 32)
      .trim()

    const articleId = await step.run({name: 'persist-rss'}, async () => {
      const storedArticle = await findArticleByUrl(input.article.link)

      const _updatedAt = input.article.date ?? input.article.pubdate ?? null
      const updatedAt = _updatedAt ? new Date(_updatedAt) : null

      if (!storedArticle) {
        const article = await createArticle({
          feedId: input.feedId,
          url: input.article.link,
          title: input.article.title,
          description: input.article.description,
          author: input.article.author ?? null,
          updatedAt,
        })

        return article.id
      }

      await updateArticle(storedArticle.id, {
        feedId: input.feedId,
        title: input.article.title,
        description: input.article.description,
        author: input.article.author ?? null,
        updatedAt,
      })

      return storedArticle.id
    })

    await storage.setItem(`articles/${prefix}/feed.json`, JSON.stringify(input.article, null, 2))

    const content = await step.run({name: 'fetch-content'}, async () => {
      try {
        const html = await fetchPage(input.article.link)
        const {document} = parseHTML(html)
        const result = await Defuddle(document, undefined, {
          markdown: true,
        })

        return {
          content: result.content,
          wordsCount: result.wordCount,
          imageUrl: result.image,
        }
      } catch (error) {
        log.warn({error, url: input.article.link}, 'could not fetch article content')
        return {content: null, wordsCount: null, imageUrl: null}
      }
    })

    if (content.content) {
      await step.run({name: 'update-content'}, async () => {
        await updateArticle(articleId, {
          content: content.content,
          wordsCount: content.wordsCount,
          imageUrl: content.imageUrl,
        })
        await storage.setItem(`articles/${prefix}/content.md`, content.content)
      })
    }
  }
)

export async function processArticle(feedId: string, article: FeedParser.Item) {
  return ow.runWorkflow(job.spec, {
    feedId,
    article: {
      ...article,
      author: article.author,
      date: article.date?.toISOString(),
      pubdate: article.pubdate?.toISOString(),
    },
  })
}

export default () => ow.implementWorkflow(job.spec, job.fn)
