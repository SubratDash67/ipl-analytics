import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PlayerComparison from '../components/comparison/PlayerComparison'

const ComparisonPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link 
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <PlayerComparison />
    </div>
  )
}

export default ComparisonPage
