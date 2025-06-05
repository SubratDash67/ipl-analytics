import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, Clock, TrendingUp, Calculator, Zap } from 'lucide-react'
import PartnershipAnalysis from '../components/partnerships/PartnershipAnalysis'
import PhaseAnalysisDetail from '../components/phase/PhaseAnalysisDetail'
import FormAnalysis from '../components/form/FormAnalysis'
import WinProbabilityCalculator from '../components/probability/WinProbabilityCalculator'
import PlayerSearchSelect from '../components/player/PlayerSearchSelect'

const AdvancedAnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'partnerships'
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [selectedBatter, setSelectedBatter] = useState('')
  const [selectedBowler, setSelectedBowler] = useState('')
  const [playerType, setPlayerType] = useState('batter')

  const tabs = [
    {
      id: 'partnerships',
      name: 'Partnerships',
      icon: Users,
      description: 'Batting partnership analysis'
    },
    {
      id: 'phases',
      name: 'Phase Analysis',
      icon: Clock,
      description: 'Powerplay, middle, and death overs'
    },
    {
      id: 'form',
      name: 'Form Analysis',
      icon: TrendingUp,
      description: 'Recent performance trends'
    },
    {
      id: 'probability',
      name: 'Win Probability',
      icon: Calculator,
      description: 'Match situation calculator'
    }
  ]

  const getTabUrl = (tabId) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tabId)
    return `?${params.toString()}`
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'partnerships':
        return (
          <div className="w-full max-w-none" style={{ overflow: 'visible' }}>
            <div className="space-y-6">
              <div className="card max-w-2xl mx-auto" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Batter for Partnership Analysis</h3>
                <PlayerSearchSelect 
                  type="batter"
                  onSelect={setSelectedPlayer}
                  placeholder="Search for a batter..."
                  className="w-full"
                />
              </div>
              {selectedPlayer ? (
                <div className="w-full">
                  <PartnershipAnalysis player={selectedPlayer} />
                </div>
              ) : (
                <div className="card text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a batter to view partnership analysis</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'phases':
        return (
          <div className="w-full max-w-none" style={{ overflow: 'visible' }}>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" style={{ overflow: 'visible' }}>
                <div className="card" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Batter</h3>
                  <PlayerSearchSelect
                    type="batter"
                    onSelect={setSelectedBatter}
                    placeholder="Search for a batter..."
                    className="w-full"
                  />
                </div>
                <div className="card" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Bowler</h3>
                  <PlayerSearchSelect
                    type="bowler"
                    onSelect={setSelectedBowler}
                    placeholder="Search for a bowler..."
                    className="w-full"
                  />
                </div>
              </div>
              {selectedBatter && selectedBowler ? (
                <div className="w-full">
                  <PhaseAnalysisDetail batter={selectedBatter} bowler={selectedBowler} />
                </div>
              ) : (
                <div className="card text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select both batter and bowler to view phase analysis</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'form':
        return (
          <div className="w-full max-w-none" style={{ overflow: 'visible' }}>
            <div className="space-y-6">
              <div className="card max-w-3xl mx-auto" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Player for Form Analysis</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Player</label>
                    <PlayerSearchSelect
                      type={playerType}
                      onSelect={setSelectedPlayer}
                      placeholder={`Search for a ${playerType}...`}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Player Type</label>
                    <select 
                      className="input-field w-full"
                      value={playerType}
                      onChange={(e) => {
                        setPlayerType(e.target.value)
                        setSelectedPlayer('')
                      }}
                    >
                      <option value="batter">Batter</option>
                      <option value="bowler">Bowler</option>
                    </select>
                  </div>
                </div>
              </div>
              {selectedPlayer ? (
                <div className="w-full">
                  <FormAnalysis 
                    player={selectedPlayer} 
                    playerType={playerType}
                  />
                </div>
              ) : (
                <div className="card text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a player to view form analysis</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'probability':
        return (
          <div className="w-full">
            <WinProbabilityCalculator />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 py-8" style={{ overflow: 'visible' }}>
        <div className="flex items-center mb-8">
          <Link 
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="h-8 w-8 text-blue-600 mr-3" />
            Advanced Analytics
          </h1>
          <p className="text-lg text-gray-600">
            In-depth cricket analysis with ICC-compliant statistics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <Link
                    key={tab.id}
                    to={getTabUrl(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span>{tab.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn w-full" style={{ overflow: 'visible' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalyticsPage
