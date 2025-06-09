import React, { useState } from 'react'
import { Calculator, TrendingUp, Target, Clock, Zap } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const WinProbabilityCalculator = () => {
  const [matchSituation, setMatchSituation] = useState({
    current_score: 120,
    target: 180,
    overs_remaining: 8.4,
    wickets_left: 6
  })

  const winProbabilityMutation = useMutation({
    mutationFn: (data) => advancedApiService.calculateWinProbability(data),
    onError: (error) => {
      console.error('Win probability calculation error:', error)
    }
  })

  const handleCalculate = () => {
    winProbabilityMutation.mutate(matchSituation)
  }

  const handleInputChange = (field, value) => {
    setMatchSituation(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }))
  }

  const runsNeeded = matchSituation.target - matchSituation.current_score
  const requiredRunRate = matchSituation.overs_remaining > 0 ? 
    (runsNeeded / matchSituation.overs_remaining).toFixed(2) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Calculator className="h-6 w-6 text-orange-600 mr-2" />
          Win Probability Calculator
        </h2>
        <p className="text-gray-600">
          Calculate real-time win probability based on current match situation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Match Situation</h3>
          
          <div className="space-y-6">
            <div>
              <label className="label">Current Score</label>
              <input
                type="number"
                value={matchSituation.current_score}
                onChange={(e) => handleInputChange('current_score', e.target.value)}
                className="input-field"
                min="0"
                max="400"
              />
            </div>

            <div>
              <label className="label">Target Score</label>
              <input
                type="number"
                value={matchSituation.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
                className="input-field"
                min="1"
                max="400"
              />
            </div>

            <div>
              <label className="label">Overs Remaining</label>
              <input
                type="number"
                step="0.1"
                value={matchSituation.overs_remaining}
                onChange={(e) => handleInputChange('overs_remaining', e.target.value)}
                className="input-field"
                min="0"
                max="20"
              />
            </div>

            <div>
              <label className="label">Wickets Left</label>
              <input
                type="number"
                value={matchSituation.wickets_left}
                onChange={(e) => handleInputChange('wickets_left', e.target.value)}
                className="input-field"
                min="0"
                max="10"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={winProbabilityMutation.isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {winProbabilityMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  <span>Calculate Win Probability</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Situation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{runsNeeded}</div>
                <div className="text-sm text-gray-600">Runs Needed</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{requiredRunRate}</div>
                <div className="text-sm text-gray-600">Required Run Rate</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{matchSituation.overs_remaining}</div>
                <div className="text-sm text-gray-600">Overs Left</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{matchSituation.wickets_left}</div>
                <div className="text-sm text-gray-600">Wickets Left</div>
              </div>
            </div>
          </div>

          {/* Win Probability Result */}
          {winProbabilityMutation.isError && (
            <ErrorMessage 
              message="Failed to calculate win probability" 
              onRetry={handleCalculate}
            />
          )}

          {winProbabilityMutation.data && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Win Probability</h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {winProbabilityMutation.data.win_probability}%
                </div>
                <div className="text-gray-600">Chance of winning</div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${winProbabilityMutation.data.win_probability}%` }}
                ></div>
              </div>

              {winProbabilityMutation.data.factors && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Key Factors</h4>
                  <div className="space-y-2">
                    {winProbabilityMutation.data.factors.map((factor, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preset Scenarios */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preset Scenarios</h3>
            <div className="space-y-2">
              {[
                { name: 'Easy Chase', current_score: 150, target: 160, overs_remaining: 5, wickets_left: 8 },
                { name: 'Moderate Chase', current_score: 120, target: 180, overs_remaining: 8, wickets_left: 6 },
                { name: 'Difficult Chase', current_score: 80, target: 200, overs_remaining: 6, wickets_left: 4 },
                { name: 'Last Over Thriller', current_score: 175, target: 180, overs_remaining: 1, wickets_left: 3 }
              ].map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => setMatchSituation(scenario)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{scenario.name}</div>
                  <div className="text-sm text-gray-600">
                    {scenario.current_score}/{scenario.target} • {scenario.overs_remaining} overs • {scenario.wickets_left} wickets
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WinProbabilityCalculator
