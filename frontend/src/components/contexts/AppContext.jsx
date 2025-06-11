import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDarkMode } from '../../hooks/useDarkMode'

// Initial state
const initialState = {
  selectedFilters: {
    season: null,
    venue: null,
    matchType: null,
  },
  recentSearches: [],
  favorites: [],
  user: null,
  isLoading: false,
  error: null,
}

// Action types
const ActionTypes = {
  SET_FILTERS: 'SET_FILTERS',
  ADD_RECENT_SEARCH: 'ADD_RECENT_SEARCH',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',
}

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        selectedFilters: { ...state.selectedFilters, ...action.payload }
      }
    
    case ActionTypes.ADD_RECENT_SEARCH:
      const newSearch = action.payload
      const filteredSearches = state.recentSearches.filter(
        search => !(search.batter === newSearch.batter && search.bowler === newSearch.bowler)
      )
      return {
        ...state,
        recentSearches: [newSearch, ...filteredSearches].slice(0, 10)
      }
    
    case ActionTypes.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      }
    
    case ActionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload)
      }
    
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ActionTypes.RESET_FILTERS:
      return { ...state, selectedFilters: initialState.selectedFilters }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [theme, setTheme] = useDarkMode() // Use the proper dark mode hook

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('ipl-recent-searches')
    if (savedSearches) {
      try {
        const searches = JSON.parse(savedSearches)
        searches.forEach(search => {
          dispatch({ type: ActionTypes.ADD_RECENT_SEARCH, payload: search })
        })
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Action creators
  const setFilters = useCallback((filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters })
  }, [])

  const addRecentSearch = useCallback((search) => {
    dispatch({ type: ActionTypes.ADD_RECENT_SEARCH, payload: search })
    const searches = JSON.parse(localStorage.getItem('ipl-recent-searches') || '[]')
    const newSearches = [search, ...searches.filter(
      s => !(s.batter === search.batter && s.bowler === search.bowler)
    )].slice(0, 10)
    localStorage.setItem('ipl-recent-searches', JSON.stringify(newSearches))
  }, [])

  const addFavorite = useCallback((favorite) => {
    dispatch({ type: ActionTypes.ADD_FAVORITE, payload: favorite })
    toast.success('Added to favorites')
  }, [])

  const removeFavorite = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_FAVORITE, payload: id })
    toast.success('Removed from favorites')
  }, [])

  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
  }, [])

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error })
    if (error) {
      toast.error(error.message || 'An error occurred')
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_FILTERS })
  }, [])

  const value = {
    ...state,
    theme,
    setTheme,
    setFilters,
    addRecentSearch,
    addFavorite,
    removeFavorite,
    setLoading,
    setError,
    clearError,
    resetFilters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Export context for testing purposes
export { AppContext }
