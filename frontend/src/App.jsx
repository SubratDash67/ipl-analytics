import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

import { AppProvider } from './components/contexts/AppContext'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'
import ApiWarmingScreen from './components/common/ApiWarmingScreen'
import { useApiStatus } from './hooks/useApiStatus'

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const HeadToHeadPage = React.lazy(() => import('./pages/HeadToHeadPage'))
const PlayerPage = React.lazy(() => import('./pages/PlayerPage'))
const ComparisonPage = React.lazy(() => import('./pages/ComparisonPage'))
const AdvancedAnalyticsPage = React.lazy(() => import('./pages/AdvancedAnalyticsPage'))
const VenuePage = React.lazy(() => import('./pages/VenuePage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

// New pages
const ApiDocsPage = React.lazy(() => import('./pages/ApiDocsPage'))
const DataSourcesPage = React.lazy(() => import('./pages/DataSourcesPage'))
const MethodologyPage = React.lazy(() => import('./pages/MethodologyPage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'))
const TermsPage = React.lazy(() => import('./pages/TermsPage'))

// Create React Query client with production-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
})

// Loading component for Suspense fallback
const PageLoader = ({ text = "Loading page..." }) => (
  <div className="flex justify-center items-center min-h-96">
    <LoadingSpinner size="lg" text={text} />
  </div>
)

// Main App Content Component
const AppContent = () => {
  const { isApiReady, isChecking, attempts, error, retryApiCheck } = useApiStatus()

  // Show warming screen while API is not ready
  if (!isApiReady) {
    return (
      <ApiWarmingScreen 
        isChecking={isChecking}
        attempts={attempts}
        error={error}
        onRetry={retryApiCheck}
      />
    )
  }

  // Show main app once API is ready
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <main className="flex-1 py-8">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main application routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/head-to-head/:batter/:bowler" element={<HeadToHeadPage />} />
                <Route path="/player/:playerName" element={<PlayerPage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/advanced" element={<AdvancedAnalyticsPage />} />
                <Route path="/venue/:batter/:bowler" element={<VenuePage />} />
                
                {/* Information pages */}
                <Route path="/api-docs" element={<ApiDocsPage />} />
                <Route path="/data-sources" element={<DataSourcesPage />} />
                <Route path="/methodology" element={<MethodologyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                
                {/* Catch all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
        </Layout>
      </ErrorBoundary>
    </Router>
  )
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </HelmetProvider>

      {/* Toast notifications with custom styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: '',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
            borderRadius: '0.5rem',
            padding: '16px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              background: 'var(--toast-success-bg)',
              color: 'var(--toast-success-color)',
              border: '1px solid var(--toast-success-border)',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: 'var(--toast-error-bg)',
              color: 'var(--toast-error-color)',
              border: '1px solid var(--toast-error-border)',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: 'var(--toast-loading-bg)',
              color: 'var(--toast-loading-color)',
              border: '1px solid var(--toast-loading-border)',
            },
          },
        }}
      />

      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}

export default App
