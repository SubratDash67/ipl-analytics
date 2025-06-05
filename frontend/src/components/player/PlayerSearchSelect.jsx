import React, { useState } from 'react'
import Select from 'react-select'
import { usePlayerSearch } from '../../hooks/useApi'

const PlayerSearchSelect = ({ type, onSelect, placeholder, className = '' }) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedValue, setSelectedValue] = useState(null)

  const { results, loading } = usePlayerSearch(inputValue, type)

  const players = type === 'batter' ? results.batters : 
                 type === 'bowler' ? results.bowlers : 
                 [...results.batters, ...results.bowlers]

  const options = players.map(player => ({
    value: player,
    label: player
  }))

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: 'absolute',
      maxHeight: '200px'
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto'
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: '#6b7280'
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#6b7280'
    })
  }

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption)
    onSelect(selectedOption ? selectedOption.value : '')
  }

  const handleInputChange = (newValue) => {
    setInputValue(newValue)
    return newValue
  }

  return (
    <div className={className}>
      <Select
        value={selectedValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={options}
        isLoading={loading}
        placeholder={placeholder}
        isClearable
        isSearchable
        noOptionsMessage={() => inputValue.length < 2 ? 'Type to search...' : 'No players found'}
        loadingMessage={() => 'Searching...'}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
        className="react-select-container"
        classNamePrefix="react-select"
        maxMenuHeight={200}
      />
    </div>
  )
}

export default PlayerSearchSelect
