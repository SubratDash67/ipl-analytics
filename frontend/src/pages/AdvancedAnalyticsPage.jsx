import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  TrendingUp, 
  Calculator, 
  Zap,
  Target,
  BarChart3,
  Activity
} from 'lucide-react'
import PartnershipAnalysis from '../components/partnerships/PartnershipAnalysis'
import PhaseAnalysisDetail from '../components/phase/PhaseAnalysisDetail'
import FormAnalysis from '../components/form/FormAnalysis'
import WinProbabilityCalculator from '../components/probability/WinProbabilityCalculator'
import PlayerSearch from '../components/player/PlayerSearch'

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
      description: 'Batting partnership analysis and combinations',
      color: 'blue'
    },
    {
      id: 'phases',
      name: 'Phase Analysis',
      icon: Clock,
      description: 'Powerplay, middle, and death overs performance',
      color: 'green'
    },
    {
      id: 'form',
      name: 'Form Analysis',
      icon: TrendingUp,
      description: 'Recent performance trends and consistency',
      color: 'purple'
    },
    {
      id: 'probability',
      name: 'Win Probability',
      icon: Calculator,
      description: 'Match situation probability calculator',
      color: 'orange'
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
          <div className="w-full max-w-none overflow-x-hidden">
            <div className="space-y-8">
              <div className="card max-w-3xl mx-auto" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Partnership Analysis</h3>
                  <p className="text-gray-600">
                    Analyze batting partnerships, combinations, and collaborative performance metrics
                  </p>
                </div>
                <PlayerSearch 
                  type="batter"
                  onSelect={setSelectedPlayer}
                  placeholder="Search for a batter to analyze partnerships..."
                  className="w-full"
                />
                {selectedPlayer && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Selected:</strong> {selectedPlayer}
                    </p>
                  </div>
                )}
              </div>
              {selectedPlayer ? (
                <div className="w-full overflow-x-hidden">
                  <PartnershipAnalysis player={selectedPlayer} />
                </div>
              ) : (
                <div className="card text-center py-16">
                  <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a Batter
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Choose a batter from the search above to view their partnership analysis, 
                    including collaboration statistics with different partners.
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'phases':
        return (
          <div className="w-full max-w-none overflow-x-hidden">
            <div className="space-y-8">
              <div className="card max-w-4xl mx-auto" style={{ overflow: 'visible' }}>
                <div className="text-center mb-6">
                  <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase Analysis</h3>
                  <p className="text-gray-600">
                    Analyze performance across different match phases: Powerplay, Middle Overs, and Death Overs
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6" style={{ overflow: 'visible' }}>
                  <div style={{ overflow: 'visible', zIndex: 20, position: 'relative' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Target className="h-4 w-4 inline mr-2" />
                      Select Batter
                    </label>
                    <PlayerSearch
                      type="batter"
                      onSelect={setSelectedBatter}
                      placeholder="Search for a batter..."
                      className="w-full"
                    />
                    {selectedBatter && (
                      <div className="mt-2 text-sm text-green-600">
                        Selected: {selectedBatter}
                      </div>
                    )}
                  </div>
                  <div style={{ overflow: 'visible', zIndex: 15, position: 'relative' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BarChart3 className="h-4 w-4 inline mr-2" />
                      Select Bowler
                    </label>
                    <PlayerSearch
                      type="bowler"
                      onSelect={setSelectedBowler}
                      placeholder="Search for a bowler..."
                      className="w-full"
                    />
                    {selectedBowler && (
                      <div className="mt-2 text-sm text-green-600">
                        Selected: {selectedBowler}
                      </div>
                    )}
                  </div>
                </div>
                {selectedBatter && selectedBowler && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 text-center">
                      <strong>Matchup:</strong> {selectedBatter} vs {selectedBowler}
                    </p>
                  </div>
                )}
              </div>
              {selectedBatter && selectedBowler ? (
                <div className="w-full overflow-x-hidden">
                  <PhaseAnalysisDetail batter={selectedBatter} bowler={selectedBowler} />
                </div>
              ) : (
                <div className="card text-center py-16">
                  <Clock className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Both Players
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Choose both a batter and bowler to analyze their phase-wise performance 
                    across Powerplay, Middle Overs, and Death Overs.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-600">Powerplay</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-600">Middle Overs</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-gray-600">Death Overs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'form':
        return (
          <div className="w-full max-w-none overflow-x-hidden">
            <div className="space-y-8">
              <div className="card max-w-4xl mx-auto" style={{ overflow: 'visible', zIndex: 10, position: 'relative' }}>
                <div className="text-center mb-6">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Form Analysis</h3>
                  <p className="text-gray-600">
                    Analyze recent performance trends, consistency ratings, and form patterns
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Activity className="h-4 w-4 inline mr-2" />
                      Select Player
                    </label>
                    <PlayerSearch
                      type={playerType}
                      onSelect={setSelectedPlayer}
                      placeholder={`Search for a ${playerType}...`}
                      className="w-full"
                    />
                    {selectedPlayer && (
                      <div className="mt-2 text-sm text-purple-600">
                        Selected: {selectedPlayer}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Player Type
                    </label>
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
                <div className="w-full overflow-x-hidden">
                  <FormAnalysis 
                    player={selectedPlayer} 
                    playerType={playerType}
                  />
                </div>
              ) : (
                <div className="card text-center py-16">
                  <TrendingUp className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a Player
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Choose a player to analyze their recent form, performance trends, 
                    and consistency across recent matches.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-600">Form Trend</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-600">Consistency</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-600">Recent Stats</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'probability':
        return (
          <div className="w-full overflow-x-hidden">
            <div className="space-y-8">
              <div className="text-center">
                <Calculator className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Win Probability Calculator</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Calculate real-time win probabilities based on current match situation, 
                  historical data, and performance metrics.
                </p>
              </div>
              <WinProbabilityCalculator />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      <Helmet>
        <title>Advanced Analytics - IPL Analytics</title>
        <meta name="description" content="Advanced cricket analytics including partnership analysis, phase analysis, form analysis, and win probability calculations." />
      </Helmet>

      <div className="min-h-screen w-full overflow-x-hidden">
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
            <p className="text-lg text-gray-600 max-w-3xl">
              In-depth cricket analysis with ICC-compliant statistics, advanced metrics, 
              and professional-grade insights for comprehensive player and match analysis.
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
                      className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 transition-colors ${
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
    </>
  )
}

export default AdvancedAnalyticsPage
