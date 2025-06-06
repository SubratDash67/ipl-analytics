import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('API_BASE_URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('[API] Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: errorMessage,
        data: error.response?.data
      })
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    })
  }
)

export const apiService = {
  async getDataSummary() {
    const response = await api.get('/data/summary')
    return response.data
  },

  async searchPlayers(query, type = 'both', signal) {
    const config = {
      params: { q: query, type }
    }
    if (signal && typeof signal.addEventListener === 'function') {
      config.signal = signal
    }
    const response = await api.get('/players/search', config)
    return response.data
  },

  async getHeadToHeadStats(batter, bowler, filters = {}) {
    const response = await api.get(`/stats/head-to-head/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters
    })
    return response.data
  },

  async getPlayerStats(playerName, playerType = 'batter') {
    if (!playerName || playerName.trim() === '') {
      throw new Error('Player name is required')
    }
    const response = await api.get(`/stats/player/${encodeURIComponent(playerName)}`, {
      params: { type: playerType }
    })
    return response.data
  },

  async getPlayerMatchups(playerName, playerType = 'batter') {
    if (!playerName || playerName.trim() === '') {
      throw new Error('Player name is required')
    }
    const response = await api.get(`/players/${encodeURIComponent(playerName)}/matchups`, {
      params: { type: playerType }
    })
    return response.data
  },

  async getFilters() {
    const response = await api.get('/filters')
    return response.data
  },

  async getVenues() {
    const response = await api.get('/venues')
    return response.data?.venues || []
  },

  async getVenueBreakdown(batter, bowler, filters = {}) {
    const response = await api.get(`/venue-breakdown/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters
    })
    return response.data
  },

  async getSeasonTrends(batter, bowler, filters = {}) {
    const response = await api.get(`/season-trends/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters
    })
    return response.data
  },

  async getVenueAnalysis(batter, bowler, venue) {
    const response = await api.get(`/stats/venue/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: { venue }
    })
    return response.data
  },

  async getMatchDetails(matchId) {
    const response = await api.get(`/match/${matchId}`)
    return response.data
  },

  async getSeasonStats(season) {
    const response = await api.get(`/stats/season/${season}`)
    return response.data
  },

  async getTeamStats(team) {
    const response = await api.get(`/stats/team/${encodeURIComponent(team)}`)
    return response.data
  }
}

export default api
