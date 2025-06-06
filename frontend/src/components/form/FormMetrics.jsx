import React from 'react'
import { Target, Zap, Award, TrendingUp } from 'lucide-react'

const FormMetrics = ({ formStats, playerType }) => {
  const getConsistencyColor = (rating) => {
    if (rating >= 80) return 'text-green-600 bg-green-50'
    if (rating >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getFormTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50'
      case 'declining':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Form Metrics</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playerType === 'batter' ? (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{formStats.average}</div>
              <div className="text-sm text-gray-600">Batting Average</div>
              <div className="text-xs text-gray-500 mt-1">
                {formStats.runs_scored} runs in {formStats.dismissals} dismissals
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{formStats.strike_rate}%</div>
              <div className="text-sm text-gray-600">Strike Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                {formStats.runs_scored} runs off {formStats.balls_faced} balls
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{formStats.boundaries}</div>
              <div className="text-sm text-gray-600">Boundaries</div>
              <div className="text-xs text-gray-500 mt-1">
                {formStats.fours} fours, {formStats.sixes} sixes
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{formStats.average}</div>
              <div className="text-sm text-gray-600">Bowling Average</div>
              <div className="text-xs text-gray-500 mt-1">
                {formStats.runs_scored} runs per wicket
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{formStats.strike_rate}</div>
              <div className="text-sm text-gray-600">Economy Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Runs per over
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formStats.balls_faced > 0 ? (formStats.balls_faced / formStats.runs_scored).toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Strike Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Balls per wicket
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <div className={`text-2xl font-bold ${getConsistencyColor(formStats.consistency_rating).split(' ')[0]}`}>
            {formStats.consistency_rating}%
          </div>
          <div className="text-sm text-gray-600">Consistency</div>
          <div className={`text-xs mt-1 px-2 py-1 rounded-full ${getFormTrendColor(formStats.form_trend)}`}>
            {formStats.form_trend.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900">{formStats.matches_played}</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{formStats.runs_scored}</div>
            <div className="text-gray-600">
              {playerType === 'batter' ? 'Total Runs' : 'Runs Conceded'}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{formStats.balls_faced}</div>
            <div className="text-gray-600">
              {playerType === 'batter' ? 'Balls Faced' : 'Balls Bowled'}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {playerType === 'batter' ? formStats.dismissals : 'N/A'}
            </div>
            <div className="text-gray-600">
              {playerType === 'batter' ? 'Dismissals' : 'Wickets'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormMetrics
