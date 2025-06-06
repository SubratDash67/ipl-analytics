// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_TIME: 1000 * 60 * 10, // 10 minutes
  STALE_TIME: 1000 * 60 * 5,  // 5 minutes
}

// Player Types
export const PLAYER_TYPES = {
  BATTER: 'batter',
  BOWLER: 'bowler',
  BOTH: 'both'
}

// Cricket Statistics
export const CRICKET_STATS = {
  OVERS_PER_INNINGS: 20,
  BALLS_PER_OVER: 6,
  POWERPLAY_OVERS: 6,
  MIDDLE_OVERS_START: 7,
  MIDDLE_OVERS_END: 15,
  DEATH_OVERS_START: 16,
  DEATH_OVERS_END: 20,
  BOUNDARY_RUNS: [4, 6],
  DISMISSAL_TYPES: [
    'bowled', 'lbw', 'caught', 'stumped', 'hit wicket', 
    'run out', 'caught and bowled', 'obstructing the field'
  ]
}

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  SEARCH_MIN_LENGTH: 2,
  MAX_RECENT_SEARCHES: 10,
  MAX_FAVORITES: 50,
  PAGINATION_SIZE: 20,
  CHART_COLORS: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ]
}

// Form Validation
export const VALIDATION_RULES = {
  PLAYER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s.'-]+$/
  },
  SCORE: {
    MIN: 0,
    MAX: 300
  },
  OVERS: {
    MIN: 0,
    MAX: 20,
    DECIMAL_PLACES: 1
  },
  WICKETS: {
    MIN: 0,
    MAX: 10
  }
}

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'ipl-analytics-theme',
  RECENT_SEARCHES: 'ipl-recent-searches',
  FAVORITES: 'ipl-favorites',
  USER_PREFERENCES: 'ipl-user-preferences',
  CACHE_PREFIX: 'ipl-cache-'
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Data not found.',
  INVALID_INPUT: 'Invalid input provided.',
  UNAUTHORIZED: 'Unauthorized access.',
  TIMEOUT: 'Request timeout. Please try again.',
  GENERIC: 'Something went wrong. Please try again.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  SEARCH_COMPLETED: 'Search completed',
  ANALYSIS_READY: 'Analysis ready',
  EXPORT_SUCCESS: 'Data exported successfully',
  FAVORITE_ADDED: 'Added to favorites',
  FAVORITE_REMOVED: 'Removed from favorites'
}

// Route Paths
export const ROUTES = {
  HOME: '/',
  HEAD_TO_HEAD: '/head-to-head/:batter/:bowler',
  PLAYER_STATS: '/player/:playerName',
  COMPARISON: '/compare',
  ADVANCED: '/advanced',
  VENUE: '/venue/:batter/:bowler',
  NOT_FOUND: '/404'
}

// Query Keys for React Query
export const QUERY_KEYS = {
  DATA_SUMMARY: ['data-summary'],
  PLAYER_SEARCH: (query, type) => ['player-search', query, type],
  HEAD_TO_HEAD: (batter, bowler, filters) => ['head-to-head', batter, bowler, filters],
  PLAYER_STATS: (player, type) => ['player-stats', player, type],
  PARTNERSHIPS: (player, filters) => ['partnerships', player, filters],
  PHASE_ANALYSIS: (batter, bowler, filters) => ['phase-analysis', batter, bowler, filters],
  FORM_ANALYSIS: (player, type, matches) => ['form-analysis', player, type, matches],
  WIN_PROBABILITY: ['win-probability'],
  VENUE_BREAKDOWN: (batter, bowler, filters) => ['venue-breakdown', batter, bowler, filters],
  SEASON_TRENDS: (batter, bowler, filters) => ['season-trends', batter, bowler, filters],
  FILTERS: ['filters'],
  VENUES: ['venues']
}

export default {
  API_CONFIG,
  PLAYER_TYPES,
  CRICKET_STATS,
  UI_CONSTANTS,
  VALIDATION_RULES,
  THEME_CONFIG,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  QUERY_KEYS
}
