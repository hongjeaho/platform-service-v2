import Home from '@views/Home'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import AuthenticationLayout from '@/layout/AuthenticationLayout.tsx'
import BaseLayout from '@/layout/BaseLayout.tsx'
import ErrorPage from '@/layout/ErrorPage.tsx'
import FullScreenLayout from '@/layout/FullScreenLayout.tsx'
import ApplicationList from '@/views/implementer/application/List'
import LoginApplication from '@/views/login/LoginApplication'

const router: RouteObject[] = [
  {
    path: '/',
    element: <AuthenticationLayout />,
    children: [],
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'implementer/application',
        element: <ApplicationList />,
      },
    ],
  },
  {
    path: '/',
    element: <FullScreenLayout />,
    children: [
      {
        path: 'login',
        element: <LoginApplication />,
      },
    ],
  },
]

const options = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
}

export default createBrowserRouter(router, options)
