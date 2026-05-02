import {defineWorkflow} from 'openworkflow'
import z from 'zod'

import {findFeedById, updateFeed} from '../domain/feeds/services.ts'
import {readFeedMeta} from '../domain/feeds/util/read-feed.ts'
import {log} from '../lib/logger.ts'
import {storage} from '../lib/storage.ts'
import {ow} from '../lib/workflows.ts'

const job = defineWorkflow(
  {
    name: 'pull-feed-metadata',
    schema: z.object({
      feedId: z.uuidv7(),
    }),
  },
  async ({input, step}) => {
    log.info(`pulling feed metadata for ${input.feedId}`)

    const feed = await step.run({name: 'find-feed'}, async () => {
      const row = await findFeedById(input.feedId)
      if (!row) throw new Error('feed does not exist')
      return row
    })

    const metadata = await step.run({name: 'fetch-metadata'}, async () => {
      const meta = await readFeedMeta(feed.url)

      await storage.setItem(
        `feed-metadata/${new URL(feed.url).hostname.replaceAll('.', '-')}.json`,
        JSON.stringify(meta, null, 2)
      )

      return meta
    })

    await step.run({name: 'update-feed'}, async () => {
      await updateFeed(feed.id, {
        title: metadata.title || undefined,
        description: metadata.description || undefined,
        iconUrl: metadata.favicon || metadata.image?.url || undefined,
        language: metadata.language || undefined,
      })
    })

    log.info(`finished pulling feed metadata for ${input.feedId}`)
  }
)

export async function pullFeedMetadata(feedId: string) {
  return ow.runWorkflow(
    job.spec,
    {feedId},
    {
      idempotencyKey: feedId,
    }
  )
}

export default () => ow.implementWorkflow(job.spec, job.fn)
