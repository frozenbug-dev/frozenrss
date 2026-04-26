import {TanStackDevtools} from '@tanstack/react-devtools'
import {formDevtoolsPlugin} from '@tanstack/react-form-devtools'
import {hotkeysDevtoolsPlugin} from '@tanstack/react-hotkeys-devtools'
import type {QueryClient} from '@tanstack/react-query'
import {HeadContent, Link, Scripts, createRootRouteWithContext} from '@tanstack/react-router'
import {TanStackRouterDevtoolsPanel} from '@tanstack/react-router-devtools'

import {CreateFeedDialog} from '#/components/dialogs/create-feed-dialog'
import {DeleteDialog} from '#/components/dialogs/delete-dialog'
import {EditFeedDialog} from '#/components/dialogs/edit-feed-dialog'
import {Button} from '#/components/ui/button'
import {TooltipProvider} from '#/components/ui/tooltip'
import {getLocale} from '#/paraglide/runtime'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../assets/styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'FrozenRSS',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({children}: {children: React.ReactNode}) {
  return (
    <html lang={getLocale()} className="dark">
      <head>
        <HeadContent />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-background">
        <TooltipProvider>
          <CreateFeedDialog.Viewport />
          <DeleteDialog.Viewport />
          <EditFeedDialog.Viewport />

          {children}
        </TooltipProvider>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
            formDevtoolsPlugin(),
            hotkeysDevtoolsPlugin(),
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-lg text-default-500">This page could not be found.</p>
      <Link to="/">
        <Button variant="default">Go home</Button>
      </Link>
    </div>
  )
}
