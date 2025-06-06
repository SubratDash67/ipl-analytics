import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  User, 
  TrendingUp, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  MapPin,
  Users,
  Zap
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import { cricketHelpers } from '../utils/cricketHelpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/stats/StatCard'
import PlayerChart from '../components/charts/PlayerChart'

const PlayerPage = () => {  // Changed from PlayerStatsPage to PlayerPage
  const { playerName } = useParams()
  const [playerType, setPlayerType] = useState('batter')
  const decodedPlayerName = decodeURIComponent(playerName)

  const { data, loading, error, refetch } = useApi(
    ['player-stats', decodedPlayerName, playerType],
    () => apiService.getPlayerStats(decodedPlayerName, playerType)
  )

  const { data: matchupsData } = useApi(
    ['player-matchups', decodedPlayerName, playerType],
    () => apiService.getPlayerMatchups(decodedPlayerName, playerType)
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading player statistics..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load player statistics" 
        onRetry={refetch}
        showBackButton
      />
    )
  }

  if (!data || data.error) {
    return (
      <ErrorMessage 
        message={data?.error || "No player data available"} 
        onRetry={refetch}
        showBackButton
        type="info"
        title="Player Not Found"
      />
    )
  }

  const stats = data.stats || {}

  return (
    <>
      <Helmet>
        <title>{`${decodedPlayerName} - Player Statistics | IPL Analytics`}</title>
        <meta name="description" content={`Comprehensive statistics and analysis for ${decodedPlayerName}. View career performance, recent form, and detailed insights.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                <User className="h-8 w-8 mr-3 text-blue-600" />
                {decodedPlayerName}
              </h1>
              <p className="text-gray-600">
                Player statistics and performance analysis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPlayerType('batter')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  playerType === 'batter'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Target className="h-4 w-4 inline mr-2" />
                Batting
              </button>
              <button
                onClick={() => setPlayerType('bowler')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  playerType === 'bowler'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Bowling
              </button>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        {playerType === 'batter' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Matches"
              value={stats.matches || 0}
              icon={Calendar}
              color="blue"
              subtitle="Total matches played"
            />
            <StatCard
              title="Runs"
              value={stats.runs || 0}
              icon={Target}
              color="green"
              subtitle="Total runs scored"
            />
            <StatCard
              title="Balls Faced"
              value={stats.balls || 0}
              icon={Zap}
              color="purple"
              subtitle="Total balls faced"
            />
            <StatCard
              title="Boundaries"
              value={stats.boundaries || 0}
              icon={Award}
              color="orange"
              subtitle="4s and 6s combined"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Matches"
              value={stats.matches || 0}
              icon={Calendar}
              color="blue"
              subtitle="Total matches bowled"
            />
            <StatCard
              title="Runs Conceded"
              value={stats.runs_conceded || 0}
              icon={Target}
              color="red"
              subtitle="Total runs conceded"
            />
            <StatCard
              title="Balls Bowled"
              value={stats.balls || 0}
              icon={Zap}
              color="purple"
              subtitle="Total balls bowled"
            />
            <StatCard
              title="Wickets"
              value={stats.wickets || 0}
              icon={Award}
              color="green"
              subtitle="Total wickets taken"
            />
          </div>
        )}

        {/* Detailed Statistics */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Career Statistics
            </h2>
            
            <div className="space-y-4">
              {playerType === 'batter' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.runs || 0}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.matches || 0}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.balls || 0}</div>
                      <div className="text-sm text-gray-600">Balls Faced</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{stats.boundaries || 0}</div>
                      <div className="text-sm text-gray-600">Boundaries</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Strike Rate</span>
                      <span className="font-semibold text-gray-900">
                        {cricketHelpers.calculateStrikeRate(stats.runs, stats.balls)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average</span>
                      <span className="font-semibold text-gray-900">
                        {cricketHelpers.calculateBattingAverage(stats.runs, stats.dismissals)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dismissals</span>
                      <span className="font-semibold text-gray-900">{stats.dismissals || 0}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stats.runs_conceded || 0}</div>
                      <div className="text-sm text-gray-600">Runs Conceded</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.wickets || 0}</div>
                      <div className="text-sm text-gray-600">Wickets</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.balls || 0}</div>
                      <div className="text-sm text-gray-600">Balls Bowled</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.matches || 0}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Economy Rate</span>
                      <span className="font-semibold text-gray-900">
                        {cricketHelpers.calculateEconomyRate(stats.runs_conceded, stats.balls)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bowling Average</span>
                      <span className="font-semibold text-gray-900">
                        {cricketHelpers.calculateBowlingAverage(stats.runs_conceded, stats.wickets) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Strike Rate</span>
                      <span className="font-semibold text-gray-900">
                        {cricketHelpers.calculateBowlingStrikeRate(stats.balls, stats.wickets) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top Matchups */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Top Matchups
            </h2>
            
            {matchupsData?.matchups?.length > 0 ? (
              <div className="space-y-3">
                {matchupsData.matchups.slice(0, 8).map((matchup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {playerType === 'batter' ? matchup.bowler : matchup.batter}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{matchup.encounters}</div>
                      <div className="text-xs text-gray-500">encounters</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No matchup data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Chart */}
        <PlayerChart 
          playerName={decodedPlayerName}
          playerType={playerType}
          stats={stats}
        />

        {/* Quick Actions */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to={`/advanced?tab=form`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-medium">Form Analysis</span>
            </Link>
            <Link
              to="/compare"
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">Compare Players</span>
            </Link>
            <Link
              to="/advanced"
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Zap className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Advanced Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerPage  // Changed from PlayerStatsPage to PlayerPage
