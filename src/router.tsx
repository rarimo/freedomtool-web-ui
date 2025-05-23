import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import MainLayout from '@/layouts/MainLayout'
import PollsLayout from '@/layouts/PollsLayout'
import Home from '@/pages/Home'

import { AppLoader, ErrorBoundaryFallback } from './common'
import HomeLayout from './layouts/HomeLayout'

export const createRouter = () => {
  const Poll = lazy(() => import('@/pages/Poll'))
  const ActivePolls = lazy(() => import('@/pages/Polls/ActivePolls'))
  const FinishedPolls = lazy(() => import('@/pages/Polls/FinishedPolls'))
  const DraftPolls = lazy(() => import('@/pages/Polls/DraftPolls'))
  const NewPoll = lazy(() => import('@/pages/NewPoll'))
  const Whitepaper = lazy(() => import('@/pages/Whitepaper'))

  return createHashRouter(
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
              <Suspense
                fallback={
                  <PollsLayout>
                    <AppLoader />
                  </PollsLayout>
                }
              >
                <PollsLayout>
                  <Outlet />
                </PollsLayout>
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: <Navigate to={RoutePaths.PollsActive} replace />,
              },
              {
                path: RoutePaths.PollsActive,
                element: (
                  <Suspense fallback={<></>}>
                    <ActivePolls />
                  </Suspense>
                ),
              },
              {
                path: RoutePaths.PollsFinished,
                element: (
                  <Suspense fallback={<></>}>
                    <FinishedPolls />
                  </Suspense>
                ),
              },
              {
                path: RoutePaths.PollsDrafts,
                element: (
                  <Suspense fallback={<></>}>
                    <DraftPolls />
                  </Suspense>
                ),
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
                element: (
                  <Suspense fallback={<AppLoader />}>
                    <NewPoll />
                  </Suspense>
                ),
              },
              {
                path: RoutePaths.Poll,
                element: (
                  <Suspense fallback={<></>}>
                    <Poll />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: RoutePaths.Whitepaper,
            element: (
              <Suspense fallback={<AppLoader />}>
                <Whitepaper />
              </Suspense>
            ),
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
