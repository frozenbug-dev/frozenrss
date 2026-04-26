import {IconArticle, IconExternalLink} from '@tabler/icons-react'
import {useQuery} from '@tanstack/react-query'
import Markdown from 'markdown-to-jsx'
import {memo} from 'react'

import {Button} from '#/components/ui/button'
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from '#/components/ui/empty'
import {ScrollArea} from '#/components/ui/scroll-area'
import {Skeleton} from '#/components/ui/skeleton'
import {getArticleOptions} from '#/lib/api'

import {YouTubeEmbed} from './youtube-embed'

function getYouTubeVideoId(href: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = href.match(pattern)
    if (match) return match[1]
  }
  return null
}

interface ArticleContentProps {
  articleId: string | undefined
}

export const ArticleContent = memo(({articleId}: ArticleContentProps) => {
  const {data, isLoading} = useQuery({
    ...getArticleOptions({path: {id: articleId!}}),
    enabled: !!articleId,
  })

  if (!articleId) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconArticle />
          </EmptyMedia>
          <EmptyTitle>Select an article</EmptyTitle>
          <EmptyDescription>Choose an article from the list to read its content.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  const article = data?.article

  if (!article) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyTitle>Article not found</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!article.content && !article.description) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconArticle />
          </EmptyMedia>
          <EmptyTitle>Content not available</EmptyTitle>
          <EmptyDescription>The full content for this article could not be extracted.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" to={article.url as `https://${string}`}>
            <IconExternalLink data-icon="inline-start" />
            Open article
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <ScrollArea className="h-full">
      <article className="mx-auto max-w-2xl px-8 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{article.title}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            {article.author && <span>{article.author}</span>}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-primary"
            >
              <IconExternalLink />
              Original
            </a>
          </div>
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Markdown
            options={{
              overrides: {
                img: {
                  component: ({src, alt, ...props}) => {
                    const videoId = getYouTubeVideoId(src ?? '')
                    if (videoId) return <YouTubeEmbed videoId={videoId} />
                    return <img src={src} alt={alt} {...props} />
                  },
                },
              },
            }}
          >
            {article.content || article.description}
          </Markdown>
        </div>
      </article>
    </ScrollArea>
  )
})
