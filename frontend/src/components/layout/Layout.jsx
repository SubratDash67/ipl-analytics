import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Breadcrumbs from './Breadcrumbs'
import { useApp } from '../contexts/AppContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const { theme } = useApp()
  const isHomePage = location.pathname === '/'

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Header />
      {!isHomePage && <Breadcrumbs />}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
