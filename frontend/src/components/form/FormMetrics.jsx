import React from 'react'
import { Target, Zap, Circle, TrendingUp } from 'lucide-react'

const FormMetrics = ({ formStats, playerType }) => {
  const formatValue = (value, type = 'number') => {
    if (value === null || value === undefined) return 'N/A'
    
    switch (type) {
      case 'percentage':
        return `${Number(value).toFixed(2)}%`
      case 'decimal':
        return Number(value).toFixed(2)
      case 'integer':
        return Math.round(Number(value))
      default:
        return Number(value).toFixed(2)
    }
  }

  const metrics = playerType === 'batter' ? [
    { 
      label: 'Average', 
      value: formStats.average, 
      icon: Target, 
      color: 'blue',
      type: 'decimal'
    },
    { 
      label: 'Strike Rate', 
      value: formStats.strike_rate, 
      icon: Zap, 
      color: 'green',
      type: 'percentage'
    },
    { 
      label: 'Consistency', 
      value: formStats.consistency_rating, 
      icon: Circle, 
      color: 'purple',
      type: 'decimal'
    },
    { 
      label: 'Boundaries', 
      value: formStats.boundaries, 
      icon: TrendingUp, 
      color: 'orange',
      type: 'integer'
    }
  ] : [
    { 
      label: 'Economy', 
      value: formStats.strike_rate, 
      icon: Target, 
      color: 'blue',
      type: 'decimal'
    },
    { 
      label: 'Average', 
      value: formStats.average, 
      icon: Zap, 
      color: 'green',
      type: 'decimal'
    },
    { 
      label: 'Consistency', 
      value: formStats.consistency_rating, 
      icon: Circle, 
      color: 'purple',
      type: 'decimal'
    },
    { 
      label: 'Balls Bowled', 
      value: formStats.balls_faced, 
      icon: TrendingUp, 
      color: 'orange',
      type: 'integer'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
            <metric.icon className={`h-6 w-6 mx-auto mb-2 text-${metric.color}-600`} />
            <div className="text-xl font-bold text-gray-900">
              {formatValue(metric.value, metric.type)}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormMetrics
