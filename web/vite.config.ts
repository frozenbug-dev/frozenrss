import {heyApiPlugin} from '@hey-api/vite-plugin'
import {paraglideVitePlugin} from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import {devtools} from '@tanstack/devtools-vite'
import {tanstackStart} from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import ky from 'ky'
import {nitro} from 'nitro/vite'
import {defineConfig} from 'vite'

// we want to wait for the server to come up
const openapiUrl = 'http://localhost:4000/api/openapi.json'
await ky.get(openapiUrl, {
  retry: {
    limit: 5,
  },
})

export default defineConfig({
  resolve: {tsconfigPaths: true},
  plugins: [
    devtools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['url', 'baseLocale'],
    }),
    nitro({
      rollupConfig: {external: [/^@sentry\//]},
      devProxy: {
        '/api/**': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    }),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    viteReact(),
    heyApiPlugin({
      config: {
        input: openapiUrl,
        output: {
          path: 'src/lib/api-client',
          header: ctx => ['/* eslint-disable */', ...ctx.defaultValue],
          postProcess: ['oxfmt'],
        },
        plugins: ['@tanstack/react-query'],
      },
      vite: {
        apply: 'serve',
      },
    }),
  ],
})
