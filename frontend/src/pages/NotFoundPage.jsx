import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 btn-primary"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
