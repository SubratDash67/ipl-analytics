import React, { useState, useEffect } from 'react'
import { MapPin, TrendingUp, Target, Zap } from 'lucide-react'

const VenueMap = ({ onVenueSelect, selectedVenue, venueStats = {} }) => {
  const [hoveredVenue, setHoveredVenue] = useState(null)

  // IPL Venue coordinates and details based on official stadium locations [4]
  const venues = [
    {
      id: 'wankhede',
      name: 'Wankhede Stadium',
      city: 'Mumbai',
      coordinates: { x: 280, y: 520 },
      capacity: 33108,
      established: 1975
    },
    {
      id: 'eden',
      name: 'Eden Gardens',
      city: 'Kolkata', 
      coordinates: { x: 650, y: 450 },
      capacity: 66000,
      established: 1864
    },
    {
      id: 'chinnaswamy',
      name: 'M Chinnaswamy Stadium',
      city: 'Bengaluru',
      coordinates: { x: 400, y: 600 },
      capacity: 40000,
      established: 1969
    },
    {
      id: 'chepauk',
      name: 'MA Chidambaram Stadium',
      city: 'Chennai',
      coordinates: { x: 420, y: 680 },
      capacity: 50000,
      established: 1916
    },
    {
      id: 'feroz_shah_kotla',
      name: 'Arun Jaitley Stadium',
      city: 'Delhi',
      coordinates: { x: 400, y: 200 },
      capacity: 41820,
      established: 1883
    },
    {
      id: 'sawai_mansingh',
      name: 'Sawai Mansingh Stadium',
      city: 'Jaipur',
      coordinates: { x: 350, y: 280 },
      capacity: 30000,
      established: 1969
    },
    {
      id: 'rajiv_gandhi',
      name: 'Rajiv Gandhi International Stadium',
      city: 'Hyderabad',
      coordinates: { x: 450, y: 550 },
      capacity: 55000,
      established: 2003
    },
    {
      id: 'mohali',
      name: 'PCA Stadium',
      city: 'Mohali',
      coordinates: { x: 350, y: 150 },
      capacity: 26950,
      established: 1993
    },
    {
      id: 'narendra_modi',
      name: 'Narendra Modi Stadium',
      city: 'Ahmedabad',
      coordinates: { x: 280, y: 350 },
      capacity: 132000,
      established: 1982
    },
    {
      id: 'brabourne',
      name: 'Brabourne Stadium',
      city: 'Mumbai',
      coordinates: { x: 275, y: 515 },
      capacity: 20000,
      established: 1937
    }
  ]

  const getVenueColor = (venue) => {
    const stats = venueStats[venue.name]
    if (!stats) return '#94a3b8'
    
    const performance = stats.batting?.strike_rate || 0
    if (performance > 130) return '#10b981' // Green for high performance
    if (performance > 110) return '#f59e0b' // Orange for medium performance
    return '#ef4444' // Red for low performance
  }

  const getVenueSize = (venue) => {
    const stats = venueStats[venue.name]
    const encounters = stats?.total_deliveries || 0
    
    if (encounters > 100) return 12
    if (encounters > 50) return 10
    if (encounters > 20) return 8
    return 6
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        IPL Venue Performance Map
      </h3>
      
      <div className="relative">
        {/* India Map SVG - Interactive map representation [3][7] */}
        <svg
          viewBox="0 0 800 900"
          className="w-full h-96 border border-gray-200 rounded-lg bg-blue-50"
        >
          {/* Simplified India outline based on geographic boundaries [3] */}
          <path
            d="M200,200 L600,200 L650,300 L680,400 L650,500 L600,600 L500,700 L400,750 L300,700 L250,600 L200,500 L180,400 L200,300 Z"
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth="2"
          />
          
          {/* Venue markers with interactive functionality [1][2] */}
          {venues.map((venue) => (
            <g key={venue.id}>
              <circle
                cx={venue.coordinates.x}
                cy={venue.coordinates.y}
                r={getVenueSize(venue)}
                fill={getVenueColor(venue)}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onVenueSelect(venue.name)}
                onMouseEnter={() => setHoveredVenue(venue)}
                onMouseLeave={() => setHoveredVenue(null)}
              />
              
              {selectedVenue === venue.name && (
                <circle
                  cx={venue.coordinates.x}
                  cy={venue.coordinates.y}
                  r={getVenueSize(venue) + 4}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
        </svg>
        
        {/* Hover tooltip with venue information [1] */}
        {hoveredVenue && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-10">
            <div className="font-medium text-gray-900">{hoveredVenue.name}</div>
            <div className="text-sm text-gray-600">{hoveredVenue.city}</div>
            <div className="text-xs text-gray-500">
              Capacity: {hoveredVenue.capacity.toLocaleString()}
            </div>
            {venueStats[hoveredVenue.name] && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  Deliveries: {venueStats[hoveredVenue.name].total_deliveries}
                </div>
                <div className="text-xs text-gray-600">
                  SR: {venueStats[hoveredVenue.name].batting?.strike_rate || 'N/A'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Performance legend for geographic visualization [5] */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
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
        <div className="text-gray-500">
          Size indicates number of encounters
        </div>
      </div>
    </div>
  )
}

export default VenueMap
