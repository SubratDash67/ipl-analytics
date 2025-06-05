import React from 'react'
import { Target, Zap, Percent, Circle } from 'lucide-react'

const StatsOverview = ({ battingStats, bowlingStats, batter, bowler }) => {
  const battingMetrics = [
    {
      label: 'Runs Scored',
      value: battingStats.runs,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Strike Rate',
      value: `${battingStats.strike_rate}%`,
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Average',
      value: battingStats.average || 'N/A',
      icon: Percent,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Dot Ball %',
      value: `${battingStats.dot_ball_percent}%`,
      icon: Circle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const bowlingMetrics = [
    {
      label: 'Runs Conceded',
      value: bowlingStats.runs_conceded,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Economy Rate',
      value: bowlingStats.economy,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Wickets',
      value: bowlingStats.wickets,
      icon: Percent,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Bowling Average',
      value: bowlingStats.average || 'N/A',
      icon: Circle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-blue-600 mr-2" />
          {batter} (Batting)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {battingMetrics.map((metric, index) => (
            <div key={index} className={`p-4 rounded-lg ${metric.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <span className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {battingStats.balls_faced}
            </div>
            <div className="text-sm text-gray-600">Balls Faced</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {battingStats.boundaries}
            </div>
            <div className="text-sm text-gray-600">Boundaries</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {battingStats.dismissals}
            </div>
            <div className="text-sm text-gray-600">Dismissals</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 text-green-600 mr-2" />
          {bowler} (Bowling)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {bowlingMetrics.map((metric, index) => (
            <div key={index} className={`p-4 rounded-lg ${metric.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <span className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {bowlingStats.balls_bowled}
            </div>
            <div className="text-sm text-gray-600">Balls Bowled</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {bowlingStats.dot_balls}
            </div>
            <div className="text-sm text-gray-600">Dot Balls</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {bowlingStats.maidens}
            </div>
            <div className="text-sm text-gray-600">Maidens</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
