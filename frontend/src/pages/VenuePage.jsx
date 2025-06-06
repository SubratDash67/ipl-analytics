import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, MapPin, BarChart3, Target, TrendingUp, Filter } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { apiService } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/stats/StatCard'

const VenuePage = () => {
  const { batter, bowler } = useParams()
  const [selectedVenue, setSelectedVenue] = useState('')
  const [filters, setFilters] = useState({})

  const decodedBatter = decodeURIComponent(batter)
  const decodedBowler = decodeURIComponent(bowler)

  const { data: venueData, loading, error } = useApi(
    ['venue-analysis', decodedBatter, decodedBowler, selectedVenue],
    () => apiService.getVenueAnalysis(decodedBatter, decodedBowler, selectedVenue),
    { enabled: !!selectedVenue }
  )

  const { data: venues } = useApi(
    ['venues'],
    () => apiService.getVenues()
  )

  return (
    <>
      <Helmet>
        <title>{`${decodedBatter} vs ${decodedBowler} - Venue Analysis | IPL Analytics`}</title>
        <meta name="description" content={`Venue-wise performance analysis between ${decodedBatter} and ${decodedBowler} across different IPL grounds.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link 
              to={`/head-to-head/${encodeURIComponent(decodedBatter)}/${encodeURIComponent(decodedBowler)}`}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Head-to-Head
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MapPin className="h-8 w-8 mr-3 text-blue-600" />
              Venue Analysis
            </h1>
            <p className="text-gray-600">
              {decodedBatter} vs {decodedBowler} • Performance by venue
            </p>
          </div>
        </div>

        {/* Venue Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Venue</h2>
          <select
            className="input-field max-w-md"
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
          >
            <option value="">Choose a venue...</option>
            {venues?.map(venue => (
              <option key={venue} value={venue}>{venue}</option>
            ))}
          </select>
        </div>

        {/* Venue Analysis Results */}
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Loading venue analysis..." />
          </div>
        )}

        {error && (
          <ErrorMessage message="Failed to load venue analysis" />
        )}

        {venueData && (
          <div className="space-y-8">
            {/* Venue Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Matches"
                value={venueData.matches || 0}
                icon={BarChart3}
                color="blue"
                subtitle="At this venue"
              />
              <StatCard
                title="Runs Scored"
                value={venueData.runs || 0}
                icon={Target}
                color="green"
                subtitle="By the batter"
              />
              <StatCard
                title="Strike Rate"
                value={`${venueData.strike_rate || 0}%`}
                icon={TrendingUp}
                color="purple"
                subtitle="At this venue"
              />
              <StatCard
                title="Dismissals"
                value={venueData.dismissals || 0}
                icon={Filter}
                color="red"
                subtitle="Times out"
              />
            </div>

            {/* Venue Details */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedVenue} - Detailed Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Batting Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Runs</span>
                      <span className="font-medium">{venueData.runs || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balls Faced</span>
                      <span className="font-medium">{venueData.balls || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strike Rate</span>
                      <span className="font-medium">{venueData.strike_rate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average</span>
                      <span className="font-medium">{venueData.average || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bowling Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Runs Conceded</span>
                      <span className="font-medium">{venueData.runs || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balls Bowled</span>
                      <span className="font-medium">{venueData.balls || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Economy Rate</span>
                      <span className="font-medium">{venueData.economy || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wickets</span>
                      <span className="font-medium">{venueData.dismissals || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedVenue && (
          <div className="card text-center py-16">
            <MapPin className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select a Venue
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose a venue from the dropdown above to analyze the performance 
              of {decodedBatter} vs {decodedBowler} at that specific ground.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default VenuePage
