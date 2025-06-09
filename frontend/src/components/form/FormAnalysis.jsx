import React, { useState } from 'react'
import { TrendingUp, User, Calendar, Target } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PlayerSearch from '../player/PlayerSearch'
import FormChart from './FormChart'
import FormMetrics from './FormMetrics'
import RecentMatches from './RecentMatches'

const FormAnalysis = ({ player: initialPlayer, onPlayerSelect }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(initialPlayer || '')
  const [playerType, setPlayerType] = useState('batter')
  const [matchCount, setMatchCount] = useState(10)

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    if (onPlayerSelect) {
      onPlayerSelect(player)
    }
  }

  const { data: formData, loading, error, refetch } = useApi(
    ['form-analysis', selectedPlayer, playerType, matchCount],
    () => selectedPlayer ? 
      advancedApiService.getFormAnalysis(selectedPlayer, playerType, matchCount) : 
      Promise.resolve(null),
    {
      enabled: !!(selectedPlayer && selectedPlayer.trim() !== ''),
      retry: 2
    }
  )

  if (!selectedPlayer) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
              Form Analysis
            </h2>
            <p className="text-gray-600">
              Analyze recent performance trends, consistency ratings, and form patterns
            </p>
          </div>

          <div className="card max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Player</h3>
            
            <div className="mb-4">
              <label className="label">Player Type</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPlayerType('batter')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    playerType === 'batter'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Batter
                </button>
                <button
                  onClick={() => setPlayerType('bowler')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    playerType === 'bowler'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Bowler
                </button>
              </div>
            </div>

            <PlayerSearch
              type={playerType}
              onSelect={handlePlayerSelect}
              placeholder={`Search for a ${playerType}...`}
              className="w-full"
            />
            
            {selectedPlayer && (
              <div className="mt-3 text-sm text-green-600 flex items-center justify-center">
                <User className="h-4 w-4 mr-1" />
                Selected: {selectedPlayer}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Analyzing recent form..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load form analysis" 
        onRetry={refetch}
      />
    )
  }

  if (!formData || formData.error) {
    return (
      <ErrorMessage 
        message={formData?.error || "No form data available"} 
        onRetry={refetch}
        type="info"
      />
    )
  }

  const formStats = formData.form_stats || {}
  const recentMatches = formData.recent_matches || []

  return (
    <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
            Recent Form - {selectedPlayer}
          </h2>
          <p className="text-gray-600">
            {playerType === 'batter' ? 'Batting' : 'Bowling'} performance analysis
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Matches:</label>
              <select 
                value={matchCount} 
                onChange={(e) => setMatchCount(Number(e.target.value))}
                className="input-field w-20 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
            <button 
              onClick={() => setSelectedPlayer('')}
              className="btn-secondary text-sm"
            >
              Change Player
            </button>
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

        {/* Recent Matches */}
        <RecentMatches 
          matches={recentMatches} 
          playerType={playerType}
          player={selectedPlayer}
        />
      </div>
    </div>
  )
}

export default FormAnalysis
