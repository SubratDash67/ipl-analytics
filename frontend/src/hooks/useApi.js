import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export function useApi(apiCall, dependencies = [], options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)
  const mountedRef = useRef(true)

  const { showErrorToast = false, initialData = null } = options

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (initialData) {
      setData(initialData)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController()
        
        setLoading(true)
        setError(null)
        
        console.log('Making API call...', { dependencies })
        const result = await apiCall(abortControllerRef.current.signal)
        console.log('API call result:', result)
        
        if (mountedRef.current) {
          setData(result)
        }
      } catch (err) {
        console.error('API call error:', err)
        
        if (err.name === 'AbortError') {
          console.log('Request was aborted')
          return
        }
        
        if (mountedRef.current) {
          setError(err)
          if (showErrorToast) {
            toast.error(err.response?.data?.error || err.message || 'An error occurred')
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, dependencies)

  const refetch = async () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setLoading(true)
      setError(null)
      
      console.log('Refetching data...')
      const result = await apiCall(abortControllerRef.current.signal)
      console.log('Refetch result:', result)
      
      if (mountedRef.current) {
        setData(result)
      }
      return result
    } catch (err) {
      console.error('Refetch error:', err)
      
      if (err.name === 'AbortError') {
        return
      }
      
      if (mountedRef.current) {
        setError(err)
        if (showErrorToast) {
          toast.error(err.response?.data?.error || err.message || 'An error occurred')
        }
      }
      throw err
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  return { data, loading, error, refetch }
}

export function usePlayerSearch(query, type = 'both') {
  const [results, setResults] = useState({ batters: [], bowlers: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timeoutRef = useRef(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ batters: [], bowlers: [] })
      return
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController()
        setLoading(true)
        setError(null)
        
        const { apiService } = await import('../services/api')
        const data = await apiService.searchPlayers(query, type, abortControllerRef.current.signal)
        setResults(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err)
          setResults({ batters: [], bowlers: [] })
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query, type])

  return { results, loading, error }
}
