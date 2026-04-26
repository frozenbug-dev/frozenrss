import {env} from '../env'
import {client} from './api-client/client.gen'

client.setConfig({
  baseUrl: typeof window === 'undefined' ? env.API_URL : '/',
})

export * from './api-client/@tanstack/react-query.gen'
export * from './api-client/types.gen'
