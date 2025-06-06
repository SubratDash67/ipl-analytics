import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Shield, Eye, Database, Lock, AlertCircle } from 'lucide-react'

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Usage data and analytics to improve our services',
        'Browser information and device type for optimization',
        'Search queries and preferences for personalized experience',
        'No personal identification information is collected'
      ]
    },
    {
      title: 'How We Use Information',
      icon: Eye,
      content: [
        'Improve platform performance and user experience',
        'Analyze usage patterns to enhance features',
        'Provide relevant cricket statistics and insights',
        'Maintain and troubleshoot technical issues'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'All data is stored securely with industry-standard encryption',
        'No sensitive personal information is collected or stored',
        'Regular security audits and updates',
        'Data is processed locally where possible'
      ]
    },
    {
      title: 'Third-Party Services',
      icon: AlertCircle,
      content: [
        'We may use analytics services to understand usage patterns',
        'No data is sold or shared with third parties for marketing',
        'External links may have their own privacy policies',
        'All integrations are carefully vetted for security'
      ]
    }
  ]

  return (
    <>
      <Helmet>
        <title>Privacy Policy - IPL Analytics</title>
        <meta name="description" content="Privacy policy for IPL Analytics platform. Learn how we collect, use, and protect your data." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: June 6, 2025
          </p>
        </div>

        {/* Overview */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Our Commitment to Privacy
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            IPL Analytics is committed to protecting your privacy. This policy explains how we collect, 
            use, and safeguard information when you use our cricket analytics platform. We believe in 
            transparency and your right to understand how your data is handled.
          </p>
        </div>

        {/* Privacy Sections */}
        {sections.map((section, index) => (
          <div key={index} className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <section.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            
            <ul className="space-y-2">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Information */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us through our GitHub repository.
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

export default PrivacyPage
