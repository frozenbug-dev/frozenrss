export const Tag = {
  Feed: {
    name: 'Feed',
  },
  Article: {
    name: 'Article',
  },
} satisfies TagMap

/** @internal */
export const Tags = Object.values(Tag)

type TagMap = Record<
  string,
  {
    name: string
    description?: string
    externalDocs?: {url: string; description?: string}
  }
>
