import {client} from './api-client/client.gen'
import {env} from '../env'

client.setConfig({
  baseUrl:
    typeof window === 'undefined'
      ? env.API_URL
      : '/api',
})
