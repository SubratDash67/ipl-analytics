import React, { useState } from 'react'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { Activity, BarChart3 } from 'lucide-react'

const ComparisonChart = ({ players, playerType, stats }) => {
  const [chartType, setChartType] = useState('radar')

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  // Prepare radar chart data
  const radarData = stats.map(stat => {
    const dataPoint = { stat: stat.label }
    players.forEach((player, index) => {
      const value = player.stats[stat.key] || 0
      dataPoint[player.name] = value
    })
    return dataPoint
  })

  // Prepare bar chart data
  const barData = players.map((player, index) => ({
    name: player.name,
    ...stats.reduce((acc, stat) => {
      acc[stat.label] = player.stats[stat.key] || 0
      return acc
    }, {}),
    color: colors[index % colors.length]
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={radarData}>
        <PolarGrid />
        <PolarAngleAxis tick={{ fontSize: 12 }} />
        <PolarRadiusAxis tick={{ fontSize: 10 }} tickCount={6} />
        {players.map((player, index) => (
          <Radar
            key={player.name}
            name={player.name}
            dataKey={player.name}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        ))}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {stats.map((stat, index) => (
          <Bar
            key={stat.key}
            dataKey={stat.label}
            fill={colors[index % colors.length]}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Player Comparison Chart
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'radar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Radar</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      <div className="h-96">
        {chartType === 'radar' ? renderRadarChart() : renderBarChart()}
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap justify-center gap-4">
          {players.map((player, index) => (
            <div key={player.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {chartType === 'radar' 
          ? 'Radar chart showing multi-dimensional performance comparison'
          : 'Bar chart showing side-by-side statistical comparison'
        }
      </div>
    </div>
  )
}

export default ComparisonChart
