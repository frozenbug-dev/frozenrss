import {createHono} from '../../lib/util/hono.ts'
import {createFeedRoute} from './create-feed.route.ts'
import {deleteFeedRoute} from './delete-feed.route.ts'
import {listFeedsRoute} from './list-feeds.route.ts'
import {updateFeedRoute} from './update-feed.route.ts'

export const feedRoutes = createHono()
  .route('/', createFeedRoute)
  .route('/', listFeedsRoute)
  .route('/', deleteFeedRoute)
  .route('/', updateFeedRoute)
