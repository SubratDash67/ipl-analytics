import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search, Target, Zap } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const MatchupsList = ({ matchups, playerName, playerType, loading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false)

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Matchups
        </h3>
        <LoadingSpinner />
      </div>
    )
  }

  if (!matchups || matchups.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Matchups
        </h3>
        <p className="text-gray-500">No matchups found</p>
      </div>
    )
  }

  const filteredMatchups = matchups.filter(matchup =>
    matchup.opponent.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayMatchups = showAll ? filteredMatchups : filteredMatchups.slice(0, 10)

  const getMatchupUrl = (opponent) => {
    if (playerType === 'batter') {
      return `/head-to-head/${encodeURIComponent(playerName)}/${encodeURIComponent(opponent)}`
    } else {
      return `/head-to-head/${encodeURIComponent(opponent)}/${encodeURIComponent(playerName)}`
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Matchups
      </h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search opponents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="space-y-2">
        {displayMatchups.map((matchup, index) => (
          <Link
            key={index}
            to={getMatchupUrl(matchup.opponent)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              {playerType === 'batter' ? (
                <Zap className="h-4 w-4 text-green-600" />
              ) : (
                <Target className="h-4 w-4 text-blue-600" />
              )}
              <div>
                <div className="font-medium text-gray-900 group-hover:text-primary-600">
                  {matchup.opponent}
                </div>
                <div className="text-sm text-gray-500">
                  {matchup.encounters} deliveries
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </Link>
        ))}
      </div>

      {filteredMatchups.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            {showAll ? 'Show Less' : `Show All ${filteredMatchups.length} Matchups`}
          </button>
        </div>
      )}

      {filteredMatchups.length === 0 && searchTerm && (
        <div className="text-center py-4 text-gray-500">
          No matchups found for "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default MatchupsList
