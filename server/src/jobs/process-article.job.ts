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
import {htmlToMarkdown} from '../lib/util/html-to-markdown.ts'
import {ow} from '../lib/workflows.ts'

const job = defineWorkflow(
  {
    name: 'process-article',
    schema: z.object({
      feedId: z.uuidv7(),
      index: z.coerce.number().optional(),
      article: z.looseObject({
        title: z.string(),
        description: z.string().nullable(),
        summary: z.string().nullable(),
        author: z.string().nullable().optional(),
        link: z.url(),
        date: z.iso.datetime().nullable().optional(),
        pubdate: z.iso.datetime().nullable().optional(),
      }),
    }),
  },
  async ({input, step}) => {
    const cleanUrl = new URL(input.article.link)
    cleanUrl.search = ''

    log.info(`processing article: ${input.article.link}`)

    const prefix = slugify(input.article.title, {lower: true, trim: true, remove: /[*+~.()&#'"!:@\\]/g})
      .substring(0, 32)
      .trim()

    const articleId = await step.run({name: 'persist-rss'}, async () => {
      const storedArticle = await findArticleByUrl(cleanUrl.toString(), input.feedId)

      const _updatedAt = input.article.date ?? input.article.pubdate ?? null
      const updatedAt = _updatedAt ? new Date(_updatedAt) : null

      if (!storedArticle) {
        const article = await createArticle({
          feedId: input.feedId,
          url: cleanUrl.toString(),
          title: input.article.title,
          description: input.article.summary,
          content: htmlToMarkdown(input.article.description),
          author: input.article.author ?? null,
          updatedAt,
          publishedAt: updatedAt || new Date(),
        })

        return article.id
      }

      await updateArticle(storedArticle.id, {
        feedId: input.feedId,
        title: input.article.title,
        description: htmlToMarkdown(input.article.description),
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
        const result = await Defuddle(document, input.article.link, {
          markdown: true,
        })

        return {
          content: result.content,
          wordsCount: result.wordCount,
          imageUrl: result.image,
        }
      } catch (error) {
        log.warn({error, url: input.article.link}, `could not fetch content of article ${input.article.link}`)
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

    await step.sendSignal({
      name: 'process-article:done',
      signal: `${input.feedId}:${input.index}`,
    })
  }
)

export async function processArticle(feedId: string, article: FeedParser.Item, index?: number) {
  return ow.runWorkflow(
    job.spec,
    {
      feedId,
      index,
      article: {
        ...article,
        author: article.author,
        date: article.date?.toISOString?.(),
        pubdate: article.pubdate?.toISOString?.(),
      },
    },
    {idempotencyKey: article.link}
  )
}

export default () => ow.implementWorkflow(job.spec, job.fn)
