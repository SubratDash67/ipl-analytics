import React, { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { usePlayerSearch } from '../../hooks/useApi'
import LoadingSpinner from '../common/LoadingSpinner'

const PlayerSearch = ({ type, onSelect, placeholder, className = '' }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const { results, loading } = usePlayerSearch(query, type)

  const players = type === 'batter' ? results.batters : 
                 type === 'bowler' ? results.bowlers : 
                 [...results.batters, ...results.bowlers]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length >= 2)
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    setQuery(player)
    setIsOpen(false)
    onSelect(player)
  }

  const handleClear = () => {
    setQuery('')
    setSelectedPlayer('')
    setIsOpen(false)
    onSelect('')
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="input-field pl-10 pr-10"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {selectedPlayer && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : players.length > 0 ? (
            <ul className="py-1">
              {players.map((player, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePlayerSelect(player)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                  >
                    {player}
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-gray-500 text-center">
              No players found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default PlayerSearch
