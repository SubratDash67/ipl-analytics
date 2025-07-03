import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Calculator, 
  Zap, 
  ArrowRight, 
  Database, 
  BarChart3,
  Star,
  History,
  Play
} from 'lucide-react'
import PlayerSearch from '../components/player/PlayerSearch'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { useApp } from '../components/contexts/AppContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { addRecentSearch, recentSearches, favorites } = useApp()
  const [selectedBatter, setSelectedBatter] = useState('')
  const [selectedBowler, setSelectedBowler] = useState('')

  const { data: summary, loading: summaryLoading, error: summaryError } = useApi(
    ['data-summary'],
    () => apiService.getDataSummary()
  )

  const handleAnalyze = () => {
    if (selectedBatter && selectedBowler) {
      addRecentSearch({
        batter: selectedBatter,
        bowler: selectedBowler,
        timestamp: new Date().toISOString()
      })
      navigate(`/head-to-head/${encodeURIComponent(selectedBatter)}/${encodeURIComponent(selectedBowler)}`)
    }
  }

  const handleQuickAnalysis = (search) => {
    navigate(`/head-to-head/${encodeURIComponent(search.batter)}/${encodeURIComponent(search.bowler)}`)
  }

  const stats = [
    {
      label: 'Total Matches',
      value: summary?.matches_count || 0,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'IPL matches analyzed'
    },
    {
      label: 'Ball Deliveries',
      value: summary?.deliveries_count || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Individual deliveries tracked'
    },
    {
      label: 'Unique Batters',
      value: summary?.batters || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Players who have batted'
    },
    {
      label: 'Unique Bowlers',
      value: summary?.bowlers || 0,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Players who have bowled'
    }
  ]

  const advancedFeatures = [
    {
      title: 'Partnership Analysis',
      description: 'Analyze batting partnerships and combinations',
      icon: Users,
      color: 'blue',
      link: '/advanced?tab=partnerships',
      features: ['Partnership runs', 'Strike rates', 'Boundary analysis']
    },
    {
      title: 'Phase Analysis',
      description: 'Powerplay, middle overs, and death overs performance',
      icon: Clock,
      color: 'green',
      link: '/advanced?tab=phases',
      features: ['Powerplay stats', 'Middle overs', 'Death overs']
    },
    {
      title: 'Form Analysis',
      description: 'Recent performance trends and consistency',
      icon: TrendingUp,
      color: 'purple',
      link: '/advanced?tab=form',
      features: ['Recent form', 'Consistency rating', 'Trend analysis']
    },
    {
      title: 'Win Probability',
      description: 'Real-time match situation calculator',
      icon: Calculator,
      color: 'orange',
      link: '/advanced?tab=probability',
      features: ['Live probability', 'Scenario analysis', 'Historical data']
    }
  ]

  return (
    <>
      <Helmet>
        <title>IPL Analytics Pro - Cricket Statistics & Analysis</title>
        <meta name="description" content="Comprehensive IPL cricket analytics from 2008-2024. Analyze player performance, head-to-head matchups, and advanced statistics." />
        <meta name="keywords" content="IPL, cricket, analytics, statistics, player analysis, head-to-head" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              IPL Analytics
              <span className="text-blue-600"> Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive statistical analysis of IPL matchups from 2008-2024. 
              Explore head-to-head performance, advanced analytics, and real-time insights.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>17 Seasons</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>ICC Compliant</span>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        {summaryLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Loading statistics..." />
          </div>
        ) : summaryError ? (
          <ErrorMessage 
            message="Failed to load statistics" 
            type="warning"
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card group hover:shadow-lg transition-all duration-300 ${stat.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                  <div className="text-xs text-gray-600">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Analysis Section */}
        <div className="card max-w-5xl mx-auto" style={{ overflow: 'visible', position: 'relative' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Head-to-Head Analysis
            </h2>
            <p className="text-gray-600 text-lg">
              Compare any batter vs bowler matchup with detailed statistics
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8" style={{ overflow: 'visible' }}>
            <div style={{ overflow: 'visible', zIndex: 20, position: 'relative' }}>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Users className="h-4 w-4 inline mr-2" />
                Select Batter
              </label>
              <PlayerSearch
                type="batter"
                onSelect={setSelectedBatter}
                placeholder="Search for a batter..."
                className="w-full"
              />
              {selectedBatter && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Selected: {selectedBatter}
                </div>
              )}
            </div>
            
            <div style={{ overflow: 'visible', zIndex: 15, position: 'relative' }}>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Select Bowler
              </label>
              <PlayerSearch
                type="bowler"
                onSelect={setSelectedBowler}
                placeholder="Search for a bowler..."
                className="w-full"
              />
              {selectedBowler && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Selected: {selectedBowler}
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={handleAnalyze}
              disabled={!selectedBatter || !selectedBowler}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center mx-auto space-x-3 ${
                selectedBatter && selectedBowler
                  ? 'btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="h-5 w-5" />
              <span>Analyze Head-to-Head</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            {selectedBatter && selectedBowler && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-blue-800 font-medium">
                    Ready to analyze: <strong>{selectedBatter}</strong> vs <strong>{selectedBowler}</strong>
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Click above to view detailed statistics and insights
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches && recentSearches.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <History className="h-5 w-5 mr-2" />
                Recent Searches
              </h3>
              <span className="text-sm text-gray-500">Last {recentSearches.length} searches</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSearches.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAnalysis(search)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-700">
                        {search.batter}
                      </p>
                      <p className="text-sm text-gray-600">vs {search.bowler}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Features Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              Advanced Analytics
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Explore cutting-edge cricket analytics with ICC-compliant statistics and professional-grade insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-l-transparent hover:border-l-blue-500"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${feature.color}-200 transition-colors group-hover:scale-110 transform duration-300`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2 mb-4">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 bg-${feature.color}-400 rounded-full mr-2`}></div>
                      {item}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="card bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-100">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Access</h3>
            <p className="text-gray-600">Jump to popular features and tools</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/compare"
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">Player Comparison</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Compare multiple players</p>
              </div>
            </Link>
            
            <Link
              to="/advanced?tab=probability"
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors">
                <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300">Win Calculator</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Match probability tool</p>
              </div>
            </Link>
            
            <Link
              to="/advanced?tab=form"
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300">Form Analysis</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recent performance trends</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
