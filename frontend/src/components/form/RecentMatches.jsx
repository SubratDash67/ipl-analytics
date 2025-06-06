import React from 'react'
import { Calendar, Target, Zap, Award } from 'lucide-react'

const RecentMatches = ({ matches, playerType, player }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="card text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recent match data available</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Unknown' || dateString === '2020-01-01') {
      return 'Unknown'
    }
    
    try {
      // Handle various date formats
      let date
      if (typeof dateString === 'string') {
        // Check if it's already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          date = new Date(dateString + 'T00:00:00')
        } else {
          date = new Date(dateString)
        }
      } else {
        date = new Date(dateString)
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown'
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.warn('Date formatting error:', error)
      return 'Unknown'
    }
  }

  const getPerformanceColor = (performance) => {
    if (playerType === 'batter') {
      if (performance >= 50) return 'bg-green-100 text-green-800'
      if (performance >= 25) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    } else {
      if (performance >= 3) return 'bg-green-100 text-green-800'
      if (performance >= 1) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }
  }

  const validateStrikeRate = (sr) => {
    const numSR = Number(sr)
    if (isNaN(numSR) || numSR > 400 || numSR < 0) {
      return 'Invalid'
    }
    return `${numSR.toFixed(1)}%`
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        Recent Matches - {player}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Season</th>
              {playerType === 'batter' ? (
                <>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Runs</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Balls</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">SR</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">4s</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">6s</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Out</th>
                </>
              ) : (
                <>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Runs</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Balls</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Wickets</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Economy</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">
                  {formatDate(match.date || match.match_date)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{match.season}</td>
                
                {playerType === 'batter' ? (
                  <>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getPerformanceColor(match.runs)}`}>
                        {match.runs}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-900">{match.balls_faced}</td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-green-600">
                      {validateStrikeRate(match.strike_rate)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-blue-600">{match.fours || 0}</td>
                    <td className="py-3 px-4 text-right text-sm text-purple-600">{match.sixes || 0}</td>
                    <td className="py-3 px-4 text-center">
                      {match.dismissed ? (
                        <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                      ) : (
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4 text-right text-sm text-red-600">{match.runs_conceded}</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-900">{match.balls_bowled}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getPerformanceColor(match.wickets)}`}>
                        {match.wickets}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-green-600">
                      {match.economy_rate || 0}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">
              {matches.reduce((sum, m) => sum + (m.runs || m.runs_conceded || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">
              Total {playerType === 'batter' ? 'Runs' : 'Runs Conceded'}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-600">
              {playerType === 'batter' ? 
                `${(matches.reduce((sum, m) => sum + (m.strike_rate || 0), 0) / matches.length).toFixed(1)}%` :
                (matches.reduce((sum, m) => sum + (m.economy_rate || 0), 0) / matches.length).toFixed(1)
              }
            </div>
            <div className="text-sm text-gray-600">
              Avg {playerType === 'batter' ? 'Strike Rate' : 'Economy'}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600">
              {playerType === 'batter' 
                ? matches.reduce((sum, m) => sum + (m.fours || 0) + (m.sixes || 0), 0)
                : matches.reduce((sum, m) => sum + (m.wickets || 0), 0)
              }
            </div>
            <div className="text-sm text-gray-600">
              {playerType === 'batter' ? 'Total Boundaries' : 'Total Wickets'}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-orange-600">{matches.length}</div>
            <div className="text-sm text-gray-600">Matches Analyzed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentMatches
