import React, { useState, useMemo } from 'react'
import { Users, TrendingUp, Target, Zap, Award } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PartnershipChart from './PartnershipChart'
import PartnershipTable from './PartnershipTable'

const PartnershipAnalysis = ({ player, filters = {} }) => {
  const [sortBy, setSortBy] = useState('runs_scored')
  const [sortOrder, setSortOrder] = useState('desc')

  // Memoize the API call to prevent infinite loops
  const apiCall = useMemo(() => 
    (signal) => advancedApiService.getPlayerPartnerships(player, filters, signal),
    [player, JSON.stringify(filters)]
  )

  const { data: partnershipData, loading, error, refetch } = useApi(
    apiCall,
    [player, JSON.stringify(filters)]
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load partnership analysis" 
        onRetry={refetch}
      />
    )
  }

  if (!partnershipData) {
    return (
      <ErrorMessage 
        message="No partnership data received from server" 
        onRetry={refetch}
      />
    )
  }

  if (partnershipData.error) {
    return (
      <ErrorMessage 
        message={partnershipData.error} 
        onRetry={refetch}
      />
    )
  }

  const partnerships = partnershipData.partnerships || []
  
  if (partnerships.length === 0) {
    return (
      <div className="card text-center py-8">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No partnership data available for {player}</p>
        <button 
          onClick={refetch}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Filter out invalid partnerships (where both batsmen are the same)
  const validPartnerships = partnerships.filter(partnership => {
    const batsman1 = partnership.batsman1?.trim() || ''
    const batsman2 = partnership.batsman2?.trim() || ''
    
    // Ensure both batsmen exist and are different
    return batsman1 && batsman2 && batsman1 !== batsman2
  })

  if (validPartnerships.length === 0) {
    return (
      <div className="card text-center py-8">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No valid partnership combinations found for {player}</p>
        <p className="text-gray-400 text-sm mt-2">Partnerships require two different batsmen</p>
        <button 
          onClick={refetch}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

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
            Partnership Analysis - {player}
          </h2>
          <p className="text-gray-600">
            Found {validPartnerships.length} valid partnership combinations
          </p>
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
              selectedPlayer={player}
            />
          </div>
        )}

        {/* Partnership Table */}
        <div className="w-full overflow-hidden">
          <PartnershipTable 
            partnerships={sortedPartnerships}
            selectedPlayer={player}
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
