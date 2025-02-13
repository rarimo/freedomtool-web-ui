import { type RouteObject, useRoutes } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import { createDeepPath } from '@/helpers'

// HACK: react-router v6 doesn't support absolute paths in the nested routes
// Discussion: https://github.com/remix-run/react-router/discussions/9841
export const useNestedRoutes = (root: RoutePaths, routes: RouteObject[]) => {
  return useRoutes(
    routes.map(({ path, ...rest }) => ({
      path: path && createDeepPath(path.replace(root, '')),
      ...rest,
    })),
  )
}
