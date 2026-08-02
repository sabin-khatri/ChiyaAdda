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
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Orders Queue', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { name: 'Menu Editor', path: '/admin/menu', icon: <Utensils size={18} /> },
  ]

  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Sidebar Header */}
        <div className={`p-6 border-b border-white/10 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-white tracking-wider">
                ☕ CHIYA HUB
              </span>
            </Link>
          )}
          <button className="md:hidden text-white cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const active = location.pathname === link.path
            return (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  active 
                    ? 'bg-chiya-orange text-white border-chiya-ink shadow-[2px_2px_0px_0px_var(--color-ink)]' 
                    : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? link.name : ''}
              >
                <div className="shrink-0">{link.icon}</div>
                {!collapsed && <span className="font-display font-bold text-xs uppercase tracking-wide">{link.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Exit Button */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          title={collapsed ? 'Exit Admin' : ''}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-transparent hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="shrink-0"><LogOut size={18} /></div>
          {!collapsed && <span className="font-display font-bold text-xs uppercase tracking-wide">Exit Console</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-chiya-cream overflow-hidden">
      
      {/* Mobile Header Banner */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-chiya-ink text-white flex items-center px-4 z-20 shadow-md justify-between border-b-2 border-chiya-ink">
        <h2 className="font-display font-black text-sm tracking-wider uppercase">☕ Chiya Console</h2>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 cursor-pointer">
          <MenuIcon size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isDesktopCollapsed ? 80 : 240 }}
        className="hidden md:flex bg-chiya-ink text-white flex-col h-full z-10 relative border-r-2 border-chiya-ink"
      >
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="absolute -right-3 top-8 bg-chiya-orange text-white rounded-full p-1 border-2 border-chiya-ink shadow-md hover:bg-chiya-pink transition-colors z-50 cursor-pointer"
        >
          {isDesktopCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
        <SidebarContent collapsed={isDesktopCollapsed} />
      </motion.aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-60 bg-chiya-ink text-white flex flex-col z-40 md:hidden shadow-2xl"
            >
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Console Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 pt-20 md:pt-10 w-full bg-chiya-cream/35 relative">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
