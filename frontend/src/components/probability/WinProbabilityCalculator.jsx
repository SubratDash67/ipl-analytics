import React, { useState } from 'react'
import { Calculator, TrendingUp, Clock, Users } from 'lucide-react'
import { advancedApiService } from '../../services/advancedApi'
import LoadingSpinner from '../common/LoadingSpinner'
import ProbabilityMeter from './ProbabilityMeter'
import SituationAnalysis from './SituationAnalysis'

const WinProbabilityCalculator = () => {
  const [formData, setFormData] = useState({
    current_score: '',
    target: '',
    overs_remaining: '',
    wickets_left: '10'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleCalculate = async () => {
    try {
      // Validation
      const { current_score, target, overs_remaining, wickets_left } = formData
      
      if (!current_score || !target || !overs_remaining || !wickets_left) {
        setError('Please fill all required fields')
        return
      }

      const currentScore = parseInt(current_score)
      const targetScore = parseInt(target)
      const oversRemaining = parseFloat(overs_remaining)
      const wicketsLeft = parseInt(wickets_left)

      if (currentScore < 0 || targetScore <= 0 || oversRemaining < 0 || oversRemaining > 20 || 
          wicketsLeft < 0 || wicketsLeft > 10) {
        setError('Please enter valid values')
        return
      }

      setLoading(true)
      setError('')

      const matchSituation = {
        current_score: currentScore,
        target: targetScore,
        overs_remaining: oversRemaining,
        wickets_left: wicketsLeft
      }

      const probabilityData = await advancedApiService.calculateWinProbability(matchSituation)
      setResult(probabilityData)

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate win probability')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      current_score: '',
      target: '',
      overs_remaining: '',
      wickets_left: '10'
    })
    setResult(null)
    setError('')
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Calculator className="h-8 w-8 text-blue-600 mr-3" />
          Win Probability Calculator
        </h2>
        <p className="text-lg text-gray-600">
          Calculate real-time win probability using advanced cricket analytics
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Match Situation</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Score
                </label>
                <input
                  type="number"
                  name="current_score"
                  value={formData.current_score}
                  onChange={handleInputChange}
                  placeholder="150"
                  min="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target
                </label>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleInputChange}
                  placeholder="180"
                  min="1"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overs Remaining
                </label>
                <input
                  type="number"
                  name="overs_remaining"
                  value={formData.overs_remaining}
                  onChange={handleInputChange}
                  placeholder="3.5"
                  min="0"
                  max="20"
                  step="0.1"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wickets Left
                </label>
                <select
                  name="wickets_left"
                  value={formData.wickets_left}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Calculator className="h-4 w-4 mr-2" />
                )}
                Calculate Probability
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              <ProbabilityMeter probability={result.win_probability} />
              <SituationAnalysis result={result} />
            </>
          )}
          
          {!result && (
            <div className="card text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Enter match situation to calculate win probability
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WinProbabilityCalculator
