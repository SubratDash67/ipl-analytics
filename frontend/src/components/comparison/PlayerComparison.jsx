import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, TrendingUp, BarChart3, Target, Zap } from 'lucide-react'
import PlayerSearch from '../player/PlayerSearch'
import { useApi } from '../../hooks/useApi'
import { apiService } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const PlayerComparison = () => {
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [comparisonType, setComparisonType] = useState('batter')
  
  const { data: player1Stats, loading: loading1 } = useApi(
    () => player1 ? apiService.getPlayerStats(player1, comparisonType) : Promise.resolve(null),
    [player1, comparisonType]
  )
  
  const { data: player2Stats, loading: loading2 } = useApi(
    () => player2 ? apiService.getPlayerStats(player2, comparisonType) : Promise.resolve(null),
    [player2, comparisonType]
  )

  const getComparisonMetrics = () => {
    if (comparisonType === 'batter') {
      return [
        { key: 'runs', label: 'Total Runs', format: (val) => val },
        { key: 'strike_rate', label: 'Strike Rate', format: (val) => `${val}%` },
        { key: 'average', label: 'Average', format: (val) => val || 'N/A' },
        { key: 'boundaries', label: 'Boundaries', format: (val) => val },
        { key: 'balls_faced', label: 'Balls Faced', format: (val) => val },
        { key: 'dismissals', label: 'Dismissals', format: (val) => val }
      ]
    } else {
      return [
        { key: 'runs_conceded', label: 'Runs Conceded', format: (val) => val },
        { key: 'economy', label: 'Economy Rate', format: (val) => val },
        { key: 'wickets', label: 'Wickets', format: (val) => val },
        { key: 'average', label: 'Average', format: (val) => val || 'N/A' },
        { key: 'balls_bowled', label: 'Balls Bowled', format: (val) => val },
        { key: 'dot_balls', label: 'Dot Balls', format: (val) => val }
      ]
    }
  }

  const getBetterPerformance = (metric, val1, val2, playerType) => {
    if (!val1 || !val2) return 'none'
    
    // Batting comparison rules
    if (playerType === 'batter') {
      const betterHigher = ['runs', 'strike_rate', 'boundaries', 'average', 'balls_faced']
      const betterLower = ['dismissals']

      if (betterHigher.includes(metric)) {
        return val1 > val2 ? 'player1' : 'player2'
      }
      if (betterLower.includes(metric)) {
        return val1 < val2 ? 'player1' : 'player2'
      }
    }
    
    // Bowling comparison rules
    if (playerType === 'bowler') {
      const betterHigher = ['wickets', 'dot_balls']
      const betterLower = ['economy', 'average', 'runs_conceded']

      if (betterHigher.includes(metric)) {
        return val1 > val2 ? 'player1' : 'player2'
      }
      if (betterLower.includes(metric)) {
        return val1 < val2 ? 'player1' : 'player2'
      }
    }
    
    return 'none'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Users className="h-8 w-8 text-blue-600 mr-3" />
          Player Comparison
        </h1>
        <p className="text-gray-600">
          Compare IPL performance statistics between two players
        </p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player 1
            </label>
            <PlayerSearch
              type={comparisonType}
              onSelect={setPlayer1}
              placeholder={`Search for a ${comparisonType}...`}
            />
          </div>
          
          <div className="flex items-end">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comparison Type
              </label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value)}
                className="input-field"
              >
                <option value="batter">Batting Stats</option>
                <option value="bowler">Bowling Stats</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player 2
            </label>
            <PlayerSearch
              type={comparisonType}
              onSelect={setPlayer2}
              placeholder={`Search for a ${comparisonType}...`}
            />
          </div>
        </div>
      </div>

      {player1 && player2 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {player1} vs {player2}
            </h3>
            <div className="flex items-center space-x-2">
              {comparisonType === 'batter' ? (
                <TrendingUp className="h-5 w-5 text-blue-600" />
              ) : (
                <BarChart3 className="h-5 w-5 text-green-600" />
              )}
              <span className="text-gray-600 capitalize">{comparisonType} Comparison</span>
            </div>
          </div>

          {(loading1 || loading2) ? (
            <LoadingSpinner />
          ) : (player1Stats && player2Stats && !player1Stats.error && !player2Stats.error) ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Metric</th>
                    <th className="text-center py-3 px-4 font-medium text-blue-600">{player1}</th>
                    <th className="text-center py-3 px-4 font-medium text-green-600">{player2}</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Better</th>
                  </tr>
                </thead>
                <tbody>
                  {getComparisonMetrics().map((metric) => {
                    const val1 = player1Stats.stats[metric.key]
                    const val2 = player2Stats.stats[metric.key]
                    const better = getBetterPerformance(metric.key, val1, val2, comparisonType)
                    
                    return (
                      <tr key={metric.key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {metric.label}
                        </td>
                        <td className={`py-3 px-4 text-right ${
                          better === 'player1' ? 'text-green-600 bg-green-50' : 'text-gray-600'
                        }`}>
                          {metric.format(val1)}
                        </td>
                        <td className={`py-3 px-4 text-right ${
                          better === 'player2' ? 'text-green-600 bg-green-50' : 'text-gray-600'
                        }`}>
                          {metric.format(val2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {better === 'player1' ? (
                            <span className="text-blue-600 font-medium">{player1}</span>
                          ) : better === 'player2' ? (
                            <span className="text-green-600 font-medium">{player2}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Unable to load comparison data for the selected players
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlayerComparison