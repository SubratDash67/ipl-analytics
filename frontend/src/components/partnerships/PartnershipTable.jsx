import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

const PartnershipTable = ({ partnerships, selectedPlayer, sortBy, sortOrder, onSort }) => {
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <div className="w-4 h-4" />
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  const getSortableHeader = (field, label) => (
    <th 
      className="text-right py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center justify-end space-x-1">
        <span>{label}</span>
        <SortIcon field={field} />
      </div>
    </th>
  )

  const getPartnerName = (partnership) => {
    if (partnership.batsman1 === selectedPlayer) {
      return partnership.batsman2
    } else if (partnership.batsman2 === selectedPlayer) {
      return partnership.batsman1
    } else {
      const player1Lower = partnership.batsman1?.toLowerCase() || ''
      const player2Lower = partnership.batsman2?.toLowerCase() || ''
      const selectedLower = selectedPlayer?.toLowerCase() || ''
      
      if (player1Lower.includes(selectedLower) || selectedLower.includes(player1Lower)) {
        return partnership.batsman2
      } else {
        return partnership.batsman1
      }
    }
  }

  return (
    <div className="card w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Partnership Statistics for {selectedPlayer}
      </h3>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Partner</th>
              {getSortableHeader('runs_scored', 'Runs')}
              {getSortableHeader('balls_faced', 'Balls')}
              {getSortableHeader('partnership_sr', 'Strike Rate')}
              {getSortableHeader('boundaries', 'Boundaries')}
              {getSortableHeader('dot_balls', 'Dot Balls')}
              <th className="text-right py-3 px-4 font-medium text-gray-900">Dot %</th>
            </tr>
          </thead>
          <tbody>
            {partnerships.map((partnership, index) => {
              const partnerName = getPartnerName(partnership)
              const dotPercentage = partnership.balls_faced > 0 ? 
                ((partnership.dot_balls / partnership.balls_faced) * 100).toFixed(1) : 0
              
              return (
                <tr 
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {partnerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      with {selectedPlayer}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600">
                    {partnership.runs_scored}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {partnership.balls_faced}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">
                    {partnership.partnership_sr}%
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-purple-600">
                    {partnership.boundaries}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {partnership.dot_balls}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-600">
                    {dotPercentage}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PartnershipTable
