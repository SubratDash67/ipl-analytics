import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Custom hook for API calls with React Query
export function useApi(queryKey, queryFn, options = {}) {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 10, // 10 minutes
    retry = 3,
    onSuccess,
    onError,
    ...restOptions
  } = options

  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    enabled,
    staleTime,
    cacheTime,
    retry,
    onSuccess,
    onError: (error) => {
      console.error('API Error:', error)
      if (onError) {
        onError(error)
      } else {
        toast.error(error.response?.data?.message || error.message || 'An error occurred')
      }
    },
    ...restOptions
  })
}

// Custom hook for mutations
export function useApiMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient()
  const {
    onSuccess,
    onError,
    invalidateQueries = [],
    ...restOptions
  } = options

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries(queryKey)
        })
      }
      
      if (onSuccess) {
        onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      console.error('Mutation Error:', error)
      if (onError) {
        onError(error, variables, context)
      } else {
        toast.error(error.response?.data?.message || error.message || 'An error occurred')
      }
    },
    ...restOptions
  })
}

// Legacy useApi hook for backward compatibility
export function useApiLegacy(apiCall, dependencies = [], options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)
  const mountedRef = useRef(true)

  const { showErrorToast = true, initialData = null } = options

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
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        setLoading(true)
        setError(null)

        const result = await apiCall(abortControllerRef.current.signal)

        if (mountedRef.current) {
          setData(result)
        }
      } catch (err) {
        if (err.name === 'AbortError') {
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

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, dependencies)

  const refetch = useCallback(async () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setLoading(true)
      setError(null)

      const result = await apiCall(abortControllerRef.current.signal)

      if (mountedRef.current) {
        setData(result)
      }
      return result
    } catch (err) {
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
  }, [apiCall, showErrorToast])

  return { data, loading, error, refetch }
}

// Player search hook
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

// Debounced value hook
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Local storage hook
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}
