import type {ButtonHTMLAttributes, Ref} from 'react'

import type {Article} from '#/lib/api'
import {formatDate, formatTimeDistance} from '#/lib/date-utils'
import {cn} from '#/lib/utils'

import {Skeleton} from '../ui/skeleton'

interface ArticlePreviewProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
  article: Article
  isActive: boolean
  onSelect: () => void
}

export function ArticlePreview({article, isActive, ref, onSelect, className, ...props}: ArticlePreviewProps) {
  const hostname = article.feed ? new URL(article.feed.url).hostname : ''
  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full gap-3 p-3 text-left transition-colors',
        'focus:outline-none',
        isActive ? 'bg-primary/25 focus:bg-primary/50' : 'focus:bg-accent/50 hover:bg-accent/50',
        className
      )}
      onMouseEnter={e => {
        e.currentTarget.focus()
        e.currentTarget.setAttribute('data-focused-id', article.id)
      }}
      onMouseLeave={e => {
        e.currentTarget.removeAttribute('data-focused-id')
      }}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className="truncate text-sm font-medium">{article.title}</h2>
        {article.description && <p className="line-clamp-2 text-xs text-muted-foreground">{article.description}</p>}

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground line-clamp-1">
          {article.feed && (
            <>
              <span className="flex gap-x-1 items-center">
                {article.feed.iconUrl && (
                  <img src={article.feed.iconUrl} alt={`Favicon of feed ${hostname}`} className="size-3 rounded-full" />
                )}
                {hostname}
              </span>
              <span>&middot;</span>
            </>
          )}
          {article.author && (
            <>
              <span className="truncate">{article.author}</span>
              <span>&middot;</span>
            </>
          )}

          <time dateTime={article.updatedAt ?? article.createdAt}>
            {formatTimeDistance(new Date(article.updatedAt ?? article.createdAt))}
          </time>
        </div>
      </div>
      {article.imageUrl && <img src={article.imageUrl} alt="" className="size-16 shrink-0 rounded object-cover" />}
    </button>
  )
}

export function ArticlePreviewSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="size-16 shrink-0 rounded" />
    </div>
  )
}
