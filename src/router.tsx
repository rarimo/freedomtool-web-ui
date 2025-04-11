import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import MainLayout from '@/layouts/MainLayout'
import PollsLayout from '@/layouts/PollsLayout'
import Home from '@/pages/Home'
import Poll from '@/pages/Poll'
import ActivePolls from '@/pages/Polls/ActivePolls'
import FinishedPolls from '@/pages/Polls/FinishedPolls'

import { ErrorBoundaryFallback } from './common'
import HomeLayout from './layouts/HomeLayout'
import NewPoll from './pages/NewPoll'
import Whitepaper from './pages/Whitepaper'

export const createRouter = () => {
  return createBrowserRouter(
    [
      {
        path: RoutePaths.Home,
        element: <Outlet />,
        errorElement: <ErrorBoundaryFallback onReset={() => window.location.reload()} />,
        children: [
          {
            index: true,
            element: (
              <HomeLayout>
                <Home />
              </HomeLayout>
            ),
          },
          {
            path: RoutePaths.Polls,
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
                path: RoutePaths.PollsFinished,
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
            path: RoutePaths.Whitepaper,
            element: <Whitepaper />,
          },
          {
            path: '*',
            element: <Navigate to={RoutePaths.Home} replace />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate replace to={RoutePaths.Home} />,
      },
    ],
    {
      future: { v7_relativeSplatPath: true },
    },
  )
}
