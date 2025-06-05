import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy load pages for optimal performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const PlayerStatsPage = React.lazy(() => import('./pages/PlayerStatsPage'))
const HeadToHeadPage = React.lazy(() => import('./pages/HeadToHeadPage'))
const VenuePage = React.lazy(() => import('./pages/VenuePage'))
const ComparisonPage = React.lazy(() => import('./pages/ComparisonPage'))
const AdvancedAnalyticsPage = React.lazy(() => import('./pages/AdvancedAnalyticsPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-96">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/player/:playerName" element={<PlayerStatsPage />} />
            <Route path="/head-to-head/:batter/:bowler" element={<HeadToHeadPage />} />
            <Route path="/venue/:batter/:bowler" element={<VenuePage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/advanced" element={<AdvancedAnalyticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
