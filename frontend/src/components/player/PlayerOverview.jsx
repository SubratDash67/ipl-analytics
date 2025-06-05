import React from 'react'
import { Target, Zap, TrendingUp, Circle, Award } from 'lucide-react'

const PlayerOverview = ({ stats, playerType, totalDeliveries }) => {
  const battingMetrics = [
    { label: 'Total Runs', value: stats.runs, icon: Target, color: 'blue' },
    { label: 'Strike Rate', value: `${stats.strike_rate}%`, icon: Zap, color: 'green' },
    { label: 'Average', value: stats.average || 'N/A', icon: TrendingUp, color: 'purple' },
    { label: 'Boundaries', value: stats.boundaries, icon: Award, color: 'orange' }
  ]

  const bowlingMetrics = [
    { label: 'Runs Conceded', value: stats.runs_conceded, icon: Target, color: 'red' },
    { label: 'Economy Rate', value: stats.economy, icon: Zap, color: 'orange' },
    { label: 'Wickets', value: stats.wickets, icon: TrendingUp, color: 'green' },
    { label: 'Average', value: stats.average || 'N/A', icon: Award, color: 'blue' }
  ]

  const metrics = playerType === 'batter' ? battingMetrics : bowlingMetrics

  const colorClasses = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
    red: { text: 'text-red-600', bg: 'bg-red-50' }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance Overview
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const colors = colorClasses[metric.color]
            return (
              <div key={index} className={`p-4 rounded-lg ${colors.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-6 w-6 ${colors.text}`} />
                  <span className={`text-xl font-bold ${colors.text}`}>
                    {metric.value}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {playerType === 'batter' ? (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.balls_faced}
                </div>
                <div className="text-sm text-gray-600">Balls Faced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.fours}
                </div>
                <div className="text-sm text-gray-600">Fours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.sixes}
                </div>
                <div className="text-sm text-gray-600">Sixes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.dismissals}
                </div>
                <div className="text-sm text-gray-600">Dismissals</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.balls_bowled}
                </div>
                <div className="text-sm text-gray-600">Balls Bowled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.dot_balls}
                </div>
                <div className="text-sm text-gray-600">Dot Balls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.maidens}
                </div>
                <div className="text-sm text-gray-600">Maidens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.boundaries_conceded}
                </div>
                <div className="text-sm text-gray-600">Boundaries</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Total Deliveries</span>
            <span className="font-medium">{totalDeliveries}</span>
          </div>
          {playerType === 'batter' ? (
            <>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Dot Ball %</span>
                <span className="font-medium">{stats.dot_ball_percent}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Boundary %</span>
                <span className="font-medium">{stats.boundary_percent}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Not Outs</span>
                <span className="font-medium">{stats.not_outs}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Strike Rate</span>
                <span className="font-medium">{stats.strike_rate || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Extras Conceded</span>
                <span className="font-medium">{stats.extras}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayerOverview
