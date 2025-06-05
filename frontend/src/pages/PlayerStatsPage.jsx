import React, { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, User, Target, TrendingUp } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import PlayerOverview from '../components/player/PlayerOverview'
import MatchupsList from '../components/player/MatchupsList'
import FilterPanel from '../components/filters/FilterPanel'

const PlayerStatsPage = () => {
  const { playerName } = useParams()
  const [searchParams] = useSearchParams()
  const playerType = searchParams.get('type') || 'batter'
  const [filters, setFilters] = useState({})

  const { data: playerStats, loading: statsLoading, error: statsError } = useApi(
    () => apiService.getPlayerStats(playerName, playerType, filters),
    [playerName, playerType, filters]
  )

  const { data: matchups, loading: matchupsLoading } = useApi(
    () => apiService.getPlayerMatchups(playerName, playerType),
    [playerName, playerType]
  )

  const { data: availableFilters } = useApi(
    () => apiService.getFilters(),
    []
  )

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (statsError || !playerStats) {
    return (
      <ErrorMessage 
        message="Failed to load player statistics"
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link 
          to="/" 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          {playerType === 'batter' ? (
            <Target className="h-8 w-8 text-blue-600" />
          ) : (
            <TrendingUp className="h-8 w-8 text-green-600" />
          )}
          <h1 className="text-3xl font-bold text-gray-900">{playerName}</h1>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
            {playerType}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <FilterPanel
          filters={filters}
          availableFilters={availableFilters}
          onFilterChange={setFilters}
          compact
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PlayerOverview 
            stats={playerStats.stats}
            playerType={playerType}
            totalDeliveries={playerStats.total_deliveries}
          />
        </div>
        
        <div>
          <MatchupsList
            matchups={matchups?.matchups || []}
            playerName={playerName}
            playerType={playerType}
            loading={matchupsLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default PlayerStatsPage
