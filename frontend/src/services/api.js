import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('API_BASE_URL:', API_BASE_URL)
console.log('Environment:', import.meta.env.MODE)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
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
  (response) => {
    console.log('API Response:', response.status, 'Success')
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiService = {
  async getDataSummary() {
    const response = await api.get('/data/summary')
    return response.data
  },

  async searchPlayers(query, type = 'both') {
    const response = await api.get('/players/search', {
      params: { q: query, type }
    })
    return response.data
  },

  async getHeadToHeadStats(batter, bowler, filters = {}) {
    const response = await api.get(`/stats/head-to-head/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters
    })
    return response.data
  },

  async getFilters() {
    const response = await api.get('/filters')
    return response.data
  },

  async getPlayerStats(playerName, playerType) {
    const response = await api.get(`/stats/player/${encodeURIComponent(playerName)}`, {
      params: { type: playerType }
    })
    return response.data
  }
}

export default api
