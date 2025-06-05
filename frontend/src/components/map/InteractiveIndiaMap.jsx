import React, { useState, useEffect } from 'react'
import { MapPin, Info, TrendingUp } from 'lucide-react'
import { indiaMapData, iplVenues } from '../../data/indiaMapData'

const InteractiveIndiaMap = ({ onVenueSelect, selectedVenue, venueStats = {} }) => {
  const [hoveredState, setHoveredState] = useState(null)
  const [hoveredVenue, setHoveredVenue] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' })

  const handleMouseMove = (e, content) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      visible: true,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 10,
      content
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' })
    setHoveredState(null)
    setHoveredVenue(null)
  }

  const getVenueColor = (venue) => {
    const stats = venueStats[venue.name]
    if (!stats) return '#3b82f6'
    
    const performance = stats.batting?.strike_rate || 0
    if (performance > 130) return '#10b981'
    if (performance > 110) return '#f59e0b' 
    return '#ef4444'
  }

  const getVenueSize = (venue) => {
    const stats = venueStats[venue.name]
    const encounters = stats?.total_deliveries || 0
    
    if (encounters > 100) return 8
    if (encounters > 50) return 6
    if (encounters > 20) return 5
    return 4
  }

  const hasVenueInState = (stateId) => {
    return iplVenues.some(venue => venue.state.toLowerCase().replace(/\s+/g, '-') === stateId)
  }

  return (
    <div className="card relative">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
        Interactive IPL Venue Map of India
      </h3>
      
      <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border border-gray-200 overflow-hidden">
        <svg
          viewBox={indiaMapData.viewBox}
          className="w-full h-96 cursor-pointer"
          style={{ maxHeight: '600px' }}
        >
          {/* Background */}
          <rect width="1000" height="1200" fill="url(#oceanGradient)" />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#bfdbfe" />
            </linearGradient>
            <linearGradient id="stateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="venueStateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* State paths */}
          {indiaMapData.states.map((state) => (
            <path
              key={state.id}
              d={state.path}
              fill={hasVenueInState(state.id) ? "url(#venueStateGradient)" : "url(#stateGradient)"}
              stroke={hoveredState === state.id ? "#3b82f6" : "#94a3b8"}
              strokeWidth={hoveredState === state.id ? "3" : "1"}
              className="transition-all duration-300 hover:brightness-110"
              style={{
                filter: hoveredState === state.id ? "url(#dropShadow)" : "none"
              }}
              onMouseMove={(e) => {
                setHoveredState(state.id)
                handleMouseMove(e, `${state.name} (${state.capital})`)
              }}
              onMouseLeave={handleMouseLeave}
            />
          ))}
          
          {/* IPL Venue markers */}
          {iplVenues.map((venue) => {
            const size = getVenueSize(venue)
            const color = getVenueColor(venue)
            
            return (
              <g key={venue.id}>
                {/* Venue marker with pulsing animation */}
                <circle
                  cx={venue.coordinates.x}
                  cy={venue.coordinates.y}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:scale-125"
                  style={{
                    filter: "url(#dropShadow)",
                    animation: selectedVenue === venue.name ? "pulse 2s infinite" : "none"
                  }}
                  onClick={() => onVenueSelect(venue.name)}
                  onMouseMove={(e) => {
                    setHoveredVenue(venue)
                    const stats = venueStats[venue.name]
                    const content = `${venue.name}\n${venue.city}, ${venue.state}\nCapacity: ${venue.capacity.toLocaleString()}\nTeam: ${venue.team}${stats ? `\nDeliveries: ${stats.total_deliveries}\nStrike Rate: ${stats.batting?.strike_rate || 'N/A'}` : ''}`
                    handleMouseMove(e, content)
                  }}
                  onMouseLeave={handleMouseLeave}
                />
                
                {/* Venue label for major stadiums */}
                {venue.capacity > 50000 && (
                  <text
                    x={venue.coordinates.x}
                    y={venue.coordinates.y - size - 8}
                    textAnchor="middle"
                    className="fill-gray-800 text-xs font-semibold pointer-events-none"
                    style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.8)" }}
                  >
                    {venue.city}
                  </text>
                )}
                
                {/* Selection ring */}
                {selectedVenue === venue.name && (
                  <circle
                    cx={venue.coordinates.x}
                    cy={venue.coordinates.y}
                    r={size + 4}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="animate-ping"
                  />
                )}
              </g>
            )
          })}
          
          {/* Map labels */}
          <text x="150" y="100" className="fill-blue-600 text-sm font-medium">Arabian Sea</text>
          <text x="750" y="100" className="fill-blue-600 text-sm font-medium">Bay of Bengal</text>
          <text x="500" y="1150" className="fill-blue-600 text-sm font-medium">Indian Ocean</text>
        </svg>
        
        {/* Interactive tooltip */}
        {tooltip.visible && (
          <div
            className="absolute bg-gray-900 text-white p-3 rounded-lg shadow-lg pointer-events-none z-20 max-w-xs"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-sm font-medium whitespace-pre-line">
              {tooltip.content}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
      
      {/* Enhanced legend */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">High Performance (130+ SR)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-600">Medium (110-130 SR)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Low Performance (&lt;110 SR)</span>
            </div>
          </div>
          <div className="text-gray-500 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Hover for details
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Interactive SVG Map • Click venues for analysis</span>
          <span>{iplVenues.length} IPL venues across India</span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-gradient-to-b from-yellow-100 to-yellow-400 rounded"></div>
            <span className="text-gray-600">States with IPL venues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-gradient-to-b from-gray-100 to-gray-300 rounded"></div>
            <span className="text-gray-600">Other states</span>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default InteractiveIndiaMap
