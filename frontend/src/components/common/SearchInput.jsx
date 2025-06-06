import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'

const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  loading = false,
  disabled = false,
  showClearButton = true,
  autoFocus = false,
  className = '',
  onFocus,
  onBlur
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch && value.trim()) {
      onSearch(value.trim())
    }
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative flex items-center ${
        isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } rounded-lg transition-all duration-200`}>
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            loading ? 'pr-16' : showClearButton && value ? 'pr-16' : 'pr-10'
          }`}
        />

        <div className="absolute right-3 flex items-center space-x-1">
          {loading && (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          )}
          
          {!loading && showClearButton && value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default SearchInput
