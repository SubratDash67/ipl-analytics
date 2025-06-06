import React from 'react'
import { Helmet } from 'react-helmet-async'
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const TermsPage = () => {
  const terms = [
    {
      title: 'Acceptable Use',
      icon: CheckCircle,
      type: 'allowed',
      content: [
        'Use the platform for cricket analysis and research',
        'Share insights and statistics from the platform',
        'Access data for educational and non-commercial purposes',
        'Provide feedback and suggestions for improvement'
      ]
    },
    {
      title: 'Prohibited Activities',
      icon: XCircle,
      type: 'prohibited',
      content: [
        'Attempt to reverse engineer or hack the platform',
        'Use automated scripts to scrape large amounts of data',
        'Redistribute or resell platform data commercially',
        'Interfere with platform security or functionality'
      ]
    },
    {
      title: 'Data Usage Rights',
      icon: FileText,
      type: 'info',
      content: [
        'Cricket statistics are provided for informational purposes',
        'Data accuracy is maintained but not guaranteed',
        'Platform may be updated or modified without notice',
        'Users retain rights to their own analysis and insights'
      ]
    },
    {
      title: 'Disclaimers',
      icon: AlertTriangle,
      type: 'warning',
      content: [
        'Platform is provided "as is" without warranties',
        'Cricket data may contain errors or omissions',
        'Platform availability is not guaranteed',
        'Users are responsible for verifying critical information'
      ]
    }
  ]

  const getCardStyle = (type) => {
    switch (type) {
      case 'allowed':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10'
      case 'prohibited':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10'
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'allowed':
        return 'text-green-600 dark:text-green-400'
      case 'prohibited':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  return (
    <>
      <Helmet>
        <title>Terms of Service - IPL Analytics</title>
        <meta name="description" content="Terms of service for IPL Analytics platform. Understand your rights and responsibilities when using our cricket analytics platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: June 6, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Welcome to IPL Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            By accessing and using IPL Analytics, you agree to be bound by these Terms of Service. 
            These terms govern your use of our cricket analytics platform and services. Please read 
            them carefully before using our platform.
          </p>
        </div>

        {/* Terms Sections */}
        {terms.map((section, index) => (
          <div key={index} className={`card ${getCardStyle(section.type)}`}>
            <div className="flex items-center mb-4">
              <section.icon className={`h-6 w-6 mr-3 ${getIconColor(section.type)}`} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            
            <ul className="space-y-2">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                  <div className={`w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0 ${
                    section.type === 'allowed' ? 'bg-green-500' :
                    section.type === 'prohibited' ? 'bg-red-500' :
                    section.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Additional Terms */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Additional Terms
          </h2>
          
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Modifications</h3>
              <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Termination</h3>
              <p>We may terminate or suspend access to our platform at any time, without prior notice, for conduct that violates these terms.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Governing Law</h3>
              <p>These terms are governed by applicable laws. Any disputes will be resolved through appropriate legal channels.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you have any questions about these Terms of Service, please contact us through our GitHub repository.
          </p>
          <a
            href="https://github.com/SubratDash67"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contact via GitHub
          </a>
        </div>
      </div>
    </>
  )
}

export default TermsPage
