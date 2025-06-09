import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  BarChart3, 
  Target, 
  Zap, 
  Award,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Filter,
  Share2,
  Download,
  Star
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/stats/StatCard'
import PerformanceChart from '../components/charts/PerformanceChart'
import VenueBreakdown from '../components/analysis/VenueBreakdown'
import SeasonTrends from '../components/analysis/SeasonTrends'

const HeadToHeadPage = () => {
  const { batter, bowler } = useParams()
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  
  const decodedBatter = decodeURIComponent(batter)
  const decodedBowler = decodeURIComponent(bowler)

  const { data, loading, error, refetch } = useApi(
    ['head-to-head', decodedBatter, decodedBowler, filters],
    () => apiService.getHeadToHeadStats(decodedBatter, decodedBowler, filters)
  )

  const { data: filtersData } = useApi(
    ['filters'],
    () => apiService.getFilters()
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading head-to-head analysis..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load head-to-head statistics" 
        onRetry={refetch}
        showBackButton
      />
    )
  }

  if (!data || data.error) {
    return (
      <ErrorMessage 
        message={data?.error || "No data available for this matchup"} 
        onRetry={refetch}
        showBackButton
        type="info"
        title="No Data Found"
      />
    )
  }

  const battingStats = data.batting_stats || {}
  const bowlingStats = data.bowling_stats || {}

  return (
    <>
      <Helmet>
        <title>{`${decodedBatter} vs ${decodedBowler} - Head-to-Head Analysis | IPL Analytics`}</title>
        <meta name="description" content={`Detailed head-to-head analysis between ${decodedBatter} and ${decodedBowler}. View batting and bowling statistics, performance trends, and match insights.`} />
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {decodedBatter} vs {decodedBowler}
              </h1>
              <p className="text-gray-600">
                Head-to-head analysis • {data.total_deliveries || 0} deliveries analyzed
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
            
            <button className="btn-secondary flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Add to Favorites</span>
            </button>
            
            <button className="btn-secondary flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid md:grid-cols-3 gap-4">
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
              <div>
                <label className="label">Venue</label>
                <select 
                  className="input-field"
                  value={filters.venue || ''}
                  onChange={(e) => setFilters({...filters, venue: e.target.value || undefined})}
                >
                  <option value="">All Venues</option>
                  {filtersData?.venues?.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
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

        {/* Key Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Runs Scored"
            value={battingStats.runs || 0}
            subtitle={`in ${battingStats.balls_faced || 0} balls`}
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Strike Rate"
            value={`${battingStats.strike_rate || 0}%`}
            subtitle="Runs per 100 balls"
            icon={Zap}
            color="green"
            type="percentage"
          />
          <StatCard
            title="Dismissals"
            value={battingStats.dismissals || 0}
            subtitle={`Average: ${battingStats.average || 0}`}
            icon={TrendingUp}
            color="red"
          />
          <StatCard
            title="Boundaries"
            value={battingStats.boundaries || 0}
            subtitle="4s and 6s combined"
            icon={Award}
            color="purple"
          />
        </div>

        {/* Performance Comparison */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Batting Performance
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{battingStats.runs || 0}</div>
                  <div className="text-sm text-gray-600">Total Runs</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{battingStats.balls_faced || 0}</div>
                  <div className="text-sm text-gray-600">Balls Faced</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{battingStats.strike_rate || 0}%</div>
                  <div className="text-sm text-gray-600">Strike Rate</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{battingStats.boundaries || 0}</div>
                  <div className="text-sm text-gray-600">Boundaries</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Batting Average</span>
                  <span className="font-semibold text-gray-900">{battingStats.average || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Times Dismissed</span>
                  <span className="font-semibold text-gray-900">{battingStats.dismissals || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
              Bowling Performance
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{bowlingStats.runs_conceded || 0}</div>
                  <div className="text-sm text-gray-600">Runs Conceded</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{bowlingStats.balls_bowled || 0}</div>
                  <div className="text-sm text-gray-600">Balls Bowled</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{bowlingStats.wickets || 0}</div>
                  <div className="text-sm text-gray-600">Wickets</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{bowlingStats.economy || 0}</div>
                  <div className="text-sm text-gray-600">Economy Rate</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dot Balls</span>
                  <span className="font-semibold text-gray-900">{bowlingStats.dot_balls || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dot Ball %</span>
                  <span className="font-semibold text-gray-900">
                    {bowlingStats.balls_bowled > 0 ? 
                      ((bowlingStats.dot_balls / bowlingStats.balls_bowled) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Visualization */}
        <PerformanceChart 
          batter={decodedBatter}
          bowler={decodedBowler}
          battingStats={battingStats}
          bowlingStats={bowlingStats}
        />

        {/* Venue and Season Analysis */}
        <div className="grid lg:grid-cols-2 gap-8">
          <VenueBreakdown 
            batter={decodedBatter} 
            bowler={decodedBowler} 
            filters={filters} 
          />
          <SeasonTrends 
            batter={decodedBatter} 
            bowler={decodedBowler} 
            filters={filters} 
          />
        </div>

        {/* Quick Actions */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to={`/advanced?tab=partnerships&player=${encodeURIComponent(decodedBatter)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Partnership Analysis</span>
            </Link>
            <Link
              to={`/advanced?tab=phases&batter=${encodeURIComponent(decodedBatter)}&bowler=${encodeURIComponent(decodedBowler)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-medium">Phase Analysis</span>
            </Link>
            <Link
              to={`/venue/${encodeURIComponent(decodedBatter)}/${encodeURIComponent(decodedBowler)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">Venue Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeadToHeadPage
