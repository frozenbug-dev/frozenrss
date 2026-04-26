import {createFileRoute, Outlet} from '@tanstack/react-router'

import {AppSidebar} from '#/components/layout/sidebar'
import {SidebarProvider, SidebarInset} from '#/components/ui/sidebar'
import {requireAuth} from '#/lib/auth-guard'

export const Route = createFileRoute('/')({
  beforeLoad: requireAuth,
  component: Home,
})

function Home() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
