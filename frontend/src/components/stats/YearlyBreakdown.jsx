import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const YearlyBreakdown = ({ data, batter, bowler }) => {
  const [expanded, setExpanded] = useState(false)
  const [sortBy, setSortBy] = useState('season')
  const [sortOrder, setSortOrder] = useState('desc')

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Yearly Breakdown
        </h3>
        <p className="text-gray-500">No yearly data available</p>
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const displayData = expanded ? sortedData : sortedData.slice(0, 5)

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Yearly Breakdown
        </h3>
        <div className="text-sm text-gray-600">
          {batter} vs {bowler}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-3 px-2 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('season')}
              >
                <div className="flex items-center space-x-1">
                  <span>Season</span>
                  <SortIcon column="season" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('runs')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Runs</span>
                  <SortIcon column="runs" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-2 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('balls')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Balls</span>
                  <SortIcon column="balls" />
                </div>
              </th>
              <th className="text-right py-3 px-2 font-medium text-gray-900">Dismissals</th>
              <th className="text-right py-3 px-2 font-medium text-gray-900">4s</th>
              <th className="text-right py-3 px-2 font-medium text-gray-900">6s</th>
              <th 
                className="text-right py-3 px-2 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('strike_rate')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>SR</span>
                  <SortIcon column="strike_rate" />
                </div>
              </th>
              <th className="text-right py-3 px-2 font-medium text-gray-900">Avg</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((season, index) => (
              <tr 
                key={season.season} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="py-3 px-2 font-medium text-gray-900">
                  {season.season}
                </td>
                <td className="py-3 px-2 text-right font-medium text-blue-600">
                  {season.runs}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {season.balls}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {season.dismissals}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {season.fours}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {season.sixes}
                </td>
                <td className="py-3 px-2 text-right font-medium text-green-600">
                  {season.strike_rate}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {season.average || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-2 mx-auto text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>{expanded ? 'Show Less' : `Show All ${data.length} Seasons`}</span>
            {expanded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
        </div>
      )}
    </div>
  )
}

export default YearlyBreakdown
