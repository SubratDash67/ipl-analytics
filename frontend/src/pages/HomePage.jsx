import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Users, Clock, TrendingUp, Calculator, Zap, ArrowRight, Database, BarChart3 } from 'lucide-react'
import PlayerSearch from '../components/player/PlayerSearch'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'

const HomePage = () => {
  const navigate = useNavigate()
  const [selectedBatter, setSelectedBatter] = useState('')
  const [selectedBowler, setSelectedBowler] = useState('')

  const { data: summary, loading: summaryLoading } = useApi(
    () => apiService.getDataSummary(),
    []
  )

  const handleAnalyze = () => {
    if (selectedBatter && selectedBowler) {
      navigate(`/head-to-head/${encodeURIComponent(selectedBatter)}/${encodeURIComponent(selectedBowler)}`)
    }
  }

  const stats = [
    {
      label: 'Total Matches',
      value: summary?.matches_count || 0,
      icon: Database,
      color: 'text-blue-600'
    },
    {
      label: 'Ball Deliveries',
      value: summary?.deliveries_count || 0,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Unique Batters',
      value: summary?.batters || 0,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: 'Unique Bowlers',
      value: summary?.bowlers || 0,
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ]

  const advancedFeatures = [
    {
      title: 'Partnership Analysis',
      description: 'Analyze batting partnerships and combinations',
      icon: Users,
      color: 'blue',
      link: '/advanced?tab=partnerships'
    },
    {
      title: 'Phase Analysis',
      description: 'Powerplay, middle overs, and death overs performance',
      icon: Clock,
      color: 'green',
      link: '/advanced?tab=phases'
    },
    {
      title: 'Form Analysis',
      description: 'Recent performance trends and consistency',
      icon: TrendingUp,
      color: 'purple',
      link: '/advanced?tab=form'
    },
    {
      title: 'Win Probability',
      description: 'Real-time match situation calculator',
      icon: Calculator,
      color: 'orange',
      link: '/advanced?tab=probability'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto" style={{ overflow: 'visible' }}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          IPL Analytics Pro
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive statistical analysis of IPL matchups from 2008-2024. 
          Explore head-to-head performance, advanced analytics, and real-time insights.
        </p>
      </div>

      {summaryLoading ? (
        <LoadingSpinner size="lg" className="mb-12" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Analysis Section */}
      <div className="card max-w-4xl mx-auto mb-12" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Head-to-Head Analysis
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8" style={{ overflow: 'visible' }}>
          <div style={{ overflow: 'visible', zIndex: 20, position: 'relative' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Batter
            </label>
            <PlayerSearch
              type="batter"
              onSelect={setSelectedBatter}
              placeholder="Search for a batter..."
              className="w-full"
            />
          </div>
          
          <div style={{ overflow: 'visible', zIndex: 15, position: 'relative' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bowler
            </label>
            <PlayerSearch
              type="bowler"
              onSelect={setSelectedBowler}
              placeholder="Search for a bowler..."
              className="w-full"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={!selectedBatter || !selectedBowler}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedBatter && selectedBowler
                ? 'btn-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Analyze Head-to-Head
          </button>
        </div>

        {selectedBatter && selectedBowler && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-center text-blue-800">
              <strong>{selectedBatter}</strong> vs <strong>{selectedBowler}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Features Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Zap className="h-6 w-6 text-blue-600 mr-2" />
            Advanced Analytics
          </h2>
          <p className="text-gray-600">
            Explore cutting-edge cricket analytics with ICC-compliant statistics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advancedFeatures.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group card hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${feature.color}-200 transition-colors`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {feature.description}
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                <span>Explore</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/compare"
            className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <span className="font-medium">Player Comparison</span>
          </Link>
          <Link
            to="/advanced?tab=probability"
            className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calculator className="h-5 w-5 text-green-600 mr-3" />
            <span className="font-medium">Win Calculator</span>
          </Link>
          <Link
            to="/advanced?tab=form"
            className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
            <span className="font-medium">Form Analysis</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
