import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Database, Download, ExternalLink, Shield, Calendar } from 'lucide-react'

const DataSourcesPage = () => {
  const dataSources = [
    {
      name: 'IPL Official Data',
      description: 'Official match data from Indian Premier League',
      coverage: '2008-2024',
      type: 'Primary',
      reliability: 'High',
      icon: Shield,
      color: 'blue'
    },
    {
      name: 'ESPNCricinfo',
      description: 'Comprehensive cricket statistics and match details',
      coverage: '2008-2024',
      type: 'Secondary',
      reliability: 'High',
      icon: Database,
      color: 'green'
    },
    {
      name: 'Cricket Archive',
      description: 'Historical cricket data and player records',
      coverage: '2008-2024',
      type: 'Supplementary',
      reliability: 'Medium',
      icon: Calendar,
      color: 'purple'
    }
  ]

  const dataTypes = [
    {
      category: 'Match Data',
      items: [
        'Ball-by-ball delivery data',
        'Match results and scores',
        'Team compositions',
        'Venue information',
        'Weather conditions'
      ]
    },
    {
      category: 'Player Data',
      items: [
        'Batting statistics',
        'Bowling figures',
        'Fielding records',
        'Player profiles',
        'Career milestones'
      ]
    },
    {
      category: 'Advanced Metrics',
      items: [
        'Strike rates and economy rates',
        'Partnership analysis',
        'Phase-wise performance',
        'Pressure situation stats',
        'Win probability factors'
      ]
    }
  ]

  return (
    <>
      <Helmet>
        <title>Data Sources - IPL Analytics</title>
        <meta name="description" content="Learn about the data sources, collection methods, and reliability of IPL Analytics platform data." />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Data Sources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive cricket analytics platform is built on reliable, 
            high-quality data from multiple trusted sources spanning 17 IPL seasons.
          </p>
        </div>

        {/* Data Sources Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          {dataSources.map((source, index) => (
            <div key={index} className="card border-l-4 border-l-blue-500">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${source.color}-100 dark:bg-${source.color}-900/20 rounded-lg flex items-center justify-center mr-4`}>
                  <source.icon className={`h-6 w-6 text-${source.color}-600 dark:text-${source.color}-400`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {source.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${source.color}-100 dark:bg-${source.color}-900/20 text-${source.color}-800 dark:text-${source.color}-400`}>
                    {source.type}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {source.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Coverage:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{source.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Reliability:</span>
                  <span className={`font-medium ${
                    source.reliability === 'High' ? 'text-green-600 dark:text-green-400' :
                    source.reliability === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {source.reliability}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Types */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Database className="h-6 w-6 mr-2 text-blue-600" />
            Data Categories
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {dataTypes.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Quality & Validation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quality Assurance
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Cross-validation with multiple sources
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Automated data consistency checks
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Regular updates and corrections
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  ICC-compliant statistical calculations
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Coverage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total Matches</span>
                  <span className="font-semibold text-gray-900 dark:text-white">1,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Ball Deliveries</span>
                  <span className="font-semibold text-gray-900 dark:text-white">250,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Players Tracked</span>
                  <span className="font-semibold text-gray-900 dark:text-white">800+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Seasons Covered</span>
                  <span className="font-semibold text-gray-900 dark:text-white">17</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Access Raw Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore the complete dataset and data processing scripts on GitHub
              </p>
            </div>
            <a
              href="https://github.com/SubratDash67"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>View Repository</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default DataSourcesPage
