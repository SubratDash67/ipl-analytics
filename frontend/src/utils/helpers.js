import { CRICKET_STATS, VALIDATION_RULES, ERROR_MESSAGES } from './constants'

// Cricket calculation helpers
export const cricketHelpers = {
  calculateStrikeRate: (runs, balls) => {
    if (balls === 0) return 0
    return ((runs / balls) * 100).toFixed(2)
  },

  calculateAverage: (runs, dismissals) => {
    if (dismissals === 0) return runs
    return (runs / dismissals).toFixed(2)
  },

  calculateEconomyRate: (runs, balls) => {
    if (balls === 0) return 0
    const overs = balls / CRICKET_STATS.BALLS_PER_OVER
    return (runs / overs).toFixed(2)
  },

  calculateBowlingStrikeRate: (balls, wickets) => {
    if (wickets === 0) return 'N/A'
    return (balls / wickets).toFixed(1)
  },

  calculateBowlingAverage: (runs, wickets) => {
    if (wickets === 0) return 'N/A'
    return (runs / wickets).toFixed(2)
  },

  formatOvers: (balls) => {
    const completedOvers = Math.floor(balls / CRICKET_STATS.BALLS_PER_OVER)
    const remainingBalls = balls % CRICKET_STATS.BALLS_PER_OVER
    return `${completedOvers}.${remainingBalls}`
  },

  getPhase: (over) => {
    if (over <= CRICKET_STATS.POWERPLAY_OVERS) return 'powerplay'
    if (over <= CRICKET_STATS.MIDDLE_OVERS_END) return 'middle'
    return 'death'
  },

  isBoundary: (runs) => {
    return CRICKET_STATS.BOUNDARY_RUNS.includes(runs)
  },

  isDismissal: (dismissalType) => {
    return CRICKET_STATS.DISMISSAL_TYPES.includes(dismissalType?.toLowerCase())
  }
}

// Data formatting helpers
export const formatHelpers = {
  formatNumber: (num, decimals = 0) => {
    if (num === null || num === undefined) return '0'
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  },

  formatPercentage: (value, decimals = 1) => {
    if (value === null || value === undefined) return '0%'
    return `${Number(value).toFixed(decimals)}%`
  },

  formatDate: (dateString) => {
    if (!dateString || dateString === 'Unknown') return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  },

  formatPlayerName: (name) => {
    if (!name) return 'Unknown Player'
    return name.trim().replace(/\s+/g, ' ')
  },

  truncateText: (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
  },

  capitalizeWords: (str) => {
    if (!str) return ''
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  }
}

// Validation helpers
export const validationHelpers = {
  validatePlayerName: (name) => {
    if (!name || name.trim().length < VALIDATION_RULES.PLAYER_NAME.MIN_LENGTH) {
      return { isValid: false, error: 'Player name is too short' }
    }
    if (name.length > VALIDATION_RULES.PLAYER_NAME.MAX_LENGTH) {
      return { isValid: false, error: 'Player name is too long' }
    }
    if (!VALIDATION_RULES.PLAYER_NAME.PATTERN.test(name)) {
      return { isValid: false, error: 'Player name contains invalid characters' }
    }
    return { isValid: true, error: null }
  },

  validateScore: (score) => {
    const numScore = Number(score)
    if (isNaN(numScore) || numScore < VALIDATION_RULES.SCORE.MIN || numScore > VALIDATION_RULES.SCORE.MAX) {
      return { isValid: false, error: `Score must be between ${VALIDATION_RULES.SCORE.MIN} and ${VALIDATION_RULES.SCORE.MAX}` }
    }
    return { isValid: true, error: null }
  },

  validateOvers: (overs) => {
    const numOvers = Number(overs)
    if (isNaN(numOvers) || numOvers < VALIDATION_RULES.OVERS.MIN || numOvers > VALIDATION_RULES.OVERS.MAX) {
      return { isValid: false, error: `Overs must be between ${VALIDATION_RULES.OVERS.MIN} and ${VALIDATION_RULES.OVERS.MAX}` }
    }
    return { isValid: true, error: null }
  },

  validateWickets: (wickets) => {
    const numWickets = Number(wickets)
    if (isNaN(numWickets) || numWickets < VALIDATION_RULES.WICKETS.MIN || numWickets > VALIDATION_RULES.WICKETS.MAX) {
      return { isValid: false, error: `Wickets must be between ${VALIDATION_RULES.WICKETS.MIN} and ${VALIDATION_RULES.WICKETS.MAX}` }
    }
    return { isValid: true, error: null }
  }
}

// Array and object helpers
export const dataHelpers = {
  sortByKey: (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key] || 0
      const bVal = b[key] || 0
      return order === 'asc' ? aVal - bVal : bVal - aVal
    })
  },

  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown'
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  },

  filterByValue: (array, key, value) => {
    return array.filter(item => item[key] === value)
  },

  findTopN: (array, key, n = 5) => {
    return [...array]
      .sort((a, b) => (b[key] || 0) - (a[key] || 0))
      .slice(0, n)
  },

  calculateSum: (array, key) => {
    return array.reduce((sum, item) => sum + (item[key] || 0), 0)
  },

  calculateAverage: (array, key) => {
    if (array.length === 0) return 0
    return dataHelpers.calculateSum(array, key) / array.length
  },

  removeDuplicates: (array, key) => {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
}

// URL and routing helpers
export const urlHelpers = {
  encodePlayerName: (name) => {
    return encodeURIComponent(name.trim())
  },

  decodePlayerName: (encodedName) => {
    return decodeURIComponent(encodedName)
  },

  buildQueryString: (params) => {
    const filteredParams = Object.entries(params)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    return filteredParams.length > 0 ? `?${filteredParams.join('&')}` : ''
  },

  parseQueryString: (queryString) => {
    const params = new URLSearchParams(queryString)
    const result = {}
    for (const [key, value] of params) {
      result[key] = value
    }
    return result
  }
}

// Performance helpers
export const performanceHelpers = {
  debounce: (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  },

  throttle: (func, limit) => {
    let inThrottle
    return (...args) => {
      if (!inThrottle) {
        func.apply(null, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  memoize: (func) => {
    const cache = new Map()
    return (...args) => {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func.apply(null, args)
      cache.set(key, result)
      return result
    }
  }
}

// Error handling helpers
export const errorHelpers = {
  getErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    if (error.code === 'NETWORK_ERROR') {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
    if (error.response?.status === 404) {
      return ERROR_MESSAGES.NOT_FOUND
    }
    if (error.response?.status === 401) {
      return ERROR_MESSAGES.UNAUTHORIZED
    }
    if (error.response?.status >= 500) {
      return ERROR_MESSAGES.SERVER_ERROR
    }
    return ERROR_MESSAGES.GENERIC
  },

  isNetworkError: (error) => {
    return error.code === 'NETWORK_ERROR' || error.message === 'Network Error'
  },

  isTimeoutError: (error) => {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout')
  },

  logError: (error, context = '') => {
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    })
  }
}

// Storage helpers
export const storageHelpers = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },

  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

export default {
  cricketHelpers,
  formatHelpers,
  validationHelpers,
  dataHelpers,
  urlHelpers,
  performanceHelpers,
  errorHelpers,
  storageHelpers
}
