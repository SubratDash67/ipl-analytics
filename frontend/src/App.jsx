import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
)

// Simple test page
const HomePage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        IPL Analytics
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Cricket analytics platform is now live!
      </p>
      <div className="space-y-4">
        <div>
          <a 
            href="https://ipl-analytics-backend-api.onrender.com/health"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Test Backend API
          </a>
        </div>
        <div>
          <a 
            href="https://ipl-analytics-backend-api.onrender.com/api/data/summary"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
          >
            Test Data API
          </a>
        </div>
      </div>
    </div>
  </div>
)

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </Router>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
