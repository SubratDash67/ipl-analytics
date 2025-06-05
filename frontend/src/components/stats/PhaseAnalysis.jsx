import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, Zap, Target } from 'lucide-react'

const PhaseAnalysis = ({ phaseStats }) => {
  const phases = [
    { 
      key: 'powerplay', 
      label: 'Powerplay (1-6)', 
      icon: Zap,
      color: '#3b82f6'
    },
    { 
      key: 'middle', 
      label: 'Middle (7-15)', 
      icon: Target,
      color: '#10b981'
    },
    { 
      key: 'death', 
      label: 'Death (16-20)', 
      icon: Clock,
      color: '#f59e0b'
    }
  ]

  const chartData = phases.map(phase => ({
    phase: phase.label,
    runs: phaseStats[phase.key]?.batting?.runs || 0,
    strike_rate: phaseStats[phase.key]?.batting?.strike_rate || 0,
    economy: phaseStats[phase.key]?.bowling?.economy || 0
  }))

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Phase Analysis</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {phases.map(phase => {
          const battingStats = phaseStats[phase.key]?.batting || {}
          const bowlingStats = phaseStats[phase.key]?.bowling || {}
          
          return (
            <div key={phase.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <phase.icon className="h-5 w-5 mr-2" style={{ color: phase.color }} />
                <span className="font-medium text-sm">{phase.label}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Runs:</span>
                  <span className="font-medium">{battingStats.runs || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Strike Rate:</span>
                  <span className="font-medium">{battingStats.strike_rate || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Economy:</span>
                  <span className="font-medium">{bowlingStats.economy || 0}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="phase" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="runs" fill="#3b82f6" name="Runs" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PhaseAnalysis
