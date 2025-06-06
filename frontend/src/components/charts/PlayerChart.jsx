import React, { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { TrendingUp, BarChart3, Activity } from 'lucide-react'

const PlayerChart = ({ playerName, playerType, stats }) => {
  const [chartType, setChartType] = useState('trend')

  // Mock trend data - in real app, this would come from API
  const trendData = [
    { period: 'Last 5', value: stats.runs || 0, matches: 5 },
    { period: 'Last 10', value: (stats.runs || 0) * 0.8, matches: 10 },
    { period: 'Last 15', value: (stats.runs || 0) * 0.9, matches: 15 },
    { period: 'Career', value: stats.runs || 0, matches: stats.matches || 0 }
  ]

  const performanceData = playerType === 'batter' ? [
    { metric: 'Runs', value: stats.runs || 0, max: 1000 },
    { metric: 'Balls', value: stats.balls || 0, max: 800 },
    { metric: 'Boundaries', value: stats.boundaries || 0, max: 100 },
    { metric: 'Matches', value: stats.matches || 0, max: 50 }
  ] : [
    { metric: 'Wickets', value: stats.wickets || 0, max: 50 },
    { metric: 'Balls', value: stats.balls || 0, max: 1000 },
    { metric: 'Runs Conceded', value: stats.runs_conceded || 0, max: 800 },
    { metric: 'Matches', value: stats.matches || 0, max: 50 }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}
              {entry.payload.matches && ` (${entry.payload.matches} matches)`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const chartTypes = [
    { id: 'trend', name: 'Trend', icon: TrendingUp },
    { id: 'performance', name: 'Performance', icon: BarChart3 },
    { id: 'area', name: 'Area', icon: Activity }
  ]

  const renderChart = () => {
    switch (chartType) {
      case 'trend':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {playerName} - Performance Chart
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setChartType(type.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                chartType === type.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-96">
        {renderChart()}
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {chartType === 'trend' && 'Performance trend across different time periods'}
        {chartType === 'performance' && 'Key performance metrics breakdown'}
        {chartType === 'area' && 'Performance trend with area visualization'}
      </div>
    </div>
  )
}

export default PlayerChart
