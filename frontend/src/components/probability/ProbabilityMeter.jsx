import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const ProbabilityMeter = ({ probability }) => {
  const getColor = () => {
    if (probability >= 70) return 'green'
    if (probability >= 40) return 'amber'
    return 'red'
  }

  const getIcon = () => {
    if (probability >= 60) return <TrendingUp className="h-6 w-6" />
    if (probability >= 40) return <Minus className="h-6 w-6" />
    return <TrendingDown className="h-6 w-6" />
  }

  const color = getColor()
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (probability / 100) * circumference

  return (
    <div className="card text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Win Probability</h3>
      
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color === 'green' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${
            color === 'green' ? 'text-green-600' : 
            color === 'amber' ? 'text-amber-600' : 'text-red-600'
          }`}>
            {probability.toFixed(1)}%
          </div>
          <div className={`mt-1 ${
            color === 'green' ? 'text-green-600' : 
            color === 'amber' ? 'text-amber-600' : 'text-red-600'
          }`}>
            {getIcon()}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className={`p-2 rounded ${probability >= 70 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          <div className="font-medium">Favorable</div>
          <div>70%+</div>
        </div>
        <div className={`p-2 rounded ${probability >= 40 && probability < 70 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
          <div className="font-medium">Balanced</div>
          <div>40-70%</div>
        </div>
        <div className={`p-2 rounded ${probability < 40 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
          <div className="font-medium">Difficult</div>
          <div>&lt;40%</div>
        </div>
      </div>
    </div>
  )
}

export default ProbabilityMeter
