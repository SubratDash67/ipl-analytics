import React, { useMemo } from 'react'
import { Clock, Zap, Target, TrendingUp } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PhaseComparisonChart from './PhaseComparisonChart'
import PhasePerformanceCards from './PhasePerformanceCards'

const PhaseAnalysisDetail = ({ batter, bowler, filters = {} }) => {
  // Memoize the API call to prevent infinite loops
  const apiCall = useMemo(() => 
    (signal) => advancedApiService.getPhaseAnalysis(batter, bowler, filters, signal),
    [batter, bowler, JSON.stringify(filters)]
  )

  const { data: phaseData, loading, error, refetch } = useApi(
    apiCall,
    [batter, bowler, JSON.stringify(filters)]
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
        message="Failed to load phase analysis" 
        onRetry={refetch}
      />
    )
  }

  if (!phaseData) {
    return (
      <ErrorMessage 
        message="No phase data received from server" 
        onRetry={refetch}
      />
    )
  }

  if (phaseData.error) {
    return (
      <ErrorMessage 
        message={phaseData.error} 
        onRetry={refetch}
      />
    )
  }

  // Check if phase analysis data exists
  if (!phaseData.phase_analysis) {
    return (
      <div className="card text-center py-8">
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No phase analysis data available for {batter} vs {bowler}</p>
        <button 
          onClick={refetch}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  const phases = [
    {
      key: 'powerplay',
      name: 'Powerplay',
      range: '1-6 Overs',
      icon: Zap,
      color: 'blue',
      description: 'Field restrictions: Only 2 fielders outside 30-yard circle'
    },
    {
      key: 'middle_overs',
      name: 'Middle Overs',
      range: '7-15 Overs',
      icon: Target,
      color: 'green',
      description: 'Building phase: Maximum 4 fielders outside circle'
    },
    {
      key: 'death_overs',
      name: 'Death Overs',
      range: '16-20 Overs',
      icon: TrendingUp,
      color: 'red',
      description: 'Final assault: Maximum 5 fielders outside circle'
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            Phase-wise Analysis
          </h2>
          <p className="text-gray-600">
            {batter} vs {bowler} • Performance across different match phases
          </p>
        </div>

        {/* Phase Performance Cards */}
        <div className="w-full overflow-hidden">
          <PhasePerformanceCards phases={phases} phaseData={phaseData.phase_analysis} />
        </div>

        {/* Phase Comparison Chart */}
        <div className="w-full overflow-hidden">
          <PhaseComparisonChart phases={phases} phaseData={phaseData.phase_analysis} />
        </div>

        {/* Detailed Phase Breakdown */}
        <div className="grid lg:grid-cols-3 gap-6 w-full">
          {phases.map(phase => {
            const data = phaseData.phase_analysis[phase.key]
            const stats = data?.stats || {}
            
            return (
              <div key={phase.key} className="card w-full">
                <div className="flex items-center mb-4">
                  <phase.icon className={`h-6 w-6 text-${phase.color}-600 mr-2`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                    <p className="text-sm text-gray-600">{phase.range}</p>
                  </div>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">{phase.description}</p>
                </div>

                {data && data.total_deliveries > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{stats.runs_scored || 0}</div>
                        <div className="text-xs text-gray-600">Runs</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">
                          {stats.strike_rate ? `${stats.strike_rate.toFixed(1)}%` : '0%'}
                        </div>
                        <div className="text-xs text-gray-600">Strike Rate</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{stats.boundaries || 0}</div>
                        <div className="text-xs text-gray-600">Boundaries</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="text-lg font-bold text-orange-600">
                          {stats.run_rate ? stats.run_rate.toFixed(1) : '0.0'}
                        </div>
                        <div className="text-xs text-gray-600">Run Rate</div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Balls Faced:</span>
                        <span className="font-medium">{stats.balls_faced || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dot Ball %:</span>
                        <span className="font-medium text-red-600">
                          {stats.dot_ball_percentage ? `${stats.dot_ball_percentage.toFixed(1)}%` : '0%'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Wickets:</span>
                        <span className="font-medium">{stats.wickets_lost || 0}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No data available for this phase</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PhaseAnalysisDetail
