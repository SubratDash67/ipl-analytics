import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Github, ExternalLink, BarChart3, Target, Users, Zap } from 'lucide-react'

const AboutPage = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Head-to-Head Analysis',
      description: 'Detailed statistical comparison between any batter and bowler combination'
    },
    {
      icon: Users,
      title: 'Player Comparison',
      description: 'Side-by-side comparison of multiple players with comprehensive metrics'
    },
    {
      icon: Target,
      title: 'Advanced Analytics',
      description: 'Partnership analysis, phase analysis, form trends, and win probability'
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Live statistics and performance metrics with interactive visualizations'
    }
  ]

  const technologies = [
    { name: 'React 18', category: 'Frontend' },
    { name: 'Flask', category: 'Backend' },
    { name: 'SQLite', category: 'Database' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Recharts', category: 'Visualization' },
    { name: 'React Query', category: 'Data Fetching' }
  ]

  return (
    <>
      <Helmet>
        <title>About - IPL Analytics</title>
        <meta name="description" content="Learn about IPL Analytics platform, its features, technology stack, and the team behind comprehensive cricket statistics analysis." />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="IPL Analytics Logo" 
              className="h-20 w-20 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <BarChart3 className="h-20 w-20 text-blue-600 hidden" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            About IPL Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive cricket analytics platform providing in-depth statistical analysis, 
            player comparisons, and match insights from 17 seasons of Indian Premier League cricket.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            To democratize cricket analytics by providing accessible, accurate, and comprehensive 
            statistical insights that help fans, analysts, and cricket enthusiasts better understand 
            the beautiful game of cricket through data-driven analysis.
          </p>
        </div>

        {/* Features */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Platform Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Technology Stack
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tech.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {tech.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Section */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Developer
          </h2>
          
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SD</span>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Subrat Dash
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Full-stack developer passionate about cricket analytics and data visualization. 
                Experienced in building scalable web applications with modern technologies.
              </p>
              
              <a
                href="https://github.com/SubratDash67"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>SubratDash67</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Data Coverage */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Coverage
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                17
              </div>
              <div className="text-gray-600 dark:text-gray-300">Seasons</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">2008-2024</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Matches</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">All formats</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                800+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Players</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Batters & Bowlers</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                250K+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Deliveries</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Ball-by-ball</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Get Involved
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This is an open-source project. Contributions, suggestions, and feedback are welcome!
            </p>
            
            <a
              href="https://github.com/SubratDash67"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Github className="h-4 w-4" />
              <span>Contribute on GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                © {new Date().getFullYear()} IPL Analytics. All rights reserved.
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Built with ❤️ for cricket analytics enthusiasts
              </div>
            </div>
          </div>
        </footer>
      </div>
      </>
  )
  }
