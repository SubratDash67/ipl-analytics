import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  Zap, 
  Menu, 
  X, 
  Search,
  Moon,
  Sun,
  Settings,
  Github
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import PlayerSearch from '../player/PlayerSearch'
const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme, recentSearches } = useApp()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Apply theme to document on mount and theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ipl-analytics-theme') || 'light'
    if (savedTheme !== theme) {
      setTheme(savedTheme)
    }
  }, [])

  const navigation = [
    {
      name: 'Head-to-Head',
      href: '/',
      icon: BarChart3,
      active: isActive('/') && location.pathname === '/'
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: Users,
      active: isActive('/compare')
    },
    {
      name: 'Advanced',
      href: '/advanced',
      icon: Zap,
      active: isActive('/advanced')
    }
  ]

  const handleQuickSearch = (player) => {
    navigate(`/player/${encodeURIComponent(player)}`)
    setIsSearchOpen(false)
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="IPL Analytics Logo" 
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                // Fallback to icon if logo fails to load
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <BarChart3 
              className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors hidden" 
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              IPL Analytics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Search */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Quick Search</span>
              </button>
              
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                  <PlayerSearch
                    type="both"
                    onSelect={handleQuickSearch}
                    placeholder="Search any player..."
                    className="mb-3"
                  />
                  {recentSearches.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Searches</h4>
                      <div className="space-y-1">
                        {recentSearches.slice(0, 3).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => navigate(`/head-to-head/${encodeURIComponent(search.batter)}/${encodeURIComponent(search.bowler)}`)}
                            className="w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                          >
                            {search.batter} vs {search.bowler}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/SubratDash67"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
              <Settings className="h-4 w-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Version Badge */}
            <div className="hidden xl:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>IPL 2008-2024</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <PlayerSearch
                type="both"
                onSelect={(player) => {
                  handleQuickSearch(player)
                  setIsMobileMenuOpen(false)
                }}
                placeholder="Search any player..."
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
