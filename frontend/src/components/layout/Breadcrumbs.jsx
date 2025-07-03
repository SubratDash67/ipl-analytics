import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  const breadcrumbNameMap = {
    'head-to-head': 'Head-to-Head Analysis',
    'compare': 'Player Comparison',
    'advanced': 'Advanced Analytics',
    'player': 'Player Stats',
    'venue': 'Venue Analysis',
  }

  const getBreadcrumbName = (pathname, index) => {
    if (breadcrumbNameMap[pathname]) {
      return breadcrumbNameMap[pathname]
    }
    
    // Handle dynamic routes
    if (pathnames[index - 1] === 'player') {
      return decodeURIComponent(pathname)
    }
    
    if (pathnames[index - 1] === 'head-to-head' && index === pathnames.length - 1) {
      const batter = decodeURIComponent(pathnames[index - 1])
      const bowler = decodeURIComponent(pathname)
      return `${batter} vs ${bowler}`
    }
    
    return pathname.charAt(0).toUpperCase() + pathname.slice(1)
  }

  if (pathnames.length === 0) return null

  return (
    <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
          
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1
            const name = getBreadcrumbName(pathname, index)

            return (
              <li key={pathname} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2" />
                {isLast ? (
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{name}</span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumbs
