import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  MapPin, 
  BarChart3, 
  Target, 
  TrendingUp,
  Filter,
  Calendar,
  Users
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/stats/StatCard'

const VenuePage = () => {
  const { batter, bowler } = useParams()
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  
  const decodedBatter = decodeURIComponent(batter)
  const decodedBowler = decodeURIComponent(bowler)

  // FIXED: Use correct venue breakdown API
  const { data: venueData, loading, error, refetch } = useApi(
    ['venue-breakdown', decodedBatter, decodedBowler, filters],
    () => apiService.getVenueBreakdown(decodedBatter, decodedBowler, filters)
  )

  const { data: filtersData } = useApi(
    ['filters'],
    () => apiService.getFilters()
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading venue analysis..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load venue analysis" 
        onRetry={refetch}
        showBackButton
      />
    )
  }

  if (!venueData || venueData.error) {
    return (
      <ErrorMessage 
        message={venueData?.error || "No venue data available for this matchup"} 
        onRetry={refetch}
        showBackButton
        type="info"
        title="No Venue Data"
      />
    )
  }

  const venues = venueData.venues || []

  // Calculate totals
  const totalStats = venues.reduce((acc, venue) => ({
    matches: acc.matches + (venue.matches || 0),
    runs: acc.runs + (venue.runs || 0),
    balls: acc.balls + (venue.balls || 0),
    dismissals: acc.dismissals + (venue.dismissals || 0)
  }), { matches: 0, runs: 0, balls: 0, dismissals: 0 })

  const overallStrikeRate = totalStats.balls > 0 ? 
    ((totalStats.runs / totalStats.balls) * 100).toFixed(2) : 0

  const overallAverage = totalStats.dismissals > 0 ? 
    (totalStats.runs / totalStats.dismissals).toFixed(2) : totalStats.runs

  return (
    <>
      <Helmet>
        <title>{`${decodedBatter} vs ${decodedBowler} - Venue Analysis | IPL Analytics`}</title>
        <meta name="description" content={`Venue-wise performance analysis between ${decodedBatter} and ${decodedBowler}. View statistics across different cricket grounds and stadiums.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/head-to-head/${encodeURIComponent(decodedBatter)}/${encodeURIComponent(decodedBowler)}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Head-to-Head
              </Link>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                <MapPin className="h-8 w-8 mr-3 text-blue-600" />
                Venue Analysis
              </h1>
              <p className="text-gray-600">
                {decodedBatter} vs {decodedBowler} • Performance across {venues.length} venues
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Season</label>
                <select 
                  className="input-field"
                  value={filters.season || ''}
                  onChange={(e) => setFilters({...filters, season: e.target.value || undefined})}
                >
                  <option value="">All Seasons</option>
                  {filtersData?.seasons?.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({})}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Venues"
            value={venues.length}
            icon={MapPin}
            color="blue"
            subtitle="Stadiums played at"
          />
          <StatCard
            title="Total Matches"
            value={totalStats.matches}
            icon={Calendar}
            color="green"
            subtitle="Across all venues"
          />
          <StatCard
            title="Overall Strike Rate"
            value={`${overallStrikeRate}%`}
            icon={TrendingUp}
            color="purple"
            subtitle="Combined performance"
          />
          <StatCard
            title="Overall Average"
            value={overallAverage}
            icon={Target}
            color="orange"
            subtitle="Runs per dismissal"
          />
        </div>

        {/* Venue Breakdown */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Venue-wise Performance
          </h2>
          
          {venues.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Venue</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Matches</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Runs</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Balls</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Strike Rate</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Dismissals</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((venue, index) => {
                    const average = venue.dismissals > 0 ? 
                      (venue.runs / venue.dismissals).toFixed(2) : venue.runs
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{venue.name}</div>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {venue.matches}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-blue-600">
                          {venue.runs}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {venue.balls}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-green-600">
                          {venue.strike_rate.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center text-red-600">
                          {venue.dismissals}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-purple-600">
                          {average}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No venue data available for this matchup</p>
            </div>
          )}
        </div>

        {/* Best and Worst Venues */}
        {venues.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Best Venues (by Strike Rate)
              </h3>
              <div className="space-y-3">
                {venues
                  .filter(v => v.balls >= 5) // Minimum 5 balls for meaningful stats
                  .sort((a, b) => b.strike_rate - a.strike_rate)
                  .slice(0, 3)
                  .map((venue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.runs} runs in {venue.balls} balls</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{venue.strike_rate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">{venue.matches} matches</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Most Runs Scored
              </h3>
              <div className="space-y-3">
                {venues
                  .sort((a, b) => b.runs - a.runs)
                  .slice(0, 3)
                  .map((venue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.balls} balls • {venue.strike_rate.toFixed(1)}% SR</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{venue.runs}</div>
                        <div className="text-xs text-gray-500">{venue.matches} matches</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to={`/head-to-head/${encodeURIComponent(decodedBatter)}/${encodeURIComponent(decodedBowler)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Head-to-Head Analysis</span>
            </Link>
            <Link
              to={`/advanced?tab=partnerships&player=${encodeURIComponent(decodedBatter)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-medium">Partnership Analysis</span>
            </Link>
            <Link
              to={`/advanced?tab=phases&batter=${encodeURIComponent(decodedBatter)}&bowler=${encodeURIComponent(decodedBowler)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">Phase Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default VenuePage
