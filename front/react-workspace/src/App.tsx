import './styles/globals.css'

import { RouterProvider } from 'react-router'

import { Providers } from './app/providers'
import { router } from './app/router'
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
