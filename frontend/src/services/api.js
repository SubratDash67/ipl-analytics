import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)


export const apiService = {
  async searchPlayers(query, type = 'both') {
    const response = await api.get('/players/search', {
      params: { q: query, type }
    })
    return response.data
  },

  async getPlayerMatchups(player, type = 'batter') {
    const response = await api.get(`/players/${encodeURIComponent(player)}/matchups`, {
      params: { type }
    })
    return response.data
  },

  async getHeadToHeadStats(batter, bowler, filters = {}) {
    const response = await api.get(`/stats/head-to-head/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters
    })
    return response.data
  },

  async getPlayerStats(player, type = 'batter', filters = {}) {
    const response = await api.get(`/stats/player/${encodeURIComponent(player)}`, {
      params: { type, ...filters }
    })
    return response.data
  },

  async getFilters() {
    const response = await api.get('/filters')
    return response.data
  },

  async getDataSummary() {
    const response = await api.get('/data/summary')
    return response.data
  },

  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  }
}

export default api
