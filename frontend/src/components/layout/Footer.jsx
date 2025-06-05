import React from 'react'
import { Github, Database } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <Database className="h-4 w-4" />
            <span className="text-sm">
              IPL Ball-by-Ball Data (2008-2024)
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">
              Built with React & Python
            </span>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
