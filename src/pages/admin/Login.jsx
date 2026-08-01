/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, ArrowRight } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const success = login(username, password)
    if (success) {
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-500"></div>
        
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 mt-4">Admin Portal</h1>
          <p className="text-gray-500 mb-4">Sign in to manage Chiya-Ghar</p>
          
          <button 
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1 mx-auto text-sm"
          >
            ← Back to Home
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            Login to Dashboard <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Use admin / admin123 for demo</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
