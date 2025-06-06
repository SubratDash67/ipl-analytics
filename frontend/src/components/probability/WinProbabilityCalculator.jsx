import React, { useState } from 'react'
import { Calculator, TrendingUp, Target, Clock, Users } from 'lucide-react'
import { useApiMutation } from '../../hooks/useApi'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'

const WinProbabilityCalculator = () => {
  const [matchSituation, setMatchSituation] = useState({
    current_score: 120,
    target: 180,
    overs_remaining: 8.0,
    wickets_left: 6,
    run_rate_required: 0,
    current_run_rate: 0
  })

  const [result, setResult] = useState(null)

  const { mutate: calculateProbability, isLoading } = useApiMutation(
    (data) => advancedApiService.calculateWinProbability(data),
    {
      onSuccess: (data) => {
        setResult(data)
      }
    }
  )

  const handleInputChange = (field, value) => {
    const updatedSituation = {
      ...matchSituation,
      [field]: parseFloat(value) || 0
    }
    
    // Auto-calculate required run rate
    if (field === 'current_score' || field === 'target' || field === 'overs_remaining') {
      const runsNeeded = updatedSituation.target - updatedSituation.current_score
      const oversLeft = updatedSituation.overs_remaining
      updatedSituation.run_rate_required = oversLeft > 0 ? (runsNeeded / oversLeft).toFixed(2) : 0
    }
    
    setMatchSituation(updatedSituation)
  }

  const handleCalculate = () => {
    calculateProbability(matchSituation)
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return 'text-green-600 bg-green-50'
    if (probability >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calculator className="h-6 w-6 text-orange-600 mr-2" />
          Match Situation
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="label">
              <Target className="h-4 w-4 inline mr-2" />
              Current Score
            </label>
            <input
              type="number"
              className="input-field"
              value={matchSituation.current_score}
              onChange={(e) => handleInputChange('current_score', e.target.value)}
              placeholder="120"
            />
          </div>
          
          <div>
            <label className="label">
              <Target className="h-4 w-4 inline mr-2" />
              Target Score
            </label>
            <input
              type="number"
              className="input-field"
              value={matchSituation.target}
              onChange={(e) => handleInputChange('target', e.target.value)}
              placeholder="180"
            />
          </div>
          
          <div>
            <label className="label">
              <Clock className="h-4 w-4 inline mr-2" />
              Overs Remaining
            </label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={matchSituation.overs_remaining}
              onChange={(e) => handleInputChange('overs_remaining', e.target.value)}
              placeholder="8.0"
            />
          </div>
          
          <div>
            <label className="label">
              <Users className="h-4 w-4 inline mr-2" />
              Wickets Left
            </label>
            <input
              type="number"
              className="input-field"
              value={matchSituation.wickets_left}
              onChange={(e) => handleInputChange('wickets_left', e.target.value)}
              placeholder="6"
              min="0"
              max="10"
            />
          </div>
          
          <div>
            <label className="label">
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Required Run Rate
            </label>
            <input
              type="number"
              step="0.01"
              className="input-field bg-gray-50"
              value={matchSituation.run_rate_required}
              readOnly
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  <span>Calculate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Win Probability Analysis
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getProbabilityColor(result.win_probability)}`}>
                {result.win_probability}%
              </div>
              <p className="text-lg font-medium text-gray-900 mt-4">
                Win Probability
              </p>
              <p className="text-sm text-gray-600">
                Based on historical data and current situation
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Runs Needed</span>
                <span className="font-medium text-gray-900">
                  {result.runs_needed || (matchSituation.target - matchSituation.current_score)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Required Run Rate</span>
                <span className="font-medium text-gray-900">
                  {matchSituation.run_rate_required}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Balls Remaining</span>
                <span className="font-medium text-gray-900">
                  {Math.floor(matchSituation.overs_remaining * 6)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Wickets in Hand</span>
                <span className="font-medium text-gray-900">
                  {matchSituation.wickets_left}
                </span>
              </div>
            </div>
          </div>
          
          {result.factors && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Key Factors</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {result.factors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {!result && (
        <div className="card text-center py-12">
          <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enter Match Situation
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Fill in the current match situation above and click calculate to get 
            the win probability based on historical data and statistical models.
          </p>
        </div>
      )}
    </div>
  )
}

export default WinProbabilityCalculator
