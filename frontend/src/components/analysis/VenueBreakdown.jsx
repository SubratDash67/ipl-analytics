import React from 'react'
import { MapPin, TrendingUp, Target, AlertTriangle } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { apiService } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const VenueBreakdown = ({ batter, bowler, filters }) => {
  const { data: venueData, loading, error } = useApi(
    ['venue-breakdown', batter, bowler, filters],
    () => apiService.getVenueBreakdown(batter, bowler, filters)
  )

  // Validate strike rate function
  const validateStrikeRate = (sr) => {
    const numSR = Number(sr)
    if (isNaN(numSR) || numSR > 400 || numSR < 0) {
      return { value: 'Invalid', isValid: false }
    }
    return { value: `${numSR.toFixed(1)}%`, isValid: true }
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Venue Breakdown
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Venue Breakdown
        </h3>
        <ErrorMessage message="Failed to load venue breakdown" />
      </div>
    )
  }

  const venues = venueData?.venues || []

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
        Venue Breakdown
      </h3>
      
      {venues.length > 0 ? (
        <div className="space-y-3">
          {venues.slice(0, 8).map((venue, index) => {
            const strikeRateValidation = validateStrikeRate(venue.strike_rate)
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{venue.name}</p>
                  <p className="text-sm text-gray-600">{venue.matches} matches • {venue.balls} balls</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">{venue.runs}</div>
                      <div className="text-xs text-gray-500">Runs</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium flex items-center ${
                        strikeRateValidation.isValid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {strikeRateValidation.value}
                        {!strikeRateValidation.isValid && (
                          <AlertTriangle className="h-3 w-3 ml-1" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">SR</div>
                    </div>
                    {venue.dismissals > 0 && (
                      <div className="text-center">
                        <div className="text-sm font-medium text-red-600">{venue.dismissals}</div>
                        <div className="text-xs text-gray-500">Out</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No venue data available for this matchup</p>
        </div>
      )}
    </div>
  )
}

export default VenueBreakdown
