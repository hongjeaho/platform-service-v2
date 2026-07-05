import './styles/globals.css'

import { RouterProvider } from 'react-router'

import { ReactQueryProvider as Providers } from './app/reactQuery.tsx'
import { router } from './app/routeRegistry.tsx'
import { ErrorBoundary } from './components/layout/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  )
}
