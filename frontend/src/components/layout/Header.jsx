import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, BarChart3, Map, Users, Zap } from 'lucide-react'

const Header = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              IPL Analytics
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Head-to-Head</span>
            </Link>
            
            <Link
              to="/compare"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/compare') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Compare</span>
            </Link>

            <Link
              to="/advanced"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/advanced') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Advanced</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              IPL 2008-2024
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
