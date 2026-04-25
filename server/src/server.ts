import {setTimeout} from 'node:timers/promises'

import {serve} from '@hono/node-server'
import type {Client, Pool} from 'pg'

import {app} from './app.ts'
import {db} from './db/client.ts'
import {ENV} from './env.ts'

const server = serve(
  {
    fetch: app.fetch,
    port: ENV.PORT,
    hostname: ENV.HOST,
  },
  ({address, port}) => {
    console.info(`listening on http://${address}:${port}`)
  }
)

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

async function shutdown(signal: string) {
  console.log(`received ${signal}, shutting down...`)

  server.close(async error => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    await (db.$client as Client | Pool).end()

    process.exit(0)
  })

  await setTimeout(10_000)
  process.exit(1)
}
