import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../../store/cartStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  const items = useCartStore(state => state.items)
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Brew Lab', path: '/brew' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="fixed top-4 left-0 w-full z-50 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto bg-white/75 backdrop-blur-lg border border-chiya-ink/10 rounded-full px-6 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/images/logo.png" alt="Chiya-Ghar Logo" className="h-9 w-auto" onError={(e) => e.target.style.display = 'none'} />
            <span className="font-display text-lg font-extrabold text-chiya-ink tracking-tight">Chiya-Ghar</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-display font-bold text-xs uppercase tracking-wider transition duration-300 ${isActive(link.path) ? 'text-chiya-orange' : 'text-chiya-ink hover:text-chiya-orange'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Cart & Book Table CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-chiya-ink hover:text-chiya-orange transition">
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <motion.span 
                  key={cartItemsCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                  className="absolute -top-1 -right-1 bg-chiya-pink text-white text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold border border-chiya-ink"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Link>
            
            <Link to="/booking" className="px-5 py-2.5 text-xs font-display font-black bg-chiya-orange hover:bg-chiya-pink text-white rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_4px_14px_rgba(255,90,31,0.25)] hover:shadow-lg hover:scale-105 active:scale-100">
              <Calendar size={14} /> Book Table
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="lg:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-chiya-ink">
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <motion.span 
                  key={`mobile-${cartItemsCount}`}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                  className="absolute -top-1 -right-1 bg-chiya-pink text-white text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold border border-chiya-ink"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-chiya-ink hover:text-chiya-orange focus:outline-none cursor-pointer">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-chiya-cream border-t-2 border-chiya-ink/10 mt-3 pt-3 pb-2 space-y-1 rounded-2xl overflow-hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-display font-bold ${isActive(link.path) ? 'bg-chiya-orange/10 text-chiya-orange' : 'text-chiya-ink hover:bg-chiya-cream/55'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/booking"
                className="block px-4 py-2.5 rounded-xl text-sm font-display font-black text-chiya-orange bg-chiya-yellow/30 border border-chiya-orange/30 mt-2"
                onClick={() => setIsOpen(false)}
              >
                📅 Book a Table
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  )
}

export default Navbar
