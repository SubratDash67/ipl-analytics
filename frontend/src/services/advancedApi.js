import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ipl-analytics-backend-api.onrender.com/api'

const advancedApi = axios.create({
  baseURL: `${API_BASE_URL}/advanced`,
  timeout: 60000, // Increased timeout for deployed backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
advancedApi.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Advanced API] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('[Advanced API] Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
advancedApi.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Advanced API] ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (error.code !== 'ERR_CANCELED') {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'An error occurred'
      
      console.error('[Advanced API] Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: errorMessage
      })
    }
    return Promise.reject(error)
  }
)

export const advancedApiService = {
  async getPlayerPartnerships(player, filters = {}, signal) {
    const config = { params: filters }
    if (signal && typeof signal.addEventListener === 'function') {
      config.signal = signal
    }
    const response = await advancedApi.get(`/partnerships/${encodeURIComponent(player)}`, config)
    return response.data
  },

  async getPhaseAnalysis(batter, bowler, filters = {}, signal) {
    const config = { params: filters }
    if (signal && typeof signal.addEventListener === 'function') {
      config.signal = signal
    }
    const response = await advancedApi.get(`/phase-analysis/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, config)
    return response.data
  },

  async getFormAnalysis(player, type = 'batter', matches = 10, signal) {
    const config = { params: { type, matches } }
    if (signal && typeof signal.addEventListener === 'function') {
      config.signal = signal
    }
    const response = await advancedApi.get(`/form-analysis/${encodeURIComponent(player)}`, config)
    return response.data
  },

  async calculateWinProbability(matchSituation, signal) {
    const config = {}
    if (signal && typeof signal.addEventListener === 'function') {
      config.signal = signal
    }
    const response = await advancedApi.post('/win-probability', matchSituation, config)
    return response.data
  },

  async getPressureAnalysis(batter, bowler, filters = {}, signal) {
    const config = { params: filters }
    if (signal && typeof signal.addEventListener === 'function') {
      config.signal = signal
    }
    const response = await advancedApi.get(`/pressure-analysis/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, config)
    return response.data
  }
}

export default advancedApi
