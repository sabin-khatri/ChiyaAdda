/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useDocumentTitle from '../hooks/useDocumentTitle'

const NotFound = () => {
  useDocumentTitle('Page Not Found')

  return (
    <AnimatedPage className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-9xl font-serif font-bold text-primary-200 mb-8"
        >
          404
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Oops! Tea spilled.
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-8"
        >
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl font-medium border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          
          <Link 
            to="/"
            className="px-6 py-3 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} /> Home Page
          </Link>
        </motion.div>
      </div>
    </AnimatedPage>
  )
}

export default NotFound
