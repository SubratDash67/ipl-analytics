import React from 'react'
import { Clock, Target, Zap, Users } from 'lucide-react'

const SituationAnalysis = ({ result }) => {
  if (!result) return null

  const getSituationColor = () => {
    switch (result.situation) {
      case 'comfortable':
        return 'bg-green-100 text-green-800'
      case 'achievable':
        return 'bg-amber-100 text-amber-800'
      case 'challenging':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Situation Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-sm text-gray-600">Balls Remaining</div>
            <div className="text-xl font-bold text-blue-600">
              {result.balls_remaining}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <Zap className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-sm text-gray-600">Required Run Rate</div>
            <div className="text-xl font-bold text-green-600">
              {result.required_run_rate}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <Users className="h-5 w-5 text-purple-600" />
          <div>
            <div className="text-sm text-gray-600">Wickets Left</div>
            <div className="text-xl font-bold text-purple-600">
              {result.wickets_left}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
          <Target className="h-5 w-5 text-red-600" />
          <div>
            <div className="text-sm text-gray-600">Runs Needed</div>
            <div className="text-xl font-bold text-red-600">
              {result.runs_needed}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded-lg ${getSituationColor()}`}>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Situation:</span>
          <span className="capitalize">{result.situation}</span>
        </div>
      </div>
    </div>
  )
}

export default SituationAnalysis
