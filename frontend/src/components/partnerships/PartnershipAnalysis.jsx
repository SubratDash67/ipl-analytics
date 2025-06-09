import React, { useState } from 'react'
import { Users, TrendingUp, Target, Zap, Award } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PlayerSearch from '../player/PlayerSearch'
import PartnershipChart from './PartnershipChart'
import PartnershipTable from './PartnershipTable'

const PartnershipAnalysis = ({ player: initialPlayer, onPlayerSelect, filters = {} }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(initialPlayer || '')
  const [sortBy, setSortBy] = useState('runs_scored')
  const [sortOrder, setSortOrder] = useState('desc')

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    if (onPlayerSelect) {
      onPlayerSelect(player)
    }
  }

  const { data: partnershipData, loading, error, refetch } = useApi(
    ['partnerships', selectedPlayer, JSON.stringify(filters)],
    () => selectedPlayer ? advancedApiService.getPlayerPartnerships(selectedPlayer, filters) : Promise.resolve(null),
    {
      enabled: !!selectedPlayer && selectedPlayer.trim() !== '',
      retry: 2,
      onError: (err) => {
        console.error('Partnership API Error:', err)
      }
    }
  )

  if (!selectedPlayer) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              Partnership Analysis
            </h2>
            <p className="text-gray-600">
              Analyze batting partnerships, combinations, and collaborative performance metrics
            </p>
          </div>

          <div className="card max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Player</h3>
            <PlayerSearch
              type="batter"
              onSelect={handlePlayerSelect}
              placeholder="Search for a batter..."
              className="w-full"
            />
            {selectedPlayer && (
              <div className="mt-3 text-sm text-green-600 flex items-center justify-center">
                <Users className="h-4 w-4 mr-1" />
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
        <LoadingSpinner size="lg" text="Loading partnership analysis..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load partnership analysis" 
        onRetry={refetch}
        showBackButton={false}
      />
    )
  }

  if (!partnershipData) {
    return (
      <ErrorMessage 
        message="No partnership data received from server" 
        onRetry={refetch}
        type="info"
        title="No Data"
      />
    )
  }

  if (partnershipData.error) {
    return (
      <ErrorMessage 
        message={partnershipData.error} 
        onRetry={refetch}
        type="warning"
        title="Data Error"
      />
    )
  }

  const partnerships = partnershipData.partnerships || []
  
  if (partnerships.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="card text-center py-12">
          <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Partnership Data Available
          </h3>
          <p className="text-gray-600 mb-4">
            No partnership data found for <strong>{selectedPlayer}</strong>
          </p>
          <button 
            onClick={() => setSelectedPlayer('')}
            className="btn-primary"
          >
            Select Different Player
          </button>
        </div>
      </div>
    )
  }

  const validPartnerships = partnerships.filter(partnership => {
    const batsman1 = partnership.batsman1?.trim() || ''
    const batsman2 = partnership.batsman2?.trim() || ''
    return batsman1 && batsman2 && batsman1 !== batsman2 && partnership.runs_scored > 0
  })

  const sortedPartnerships = [...validPartnerships].sort((a, b) => {
    const aVal = a[sortBy] || 0
    const bVal = b[sortBy] || 0
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  const topPartnerships = sortedPartnerships.slice(0, 5)
  const totalStats = validPartnerships.reduce((acc, partnership) => ({
    runs: acc.runs + (partnership.runs_scored || 0),
    balls: acc.balls + (partnership.balls_faced || 0),
    boundaries: acc.boundaries + (partnership.boundaries || 0)
  }), { runs: 0, balls: 0, boundaries: 0 })

  return (
    <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            Partnership Analysis - {selectedPlayer}
          </h2>
          <p className="text-gray-600">
            Found {validPartnerships.length} valid partnership combinations
          </p>
          <button 
            onClick={() => setSelectedPlayer('')}
            className="btn-secondary mt-2"
          >
            Change Player
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{validPartnerships.length}</div>
            <div className="text-sm text-gray-600">Unique Partners</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-green-50 to-green-100">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{totalStats.runs}</div>
            <div className="text-sm text-gray-600">Partnership Runs</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {totalStats.balls > 0 ? ((totalStats.runs / totalStats.balls) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Partnership SR</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-orange-50 to-orange-100">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{totalStats.boundaries}</div>
            <div className="text-sm text-gray-600">Total Boundaries</div>
          </div>
        </div>

        {/* Partnership Chart */}
        {topPartnerships.length > 0 && (
          <div className="w-full overflow-hidden">
            <PartnershipChart 
              partnerships={topPartnerships} 
              selectedPlayer={selectedPlayer}
            />
          </div>
        )}

        {/* Partnership Table */}
        <div className="w-full overflow-hidden">
          <PartnershipTable 
            partnerships={sortedPartnerships}
            selectedPlayer={selectedPlayer}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(field) => {
              if (sortBy === field) {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
              } else {
                setSortBy(field)
                setSortOrder('desc')
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PartnershipAnalysis
