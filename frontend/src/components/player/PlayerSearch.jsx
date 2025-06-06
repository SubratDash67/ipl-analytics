import React, { useState, useRef, useEffect } from 'react'
import { Search, X, User, Users } from 'lucide-react'
import { usePlayerSearch } from '../../hooks/useApi'
import LoadingSpinner from '../common/LoadingSpinner'

const PlayerSearch = ({ 
  type, 
  onSelect, 
  placeholder, 
  className = '',
  disabled = false,
  showRecentSearches = true 
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const { results, loading } = usePlayerSearch(query, type)

  const players = type === 'batter' ? results.batters : 
                 type === 'bowler' ? results.bowlers : 
                 [...results.batters, ...results.bowlers]

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem(`recent-${type}-searches`)
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [type])

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
    setIsOpen(value.length >= 2 || (value.length === 0 && showRecentSearches && recentSearches.length > 0))
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    setQuery(player)
    setIsOpen(false)
    onSelect(player)

    // Save to recent searches
    if (showRecentSearches) {
      const newRecentSearches = [player, ...recentSearches.filter(p => p !== player)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem(`recent-${type}-searches`, JSON.stringify(newRecentSearches))
    }
  }

  const handleClear = () => {
    setQuery('')
    setSelectedPlayer('')
    setIsOpen(false)
    onSelect('')
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true)
    } else if (showRecentSearches && recentSearches.length > 0) {
      setIsOpen(true)
    }
  }

  const getDisplayPlayers = () => {
    if (query.length >= 2) {
      return players
    } else if (showRecentSearches && recentSearches.length > 0) {
      return recentSearches
    }
    return []
  }

  const displayPlayers = getDisplayPlayers()

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field pl-10 pr-10 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {selectedPlayer && !disabled && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-gray-600 mt-2">Searching players...</p>
            </div>
          ) : displayPlayers.length > 0 ? (
            <div>
              {query.length < 2 && showRecentSearches && recentSearches.length > 0 && (
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recent Searches
                  </p>
                </div>
              )}
              <ul className="py-1">
                {displayPlayers.map((player, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handlePlayerSelect(player)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors flex items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {type === 'both' ? (
                            <Users className="h-4 w-4 text-gray-400" />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{player}</p>
                          <p className="text-xs text-gray-500 capitalize">{type}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No players found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default PlayerSearch
