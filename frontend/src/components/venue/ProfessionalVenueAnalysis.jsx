import React, { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { apiService } from '../../services/api'
import { MapPin, BarChart3, TrendingUp, Target, Globe, Activity } from 'lucide-react'
import InteractiveIndiaMap from '../map/InteractiveIndiaMap'
import LoadingSpinner from '../common/LoadingSpinner'

const ProfessionalVenueAnalysis = ({ batter, bowler }) => {
  const [selectedVenue, setSelectedVenue] = useState(null)
  
  const { data: allVenues } = useApi(
    () => apiService.getFilters(),
    []
  )

  const { data: venueStats, loading: venueLoading } = useApi(
    () => selectedVenue ? 
      apiService.getHeadToHeadStats(batter, bowler, { venue: selectedVenue }) : 
      Promise.resolve(null),
    [batter, bowler, selectedVenue]
  )

  const { data: allVenueStats, loading: allStatsLoading } = useApi(
    async () => {
      if (!allVenues?.venues) return {}
      
      const venuePromises = allVenues.venues.slice(0, 15).map(async (venue) => {
        try {
          const stats = await apiService.getHeadToHeadStats(batter, bowler, { venue })
          return { venue, stats }
        } catch {
          return { venue, stats: null }
        }
      })
      
      const results = await Promise.all(venuePromises)
      return results.reduce((acc, { venue, stats }) => {
        if (stats && !stats.error) {
          acc[venue] = {
            total_deliveries: stats.total_deliveries,
            batting: stats.batting_stats,
            bowling: stats.bowling_stats
          }
        }
        return acc
      }, {})
    },
    [batter, bowler, allVenues?.venues]
  )

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue === selectedVenue ? null : venue)
  }

  const getVenueInsights = () => {
    if (!allVenueStats) return null
    
    const venues = Object.entries(allVenueStats)
    const totalVenues = venues.length
    const avgStrikeRate = venues.reduce((sum, [_, stats]) => sum + (stats.batting.strike_rate || 0), 0) / totalVenues
    const totalDeliveries = venues.reduce((sum, [_, stats]) => sum + stats.total_deliveries, 0)
    
    return {
      totalVenues,
      avgStrikeRate: avgStrikeRate.toFixed(2),
      totalDeliveries,
      bestVenue: venues.reduce((best, [venue, stats]) => 
        !best || stats.batting.strike_rate > best.stats.batting.strike_rate ? { venue, stats } : best, null
      )
    }
  }

  const insights = getVenueInsights()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Globe className="h-8 w-8 text-blue-600 mr-3" />
          Professional IPL Venue Analysis
        </h2>
        <p className="text-lg text-gray-600">
          {batter} vs {bowler} • Interactive geographic performance mapping
        </p>
      </div>

      {insights && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{insights.totalVenues}</div>
            <div className="text-sm text-gray-600">Venues Played</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-green-50 to-green-100">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{insights.avgStrikeRate}</div>
            <div className="text-sm text-gray-600">Avg Strike Rate</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{insights.totalDeliveries}</div>
            <div className="text-sm text-gray-600">Total Deliveries</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-orange-50 to-orange-100">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-orange-600">{insights.bestVenue?.venue.split(' ')[0]}</div>
            <div className="text-sm text-gray-600">Best Venue</div>
          </div>
        </div>
      )}

      {allStatsLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <InteractiveIndiaMap 
          onVenueSelect={handleVenueSelect}
          selectedVenue={selectedVenue}
          venueStats={allVenueStats || {}}
        />
      )}

      {selectedVenue && (
        <div className="space-y-6 animate-slideUp">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
              <MapPin className="h-6 w-6 text-blue-600 mr-2" />
              {selectedVenue} - Detailed Analysis
            </h3>
            <button
              onClick={() => setSelectedVenue(null)}
              className="text-gray-500 hover:text-gray-700 text-3xl font-light"
            >
              ×
            </button>
          </div>

          {venueLoading ? (
            <LoadingSpinner />
          ) : venueStats && !venueStats.error ? (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 text-blue-600 mr-2" />
                  {batter} - Batting Performance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {venueStats.batting_stats.runs}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Runs Scored</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {venueStats.batting_stats.strike_rate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Strike Rate</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {venueStats.batting_stats.boundaries}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Boundaries</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {venueStats.batting_stats.balls_faced}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Balls Faced</div>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-50 to-green-100">
                <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
                  {bowler} - Bowling Performance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-red-600">
                      {venueStats.bowling_stats.runs_conceded}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Runs Conceded</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-orange-600">
                      {venueStats.bowling_stats.economy}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Economy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-green-600">
                      {venueStats.bowling_stats.wickets}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Wickets Taken</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">
                      {venueStats.bowling_stats.dot_balls}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Dot Balls</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No performance data available for this venue
              </p>
            </div>
          )}
        </div>
      )}

      {allVenueStats && Object.keys(allVenueStats).length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Complete Venue Performance Ranking
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-3 font-semibold text-gray-900">Rank</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-900">Venue</th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-900">Deliveries</th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-900">Runs</th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-900">Strike Rate</th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-900">Economy</th>
                  <th className="text-center py-4 px-3 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(allVenueStats)
                  .sort(([,a], [,b]) => b.batting.strike_rate - a.batting.strike_rate)
                  .map(([venue, stats], index) => (
                  <tr key={venue} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-3 font-medium text-gray-900">{venue}</td>
                    <td className="py-4 px-3 text-right text-gray-600 font-medium">
                      {stats.total_deliveries}
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-blue-600">
                      {stats.batting.runs}
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-green-600">
                      {stats.batting.strike_rate}%
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-orange-600">
                      {stats.bowling.economy}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <button
                        onClick={() => handleVenueSelect(venue)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessionalVenueAnalysis
