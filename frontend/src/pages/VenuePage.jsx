import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import ProfessionalVenueAnalysis from '../components/venue/ProfessionalVenueAnalysis'

const VenuePage = () => {
  const { batter, bowler } = useParams()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Link 
          to={`/head-to-head/${encodeURIComponent(batter)}/${encodeURIComponent(bowler)}`}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Head-to-Head Analysis
        </Link>
      </div>

      <ProfessionalVenueAnalysis batter={batter} bowler={bowler} />
    </div>
  )
}

export default VenuePage
