import React, { useState } from 'react'
import { Clock, Zap, Target, TrendingUp } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PlayerSearch from '../player/PlayerSearch'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PhaseAnalysisDetail = ({ 
  batter: initialBatter, 
  bowler: initialBowler, 
  onBatterSelect, 
  onBowlerSelect, 
  filters = {} 
}) => {
  const [selectedBatter, setSelectedBatter] = useState(initialBatter || '')
  const [selectedBowler, setSelectedBowler] = useState(initialBowler || '')

  const handleBatterSelect = (batter) => {
    setSelectedBatter(batter)
    if (onBatterSelect) {
      onBatterSelect(batter)
    }
  }

  const handleBowlerSelect = (bowler) => {
    setSelectedBowler(bowler)
    if (onBowlerSelect) {
      onBowlerSelect(bowler)
    }
  }

  const { data: phaseData, loading, error, refetch } = useApi(
    ['phase-analysis', selectedBatter, selectedBowler, filters],
    () => (selectedBatter && selectedBowler) ? 
      advancedApiService.getPhaseAnalysis(selectedBatter, selectedBowler, filters) : 
      Promise.resolve(null),
    {
      enabled: !!(selectedBatter && selectedBowler && selectedBatter.trim() !== '' && selectedBowler.trim() !== ''),
      retry: 2
    }
  )

  if (!selectedBatter || !selectedBowler) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600 mr-2" />
              Phase Analysis
            </h2>
            <p className="text-gray-600">
              Analyze performance across powerplay, middle overs, and death overs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Batter</h3>
              <PlayerSearch
                type="batter"
                onSelect={handleBatterSelect}
                placeholder="Search for a batter..."
                value={selectedBatter}
                className="w-full"
              />
              {selectedBatter && (
                <div className="mt-3 text-sm text-green-600 flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Selected: {selectedBatter}
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Bowler</h3>
              <PlayerSearch
                type="bowler"
                onSelect={handleBowlerSelect}
                placeholder="Search for a bowler..."
                value={selectedBowler}
                className="w-full"
              />
              {selectedBowler && (
                <div className="mt-3 text-sm text-green-600 flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Selected: {selectedBowler}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading phase analysis..." />
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

  if (!phaseData || phaseData.error) {
    return (
      <ErrorMessage 
        message={phaseData?.error || "No phase data available"} 
        onRetry={refetch}
        type="info"
      />
    )
  }

  const phases = phaseData.phase_analysis
  const chartData = [
    {
      phase: 'Powerplay (1-6)',
      runs: phases.powerplay.runs,
      balls: phases.powerplay.balls,
      strike_rate: phases.powerplay.strike_rate,
      boundaries: phases.powerplay.boundaries,
      color: '#3b82f6'
    },
    {
      phase: 'Middle (7-15)',
      runs: phases.middle_overs.runs,
      balls: phases.middle_overs.balls,
      strike_rate: phases.middle_overs.strike_rate,
      boundaries: phases.middle_overs.boundaries,
      color: '#10b981'
    },
    {
      phase: 'Death (16-20)',
      runs: phases.death_overs.runs,
      balls: phases.death_overs.balls,
      strike_rate: phases.death_overs.strike_rate,
      boundaries: phases.death_overs.boundaries,
      color: '#f59e0b'
    }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Runs: {data.runs}</p>
            <p className="text-green-600">Strike Rate: {data.strike_rate}%</p>
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
    <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Clock className="h-6 w-6 text-green-600 mr-2" />
            Phase Analysis - {selectedBatter} vs {selectedBowler}
          </h2>
          <p className="text-gray-600">
            Performance breakdown across different match phases
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <button 
              onClick={() => setSelectedBatter('')}
              className="btn-secondary text-sm"
            >
              Change Batter
            </button>
            <button 
              onClick={() => setSelectedBowler('')}
              className="btn-secondary text-sm"
            >
              Change Bowler
            </button>
          </div>
        </div>

        {/* Phase Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Powerplay (1-6)</h3>
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Runs:</span>
                <span className="font-bold text-blue-900">{phases.powerplay.runs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Balls:</span>
                <span className="font-bold text-blue-900">{phases.powerplay.balls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Strike Rate:</span>
                <span className="font-bold text-blue-900">{phases.powerplay.strike_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Boundaries:</span>
                <span className="font-bold text-blue-900">{phases.powerplay.boundaries}</span>
              </div>
              {phases.powerplay.dismissals > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Dismissals:</span>
                  <span className="font-bold text-red-600">{phases.powerplay.dismissals}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Middle Overs (7-15)</h3>
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Runs:</span>
                <span className="font-bold text-green-900">{phases.middle_overs.runs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Balls:</span>
                <span className="font-bold text-green-900">{phases.middle_overs.balls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Strike Rate:</span>
                <span className="font-bold text-green-900">{phases.middle_overs.strike_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Boundaries:</span>
                <span className="font-bold text-green-900">{phases.middle_overs.boundaries}</span>
              </div>
              {phases.middle_overs.dismissals > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-700">Dismissals:</span>
                  <span className="font-bold text-red-600">{phases.middle_overs.dismissals}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-900">Death Overs (16-20)</h3>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-orange-700">Runs:</span>
                <span className="font-bold text-orange-900">{phases.death_overs.runs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Balls:</span>
                <span className="font-bold text-orange-900">{phases.death_overs.balls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Strike Rate:</span>
                <span className="font-bold text-orange-900">{phases.death_overs.strike_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Boundaries:</span>
                <span className="font-bold text-orange-900">{phases.death_overs.boundaries}</span>
              </div>
              {phases.death_overs.dismissals > 0 && (
                <div className="flex justify-between">
                  <span className="text-orange-700">Dismissals:</span>
                  <span className="font-bold text-red-600">{phases.death_overs.dismissals}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phase Comparison Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Phase Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="phase" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="runs" name="Runs">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhaseAnalysisDetail
