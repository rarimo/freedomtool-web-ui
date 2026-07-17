import { Link as RouterLink } from 'react-router-dom'

import { config } from '@/config'
import { RoutePaths } from '@/enums'

export const createDeepPath = (path: string) => {
  return path.endsWith('*') ? path : `${path}/*`
}

// Landing CTAs lead to the poll app. On a split deployment (landing on its own
// host, poll app on another) POLL_APP_URL points them at the external host.
export const getCreatePollLinkProps = () =>
  config.POLL_APP_URL
    ? ({ component: 'a', href: `${config.POLL_APP_URL}/#${RoutePaths.NewPoll}` } as const)
    : ({ component: RouterLink, to: RoutePaths.NewPoll } as const)
