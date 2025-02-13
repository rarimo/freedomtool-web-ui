import { createBrowserRouter, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'

import { ErrorBoundaryFallback } from './common'
import MainLayout from './layouts/MainLayout'

export const createRouter = () => {
  return createBrowserRouter([
    {
      path: RoutePaths.Home,
      element: (
        <MainLayout>
          <Outlet />
        </MainLayout>
      ),
      ErrorBoundary: () => <ErrorBoundaryFallback onReset={() => window.location.reload()} />,
      children: [
        {
          index: true,
          element: <p>Home</p>,
        },
        {
          path: RoutePaths.Votes,
          element: <p>Votes list</p>,
        },
        {
          path: RoutePaths.VotesNew,
          element: <p>Create vote</p>,
        },
        {
          path: RoutePaths.Vote,
          element: <p>Vote page</p>,
        },
      ],
    },
  ])
}
