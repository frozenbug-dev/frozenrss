import {glob} from 'node:fs/promises'
import {join} from 'node:path'

import {ENV} from './env.ts'
import {ow} from './lib/workflows.ts'

// find all job files and load them.
const jobFiles = glob(join(import.meta.dirname, 'jobs', '*.job.ts'))
for await (const file of jobFiles) {
  const {default: startJob} = await import(file)
  startJob()
}

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
