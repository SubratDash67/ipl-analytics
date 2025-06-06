import React, { useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

const PerformanceChart = ({ battingStats, bowlingStats, batter, bowler }) => {
  const [chartType, setChartType] = useState('comparison')

  const comparisonData = [
    {
      name: 'Runs',
      batting: battingStats.runs || 0,
      bowling: bowlingStats.runs_conceded || 0,
      category: 'Performance'
    },
    {
      name: 'Balls',
      batting: battingStats.balls_faced || 0,
      bowling: bowlingStats.balls_bowled || 0,
      category: 'Volume'
    },
    {
      name: 'Boundaries',
      batting: battingStats.boundaries || 0,
      bowling: 0,
      category: 'Aggression'
    },
    {
      name: 'Dot Balls',
      batting: 0,
      bowling: bowlingStats.dot_balls || 0,
      category: 'Control'
    }
  ]

  const efficiencyData = [
    {
      name: 'Strike Rate',
      value: battingStats.strike_rate || 0,
      color: '#3b82f6'
    },
    {
      name: 'Economy Rate',
      value: bowlingStats.economy || 0,
      color: '#ef4444'
    }
  ]

  const performanceBreakdown = [
    { name: 'Runs Scored', value: battingStats.runs || 0, fill: '#10b981' },
    { name: 'Dot Balls', value: bowlingStats.dot_balls || 0, fill: '#f59e0b' },
    { name: 'Boundaries', value: battingStats.boundaries || 0, fill: '#8b5cf6' },
    { name: 'Dismissals', value: battingStats.dismissals || 0, fill: '#ef4444' }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'batting' ? `${batter}:` : 
               entry.dataKey === 'bowling' ? `${bowler}:` : 
               `${entry.dataKey}:`} {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const chartTypes = [
    { id: 'comparison', name: 'Comparison', icon: BarChart3 },
    { id: 'efficiency', name: 'Efficiency', icon: TrendingUp },
    { id: 'breakdown', name: 'Breakdown', icon: PieChartIcon }
  ]

  const renderChart = () => {
    switch (chartType) {
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="batting" fill="#3b82f6" name={batter} radius={[4, 4, 0, 0]} />
              <Bar dataKey="bowling" fill="#ef4444" name={bowler} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'efficiency':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={efficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900 mb-2">{label}</p>
                        <p style={{ color: payload[0].color }} className="text-sm">
                          Value: {payload[0].value}
                          {label === 'Strike Rate' ? '%' : ''}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'breakdown':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={performanceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Performance Visualization</h3>
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
        {chartType === 'comparison' && 'Side-by-side comparison of key performance metrics'}
        {chartType === 'efficiency' && 'Efficiency metrics showing strike rate and economy rate'}
        {chartType === 'breakdown' && 'Performance breakdown across different categories'}
      </div>
    </div>
  )
}

export default PerformanceChart
