import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AppProvider } from './components/contexts/AppContext'

// Lazy load pages for optimal performance
const HomePage = lazy(() => import('./pages/HomePage'))
const PlayerStatsPage = lazy(() => import('./pages/PlayerPage'))
const HeadToHeadPage = lazy(() => import('./pages/HeadToHeadPage'))
const VenuePage = lazy(() => import('./pages/VenuePage'))
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'))
const AdvancedAnalyticsPage = lazy(() => import('./pages/AdvancedAnalyticsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-96">
    <LoadingSpinner size="lg" />
  </div>
)

function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <ErrorBoundary>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/player/:playerName" element={<PlayerStatsPage />} />
                <Route path="/head-to-head/:batter/:bowler" element={<HeadToHeadPage />} />
                <Route path="/venue/:batter/:bowler" element={<VenuePage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/advanced" element={<AdvancedAnalyticsPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </ErrorBoundary>
      </AppProvider>
    </HelmetProvider>
  )
}

export default App
