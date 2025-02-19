import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'

import { ErrorBoundaryFallback } from './common'
import MainLayout from './layouts/MainLayout'
import CreateVote from './pages/CreateVote'
import Vote from './pages/Vote'
import Votes from './pages/Votes'

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
          element: <Navigate to={RoutePaths.Votes} replace />,
        },
        {
          path: RoutePaths.Votes,
          element: <Votes />,
        },
        {
          path: RoutePaths.VotesNew,
          element: <CreateVote />,
        },
        {
          path: RoutePaths.Vote,
          element: <Vote />,
        },
      ],
    },
  ])
}
