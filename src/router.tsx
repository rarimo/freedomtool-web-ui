import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'

import { ErrorBoundaryFallback } from './common'
import MainLayout from './layouts/MainLayout'
import CreateVote from './pages/CreateVote'

export const createRouter = () => {
  const Votes = lazy(() => import('@/pages/Votes'))

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
          element: (
            <Suspense fallback={<p>Loading...</p>}>
              <CreateVote />
            </Suspense>
          ),
        },
        {
          path: RoutePaths.Vote,
          element: <p>Vote page</p>,
        },
      ],
    },
  ])
}
