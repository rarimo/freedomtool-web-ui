import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import DashboardLayout from '@/layouts/DashboardLayout'
import MainLayout from '@/layouts/MainLayout'
import ActivePolls from '@/pages/Dashboard/ActivePolls'
import DraftPolls from '@/pages/Dashboard/DraftPolls'
import FinishedPolls from '@/pages/Dashboard/FinishedPolls'

import { ErrorBoundaryFallback } from './common'
import CreatePoll from './pages/CreatePoll'
import Vote from './pages/Vote'

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
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={RoutePaths.DashboardActive} replace />,
              },
              {
                path: RoutePaths.DashboardActive,
                element: <ActivePolls />,
              },
              {
                path: RoutePaths.DashboardHistory,
                element: <FinishedPolls />,
              },
              {
                path: RoutePaths.DashboardDraft,
                element: <DraftPolls />,
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
                path: RoutePaths.VotesNew,
                element: <CreatePoll />,
              },
              {
                path: RoutePaths.Vote,
                element: <Vote />,
              },
            ],
          },
        ],
      },
    ],
    {
      future: { v7_relativeSplatPath: true },
    },
  )
}
