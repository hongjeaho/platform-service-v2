import { Component, type ErrorInfo } from 'react'

import type { ErrorBoundaryProps } from './ErrorBoundary.type'
import { FallbackPage } from './FallbackPage'

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // 다음 렌더링에서 폴백 UI를 표시하기 위해 상태 업데이트
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 (개발 환경에서는 콘솔에 출력)
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error)
      console.error('Error Info:', errorInfo)
    }

    // TODO: 프로덕션 환경에서는 Sentry 같은 에러 트래킹 서비스로 전송
    // if (Sentry) {
    //   Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    // }
  }

  handleResetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return <FallbackPage error={this.state.error} resetError={this.handleResetError} />
    }

    return this.props.children
  }
}
