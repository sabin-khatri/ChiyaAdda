/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Utensils, LogOut, Menu as MenuIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../store/authStore'

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const handleLogout = () => {
    navigate('/')
    setTimeout(() => {
      logout()
    }, 100)
  }

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Menu', path: '/admin/menu', icon: <Utensils size={20} /> },
  ]

  const SidebarContent = ({ collapsed = false }) => (
    <>
      <div className={`p-6 border-b border-primary-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <h2 className="text-xl font-serif font-bold whitespace-nowrap">Chiya-Ghar</h2>}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === link.path ? 'bg-primary-700 font-bold' : 'hover:bg-primary-700'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? link.name : ''}
          >
            <div className="shrink-0">{link.icon}</div>
            {!collapsed && <span className="whitespace-nowrap">{link.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-700">
        <button 
          onClick={handleLogout}
          title={collapsed ? 'Exit Admin' : ''}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-red-300 hover:text-white ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="shrink-0"><LogOut size={20} /></div>
          {!collapsed && <span className="whitespace-nowrap">Exit Admin</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-primary-800 text-white flex items-center px-4 z-20 shadow-md justify-between">
        <h2 className="text-xl font-serif font-bold">Chiya-Ghar Admin</h2>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Desktop Sidebar (Animated Width) */}
      <motion.aside 
        initial={false}
        animate={{ width: isDesktopCollapsed ? 80 : 256 }}
        className="hidden md:flex bg-primary-800 text-white flex-col h-full z-10 relative shadow-xl"
      >
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="absolute -right-3 top-8 bg-primary-600 text-white rounded-full p-1 shadow-md hover:bg-primary-500 transition-colors z-50"
        >
          {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <SidebarContent collapsed={isDesktopCollapsed} />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-primary-800 text-white flex flex-col z-40 md:hidden shadow-2xl"
            >
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 w-full bg-gray-50 relative">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
