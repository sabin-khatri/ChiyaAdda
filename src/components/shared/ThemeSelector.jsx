import React, { useState, useEffect } from 'react'
import { Palette, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ThemeSelector = () => {
  const [activeTheme, setActiveTheme] = useState('cream')
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { id: 'cream', name: 'Cream Tea', bg: 'bg-[#FFF6ED]', border: 'border-[#2B2118]' },
    { id: 'midnight', name: 'Midnight Brew', bg: 'bg-[#14141E]', border: 'border-[#EEEEEE]' },
    { id: 'pink', name: 'Sakura Pink', bg: 'bg-[#FFF0F5]', border: 'border-[#3A0F1D]' }
  ]

  useEffect(() => {
    // Load from local storage
    const savedTheme = localStorage.getItem('chiya-theme') || 'cream'
    setActiveTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeId) => {
    const body = document.body
    body.classList.remove('theme-midnight', 'theme-pink')
    if (themeId !== 'cream') {
      body.classList.add(`theme-${themeId}`)
    }
  }

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId)
    applyTheme(themeId)
    localStorage.setItem('chiya-theme', themeId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 safe-bottom">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-white border-2 border-chiya-ink p-3 rounded-2xl shadow-pop flex flex-col gap-2.5 min-w-[150px]"
          >
            <p className="text-[10px] font-display font-extrabold uppercase tracking-wider text-chiya-ink/50 border-b border-chiya-ink/10 pb-1.5 px-1">
              Select Theme
            </p>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded-xl font-display font-bold text-xs hover:bg-chiya-cream cursor-pointer transition ${activeTheme === t.id ? 'text-chiya-orange' : 'text-chiya-ink'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${t.bg} border-2 ${t.border} inline-block`} />
                  {t.name}
                </div>
                {activeTheme === t.id && <Check size={12} className="text-chiya-orange" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-chiya-yellow border-2 border-chiya-ink rounded-full flex items-center justify-center text-chiya-ink shadow-pop hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
        aria-label="Toggle Theme Menu"
      >
        <Palette size={20} />
      </button>
    </div>
  )
}

export default ThemeSelector
