import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconRss,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import {useQuery} from '@tanstack/react-query'
import {Link} from '@tanstack/react-router'
import * as React from 'react'

import {authClient} from '#/lib/auth-client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import {NavFeeds} from './nav-feeds'
import {NavMain} from './nav-main'
import {NavSecondary} from './nav-secondary'
import {NavUser} from './nav-user'

const data = {
  navMain: [
    {
      title: 'Latest',
      url: '/dash',
      icon: IconDashboard,
    },
    {
      title: 'Feeds',
      url: '/dash/feeds',
      icon: IconRss,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {data: user} = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {data, error} = await authClient.getSession()
      if (error) throw error
      return data
    },
  })

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!" render={<Link to="/" />}>
              <IconInnerShadowTop className="size-5!" />
              <span className="text-base font-semibold">FrozenRSS</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavFeeds />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            avatar: user?.user.image || '',
            email: user?.user.email || '...',
            name: user?.user.name || '...',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
