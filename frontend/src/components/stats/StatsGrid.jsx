import React from 'react'
import StatCard from './StatCard'

const StatsGrid = ({ stats, type = 'batting', className = '' }) => {
  const battingStats = [
    {
      key: 'runs',
      title: 'Runs Scored',
      icon: 'Target',
      color: 'blue',
      subtitle: 'Total runs'
    },
    {
      key: 'balls',
      title: 'Balls Faced',
      icon: 'Zap',
      color: 'green',
      subtitle: 'Total balls'
    },
    {
      key: 'strike_rate',
      title: 'Strike Rate',
      icon: 'TrendingUp',
      color: 'purple',
      subtitle: 'Runs per 100 balls',
      format: (value) => `${value}%`
    },
    {
      key: 'boundaries',
      title: 'Boundaries',
      icon: 'Award',
      color: 'orange',
      subtitle: '4s and 6s'
    }
  ]

  const bowlingStats = [
    {
      key: 'wickets',
      title: 'Wickets',
      icon: 'Target',
      color: 'red',
      subtitle: 'Total wickets'
    },
    {
      key: 'balls',
      title: 'Balls Bowled',
      icon: 'Zap',
      color: 'blue',
      subtitle: 'Total balls'
    },
    {
      key: 'economy',
      title: 'Economy Rate',
      icon: 'TrendingDown',
      color: 'green',
      subtitle: 'Runs per over'
    },
    {
      key: 'runs_conceded',
      title: 'Runs Conceded',
      icon: 'BarChart3',
      color: 'orange',
      subtitle: 'Total runs given'
    }
  ]

  const currentStats = type === 'batting' ? battingStats : bowlingStats

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {currentStats.map((stat) => {
        const value = stats[stat.key] || 0
        const formattedValue = stat.format ? stat.format(value) : value

        return (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={formattedValue}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        )
      })}
    </div>
  )
}

export default StatsGrid
