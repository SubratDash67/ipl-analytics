import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Calculator, 
  Zap, 
  ArrowLeft,
  Target,
  BarChart3
} from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PartnershipAnalysis from '../components/partnerships/PartnershipAnalysis'
import PhaseAnalysisDetail from '../components/phase/PhaseAnalysisDetail'
import FormAnalysis from '../components/form/FormAnalysis'
import WinProbabilityCalculator from '../components/probability/WinProbabilityCalculator'

const AdvancedAnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('partnerships')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [selectedBatter, setSelectedBatter] = useState('')
  const [selectedBowler, setSelectedBowler] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    const player = searchParams.get('player')
    const batter = searchParams.get('batter')
    const bowler = searchParams.get('bowler')
    
    if (tab) setActiveTab(tab)
    if (player) setSelectedPlayer(player)
    if (batter) setSelectedBatter(batter)
    if (bowler) setSelectedBowler(bowler)
  }, [searchParams])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('tab', tab)
    setSearchParams(newParams)
  }

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
      description: 'Powerplay, middle overs, and death overs performance',
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
      description: 'Real-time match situation calculator',
      color: 'orange'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'partnerships':
        return (
          <PartnershipAnalysis 
            player={selectedPlayer} 
            onPlayerSelect={setSelectedPlayer}
          />
        )
      case 'phases':
        return (
          <PhaseAnalysisDetail 
            batter={selectedBatter} 
            bowler={selectedBowler}
            onBatterSelect={setSelectedBatter}
            onBowlerSelect={setSelectedBowler}
          />
        )
      case 'form':
        return (
          <FormAnalysis 
            player={selectedPlayer}
            onPlayerSelect={setSelectedPlayer}
          />
        )
      case 'probability':
        return <WinProbabilityCalculator />
      default:
        return (
          <div className="text-center py-12">
            <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a tab to begin analysis</p>
          </div>
        )
    }
  }

  return (
    <>
      <Helmet>
        <title>Advanced Analytics - IPL Cricket Analysis</title>
        <meta name="description" content="In-depth cricket analysis with ICC-compliant statistics, advanced metrics, and professional-grade insights for comprehensive player and match analysis." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                <Zap className="h-8 w-8 mr-3 text-blue-600" />
                Advanced Analytics
              </h1>
              <p className="text-gray-600">
                In-depth cricket analysis with ICC-compliant statistics, advanced metrics, and professional-grade insights for comprehensive player and match analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card p-0 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`p-6 text-left transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-${tab.color}-50 text-${tab.color}-700`
                    : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <tab.icon className={`h-6 w-6 ${
                    activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'
                  }`} />
                  <span className="font-semibold">{tab.name}</span>
                </div>
                <p className="text-sm opacity-75">{tab.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </>
  )
}

export default AdvancedAnalyticsPage
