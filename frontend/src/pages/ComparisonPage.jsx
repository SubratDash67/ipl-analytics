import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Users, 
  Plus, 
  X, 
  BarChart3, 
  Target, 
  Zap, 
  Award,
  TrendingUp,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react'
import PlayerSearch from '../components/player/PlayerSearch'
import { apiService } from '../services/api'
import { cricketHelpers } from '../utils/cricketHelpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import ComparisonChart from '../components/charts/ComparisonChart'

const ComparisonPage = () => {
  const [players, setPlayers] = useState([])
  const [playerType, setPlayerType] = useState('batter')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [playersData, setPlayersData] = useState([])

  const addPlayer = (playerName) => {
    if (players.length < 4 && !players.includes(playerName) && playerName.trim() !== '') {
      setPlayers([...players, playerName])
    }
  }

  const removePlayer = (playerName) => {
    setPlayers(players.filter(p => p !== playerName))
    setPlayersData(playersData.filter(p => p.name !== playerName))
  }

  const fetchComparison = async () => {
    if (players.length < 2) return

    setLoading(true)
    setError(null)
    
    try {
      const promises = players
        .filter(player => player && player.trim() !== '')
        .map(player => 
          apiService.getPlayerStats(player, playerType)
        )
      
      const results = await Promise.all(promises)
      
      const formattedData = results.map((result, index) => ({
        name: players[index],
        stats: result.stats || {},
        error: result.error
      }))
      
      setPlayersData(formattedData)
    } catch (err) {
      setError(err.message)
      console.error('Comparison fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatValue = (stats, statKey) => {
    return stats[statKey] || 0
  }

  const calculateDerivedStats = (stats) => {
    if (playerType === 'batter') {
      const runs = stats.runs || 0
      const balls = stats.balls || 0
      const dismissals = stats.dismissals || 0
      const boundaries = stats.boundaries || 0

      return {
        strikeRate: cricketHelpers.calculateStrikeRate(runs, balls),
        average: cricketHelpers.calculateBattingAverage(runs, dismissals),
        boundaryPercentage: balls > 0 ? ((boundaries / balls) * 100).toFixed(1) : 0
      }
    } else {
      const runsConceded = stats.runs_conceded || 0
      const balls = stats.balls || 0
      const wickets = stats.wickets || 0

      return {
        economy: cricketHelpers.calculateEconomyRate(runsConceded, balls),
        average: cricketHelpers.calculateBowlingAverage(runsConceded, wickets),
        strikeRate: cricketHelpers.calculateBowlingStrikeRate(balls, wickets)
      }
    }
  }

  const comparisonStats = playerType === 'batter' ? [
    { key: 'matches', label: 'Matches', icon: BarChart3 },
    { key: 'runs', label: 'Runs', icon: Target },
    { key: 'balls', label: 'Balls', icon: Zap },
    { key: 'boundaries', label: 'Boundaries', icon: Award }
  ] : [
    { key: 'matches', label: 'Matches', icon: BarChart3 },
    { key: 'runs_conceded', label: 'Runs Conceded', icon: Target },
    { key: 'balls', label: 'Balls Bowled', icon: Zap },
    { key: 'wickets', label: 'Wickets', icon: Award }
  ]

  return (
    <>
      <Helmet>
        <title>Player Comparison - IPL Analytics</title>
        <meta name="description" content="Compare multiple IPL players side by side. Analyze batting and bowling statistics, performance metrics, and career achievements." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Player Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Compare up to 4 players side by side. Analyze their performance metrics, 
            career statistics, and identify strengths and weaknesses.
          </p>
        </div>

        {/* Player Type Selection */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => {
                setPlayerType('batter')
                setPlayers([])
                setPlayersData([])
              }}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                playerType === 'batter'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Compare Batters
            </button>
            <button
              onClick={() => {
                setPlayerType('bowler')
                setPlayers([])
                setPlayersData([])
              }}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                playerType === 'bowler'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Compare Bowlers
            </button>
          </div>
        </div>

        {/* Player Selection */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Select Players ({players.length}/4)
            </h2>
            {players.length >= 2 && (
              <button
                onClick={fetchComparison}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    <span>Compare</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-24">
                {players[index] ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{players[index]}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{playerType}</p>
                    </div>
                    <button
                      onClick={() => removePlayer(players[index])}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Plus className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">Add Player {index + 1}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {players.length < 4 && (
            <PlayerSearch
              type={playerType}
              onSelect={addPlayer}
              placeholder={`Search for a ${playerType}...`}
              className="max-w-md mx-auto"
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Fetching player statistics..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={fetchComparison}
          />
        )}

        {/* Comparison Results - REMOVED GREEN HIGHLIGHTS */}
        {playersData.length >= 2 && !loading && (
          <div className="space-y-8">
            {/* Statistics Table */}
            <div className="card overflow-x-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Statistical Comparison
              </h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Statistic</th>
                    {playersData.map((player, index) => (
                      <th key={index} className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {player.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonStats.map((stat) => (
                    <tr key={stat.key} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 flex items-center">
                        <stat.icon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        {stat.label}
                      </td>
                      {playersData.map((player, index) => {
                        const value = getStatValue(player.stats, stat.key)
                        
                        return (
                          <td key={index} className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">
                            {value.toLocaleString()}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  
                  {/* Derived Statistics without highlights */}
                  {playerType === 'batter' && (
                    <>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          Strike Rate
                        </td>
                        {playersData.map((player, index) => {
                          const derived = calculateDerivedStats(player.stats)
                          const value = derived.strikeRate
                          
                          return (
                            <td key={index} className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">
                              {value.toFixed(2)}%
                            </td>
                          )
                        })}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          Average
                        </td>
                        {playersData.map((player, index) => {
                          const derived = calculateDerivedStats(player.stats)
                          const value = derived.average
                          
                          return (
                            <td key={index} className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">
                              {value.toFixed(2)}
                            </td>
                          )
                        })}
                      </tr>
                    </>
                  )}

                  {playerType === 'bowler' && (
                    <>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          Economy Rate
                        </td>
                        {playersData.map((player, index) => {
                          const derived = calculateDerivedStats(player.stats)
                          const value = derived.economy
                          
                          return (
                            <td key={index} className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">
                              {value.toFixed(2)}
                            </td>
                          )
                        })}
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          Bowling Average
                        </td>
                        {playersData.map((player, index) => {
                          const derived = calculateDerivedStats(player.stats)
                          
                          return (
                            <td key={index} className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">
                              {derived.average.toFixed(2)}
                            </td>
                          )
                        })}
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <ComparisonChart 
              players={playersData}
              playerType={playerType}
              stats={comparisonStats}
            />
          </div>
        )}

        {/* Empty State */}
        {players.length === 0 && (
          <div className="card text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start Your Comparison
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Add at least 2 players to begin comparing their statistics and performance metrics.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default ComparisonPage
