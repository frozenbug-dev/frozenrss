import {CronJob} from 'cron'

import {listFeeds} from './domain/feeds/services.ts'
import {ENV} from './env.ts'
import {pullFeed} from './jobs/pull-feed.job.ts'
import {log} from './lib/logger.ts'

export function startCronJobs() {
  const job = CronJob.from({
    cronTime: ENV.CRON_PULL_FEEDS,
    onTick: async () => {
      log.info('starting feed pull')

      try {
        const feeds = await listFeeds({limit: 0})
        await Promise.all(feeds.map(f => pullFeed(f.id)))
        log.info(`enqueued ${feeds.length} feeds`)
      } catch (error) {
        log.error(error)
      }
    },
    start: true,
  })

  log.info(`pull-feed job scheduled with pattern "${ENV.CRON_PULL_FEEDS}"`)

  return job
}
