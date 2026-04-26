import {createFileRoute, Outlet} from '@tanstack/react-router'

import {AppSidebar} from '#/components/layout/sidebar'
import {SidebarInset, SidebarProvider} from '#/components/ui/sidebar'
import {requireAuth} from '#/lib/auth-guard'

export const Route = createFileRoute('/dash')({
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider
      className="h-svh"
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
