import React from 'react'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ErrorMessage = ({ 
  message, 
  onRetry, 
  showHomeButton = false,
  showBackButton = false,
  title = "Something went wrong",
  type = "error" // error, warning, info
}) => {
  const navigate = useNavigate()

  const getIconAndColors = () => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        }
      case 'info':
        return {
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
    }
  }

  const { icon: Icon, iconColor, bgColor, borderColor } = getIconAndColors()

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-6`}>
      <div className="flex flex-col items-center text-center">
        <Icon className={`h-12 w-12 ${iconColor} mb-4`} />
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md">
          {message || 'An unexpected error occurred while loading the data. Please try again.'}
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
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
          
          {showHomeButton && (
            <button
              onClick={() => navigate('/')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
