import {Readable} from 'stream'

import FeedParser from 'feedparser'

import {http} from '../../../lib/util/ky.ts'

export async function readFeed(url: string) {
  const response = await http.get(url, {
    throwHttpErrors: false,
    timeout: 5000,
    retry: 3,
  })

  if (!response.ok) throw new FeedError(`Could not fetch feed. Status code: ${response.status}`)

  const feedParser = new FeedParser({
    normalize: true,
  })

  const promise = new Promise<FeedParser.Item[]>((resolve, reject) => {
    const items: FeedParser.Item[] = []

    feedParser.on('error', e => reject(new FeedError(e.message || 'Could not parse feed XML')))
    feedParser.on('readable', function () {
      let item
      while ((item = this.read())) {
        items.push(item)
      }
    })
    feedParser.on('end', () => resolve(items))
  })

  // @ts-expect-error
  Readable.fromWeb(response.body!).pipe(feedParser)

  return promise
}

export async function readFeedMeta(url: string) {
  const response = await http.get(url, {
    throwHttpErrors: false,
    timeout: 5000,
    retry: 3,
  })

  if (!response.ok) throw new FeedError(`Could not fetch feed. Status code: ${response.status}`)

  const feedParser = new FeedParser({
    normalize: true,
  })

  const promise = new Promise<FeedParser.Meta>((resolve, reject) => {
    let meta: FeedParser.Meta | null = null

    feedParser.on('error', e => reject(new FeedError(e.message || 'Could not parse feed XML')))
    feedParser.on('meta', m => {
      meta = m
    })
    feedParser.on('end', () => {
      if (meta) resolve(meta)
      else reject(new FeedError('No metadata found in feed'))
    })
  })

  // @ts-expect-error
  Readable.fromWeb(response.body!).pipe(feedParser)

  return promise
}

export class FeedError extends Error {
  constructor(message: string) {
    super(message)
  }
}
