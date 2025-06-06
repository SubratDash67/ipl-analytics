import React from 'react'
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApi } from '../../hooks/useApi'
import { apiService } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const SeasonTrends = ({ batter, bowler, filters }) => {
  const { data: seasonData, loading, error } = useApi(
    ['season-trends', batter, bowler, filters],
    () => apiService.getSeasonTrends(batter, bowler, filters)
  )

  // Validate strike rate function
  const validateStrikeRate = (sr) => {
    const numSR = Number(sr)
    if (isNaN(numSR) || numSR > 400 || numSR < 0) {
      return { value: 'Invalid', isValid: false, numValue: 0 }
    }
    return { value: `${numSR.toFixed(1)}%`, isValid: true, numValue: numSR }
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-600" />
          Season Trends
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
          <Calendar className="h-5 w-5 mr-2 text-green-600" />
          Season Trends
        </h3>
        <ErrorMessage message="Failed to load season trends" />
      </div>
    )
  }

  const seasons = seasonData?.seasons || []

  // Filter out seasons with invalid strike rates for chart
  const validSeasons = seasons.filter(season => {
    const validation = validateStrikeRate(season.strike_rate)
    return validation.isValid
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const strikeRateValidation = validateStrikeRate(data.strike_rate)
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">Season {label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Runs: {data.runs}</p>
            <p className="text-gray-600">Balls: {data.balls}</p>
            <p className={`flex items-center ${strikeRateValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
              Strike Rate: {strikeRateValidation.value}
              {!strikeRateValidation.isValid && <AlertTriangle className="h-3 w-3 ml-1" />}
            </p>
            <p className="text-purple-600">Boundaries: {data.boundaries}</p>
            {data.dismissals > 0 && (
              <p className="text-red-600">Dismissals: {data.dismissals}</p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-green-600" />
        Season Trends
      </h3>
      
      {seasons.length > 0 ? (
        <div className="space-y-4">
          {validSeasons.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={validSeasons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="season" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Runs', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Strike Rate (%)', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="runs" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="strike_rate" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-red-50 rounded-lg">
              <div className="text-center text-red-600">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                <p>Invalid strike rate data detected</p>
                <p className="text-sm">Chart cannot be displayed</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {Math.max(...seasons.map(s => s.runs))}
              </div>
              <div className="text-sm text-gray-600">Best Season (Runs)</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600 flex items-center justify-center">
                {(() => {
                  const maxSR = Math.max(...seasons.map(s => s.strike_rate))
                  const validation = validateStrikeRate(maxSR)
                  return (
                    <>
                      {validation.value}
                      {!validation.isValid && <AlertTriangle className="h-4 w-4 ml-1" />}
                    </>
                  )
                })()}
              </div>
              <div className="text-sm text-gray-600">Best Strike Rate</div>
            </div>
          </div>

          {/* Warning for invalid data */}
          {seasons.length !== validSeasons.length && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center text-yellow-800">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Some seasons have invalid strike rate data and are excluded from the chart
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No season data available for this matchup</p>
        </div>
      )}
    </div>
  )
}

export default SeasonTrends
