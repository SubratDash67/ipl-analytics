import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const FormChart = ({ recentMatches, playerType, formTrend }) => {
  if (!recentMatches || recentMatches.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No recent match data available for chart</p>
      </div>
    )
  }

  const chartData = recentMatches.map((match, index) => ({
    match: `Match ${recentMatches.length - index}`,
    runs: match.runs || match.runs_conceded || 0,
    strike_rate: match.strike_rate || match.economy_rate || 0,
    balls: match.balls_faced || match.balls_bowled || 0,
    wickets: match.wickets || 0,
    dismissed: match.dismissed ? 1 : 0
  })).reverse()

  const getTrendIcon = () => {
    switch (formTrend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (formTrend) {
      case 'improving':
        return 'text-green-600'
      case 'declining':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            {playerType === 'batter' ? (
              <>
                <p className="text-blue-600">Runs: {data.runs}</p>
                <p className="text-green-600">Strike Rate: {data.strike_rate}%</p>
                <p className="text-purple-600">Balls: {data.balls}</p>
                {data.dismissed === 1 && (
                  <p className="text-red-600">Dismissed: Yes</p>
                )}
              </>
            ) : (
              <>
                <p className="text-red-600">Runs Conceded: {data.runs}</p>
                <p className="text-green-600">Economy: {data.strike_rate}</p>
                <p className="text-blue-600">Balls: {data.balls}</p>
                <p className="text-purple-600">Wickets: {data.wickets}</p>
              </>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Form Trend</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium capitalize">{formTrend}</span>
        </div>
      </div>

      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="match" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="runs"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="strike_rate"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {Math.max(...chartData.map(m => m.runs))}
          </div>
          <div className="text-sm text-gray-600">
            Best {playerType === 'batter' ? 'Score' : 'Figures'}
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {Math.max(...chartData.map(m => m.strike_rate)).toFixed(1)}
            {playerType === 'batter' ? '%' : ''}
          </div>
          <div className="text-sm text-gray-600">
            Best {playerType === 'batter' ? 'SR' : 'Economy'}
          </div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {(chartData.reduce((sum, m) => sum + m.runs, 0) / chartData.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Average</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">
            {chartData.length}
          </div>
          <div className="text-sm text-gray-600">Matches</div>
        </div>
      </div>
    </div>
  )
}

export default FormChart
