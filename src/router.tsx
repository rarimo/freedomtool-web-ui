import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import MainLayout from '@/layouts/MainLayout'
import PollsLayout from '@/layouts/PollsLayout'
import ActivePolls from '@/pages/Polls/ActivePolls'
import FinishedPolls from '@/pages/Polls/FinishedPolls'

import { ErrorBoundaryFallback } from './common'
import NewPoll from './pages/NewPoll'
import Poll from './pages/Poll'

export const createRouter = () => {
  return createBrowserRouter(
    [
      {
        path: RoutePaths.Home,
        element: <Outlet />,
        errorElement: <ErrorBoundaryFallback onReset={() => window.location.reload()} />,
        children: [
          {
            element: (
              <PollsLayout>
                <Outlet />
              </PollsLayout>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={RoutePaths.PollsActive} replace />,
              },
              {
                path: RoutePaths.PollsActive,
                element: <ActivePolls />,
              },
              {
                path: RoutePaths.PollsHistory,
                element: <FinishedPolls />,
              },
            ],
          },
          {
            element: (
              <MainLayout>
                <Outlet />
              </MainLayout>
            ),
            children: [
              {
                path: RoutePaths.NewPoll,
                element: <NewPoll />,
              },
              {
                path: RoutePaths.Poll,
                element: <Poll />,
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to={RoutePaths.Home} replace />,
          },
        ],
      },
    ],
    {
      future: { v7_relativeSplatPath: true },
    },
  )
}
