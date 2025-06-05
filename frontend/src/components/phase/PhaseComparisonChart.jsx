import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const PhaseComparisonChart = ({ phases, phaseData }) => {
  const chartData = phases.map(phase => {
    const data = phaseData[phase.key]
    const stats = data?.stats || {}
    
    return {
      phase: phase.name,
      'Strike Rate': stats.strike_rate || 0,
      'Run Rate': (stats.run_rate || 0) * 10,
      'Boundary %': stats.boundary_percentage || 0,
      'Dot Ball %': 100 - (stats.dot_ball_percentage || 0),
    }
  }).filter(item => item['Strike Rate'] > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => {
            let value = entry.value
            let suffix = ''
            
            if (entry.dataKey === 'Run Rate') {
              value = (value / 10).toFixed(1)
              suffix = ' RPO'
            } else if (entry.dataKey === 'Dot Ball %') {
              value = (100 - value).toFixed(1)
              suffix = '%'
            } else {
              suffix = entry.dataKey.includes('%') ? '%' : ''
            }
            
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.dataKey}: {value}{suffix}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No data available for radar chart</p>
      </div>
    )
  }

  return (
    <div className="card w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase Performance Radar</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis tick={{ fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} tickCount={6} />
            <Radar
              name="Performance"
              dataKey="Strike Rate"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Run Rate (x10)"
              dataKey="Run Rate"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Boundary %"
              dataKey="Boundary %"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Strike Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Run Rate</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
          <span>Boundary %</span>
        </div>
      </div>
    </div>
  )
}

export default PhaseComparisonChart
