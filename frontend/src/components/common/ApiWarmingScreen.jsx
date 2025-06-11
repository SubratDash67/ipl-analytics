import React, { useState, useEffect } from 'react'
import { 
  Server, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Clock,
  Zap,
  Database
} from 'lucide-react'

const ApiWarmingScreen = ({ 
  isChecking, 
  attempts, 
  error, 
  onRetry 
}) => {
  const [dots, setDots] = useState('')
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    "Waking up the cricket analytics engine",
    "Loading IPL data from 2008-2024", 
    "Preparing statistical calculations",
    "Almost ready for cricket analysis",
    "Finalizing ICC-compliant metrics"
  ]

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [messages.length])

  const getStatusMessage = () => {
    if (error) {
      return "API connection failed"
    }
    if (attempts === 0) {
      return "Initializing connection"
    }
    if (attempts < 3) {
      return "Starting up backend services"
    }
    if (attempts < 8) {
      return "Backend is warming up"
    }
    return "Almost ready"
  }

  const getEstimatedTime = () => {
    if (attempts < 3) return "30-45 seconds"
    if (attempts < 8) return "15-30 seconds"
    return "Any moment now"
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              {isChecking ? (
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              ) : error ? (
                <AlertCircle className="h-10 w-10 text-white" />
              ) : (
                <CheckCircle className="h-10 w-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              IPL Analytics
            </h1>
          </div>

          {/* Status Message */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {getStatusMessage()}{dots}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {messages[currentMessage]}
            </p>
            
            {!error && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Estimated time: {getEstimatedTime()}</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {isChecking && !error && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Attempt {attempts + 1}</span>
                <span>{Math.min(((attempts + 1) / 10) * 100, 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(((attempts + 1) / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm mb-3">{error}</p>
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          )}

          {/* Info Cards */}
          {!error && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Database className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">17 Seasons</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Server className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Live Backend</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Real-time</div>
              </div>
            </div>
          )}

          {/* Technical Info */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Backend hosted on Render (free tier)</p>
            <p>Cold starts may take 30-60 seconds</p>
            <p className="font-mono">api.onrender.com</p>
          </div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default ApiWarmingScreen
