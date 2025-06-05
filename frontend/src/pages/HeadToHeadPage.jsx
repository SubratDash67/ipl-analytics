import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Filter, Calendar, MapPin, Clock } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatsOverview from '../components/stats/StatsOverview'
import PerformanceChart from '../components/stats/PerformanceChart'
import PhaseAnalysis from '../components/stats/PhaseAnalysis'
import YearlyBreakdown from '../components/stats/YearlyBreakdown'
import FilterPanel from '../components/filters/FilterPanel'

const HeadToHeadPage = () => {
  const { batter, bowler } = useParams()
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const { data: stats, loading, error, refetch } = useApi(
    () => apiService.getHeadToHeadStats(batter, bowler, filters),
    [batter, bowler, filters]
  )

  const { data: availableFilters } = useApi(
    () => apiService.getFilters(),
    []
  )

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

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
        message={error.response?.data?.error || 'Failed to load head-to-head stats'}
        onRetry={refetch}
      />
    )
  }

  if (!stats || stats.error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          No Data Available
        </h2>
        <p className="text-gray-600 mb-6">
          {stats?.error || 'No matchup data found for these players.'}
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/venue/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`}
            className="flex items-center space-x-2 btn-secondary"
          >
            <MapPin className="h-4 w-4" />
            <span>Venue Analysis</span>
          </Link>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 btn-secondary"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {batter} vs {bowler}
        </h1>
        <p className="text-lg text-gray-600">
          Head-to-Head Analysis • {stats.total_deliveries} Deliveries
        </p>
      </div>

      {showFilters && (
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      <div className="space-y-8">
        <StatsOverview 
          battingStats={stats.batting_stats}
          bowlingStats={stats.bowling_stats}
          batter={batter}
          bowler={bowler}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <PerformanceChart 
            data={stats.yearly_breakdown}
            title="Performance Trend"
            type="line"
          />
          <PhaseAnalysis 
            phaseStats={stats.phase_stats}
          />
        </div>

        <YearlyBreakdown 
          data={stats.yearly_breakdown}
          batter={batter}
          bowler={bowler}
        />
      </div>
    </div>
  )
}

export default HeadToHeadPage
