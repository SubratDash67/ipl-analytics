import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Code, Database, Zap, Shield, ExternalLink } from 'lucide-react'

const ApiDocsPage = () => {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/data/summary',
      description: 'Get dataset summary statistics',
      response: {
        matches_count: 1000,
        deliveries_count: 250000,
        batters: 500,
        bowlers: 300
      }
    },
    {
      method: 'GET',
      path: '/api/players/search',
      description: 'Search for players',
      params: ['q (query)', 'type (batter/bowler/both)'],
      response: {
        batters: ['V Kohli', 'MS Dhoni'],
        bowlers: ['JJ Bumrah', 'RA Jadeja']
      }
    },
    {
      method: 'GET',
      path: '/api/stats/head-to-head/{batter}/{bowler}',
      description: 'Get head-to-head statistics',
      params: ['season', 'venue', 'match_type'],
      response: {
        batting_stats: {},
        bowling_stats: {},
        total_deliveries: 98
      }
    }
  ]

  return (
    <>
      <Helmet>
        <title>API Documentation - IPL Analytics</title>
        <meta name="description" content="Complete API documentation for IPL Analytics platform with endpoints, parameters, and response formats." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            API Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete reference for the IPL Analytics API
          </p>
        </div>

        {/* Overview */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="h-6 w-6 mr-2 text-blue-600" />
            Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The IPL Analytics API provides comprehensive cricket statistics and analysis data. 
            All endpoints return JSON responses and support various query parameters for filtering.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Base URL:</strong> http://localhost:5000/api
            </p>
          </div>
        </div>

        {/* Authentication */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-green-600" />
            Authentication
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Currently, the API is open and does not require authentication. 
            All endpoints are publicly accessible for development purposes.
          </p>
        </div>

        {/* Endpoints */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-purple-600" />
            Endpoints
          </h2>
          
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {endpoint.description}
                </p>

                {endpoint.params && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Parameters:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                      {endpoint.params.map((param, paramIndex) => (
                        <li key={paramIndex}>{param}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Response:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Rate Limits
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Currently, there are no rate limits imposed. However, please use the API responsibly 
            and avoid making excessive requests that could impact performance.
          </p>
        </div>

        {/* GitHub Link */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Source Code
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View the complete source code and contribute to the project
              </p>
            </div>
            <a
              href="https://github.com/SubratDash67"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <Code className="h-4 w-4" />
              <span>View on GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default ApiDocsPage
