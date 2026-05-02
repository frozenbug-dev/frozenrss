import {startCronJobs} from './server.cron.ts'

const job = startCronJobs()

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

async function shutdown(signal: string) {
  console.log(`received ${signal}, shutting down`)
  job.stop()
  process.exit(0)
}
