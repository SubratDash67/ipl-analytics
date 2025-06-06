import React from 'react'
import { Link } from 'react-router-dom'
import { Github, ExternalLink, BarChart3 } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Resources',
      links: [
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Data Sources', href: '/data-sources' },
        { name: 'Methodology', href: '/methodology' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="IPL Analytics Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <BarChart3 className="h-6 w-6 text-blue-400 hidden" />
              <span className="text-xl font-bold">IPL Analytics</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Comprehensive IPL cricket analytics platform providing in-depth statistical analysis, 
              player comparisons, and match insights from 2008-2024.
            </p>
            
            {/* GitHub Profile */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/SubratDash67"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>SubratDash67</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} IPL Analytics. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm mt-4 md:mt-0">
              Built with ❤️ for cricket analytics enthusiasts
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
