import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Calendar, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../../store/cartStore'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'

const primaryLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Brew Lab', path: '/brew' },
  { name: 'About', path: '/about' },
]

const secondaryLinks = [
  { name: 'Rewards', path: '/rewards' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
]

const allLinks = [...primaryLinks, ...secondaryLinks]

function NavLink({ link, isActive, onClick, className = '' }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`font-display font-bold text-xs uppercase tracking-wide whitespace-nowrap rounded-full px-3 py-2 transition-colors duration-200 ${
        isActive(link.path)
          ? 'text-chiya-orange bg-chiya-orange/10'
          : 'text-chiya-ink/80 hover:text-chiya-orange hover:bg-chiya-cream/80'
      } ${className}`}
    >
      {link.name}
    </Link>
  )
}

function CartButton({ count, className = '' }) {
  return (
    <Link
      to="/cart"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}
      className={`relative p-2 rounded-full text-chiya-ink hover:text-chiya-orange hover:bg-chiya-cream/80 transition-colors ${className}`}
    >
      <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          className="absolute -top-0.5 -right-0.5 bg-chiya-pink text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold border border-chiya-ink px-0.5"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </Link>
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)
  const location = useLocation()

  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )

  useBodyScrollLock(isOpen)

  useEffect(() => {
    setIsOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path) => location.pathname === path
  const closeMobile = () => setIsOpen(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 safe-top px-3 sm:px-5 lg:px-8 pointer-events-none">
        <nav
          aria-label="Main navigation"
          className="pointer-events-auto max-w-7xl mx-auto mt-3 sm:mt-4 bg-white/90 backdrop-blur-xl border-2 border-chiya-ink/10 rounded-2xl sm:rounded-full shadow-[0_8px_32px_rgba(26,21,35,0.08)]"
        >
          {/* Main bar — 3-column grid keeps logo & actions aligned */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 h-14 sm:h-[4.25rem] px-3 sm:px-5 lg:px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 justify-self-start">
              <img
                src="/images/logo.png"
                alt=""
                className="h-8 sm:h-9 w-auto shrink-0"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <span className="font-display text-base sm:text-lg font-extrabold text-chiya-ink tracking-tight truncate">
                Chiya-Ghar
              </span>
            </Link>

            {/* Desktop / tablet center nav */}
            <div className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1">
              {primaryLinks.map((link) => (
                <NavLink key={link.path} link={link} isActive={isActive} />
              ))}

              {/* Secondary links — full row on xl, dropdown on md-lg */}
              <div className="hidden xl:contents">
                {secondaryLinks.map((link) => (
                  <NavLink key={link.path} link={link} isActive={isActive} />
                ))}
              </div>

              <div className="relative xl:hidden" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={`font-display font-bold text-xs uppercase tracking-wide flex items-center gap-0.5 rounded-full px-3 py-2 transition-colors cursor-pointer ${
                    secondaryLinks.some((l) => isActive(l.path))
                      ? 'text-chiya-orange bg-chiya-orange/10'
                      : 'text-chiya-ink/80 hover:text-chiya-orange hover:bg-chiya-cream/80'
                  }`}
                >
                  More <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[160px] bg-white border-2 border-chiya-ink/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] py-2 z-50"
                    >
                      {secondaryLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setMoreOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-display font-bold transition-colors ${
                            isActive(link.path)
                              ? 'text-chiya-orange bg-chiya-orange/5'
                              : 'text-chiya-ink hover:bg-chiya-cream'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 justify-self-end">
              <CartButton count={cartItemsCount} />

              <Link
                to="/booking"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-display font-black bg-chiya-orange hover:bg-chiya-pink text-white rounded-full transition-all shadow-[0_4px_14px_rgba(255,90,31,0.25)] hover:scale-[1.02] active:scale-100"
              >
                <Calendar size={14} /> Book
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
                className="md:hidden p-2 rounded-full text-chiya-ink hover:text-chiya-orange hover:bg-chiya-cream/80 transition-colors cursor-pointer"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen drawer — outside pill so layout stays clean */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-chiya-ink/40 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[min(100%,320px)] bg-chiya-cream border-l-4 border-chiya-ink shadow-[-8px_0_40px_rgba(0,0,0,0.15)] flex flex-col md:hidden safe-top safe-bottom"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b-2 border-chiya-ink/10">
                <span className="font-display font-black text-chiya-ink">Menu</span>
                <button
                  type="button"
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="p-2 rounded-full border-2 border-chiya-ink/20 hover:bg-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {allLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={closeMobile}
                      className={`block px-4 py-3.5 rounded-xl text-base font-display font-bold transition-colors ${
                        isActive(link.path)
                          ? 'bg-chiya-orange text-white shadow-[2px_2px_0px_0px_var(--color-ink)]'
                          : 'text-chiya-ink hover:bg-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-4 border-t-2 border-chiya-ink/10 space-y-3">
                <Link
                  to="/booking"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-display font-black text-white bg-chiya-orange border-2 border-chiya-ink shadow-pop"
                >
                  <Calendar size={18} /> Book a Table
                </Link>
                <Link
                  to="/cart"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-display font-bold text-chiya-ink bg-white border-2 border-chiya-ink/20"
                >
                  <ShoppingCart size={18} />
                  View Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
