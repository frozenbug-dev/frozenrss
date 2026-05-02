import {useHotkey} from '@tanstack/react-hotkeys'
import {useInfiniteQuery} from '@tanstack/react-query'
import {createFileRoute, useNavigate, useSearch} from '@tanstack/react-router'
import {useVirtualizer, type VirtualItem} from '@tanstack/react-virtual'
import {isSameDay} from 'date-fns/isSameDay'
import {Calendar1} from 'lucide-react'
import {useCallback, useMemo, useRef, type Ref} from 'react'
import * as z from 'zod'

import {ArticleContent} from '#/components/article/article-content'
import {ArticlePreview, ArticlePreviewSkeleton} from '#/components/article/article-list-item'
import {ProgressiveBlur} from '#/components/decorations/progressive-blur'
import {useFocusHelper} from '#/hooks/use-focus-helper'
import {listArticlesInfiniteOptions, type Article} from '#/lib/api'
import {formatDate} from '#/lib/date-utils'

const dashSearchSchema = z.object({
  articleId: z.string().optional(),
})

export const Route = createFileRoute('/dash/')({
  validateSearch: dashSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({from: '/dash/'})

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    ...listArticlesInfiniteOptions(),
    getNextPageParam: lastPage => lastPage.cursor,
    initialPageParam: {
      query: {
        limit: 20,
      },
    },
  })
  const articles = useMemo(() => data?.pages.flatMap(page => page.articles) ?? [], [data])

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: data?.pages?.[0].count || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,

    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  const lastItem = virtualItems[virtualItems.length - 1]
  if (lastItem && lastItem.index >= articles.length - 1 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }

  const {getCurrentFocusIndex, focusElementByIndex} = useFocusHelper(parentRef.current)
  useHotkey('ArrowDown', () => {
    const index = getCurrentFocusIndex()
    if (index) focusElementByIndex(index + 1)
  })
  useHotkey('ArrowUp', () => {
    const index = getCurrentFocusIndex()
    if (index) focusElementByIndex(index - 1)
  })

  return (
    <div className="flex h-full">
      <div ref={parentRef} className="w-full max-w-md overflow-auto border-r no-scrollbar relative">
        {/*<header className="h-12 bg-sidebar/50 sticky top-0 z-10 backdrop-blur-lg"></header>*/}
        <ProgressiveBlur className="z-10 sticky flex items-center h-16 px-3" backgroundColor="white">
          Hello
        </ProgressiveBlur>

        {isLoading ? (
          <div className="flex flex-col gap-1 p-3">
            {Array.from({length: 8}).map((_, i) => (
              <ArticlePreviewSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div style={{height: `${virtualizer.getTotalSize()}px`}} className="relative">
            <div
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
              }}
            >
              {virtualItems.map(virtualRow => (
                <VirtualArticlePreview
                  row={virtualRow}
                  key={virtualRow.index}
                  articles={articles}
                  loading={isFetchingNextPage}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <ArticleContent articleId={search.articleId} />
      </div>
    </div>
  )
}

function VirtualArticlePreview({
  row,
  articles,
  ref,
  loading = true,
}: {
  row: VirtualItem
  articles: Article[]
  ref?: Ref<HTMLDivElement>
  loading?: boolean
}) {
  const search = useSearch({from: '/dash/'})
  const navigate = useNavigate({from: '/dash/'})

  const viewArticle = useCallback(
    (articleId: string) => {
      navigate({search: {articleId}, replace: true})
    },
    [navigate]
  )

  const isLoaderRow = row.index >= articles.length
  if (isLoaderRow && loading) {
    return (
      <div
        key={row.key}
        data-index={row.index}
        ref={ref}
        className="flex items-center justify-center p-4 text-sm text-muted-foreground"
      >
        Loading more...
      </div>
    )
  }

  const article = articles[row.index]
  if (!article)
    return (
      <div
        key={row.key}
        data-index={row.index}
        ref={ref}
        className="flex items-center justify-center px-4 py-8 text-sm text-muted-foreground"
      >
        You reached the end.
      </div>
    )

  const prevArticle = articles[row.index - 1]

  const prevArticleDate = prevArticle?.updatedAt
  const articleDate = article.updatedAt
  const dateSeparator =
    prevArticleDate && articleDate && !isSameDay(new Date(prevArticleDate), new Date(articleDate))
      ? new Date(articleDate)
      : undefined

  return (
    <article key={row.key} data-index={row.index} ref={ref}>
      {dateSeparator && (
        <div className="h-8 flex items-center px-3 text-xs border-t border-b border-accent bg-accent/25 gap-x-1 text-muted-foreground">
          <Calendar1 size={12} />
          {formatDate(dateSeparator)}
        </div>
      )}

      <ArticlePreview
        article={article}
        isActive={search.articleId === article.id}
        onSelect={() => viewArticle(article.id)}
        data-focus-index={row.index}
      />
    </article>
  )
}
