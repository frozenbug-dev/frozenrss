import {IconDots, IconFolder, IconShare3, IconTrash, type Icon} from '@tabler/icons-react'
import {useQuery} from '@tanstack/react-query'
import {Link} from '@tanstack/react-router'

import {listFeedsOptions} from '#/lib/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavFeeds({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const {isMobile} = useSidebar()

  const {data: feeds, isLoading} = useQuery({
    ...listFeedsOptions({
      query: {
        limit: 10,
      },
    }),
  })

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Feeds</SidebarGroupLabel>
      <SidebarMenu>
        {!isLoading &&
          feeds &&
          feeds.feeds?.map(feed => (
            <SidebarMenuItem key={feed.id}>
              <SidebarMenuButton className="overflow-hidden" render={<Link to={feed.url} />}>
                {feed.iconUrl && <img src={feed.iconUrl} alt="feed icon" className="size-5 aspect-square" />}
                <span className="line-clamp-1">{new URL(feed.url).hostname}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
