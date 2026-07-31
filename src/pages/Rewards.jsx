/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { Gift, Sparkles, Trophy, Lock, Image, Download, Sliders, RefreshCw, Star } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useCartStore from '../store/cartStore'
import useDocumentTitle from '../hooks/useDocumentTitle'
import toast from 'react-hot-toast'

const Rewards = () => {
  useDocumentTitle('Chiya Rewards')
  const applyPromoCode = useCartStore(state => state.applyPromoCode)
  const shouldReduce = useReducedMotion()
  const controls = useAnimation()
  
  const [spinning, setSpinning] = useState(false)
  const [prize, setPrize] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [hasSpun, setHasSpun] = useState(false)
  
  // Cooldown & Daily Limit state
  const [spinLimitReached, setSpinLimitReached] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')

  const sectors = [
    { text: '10% OFF', code: '10_OFF', color: 'bg-chiya-orange text-white' },
    { text: 'TRY AGAIN', code: null, color: 'bg-chiya-ink text-chiya-cream' },
    { text: '15% OFF', code: 'CHIYA_LOVE', color: 'bg-chiya-pink text-white' },
    { text: 'TRY AGAIN', code: null, color: 'bg-chiya-ink text-chiya-cream' },
    { text: '20% OFF', code: 'FREE_MOMO', color: 'bg-chiya-yellow text-chiya-ink' },
    { text: 'TRY AGAIN', code: null, color: 'bg-chiya-ink text-chiya-cream' }
  ]

  // Meme Card Creator state
  const [selectedTea, setSelectedTea] = useState('Classic Masala Chiya')
  const [memeQuote, setMemeQuote] = useState('Chiya over code, always.')
  const [cardGradient, setCardGradient] = useState('bg-gradient-to-br from-chiya-orange to-chiya-pink')
  const [stats, setStats] = useState({
    caffeine: 85,
    sweetness: 60,
    spicy: 75,
    vibes: 95
  })
  
  const cardRef = useRef(null)

  // Check 24-hour limit on load and update countdown
  useEffect(() => {
    const checkLimit = () => {
      const lastSpin = localStorage.getItem('chiya_last_spin')
      if (lastSpin) {
        const timePassed = Date.now() - parseInt(lastSpin)
        const cooldown = 24 * 60 * 60 * 1000 // 24 hours
        
        if (timePassed < cooldown) {
          setSpinLimitReached(true)
          const remaining = cooldown - timePassed
          const hours = Math.floor(remaining / (1000 * 60 * 60))
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
          
          setTimeRemaining(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          )
        } else {
          setSpinLimitReached(false)
        }
      }
    }

    checkLimit()
    const timer = setInterval(checkLimit, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSpin = async () => {
    if (spinning || hasSpun || spinLimitReached) return
    setSpinning(true)

    // Select a random sector that isn't 'TRY AGAIN' for better UX!
    const winningOptions = [0, 2, 4] // 10%, 15%, 20%
    const winIndex = winningOptions[Math.floor(Math.random() * winningOptions.length)]
    const sectorAngle = 360 / sectors.length
    
    // Spin multiple times plus offset to target index
    const totalRotation = 360 * 5 - (winIndex * sectorAngle) - (sectorAngle / 2)

    if (shouldReduce) {
      setPrize(sectors[winIndex])
      setPromoCode(sectors[winIndex].code)
      setHasSpun(true)
      setSpinning(false)
      
      localStorage.setItem('chiya_last_spin', Date.now().toString())
      setSpinLimitReached(true)
      
      toast.success(`You won: ${sectors[winIndex].text}!`)
      return
    }

    await controls.start({
      rotate: totalRotation,
      transition: { duration: 4, ease: [0.25, 0.1, 0.25, 1] }
    })

    setPrize(sectors[winIndex])
    setPromoCode(sectors[winIndex].code)
    setHasSpun(true)
    setSpinning(false)
    
    localStorage.setItem('chiya_last_spin', Date.now().toString())
    setSpinLimitReached(true)
    
    toast.success(`Congratulations! You won: ${sectors[winIndex].text}!`, { icon: '🎉' })
  }

  const handleClaim = () => {
    if (!promoCode) return
    const success = applyPromoCode(promoCode)
    if (success) {
      toast.success(`Promo code "${promoCode}" applied to your cart!`, { icon: '🎟️' })
    } else {
      toast.error('Invalid promo code.')
    }
  }

  const handleDownloadMemeCard = () => {
    toast.success('Meme card saved! Share it with your friends! 📸', { icon: '⚡' })
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4 flex items-center justify-center gap-2">
            <Gift className="text-chiya-pink animate-bounce" size={36} /> Chiya Rewards Lab
          </h1>
          <p className="text-chiya-ink/75 max-w-lg mx-auto font-sans font-medium text-sm">
            Spin the wheel once a day to win discount promo codes, or customize your own tea review cards.
          </p>
        </div>

        {/* Section 1: Spin Wheel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Wheel Visual */}
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 rounded-full border-4 border-chiya-ink bg-white shadow-[8px_8px_0px_0px_var(--color-ink)] flex items-center justify-center overflow-hidden">
              
              {/* Pointer */}
              <div className="absolute top-0 z-20 w-4 h-8 bg-chiya-pink border-2 border-chiya-ink rounded-b-full shadow-md" style={{ transform: 'translateX(-50%)', left: '50%' }} />

              <motion.div
                animate={controls}
                className="w-full h-full relative rounded-full"
                style={{ transformOrigin: 'center' }}
              >
                {sectors.map((sec, idx) => {
                  const rotation = idx * (360 / sectors.length)
                  return (
                    <div
                      key={idx}
                      className="absolute inset-0"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        clipPath: 'polygon(50% 50%, 30% 0, 70% 0)'
                      }}
                    >
                      <div className={`w-full h-full flex justify-center pt-8 font-display font-extrabold text-xs ${sec.color}`}>
                        <span style={{ transform: 'rotate(90deg) translateY(-10px)' }} className="origin-center block">
                          {sec.text}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </motion.div>

              {/* Pin Center Button */}
              <button
                onClick={handleSpin}
                disabled={spinning || hasSpun || spinLimitReached}
                className={`absolute z-30 w-16 h-16 rounded-full border-4 border-chiya-ink flex items-center justify-center font-display font-black text-xs shadow-[2px_2px_0px_0px_var(--color-ink)] cursor-pointer transition-all ${
                  spinning 
                    ? 'bg-gray-200 text-gray-400' 
                    : spinLimitReached 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : hasSpun 
                    ? 'bg-chiya-pink text-white' 
                    : 'bg-chiya-yellow text-chiya-ink hover:bg-chiya-orange hover:text-white'
                }`}
              >
                {spinning ? 'SPIN...' : spinLimitReached ? 'LOCKED' : hasSpun ? 'WON!' : 'SPIN'}
              </button>
            </div>
            
            {/* Countdown / Status display */}
            {spinLimitReached && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white/70 backdrop-blur border border-chiya-ink/10 rounded-2xl p-4 flex items-center gap-3 shadow-md"
              >
                <Lock size={18} className="text-chiya-pink animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-display font-black text-chiya-ink/50 uppercase tracking-wide">Next Spin Available In</p>
                  <p className="text-lg font-display font-black text-chiya-pink font-mono">{timeRemaining}</p>
                </div>
              </motion.div>
            )}

            {hasSpun && prize && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6 font-display font-black text-xl text-chiya-orange flex items-center gap-1.5"
              >
                <Trophy size={20} /> You won: {prize.text}!
              </motion.div>
            )}
          </div>

          {/* Form & Claim Details */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-chiya-ink rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)]">
              <h3 className="text-xl font-display font-black mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-chiya-yellow" /> Redeem Promo Code
              </h3>
              
              <div className="space-y-4">
                <p className="text-sm font-sans font-medium text-chiya-ink/75">
                  Enter your winning code below or type any valid promo code (e.g. <code className="bg-chiya-cream px-1.5 py-0.5 rounded text-chiya-orange font-bold font-sans">CHIYA_LOVE</code>) to apply your discount.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-grow px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-orange/20 font-display font-bold"
                  />
                  <button
                    onClick={handleClaim}
                    type="button"
                    className="btn-primary py-3 px-6 shadow-pop shrink-0"
                  >
                    Apply Code
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-chiya-teal/10 border-2 border-chiya-ink rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] space-y-4">
              <h3 className="text-lg font-display font-black text-chiya-teal">Chiya Club Rules</h3>
              <ul className="space-y-2 text-xs font-sans font-bold text-chiya-ink/80 list-disc list-inside">
                <li>Strictly one spin per customer every 24 hours.</li>
                <li>Discounts apply to cart totals on checkout.</li>
                <li>Discounts cannot be combined with other offers.</li>
              </ul>
            </div>

            <div className="bg-chiya-yellow/15 border-2 border-chiya-ink rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] space-y-4 text-left">
              <h3 className="text-lg font-display font-black text-chiya-orange flex items-center gap-1.5">🕹️ Secret Momo Game</h3>
              <p className="text-xs font-sans font-medium text-chiya-ink/75">
                Play our retro Momo Catch arcade challenge and score 10 points to unlock a secret 25% OFF discount code!
              </p>
              <Link
                to="/game"
                className="w-full btn-primary py-3 justify-center text-xs shadow-[2px_2px_0px_0px_var(--color-ink)] inline-flex items-center"
              >
                Launch Momo Catcher
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Meme Card Creator */}
        <div className="border-t-4 border-chiya-ink/10 pt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-black text-chiya-ink mb-2 flex items-center justify-center gap-2">
              <Image className="text-chiya-orange" size={28} /> Chiya Review Card Creator
            </h2>
            <p className="text-chiya-ink/75 max-w-lg mx-auto font-sans font-medium text-sm">
              Generate customizable review cards of your favorite drinks to share with your friends.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Live Card Preview */}
            <div className="flex flex-col items-center">
              <motion.div
                ref={cardRef}
                whileHover={{ rotateY: 10, rotateX: -5 }}
                style={{ perspective: 1000 }}
                className={`w-80 h-[450px] ${cardGradient} border-4 border-chiya-ink rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_var(--color-ink)] text-white relative z-10 flex flex-col justify-between overflow-hidden`}
              >
                <div>
                  {/* Badge Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-display font-black uppercase tracking-wider bg-white/20 border border-white/30 px-3 py-1 rounded-full backdrop-blur">
                      ☕ Chiya Card
                    </span>
                    <div className="flex gap-0.5 text-chiya-yellow">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-display font-black leading-tight mb-2">
                    {selectedTea}
                  </h3>
                  
                  {/* Stats bars */}
                  <div className="space-y-3.5 mt-6">
                    {[
                      { key: 'caffeine', label: '⚡ Caffeine Vibe', val: stats.caffeine },
                      { key: 'sweetness', label: '🍯 Sweetness', val: stats.sweetness },
                      { key: 'spicy', label: '🌶️ Spice Blend', val: stats.spicy },
                      { key: 'vibes', label: '💖 Overall Vibe', val: stats.vibes }
                    ].map((stat) => (
                      <div key={stat.key} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-display font-bold">
                          <span>{stat.label}</span>
                          <span>{stat.val}%</span>
                        </div>
                        <div className="bg-white/20 h-2 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: `${stat.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meme Quote */}
                <div className="border-t border-white/20 pt-4 text-center">
                  <p className="text-sm font-display font-extrabold italic leading-relaxed">
                    "{memeQuote}"
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Controls panel */}
            <div className="bg-white border-2 border-chiya-ink rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_var(--color-ink)] space-y-6">
              <h3 className="text-xl font-display font-black flex items-center gap-2">
                <Sliders size={20} className="text-chiya-pink" /> Customize Options
              </h3>

              {/* Selector */}
              <div>
                <label className="block text-xs font-display font-extrabold uppercase text-chiya-ink/50 mb-2">Select Drink</label>
                <select
                  value={selectedTea}
                  onChange={(e) => setSelectedTea(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none font-bold text-sm bg-white"
                >
                  <option>Classic Masala Chiya</option>
                  <option>Dudh Chiya</option>
                  <option>Kalo Chiya</option>
                  <option>Lemon Ginger Chiya</option>
                  <option>Honey Lemon Ginger Chiya</option>
                  <option>Pudina Chiya</option>
                </select>
              </div>

              {/* Meme Text Input */}
              <div>
                <label className="block text-xs font-display font-extrabold uppercase text-chiya-ink/50 mb-2">Meme Quote / Caption</label>
                <input
                  type="text"
                  maxLength={40}
                  value={memeQuote}
                  onChange={(e) => setMemeQuote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none font-bold text-sm"
                  placeholder="e.g. Chiya is the answer."
                />
              </div>

              {/* Stats Sliders */}
              <div className="space-y-4 pt-2">
                {[
                  { key: 'caffeine', label: 'Caffeine Power' },
                  { key: 'sweetness', label: 'Sweetness level' },
                  { key: 'spicy', label: 'Spice factor' },
                  { key: 'vibes', label: 'Cozy vibes' }
                ].map((stat) => (
                  <div key={stat.key}>
                    <div className="flex justify-between text-[11px] font-display font-black text-chiya-ink mb-1.5">
                      <span>{stat.label}</span>
                      <span className="text-chiya-orange">{stats[stat.key]}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={stats[stat.key]}
                      onChange={(e) => setStats({ ...stats, [stat.key]: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-chiya-ink/10 rounded-lg appearance-none cursor-pointer accent-chiya-pink"
                    />
                  </div>
                ))}
              </div>

              {/* Background Theme Preset */}
              <div>
                <label className="block text-xs font-display font-extrabold uppercase text-chiya-ink/50 mb-2">Background gradient</label>
                <div className="flex gap-2">
                  {[
                    { id: 'sunset', bg: 'bg-gradient-to-br from-chiya-orange to-chiya-pink', label: 'Sunset' },
                    { id: 'mint', bg: 'bg-gradient-to-br from-chiya-teal to-chiya-ink', label: 'Mint' },
                    { id: 'cyber', bg: 'bg-gradient-to-br from-chiya-pink to-purple-600', label: 'Cyber' },
                    { id: 'honey', bg: 'bg-gradient-to-br from-chiya-yellow to-chiya-orange', label: 'Honey' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setCardGradient(preset.bg)}
                      className={`w-10 h-10 rounded-xl border-2 border-chiya-ink cursor-pointer transition-all ${preset.bg} ${cardGradient === preset.bg ? 'scale-110 shadow-pop' : ''}`}
                      title={preset.label}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownloadMemeCard}
                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
              >
                <Download size={16} /> Save Meme Card
              </button>
            </div>
          </div>
        </div>

      </div>
    </AnimatedPage>
  )
}

export default Rewards
