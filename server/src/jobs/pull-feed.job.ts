import {defineWorkflow} from 'openworkflow'
import z from 'zod'

import {findFeedById, updateFeed} from '../domain/feeds/services.ts'
import {readFeed} from '../domain/feeds/util/read-feed.ts'
import {log} from '../lib/logger.ts'
import {ow} from '../lib/workflows.ts'
import {processArticle} from './process-article.job.ts'

const job = defineWorkflow({name: 'pull-feed', schema: z.object({feedId: z.uuidv7()})}, async ({input, step}) => {
  log.info(`pulling feed ${input.feedId}`)

  const items = await step.run({name: 'fetch-feed'}, async () => {
    const feed = await findFeedById(input.feedId)
    if (!feed) throw new Error('feed does not exist')

    try {
      const items = await readFeed(feed.url)

      return items
    } catch (error) {
      const message = error instanceof Error ? error.message : 'failed parsing feed with unknown error'
      log.error(error)

      await updateFeed(feed.id, {
        error: message,
      })

      throw error
    }
  })

  await step.run({name: 'parse-feed'}, async () => {
    const jobs = await Promise.all(items.map(article => processArticle(input.feedId, article)))

    await Promise.all(jobs.map(job => job.result()))

    await updateFeed(input.feedId, {lastPullAt: new Date()})

    log.info('finished pulling feed')
  })
})

export async function pullFeed(feedId: string) {
  return ow.runWorkflow(job.spec, {
    feedId,
  })
}

export default () => ow.implementWorkflow(job.spec, job.fn)
