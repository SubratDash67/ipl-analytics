import React, { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { apiService } from '../../services/api'
import { MapPin, BarChart3, TrendingUp, Target } from 'lucide-react'
import VenueMap from '../map/VenueMap'
import LoadingSpinner from '../common/LoadingSpinner'
import PerformanceChart from '../stats/PerformanceChart'

const VenueAnalysis = ({ batter, bowler }) => {
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

  // Get comprehensive venue statistics for map visualization [5][6]
  const { data: allVenueStats } = useApi(
    async () => {
      if (!allVenues?.venues) return {}
      
      const venuePromises = allVenues.venues.slice(0, 10).map(async (venue) => {
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Venue Performance Analysis
        </h2>
        <p className="text-gray-600">
          {batter} vs {bowler} • Click venues for detailed analysis
        </p>
      </div>

      <VenueMap 
        onVenueSelect={handleVenueSelect}
        selectedVenue={selectedVenue}
        venueStats={allVenueStats || {}}
      />

      {selectedVenue && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              {selectedVenue}
            </h3>
            <button
              onClick={() => setSelectedVenue(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {venueLoading ? (
            <LoadingSpinner />
          ) : venueStats && !venueStats.error ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  Batting Performance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {venueStats.batting_stats.runs}
                    </div>
                    <div className="text-sm text-gray-600">Runs</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {venueStats.batting_stats.strike_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Strike Rate</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {venueStats.batting_stats.boundaries}
                    </div>
                    <div className="text-sm text-gray-600">Boundaries</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {venueStats.batting_stats.balls_faced}
                    </div>
                    <div className="text-sm text-gray-600">Balls</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                  Bowling Performance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {venueStats.bowling_stats.runs_conceded}
                    </div>
                    <div className="text-sm text-gray-600">Runs</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {venueStats.bowling_stats.economy}
                    </div>
                    <div className="text-sm text-gray-600">Economy</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {venueStats.bowling_stats.wickets}
                    </div>
                    <div className="text-sm text-gray-600">Wickets</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {venueStats.bowling_stats.dot_balls}
                    </div>
                    <div className="text-sm text-gray-600">Dots</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-500">
                No data available for this venue in the selected matchup
              </p>
            </div>
          )}
        </div>
      )}

      {/* Comprehensive venue comparison table for geographic analysis [3] */}
      {allVenueStats && Object.keys(allVenueStats).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Venue Comparison Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Venue</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">Deliveries</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">Runs</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">SR</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">Economy</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(allVenueStats).map(([venue, stats]) => (
                  <tr key={venue} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{venue}</td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {stats.total_deliveries}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-blue-600">
                      {stats.batting.runs}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-green-600">
                      {stats.batting.strike_rate}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-orange-600">
                      {stats.bowling.economy}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleVenueSelect(venue)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Details
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

export default VenueAnalysis
