import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PartnershipChart = ({ partnerships, selectedPlayer }) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {selectedPlayer} + {label}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Runs:</span>
              <span className="ml-1 font-medium text-blue-600">{data.runs_scored}</span>
            </div>
            <div>
              <span className="text-gray-600">Balls:</span>
              <span className="ml-1 font-medium">{data.balls_faced}</span>
            </div>
            <div>
              <span className="text-gray-600">SR:</span>
              <span className="ml-1 font-medium text-green-600">{data.partnership_sr || data.strike_rate}%</span>
            </div>
            <div>
              <span className="text-gray-600">Boundaries:</span>
              <span className="ml-1 font-medium text-purple-600">{data.boundaries}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Fix the partner logic to correctly identify the other batsman
  const chartData = partnerships.map((partnership, index) => {
    let partner = ''
    
    // Determine who is the partner (not the selected player)
    if (partnership.batsman1 === selectedPlayer) {
      partner = partnership.batsman2
    } else if (partnership.batsman2 === selectedPlayer) {
      partner = partnership.batsman1
    } else {
      // Fallback: if neither matches exactly, use the one that's not the selected player
      // This handles cases where names might have slight variations
      const player1Lower = partnership.batsman1?.toLowerCase() || ''
      const player2Lower = partnership.batsman2?.toLowerCase() || ''
      const selectedLower = selectedPlayer?.toLowerCase() || ''
      
      if (player1Lower.includes(selectedLower) || selectedLower.includes(player1Lower)) {
        partner = partnership.batsman2
      } else {
        partner = partnership.batsman1
      }
    }

    return {
      ...partnership,
      partner: partner || 'Unknown Partner',
      color: colors[index % colors.length]
    }
  })

  // Filter out any partnerships where partner is the same as selected player
  const validChartData = chartData.filter(item => 
    item.partner !== selectedPlayer && 
    item.partner !== 'Unknown Partner' &&
    item.partner.trim() !== ''
  )

  if (validChartData.length === 0) {
    return (
      <div className="card w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Partnership Combinations</h3>
        <div className="h-80 w-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No valid partnership data available</p>
            <p className="text-sm mt-2">Partnerships require two different batsmen</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Partnership Combinations for {selectedPlayer}
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={validChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="partner" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Partnership Runs', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="runs_scored" name="Partnership Runs">
              {validChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Showing top {validChartData.length} partnership combinations
      </div>
    </div>
  )
}

export default PartnershipChart
