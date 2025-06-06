import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cricketHelpers } from '../../utils/cricketHelpers'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  subtitle, 
  trend,
  trendValue,
  className = '',
  size = 'md',
  type = 'number' // 'number', 'percentage', 'strike_rate', 'economy'
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  // Format value based on type
  const formatValue = (val) => {
    if (val === null || val === undefined) return '0'
    
    const numVal = Number(val)
    if (isNaN(numVal)) return val

    switch (type) {
      case 'percentage':
      case 'strike_rate':
        // Validate strike rate
        if (type === 'strike_rate' && !cricketHelpers.isValidStrikeRate(numVal)) {
          console.warn(`Invalid strike rate: ${numVal}`)
          return 'Invalid'
        }
        return `${numVal.toFixed(2)}%`
      
      case 'economy':
        // Validate economy rate
        if (!cricketHelpers.isValidEconomyRate(numVal)) {
          console.warn(`Invalid economy rate: ${numVal}`)
          return 'Invalid'
        }
        return numVal.toFixed(2)
      
      case 'number':
      default:
        return numVal.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white rounded-lg border-2 ${colorClasses[color]} ${sizeClasses[size]} hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${iconSizes[size]} ${colorClasses[color].split(' ')[0]} flex-shrink-0`}>
          <Icon className={iconSizes[size]} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            {trendValue && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className={`font-bold text-gray-900 ${textSizes[size]}`}>
          {formatValue(value)}
        </div>
        <div className="text-sm font-medium text-gray-700">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
