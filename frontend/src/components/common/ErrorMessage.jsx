import React from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft, Wifi, Server } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry, 
  showBackButton = false,
  type = 'error',
  title,
  className = ''
}) => {
  const navigate = useNavigate()

  const getIcon = () => {
    if (message.includes('Network') || message.includes('timeout')) {
      return <Wifi className="h-12 w-12 text-orange-500" />
    }
    if (message.includes('server') || message.includes('500')) {
      return <Server className="h-12 w-12 text-red-500" />
    }
    return <AlertTriangle className="h-12 w-12 text-red-500" />
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }
  }

  const getTitle = () => {
    if (title) return title
    if (message.includes('Network') || message.includes('timeout')) {
      return 'Connection Error'
    }
    if (message.includes('server') || message.includes('500')) {
      return 'Server Error'
    }
    if (message.includes('404') || message.includes('not found')) {
      return 'Not Found'
    }
    return 'Error'
  }

  const getSuggestion = () => {
    if (message.includes('Network') || message.includes('timeout')) {
      return 'Please check your internet connection and try again.'
    }
    if (message.includes('server') || message.includes('500')) {
      return 'Our servers are experiencing issues. Please try again in a few moments.'
    }
    if (message.includes('404') || message.includes('not found')) {
      return 'The requested resource could not be found.'
    }
    return 'Please try again or contact support if the problem persists.'
  }

  return (
    <div className={`card text-center py-12 ${getTypeStyles()} ${className}`}>
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {getTitle()}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {message}
      </p>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {getSuggestion()}
      </p>
      
      <div className="flex justify-center space-x-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
        
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        )}
      </div>
      
      {/* Backend Status Indicator */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Backend: https://ipl-analytics-backend-api.onrender.com
        </p>
      </div>
    </div>
  )
}

export default ErrorMessage
