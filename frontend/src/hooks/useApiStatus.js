import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'

export const useApiStatus = () => {
  const [isApiReady, setIsApiReady] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState(null)

  const checkApiStatus = useCallback(async () => {
    try {
      setIsChecking(true)
      setError(null)
      
      // Try to fetch summary data as health check
      const summaryData = await apiService.getDataSummary()
      
      if (summaryData && (summaryData.matches_count || summaryData.batters)) {
        setIsApiReady(true)
        setIsChecking(false)
        return true
      }
      
      return false
    } catch (error) {
      console.log(`API check attempt ${attempts + 1} failed:`, error.message)
      setError(error.message)
      return false
    }
  }, [attempts])

  useEffect(() => {
    let intervalId
    let timeoutId

    const startChecking = async () => {
      const isReady = await checkApiStatus()
      
      if (!isReady && attempts < 20) { // Max 20 attempts (about 2 minutes)
        setAttempts(prev => prev + 1)
        
        // Progressive delay: start with 3s, then 6s, then 10s
        const delay = attempts < 3 ? 3000 : attempts < 8 ? 6000 : 10000
        
        timeoutId = setTimeout(() => {
          startChecking()
        }, delay)
      } else if (!isReady) {
        // Max attempts reached
        setIsChecking(false)
        setError('API is taking longer than expected to respond')
      }
    }

    if (!isApiReady) {
      startChecking()
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [checkApiStatus, isApiReady, attempts])

  const retryApiCheck = useCallback(() => {
    setAttempts(0)
    setError(null)
    setIsApiReady(false)
    setIsChecking(true)
  }, [])

  return {
    isApiReady,
    isChecking,
    attempts,
    error,
    retryApiCheck
  }
}
