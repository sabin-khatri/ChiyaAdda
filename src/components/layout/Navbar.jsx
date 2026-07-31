/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Calendar } from 'lucide-react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import useCartStore from '../../store/cartStore'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Vibe Match', path: '/match' },
  { name: 'Brew Lab', path: '/brew' },
  { name: 'Rewards', path: '/rewards' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
]
function OutlineNavGroup({ isActive }) {
  const navRef = useRef(null)
  const [hoverX, setHoverX] = useState(null)
  const location = useLocation()

  // Track active index based on route match
  const activeIndex = navLinks.findIndex((link) => isActive(link.path))

  const spotlightX = useRef(0)
  const ambienceX = useRef(0)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect()
      const x = e.clientX - rect.left
      setHoverX(x)
      spotlightX.current = x
      nav.style.setProperty('--spotlight-x', `${x}px`)
    }

    const handleMouseLeave = () => {
      setHoverX(null)
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`)
      if (activeItem) {
        const navRect = nav.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()
        const targetX = itemRect.left - navRect.left + itemRect.width / 2

        animate(spotlightX.current, targetX, {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v
            nav.style.setProperty('--spotlight-x', `${v}px`)
          },
        })
      }
    }

    nav.addEventListener('mousemove', handleMouseMove)
    nav.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove)
      nav.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [activeIndex])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`)

    if (activeItem) {
      const navRect = nav.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const targetX = itemRect.left - navRect.left + itemRect.width / 2

      animate(ambienceX.current, targetX, {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v
          nav.style.setProperty('--ambience-x', `${v}px`)
        },
      })
    }
  }, [activeIndex])

  return (
    <div
      ref={navRef}
      className="relative flex items-center h-11 rounded-full bg-white/70 backdrop-blur-md border border-chiya-ink/10 shadow-sm overflow-hidden"
      style={{
        '--spotlight-color': 'rgba(255, 90, 31, 0.1)',
        '--ambience-color': '#FF5A1F'
      }}
    >
      {/* 1. Moving Spotlight (Follows Mouse) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
        style={{
          opacity: hoverX !== null ? 1 : 0,
          background: `
            radial-gradient(
              120px circle at var(--spotlight-x) 100%, 
              var(--spotlight-color) 0%, 
              transparent 60%
            )
          `
        }}
      />

      {/* 2. Active State Ambience (Stays on Active) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[3px] z-[2]"
        style={{
          background: `
            radial-gradient(
              60px circle at var(--ambience-x) 0%, 
              var(--ambience-color) 0%, 
              transparent 100%
            )
          `,
          filter: 'drop-shadow(0 0 6px var(--ambience-color))'
        }}
      />

      {/* Content */}
      <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
        {navLinks.map((link, idx) => {
          const active = activeIndex === idx
          return (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <Link
                to={link.path}
                data-index={idx}
                className={`px-4 py-2 font-display font-bold text-xs uppercase tracking-wide transition-colors duration-200 rounded-full ${
                  active ? 'text-chiya-orange' : 'text-chiya-ink/60 hover:text-chiya-ink'
                }`}
              >
                {link.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function CartButton({ count, className = '' }) {
  return (
    <Link
      to="/cart"
      aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}
      className={`relative p-2 rounded-full text-chiya-ink bg-chiya-cream/60 border border-chiya-ink/10 hover:text-chiya-orange hover:bg-chiya-cream transition-colors ${className}`}
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
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )

  useBodyScrollLock(isOpen)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path
  const closeMobile = () => setIsOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 safe-top w-full transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_24px_rgba(26,21,35,0.1)] border-b border-chiya-ink/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className={`w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-out ${
            isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}
        >
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

          {/* Desktop / large-tablet center nav — bracket outline-trace hover effect */}
          <div className="hidden lg:flex items-center justify-center">
            <OutlineNavGroup isActive={isActive} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
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
              className="lg:hidden p-2 rounded-full text-chiya-ink hover:text-chiya-orange hover:bg-chiya-cream/80 transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile / tablet full-screen drawer (shown below lg, where the row of 8 links won't fit) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-chiya-ink/40 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[min(100%,320px)] bg-chiya-cream border-l-4 border-chiya-ink shadow-[-8px_0_40px_rgba(0,0,0,0.15)] flex flex-col lg:hidden safe-top safe-bottom"
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
                {navLinks.map((link, i) => (
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