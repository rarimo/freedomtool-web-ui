import { JsonApiClient } from '@distributedlab/jac'

import { config } from '@/config'

export const DEFAULT_PAGE_LIMIT = 15

export const api = new JsonApiClient({
  baseUrl: config.API_URL,
})
