import {ENV} from './env.ts'
import startProcessArticleJob from './jobs/process-article.job.ts'
import startPullFeedJob from './jobs/pull-feed.job.ts'
import startPullFeedMetadataJob from './jobs/pull-feed-metadata.job.ts'
import {ow} from './lib/workflows.ts'

startProcessArticleJob()
startPullFeedJob()
startPullFeedMetadataJob()

const worker = ow.newWorker({
  concurrency: ENV.WORKERS.CONCURRENCY,
})
await worker.start()

console.log('workers ready')

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

async function shutdown(signal: string) {
  console.log(`received ${signal}, shutting down`)

  await worker.stop()
  process.exit(0)
}
