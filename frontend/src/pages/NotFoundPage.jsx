import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, ArrowLeft, Search, TrendingUp } from 'lucide-react'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const quickLinks = [
    {
      title: 'Head-to-Head Analysis',
      description: 'Compare batter vs bowler matchups',
      href: '/',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Player Comparison',
      description: 'Compare multiple players side by side',
      href: '/compare',
      icon: Search,
      color: 'green'
    },
    {
      title: 'Advanced Analytics',
      description: 'Explore partnerships, phases, and form',
      href: '/advanced',
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Page Not Found - IPL Analytics</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore our cricket analytics features instead." />
      </Helmet>

      <div className="min-h-96 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-gray-300 mb-4">
              404
            </div>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to exploring cricket analytics.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Or explore these popular features:
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 bg-${link.color}-100 dark:bg-${link.color}-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-${link.color}-200 dark:group-hover:bg-${link.color}-800/30 transition-colors`}>
                    <link.icon className={`h-6 w-6 text-${link.color}-600 dark:text-${link.color}-400`} />
                  </div>
                  <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-${link.color}-600 dark:group-hover:text-${link.color}-400 transition-colors`}>
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Need help?</strong> If you believe this is an error, please check the URL 
              or contact our support team. We're here to help you explore cricket analytics.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
