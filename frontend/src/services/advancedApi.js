import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const advancedApi = axios.create({
  baseURL: `${API_BASE_URL}/advanced`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

advancedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code !== 'ERR_CANCELED') {
      console.error('Advanced API Error:', error.response?.data || error.message)
    }
    return Promise.reject(error)
  }
)

export const advancedApiService = {
  async getPlayerPartnerships(player, filters = {}, signal) {
    const response = await advancedApi.get(`/partnerships/${encodeURIComponent(player)}`, {
      params: filters,
      signal
    })
    return response.data
  },

  async getPhaseAnalysis(batter, bowler, filters = {}, signal) {
    const response = await advancedApi.get(`/phase-analysis/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters,
      signal
    })
    return response.data
  },

  async getFormAnalysis(player, type = 'batter', matches = 10, signal) {
    const response = await advancedApi.get(`/form-analysis/${encodeURIComponent(player)}`, {
      params: { type, matches },
      signal
    })
    return response.data
  },

  async calculateWinProbability(matchSituation, signal) {
    const response = await advancedApi.post('/win-probability', matchSituation, { signal })
    return response.data
  },

  async getPressureAnalysis(batter, bowler, filters = {}, signal) {
    const response = await advancedApi.get(`/pressure-analysis/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`, {
      params: filters,
      signal
    })
    return response.data
  }
}

export default advancedApi
