import type { ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
}

export interface FallbackPageProps {
  error?: Error
  resetError?: () => void
}
