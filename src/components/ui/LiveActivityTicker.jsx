import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ShoppingBag, Calendar } from 'lucide-react'

const activitiesList = [
  { name: 'Prashant', location: 'Lalitpur', action: 'ordered Classic Masala Chiya + Chicken Momo', time: '2m ago', type: 'order' },
  { name: 'Srijana', location: 'Kirtipur', action: 'booked Table 1 (Couple Corner)', time: '5m ago', type: 'booking' },
  { name: 'Ashish', location: 'Thamel', action: 'won 10% OFF on the spin wheel', time: '1m ago', type: 'reward' },
  { name: 'Anish', location: 'Jamsikhel', action: 'ordered Dudh Chiya + Vegetable Samosa', time: '12m ago', type: 'order' },
  { name: 'Rojina', location: 'Baneshwor', action: 'booked Table 5 (Garden Patio)', time: '8m ago', type: 'booking' },
  { name: 'Sagar', location: 'Bhaktapur', action: 'won 20% OFF on the spin wheel', time: '30s ago', type: 'reward' },
  { name: 'Niranjan', location: 'Kalimati', action: 'ordered Kalo Chiya + French Fries', time: '15m ago', type: 'order' }
]

const LiveActivityTicker = () => {
  const [activeActivity, setActiveActivity] = useState(null)

  useEffect(() => {
    // Show first ticker after 6 seconds
    const startDelay = setTimeout(() => {
      showRandomActivity()
    }, 6000)

    // Cycle new ticker every 28 seconds
    const interval = setInterval(() => {
      showRandomActivity()
    }, 28000)

    return () => {
      clearTimeout(startDelay)
      clearInterval(interval)
    }
  }, [])

  const showRandomActivity = () => {
    const randomItem = activitiesList[Math.floor(Math.random() * activitiesList.length)]
    setActiveActivity(randomItem)

    // Hide after 5 seconds
    setTimeout(() => {
      setActiveActivity(null)
    }, 5500)
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none max-w-xs w-full">
      <AnimatePresence>
        {activeActivity && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white/90 backdrop-blur-md border-2 border-chiya-ink rounded-2xl p-4 shadow-[4px_4px_0px_0px_var(--color-ink)] pointer-events-auto flex gap-3 items-start"
          >
            {/* Action Icon */}
            <div className={`p-2 rounded-xl border border-chiya-ink shrink-0 ${
              activeActivity.type === 'order' ? 'bg-chiya-orange/10 text-chiya-orange' :
              activeActivity.type === 'booking' ? 'bg-chiya-yellow/20 text-chiya-orange' :
              'bg-chiya-pink/10 text-chiya-pink'
            }`}>
              {activeActivity.type === 'order' && <ShoppingBag size={14} />}
              {activeActivity.type === 'booking' && <Calendar size={14} />}
              {activeActivity.type === 'reward' && <Sparkles size={14} />}
            </div>

            {/* Details */}
            <div className="text-left text-xs font-sans">
              <p className="font-bold text-chiya-ink">
                {activeActivity.name} <span className="font-medium text-chiya-ink/50">from {activeActivity.location}</span>
              </p>
              <p className="font-medium text-chiya-ink/75 mt-0.5 leading-snug">
                {activeActivity.action}
              </p>
              <span className="text-[10px] font-mono text-chiya-ink/40 block mt-1.5 font-bold uppercase">
                {activeActivity.time}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LiveActivityTicker
