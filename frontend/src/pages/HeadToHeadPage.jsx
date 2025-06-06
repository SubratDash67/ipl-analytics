import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  BarChart3,
  Filter,
  Download,
  Share2,
  Star,
  Calendar,
  MapPin
} from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import { useApp } from '../components/contexts/AppContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/stats/StatCard'
import PerformanceChart from '../components/charts/PerformanceChart'
import VenueBreakdown from '../components/analysis/VenueBreakdown'
import SeasonTrends from '../components/analysis/SeasonTrends'

const HeadToHeadPage = () => {
  const { batter, bowler } = useParams()
  const navigate = useNavigate()
  const { addFavorite, favorites } = useApp()
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

  const isFavorite = favorites.some(fav => 
    fav.batter === decodedBatter && fav.bowler === decodedBowler
  )

  const handleAddToFavorites = () => {
    if (!isFavorite) {
      addFavorite({
        id: `${decodedBatter}-${decodedBowler}`,
        batter: decodedBatter,
        bowler: decodedBowler,
        timestamp: new Date().toISOString()
      })
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? null : value
    }))
  }

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

  const { batting_stats, bowling_stats, total_deliveries } = data

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
                {decodedBatter} <span className="text-blue-600">vs</span> {decodedBowler}
              </h1>
              <p className="text-gray-600">
                Head-to-head analysis • {total_deliveries} deliveries analyzed
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
            
            <button
              onClick={handleAddToFavorites}
              disabled={isFavorite}
              className={`btn-secondary flex items-center space-x-2 ${
                isFavorite ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''
              }`}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>

            <button className="btn-secondary flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <button className="btn-primary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && filtersData && (
          <div className="card bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Analysis</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select
                  className="input-field"
                  value={filters.season || 'all'}
                  onChange={(e) => handleFilterChange('season', e.target.value)}
                >
                  <option value="all">All Seasons</option>
                  {filtersData.seasons?.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                <select
                  className="input-field"
                  value={filters.venue || 'all'}
                  onChange={(e) => handleFilterChange('venue', e.target.value)}
                >
                  <option value="all">All Venues</option>
                  {filtersData.venues?.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>
                <select
                  className="input-field"
                  value={filters.match_type || 'all'}
                  onChange={(e) => handleFilterChange('match_type', e.target.value)}
                >
                  <option value="all">All Matches</option>
                  <option value="league">League</option>
                  <option value="playoff">Playoff</option>
                  <option value="final">Final</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Key Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Runs Scored"
            value={batting_stats.runs}
            icon={Target}
            color="blue"
            subtitle={`in ${batting_stats.balls_faced} balls`}
          />
          <StatCard
            title="Strike Rate"
            value={`${batting_stats.strike_rate}%`}
            icon={Zap}
            color="green"
            subtitle="Runs per 100 balls"
          />
          <StatCard
            title="Dismissals"
            value={batting_stats.dismissals}
            icon={Award}
            color="red"
            subtitle={`Average: ${batting_stats.average}`}
          />
          <StatCard
            title="Boundaries"
            value={batting_stats.boundaries}
            icon={TrendingUp}
            color="purple"
            subtitle="4s and 6s combined"
          />
        </div>

        {/* Performance Analysis */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Batting Performance */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Batting Performance
              </h2>
              <span className="text-sm text-gray-500">{decodedBatter}</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{batting_stats.runs}</div>
                  <div className="text-sm text-gray-600">Total Runs</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{batting_stats.balls_faced}</div>
                  <div className="text-sm text-gray-600">Balls Faced</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{batting_stats.strike_rate}%</div>
                  <div className="text-sm text-gray-600">Strike Rate</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{batting_stats.boundaries}</div>
                  <div className="text-sm text-gray-600">Boundaries</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Batting Average</span>
                  <span className="font-semibold text-gray-900">{batting_stats.average}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Times Dismissed</span>
                  <span className="font-semibold text-gray-900">{batting_stats.dismissals}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bowling Performance */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
                Bowling Performance
              </h2>
              <span className="text-sm text-gray-500">{decodedBowler}</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{bowling_stats.runs_conceded}</div>
                  <div className="text-sm text-gray-600">Runs Conceded</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{bowling_stats.balls_bowled}</div>
                  <div className="text-sm text-gray-600">Balls Bowled</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{bowling_stats.wickets}</div>
                  <div className="text-sm text-gray-600">Wickets</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{bowling_stats.economy}</div>
                  <div className="text-sm text-gray-600">Economy Rate</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dot Balls</span>
                  <span className="font-semibold text-gray-900">{bowling_stats.dot_balls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dot Ball %</span>
                  <span className="font-semibold text-gray-900">
                    {bowling_stats.balls_bowled > 0 ? 
                      ((bowling_stats.dot_balls / bowling_stats.balls_bowled) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <PerformanceChart 
          battingStats={batting_stats}
          bowlingStats={bowling_stats}
          batter={decodedBatter}
          bowler={decodedBowler}
        />

        {/* Additional Analysis */}
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
              to={`/player/${encodeURIComponent(decodedBatter)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Target className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">{decodedBatter} Profile</span>
            </Link>
            <Link
              to={`/player/${encodeURIComponent(decodedBowler)}`}
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-red-600 mr-3" />
              <span className="font-medium">{decodedBowler} Profile</span>
            </Link>
            <Link
              to="/compare"
              className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">Compare Players</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeadToHeadPage
