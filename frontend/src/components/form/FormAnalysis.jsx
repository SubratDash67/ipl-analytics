import React, { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Activity, Target } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import FormChart from './FormChart'
import FormMetrics from './FormMetrics'
import RecentMatches from './RecentMatches'

const FormAnalysis = ({ player, playerType = 'batter' }) => {
  const [matchCount, setMatchCount] = useState(10)
  
  const apiCall = useMemo(() => 
    (signal) => advancedApiService.getFormAnalysis(player, playerType, matchCount, signal),
    [player, playerType, matchCount]
  )

  const { data: formData, loading, error, refetch } = useApi(
    ['form-analysis', player, playerType, matchCount],
    apiCall
  )

  const handleMatchCountChange = (count) => {
    setMatchCount(count)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Analyzing recent form..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message="Failed to load form analysis" onRetry={refetch} />
  }

  if (!formData || formData.error) {
    return (
      <div className="card text-center py-8">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recent form data available</p>
      </div>
    )
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50'
      case 'declining':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formStats = formData.form_stats
  const recentMatches = formData.recent_matches || []

  return (
    <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Activity className="h-6 w-6 text-blue-600 mr-2" />
              Recent Form - {player}
            </h2>
            <p className="text-gray-600 mt-1">
              {playerType === 'batter' ? 'Batting' : 'Bowling'} performance analysis
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Matches:</span>
            {[5, 10, 15, 20].map(count => (
              <button
                key={count}
                onClick={() => handleMatchCountChange(count)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  matchCount === count
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Form Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{formStats.matches_played}</div>
            <div className="text-sm text-gray-600">Matches Played</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {formStats.runs_scored}
            </div>
            <div className="text-sm text-gray-600">
              {playerType === 'batter' ? 'Runs Scored' : 'Runs Conceded'}
            </div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {playerType === 'batter' ? 
                (formStats.strike_rate ? `${formStats.strike_rate}%` : 'N/A') :
                (formStats.strike_rate ? formStats.strike_rate.toFixed(2) : 'N/A')
              }
            </div>
            <div className="text-sm text-gray-600">
              {playerType === 'batter' ? 'Strike Rate' : 'Economy Rate'}
            </div>
          </div>
          
          <div className="card text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(formStats.form_trend)}`}>
              {getTrendIcon(formStats.form_trend)}
              <span className="ml-1 capitalize">{formStats.form_trend.replace('_', ' ')}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Form Trend</div>
          </div>
        </div>

        {/* Form Metrics */}
        <FormMetrics formStats={formStats} playerType={playerType} />

        {/* Form Chart */}
        <FormChart 
          recentMatches={recentMatches} 
          playerType={playerType}
          formTrend={formStats.form_trend}
        />

        {/* Recent Matches Table */}
        <RecentMatches 
          matches={recentMatches} 
          playerType={playerType} 
          player={player}
        />
      </div>
    </div>
  )
}

export default FormAnalysis
