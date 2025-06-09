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

// Lazy load pages
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

// Create a client with production-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppProvider>
          <Router>
            <ErrorBoundary>
              <Layout>
                <main className="flex-1 py-8">
                  <Suspense 
                    fallback={
                      <div className="flex justify-center items-center min-h-96">
                        <LoadingSpinner size="lg" text="Loading page..." />
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/head-to-head/:batter/:bowler" element={<HeadToHeadPage />} />
                      <Route path="/player/:playerName" element={<PlayerPage />} />
                      <Route path="/compare" element={<ComparisonPage />} />
                      <Route path="/advanced" element={<AdvancedAnalyticsPage />} />
                      <Route path="/venue/:batter/:bowler" element={<VenuePage />} />
                      
                      {/* New routes */}
                      <Route path="/api-docs" element={<ApiDocsPage />} />
                      <Route path="/data-sources" element={<DataSourcesPage />} />
                      <Route path="/methodology" element={<MethodologyPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>
              </Layout>
            </ErrorBoundary>
          </Router>
        </AppProvider>
      </HelmetProvider>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

export default App
