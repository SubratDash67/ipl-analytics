import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Calculator, TrendingUp, BarChart3, Zap, Target, Award } from 'lucide-react'

const MethodologyPage = () => {
  const calculations = [
    {
      metric: 'Strike Rate',
      formula: '(Runs Scored / Balls Faced) × 100',
      description: 'Measures batting aggression and scoring rate',
      icon: Zap,
      example: 'If a batter scores 50 runs in 40 balls: (50/40) × 100 = 125%'
    },
    {
      metric: 'Economy Rate',
      formula: 'Runs Conceded / Overs Bowled',
      description: 'Measures bowling efficiency in terms of runs per over',
      icon: Target,
      example: 'If a bowler concedes 30 runs in 4 overs: 30/4 = 7.5'
    },
    {
      metric: 'Batting Average',
      formula: 'Total Runs / Times Dismissed',
      description: 'Measures batting consistency and reliability',
      icon: BarChart3,
      example: 'If a batter scores 300 runs and gets out 10 times: 300/10 = 30'
    },
    {
      metric: 'Bowling Average',
      formula: 'Runs Conceded / Wickets Taken',
      description: 'Measures bowling effectiveness in terms of runs per wicket',
      icon: Award,
      example: 'If a bowler concedes 120 runs and takes 6 wickets: 120/6 = 20'
    }
  ]

  const methodologies = [
    {
      title: 'Partnership Analysis',
      description: 'Partnerships are calculated following ICC rules where runs include extras and partnership ends when either batter is dismissed.',
      steps: [
        'Identify continuous batting pairs',
        'Calculate total runs including extras',
        'Track partnership duration in balls',
        'End partnership on dismissal or innings conclusion'
      ]
    },
    {
      title: 'Phase Analysis',
      description: 'Match phases are divided according to T20 cricket conventions with specific over ranges.',
      steps: [
        'Powerplay: Overs 1-6',
        'Middle Overs: Overs 7-15',
        'Death Overs: Overs 16-20',
        'Calculate statistics for each phase separately'
      ]
    },
    {
      title: 'Form Analysis',
      description: 'Recent form is calculated using weighted averages of recent performances with trend analysis.',
      steps: [
        'Collect last N matches data',
        'Calculate moving averages',
        'Identify performance trends',
        'Generate consistency ratings'
      ]
    },
    {
      title: 'Win Probability',
      description: 'Win probability uses historical data and current match situation to predict outcomes.',
      steps: [
        'Analyze current match state',
        'Compare with historical similar situations',
        'Apply machine learning models',
        'Generate probability percentage'
      ]
    }
  ]

  return (
    <>
      <Helmet>
        <title>Methodology - IPL Analytics</title>
        <meta name="description" content="Learn about the statistical methodologies, calculations, and ICC-compliant formulas used in IPL Analytics platform." />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Methodology
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our analytics platform follows ICC-compliant statistical methods and industry-standard 
            cricket analysis techniques to ensure accurate and meaningful insights.
          </p>
        </div>

        {/* Statistical Calculations */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-blue-600" />
            Statistical Calculations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {calculations.map((calc, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                    <calc.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {calc.metric}
                  </h3>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    {calc.formula}
                  </code>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {calc.description}
                </p>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Example:</strong> {calc.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Methodologies */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
            Analysis Methodologies
          </h2>
          
          <div className="space-y-6">
            {methodologies.map((method, index) => (
              <div key={index} className="border-l-4 border-l-green-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {method.description}
                </p>
                <div className="grid md:grid-cols-2 gap-2">
                  {method.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Validation */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Validation & Quality Control
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Range Validation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Strike rates validated to be within 0-400%, economy rates within 0-25 to ensure realistic values
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cross-Validation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Statistics cross-checked against multiple data sources to ensure accuracy and consistency
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Trend Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Statistical trends analyzed for anomalies and outliers to maintain data integrity
              </p>
            </div>
          </div>
        </div>

        {/* ICC Compliance */}
        <div className="card bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ICC Compliance
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All statistical calculations follow International Cricket Council (ICC) standards 
              and official cricket scoring rules to ensure authenticity and comparability with 
              official cricket statistics.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
              ✓ ICC Compliant Statistics
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MethodologyPage
