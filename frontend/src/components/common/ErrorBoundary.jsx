import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Enhanced error logging for production monitoring [6]
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-96 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleReload}
                className="btn-primary flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
