import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const FormChart = ({ recentMatches, playerType, formTrend }) => {
  const chartData = recentMatches.map((match, index) => {
    const performance = playerType === 'batter' ? match.runs : match.runs_conceded
    const efficiency = playerType === 'batter' ? 
      (match.balls_faced > 0 ? ((match.runs / match.balls_faced) * 100) : 0) :
      (match.balls_bowled > 0 ? (match.runs_conceded / (match.balls_bowled / 6)) : 0)
    
    return {
      match: `M${recentMatches.length - index}`,
      performance: performance || 0,
      efficiency: Number(efficiency).toFixed(2),
      date: match.date,
      season: match.season,
      balls: playerType === 'batter' ? match.balls_faced : match.balls_bowled
    }
  }).reverse()

  const avgPerformance = chartData.length > 0 ? 
    chartData.reduce((sum, match) => sum + match.performance, 0) / chartData.length : 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-blue-600">
            {playerType === 'batter' ? 'Runs' : 'Runs Conceded'}: {data.performance}
          </p>
          <p className="text-sm text-gray-600">
            {playerType === 'batter' ? 'Balls Faced' : 'Balls Bowled'}: {data.balls}
          </p>
          <p className="text-sm text-green-600">
            {playerType === 'batter' ? 'Strike Rate' : 'Economy Rate'}: {data.efficiency}
            {playerType === 'batter' ? '%' : ''}
          </p>
          <p className="text-sm text-gray-500">
            Season: {data.season}
          </p>
        </div>
      )
    }
    return null
  }

  const getTrendColor = () => {
    switch (formTrend) {
      case 'improving': return '#10b981'
      case 'declining': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="match" 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={avgPerformance} 
              stroke="#94a3b8" 
              strokeDasharray="5 5"
              label={{ value: "Average", position: "insideTopRight" }}
            />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke={getTrendColor()}
              strokeWidth={3}
              dot={{ fill: getTrendColor(), strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: getTrendColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Recent matches (left to right)</span>
        <span>Average: {avgPerformance.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default FormChart
