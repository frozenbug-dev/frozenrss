import {OpenWorkflow} from 'openworkflow'
import {BackendPostgres} from 'openworkflow/postgres'

import {ENV} from '../env.js'

export const ow = new OpenWorkflow({
  backend: await BackendPostgres.connect(ENV.DATABASE.URL),
})
