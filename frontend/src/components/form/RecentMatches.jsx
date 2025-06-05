import React from 'react'
import { Calendar } from 'lucide-react'

const RecentMatches = ({ matches, playerType, player }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No Date'
    
    try {
      // Handle different date formats that might come from the database
      let date
      
      // Check if it's already a valid date string
      if (typeof dateString === 'string') {
        // Handle various date formats
        if (dateString.includes('/')) {
          // Format: DD/MM/YYYY or MM/DD/YYYY or YYYY/MM/DD
          const parts = dateString.split('/')
          if (parts.length === 3) {
            // Try different interpretations
            if (parts[0].length === 4) {
              // YYYY/MM/DD format
              date = new Date(parts[0], parts[1] - 1, parts[2])
            } else if (parts[2].length === 4) {
              // DD/MM/YYYY or MM/DD/YYYY format
              // Assume DD/MM/YYYY for IPL data (Indian format)
              date = new Date(parts[2], parts[1] - 1, parts[0])
            }
          }
        } else if (dateString.includes('-')) {
          // Format: YYYY-MM-DD or DD-MM-YYYY
          const parts = dateString.split('-')
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              // YYYY-MM-DD format
              date = new Date(dateString)
            } else {
              // DD-MM-YYYY format
              date = new Date(parts[2], parts[1] - 1, parts[0])
            }
          }
        } else {
          // Try direct parsing
          date = new Date(dateString)
        }
      } else {
        // If it's already a Date object or timestamp
        date = new Date(dateString)
      }
      
      // Validate the date
      if (!date || isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString)
        return 'Invalid Date'
      }
      
      // Check if date is reasonable (between 2008 and current year + 1)
      const year = date.getFullYear()
      if (year < 2008 || year > new Date().getFullYear() + 1) {
        console.warn('Date out of IPL range:', dateString, year)
        return 'Invalid Date'
      }
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      console.error('Date parsing error:', error, 'for date:', dateString)
      return 'Invalid Date'
    }
  }

  const formatStrikeRate = (runs, balls) => {
    if (!balls || balls === 0) return 'N/A'
    const sr = ((runs / balls) * 100)
    return isNaN(sr) ? 'N/A' : sr.toFixed(1)
  }

  const formatEconomyRate = (runs, balls) => {
    if (!balls || balls === 0) return 'N/A'
    const overs = balls / 6.0
    const economy = runs / overs
    return isNaN(economy) ? 'N/A' : economy.toFixed(2)
  }

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 0
    return Number(value) || 0
  }

  // Filter out matches with invalid data
  const validMatches = matches.filter(match => {
    return match && (
      (playerType === 'batter' && (match.runs !== undefined || match.balls_faced !== undefined)) ||
      (playerType === 'bowler' && (match.runs_conceded !== undefined || match.balls_bowled !== undefined))
    )
  })

  if (validMatches.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No recent match data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Season</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">
                {playerType === 'batter' ? 'Runs' : 'Runs Conceded'}
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">
                {playerType === 'batter' ? 'Balls' : 'Balls Bowled'}
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">
                {playerType === 'batter' ? 'SR' : 'Economy'}
              </th>
              {playerType === 'batter' && (
                <>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">4s/6s</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Out</th>
                </>
              )}
              {playerType === 'bowler' && (
                <th className="text-right py-3 px-4 font-medium text-gray-900">Wickets</th>
              )}
            </tr>
          </thead>
          <tbody>
            {validMatches.map((match, index) => {
              const runs = formatNumber(playerType === 'batter' ? match.runs : match.runs_conceded)
              const balls = formatNumber(playerType === 'batter' ? match.balls_faced : match.balls_bowled)
              const fours = formatNumber(match.fours)
              const sixes = formatNumber(match.sixes)
              const wickets = formatNumber(match.wickets)
              
              return (
                <tr key={`${match.match_id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={formatDate(match.date) === 'Invalid Date' ? 'text-red-500' : ''}>
                        {formatDate(match.date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {match.season || 'Unknown'}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-blue-600">
                    {runs}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {balls}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    {playerType === 'batter' ? 
                      `${formatStrikeRate(runs, balls)}%` :
                      formatEconomyRate(runs, balls)
                    }
                  </td>
                  {playerType === 'batter' && (
                    <>
                      <td className="py-3 px-4 text-right text-purple-600">
                        {fours}/{sixes}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {match.dismissed ? (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                            Out
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                            Not Out
                          </span>
                        )}
                      </td>
                    </>
                  )}
                  {playerType === 'bowler' && (
                    <td className="py-3 px-4 text-right font-medium text-orange-600">
                      {wickets}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Showing {validMatches.length} recent matches for {player}
      </div>
    </div>
  )
}

export default RecentMatches
