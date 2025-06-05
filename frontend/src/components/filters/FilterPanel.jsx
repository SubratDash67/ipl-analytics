import React from 'react'
import Select from 'react-select'
import { X } from 'lucide-react'

const FilterPanel = ({ filters, availableFilters, onFilterChange, compact = false }) => {
  if (!availableFilters) return null

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters }
    if (value) {
      newFilters[key] = value
    } else {
      delete newFilters[key]
    }
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const filterConfigs = [
    {
      key: 'season',
      label: 'Season',
      options: availableFilters.seasons?.map(season => ({
        value: season,
        label: season
      })) || []
    },
    {
      key: 'venue',
      label: 'Venue',
      options: availableFilters.venues?.map(venue => ({
        value: venue,
        label: venue
      })) || []
    },
    {
      key: 'phase',
      label: 'Phase',
      options: [
        { value: 'powerplay', label: 'Powerplay (1-6)' },
        { value: 'middle', label: 'Middle (7-15)' },
        { value: 'death', label: 'Death (16-20)' }
      ]
    },
    {
      key: 'match_type',
      label: 'Match Type',
      options: availableFilters.match_types?.map(type => ({
        value: type,
        label: type
      })) || []
    }
  ]

  const activeFiltersCount = Object.keys(filters).length

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: compact ? '36px' : '40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px'
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '14px',
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white'
    })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            <span>Clear All ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {filterConfigs.map(config => (
          <div key={config.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label}
            </label>
            <Select
              options={config.options}
              value={config.options.find(option => option.value === filters[config.key]) || null}
              onChange={(selected) => handleFilterChange(config.key, selected?.value)}
              placeholder={`Select ${config.label.toLowerCase()}...`}
              isClearable
              isSearchable
              styles={customStyles}
              menuPlacement="auto"
            />
          </div>
        ))}
      </div>

      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              const config = filterConfigs.find(c => c.key === key)
              const option = config?.options.find(o => o.value === value)
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  <span className="font-medium">{config?.label}:</span>
                  <span className="ml-1">{option?.label || value}</span>
                  <button
                    onClick={() => handleFilterChange(key, null)}
                    className="ml-2 hover:text-primary-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
