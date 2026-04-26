import {IconPencil, IconRss, IconTrash} from '@tabler/icons-react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {createFileRoute} from '@tanstack/react-router'

import {DeleteDialog} from '#/components/dialogs/delete-dialog'
import {EditFeedDialog} from '#/components/dialogs/edit-feed-dialog'
import {Button} from '#/components/ui/button'
import {Card, CardDescription, CardContent, CardTitle} from '#/components/ui/card'
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from '#/components/ui/empty'
import {Skeleton} from '#/components/ui/skeleton'
import {deleteFeedMutation, listFeedsQueryKey, listFeedsOptions} from '#/lib/api'

export const Route = createFileRoute('/dash/feeds')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const {data, isLoading} = useQuery({
    ...listFeedsOptions({query: {limit: 100}}),
  })

  const deleteFeed = useMutation({
    ...deleteFeedMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: listFeedsQueryKey()})
    },
  })

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Feeds</h1>
          <p className="text-sm text-muted-foreground">Manage your RSS feed subscriptions.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({length: 4}).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data?.feeds?.length ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconRss />
            </EmptyMedia>
            <EmptyTitle>No feeds yet</EmptyTitle>
            <EmptyDescription>Add your first RSS feed to get started.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {data.feeds.map(feed => (
            <Card key={feed.id} size="sm">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted">
                      {feed.iconUrl ? (
                        <img src={feed.iconUrl} alt="" className="size-5 shrink-0 rounded" />
                      ) : (
                        <IconRss size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">{feed.title ?? new URL(feed.url).hostname}</CardTitle>
                      <CardDescription className="truncate">{feed.url}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        EditFeedDialog.open('edit-feed', {
                          feedId: feed.id,
                          feedUrl: feed.url,
                          feedTitle: feed.title,
                          feedDescription: feed.description,
                        })
                      }
                    >
                      <IconPencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() =>
                        DeleteDialog.open('delete-feed', {
                          title: 'Delete feed?',
                          description: (
                            <>
                              This will permanently delete <strong>{feed.title ?? feed.url}</strong> and all its
                              articles. This action cannot be undone.
                            </>
                          ),
                          actionLabel: 'Delete',
                          onConfirm: () => deleteFeed.mutateAsync({path: {id: feed.id}}),
                        })
                      }
                    >
                      <IconTrash />
                    </Button>
                  </div>
                </div>
                {feed.error && <p className="text-xs text-destructive">{feed.error}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
