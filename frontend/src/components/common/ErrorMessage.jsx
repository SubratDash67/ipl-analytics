import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message || 'An unexpected error occurred while loading the data.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
