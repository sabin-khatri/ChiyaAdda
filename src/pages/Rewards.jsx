import React, { useState } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { Gift, Sparkles, RefreshCw, Trophy } from 'lucide-react'
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

  const sectors = [
    { text: '10% OFF', code: '10_OFF', color: 'bg-chiya-orange text-white' },
    { text: 'TRY AGAIN', code: null, color: 'bg-chiya-ink text-chiya-cream' },
    { text: '15% OFF', code: 'CHIYA_LOVE', color: 'bg-chiya-pink text-white' },
    { text: 'TRY AGAIN', code: null, color: 'bg-chiya-ink text-chiya-cream' },
    { text: '20% OFF', code: 'FREE_MOMO', color: 'bg-chiya-yellow text-chiya-ink' },
    { text: 'TRY AGAIN', code: null, color: 'bg-chiya-ink text-chiya-cream' },
  ]

  const handleSpin = async () => {
    if (spinning || hasSpun) return
    setSpinning(true)

    // Select a random sector that isn't 'TRY AGAIN' for better demo reward UX!
    const winningOptions = [0, 2, 4] // 10%, 15%, 20%
    const winIndex = winningOptions[Math.floor(Math.random() * winningOptions.length)]
    const sectorAngle = 360 / sectors.length
    
    // Spin multiple times plus offset to target index
    const totalRotation = 360 * 5 - (winIndex * sectorAngle) - (sectorAngle / 2)

    if (shouldReduce) {
      // Instant win for accessibility
      setPrize(sectors[winIndex])
      setPromoCode(sectors[winIndex].code)
      setHasSpun(true)
      setSpinning(false)
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

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4 flex items-center justify-center gap-2">
            <Gift className="text-chiya-pink" size={36} /> Chiya Rewards Lab
          </h1>
          <p className="text-chiya-ink/75 max-w-lg mx-auto font-sans font-medium">
            Spin the wheel once a day to win discount promo codes for momos, milk teas, and bakery treats!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Wheel Visual */}
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 rounded-full border-4 border-chiya-ink bg-white shadow-pop flex items-center justify-center overflow-hidden">
              
              {/* Pointer */}
              <div className="absolute top-0 z-20 w-4 h-8 bg-chiya-pink border-2 border-chiya-ink rounded-b-full shadow-md" style={{ transform: 'translateX(-50%)', left: '50%' }} />

              <motion.div
                animate={controls}
                className="w-full h-full relative rounded-full"
                style={{ transformOrigin: 'center' }}
              >
                {/* Draw sectors */}
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

              {/* Pin Center */}
              <button
                onClick={handleSpin}
                disabled={spinning || hasSpun}
                className={`absolute z-30 w-16 h-16 rounded-full border-4 border-chiya-ink flex items-center justify-center font-display font-black text-sm shadow-pop cursor-pointer ${spinning ? 'bg-gray-200 text-gray-400' : hasSpun ? 'bg-chiya-pink text-white' : 'bg-chiya-yellow text-chiya-ink hover:bg-chiya-orange hover:text-white transition'}`}
              >
                {spinning ? 'SPIN...' : hasSpun ? 'WON!' : 'SPIN'}
              </button>
            </div>
            
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
            <div className="bg-white border-2 border-chiya-ink rounded-card-lg p-6 shadow-pop">
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
                    className="btn-primary py-3 px-6 shadow-pop shrink-0"
                  >
                    Apply Code
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-chiya-teal/10 border-2 border-chiya-ink rounded-card-lg p-6 shadow-pop space-y-4">
              <h3 className="text-lg font-display font-black text-chiya-teal">Chiya Club Rules</h3>
              <ul className="space-y-2 text-sm font-sans font-bold text-chiya-ink/80 list-disc list-inside">
                <li>One spin per customer per day.</li>
                <li>Discounts apply to cart totals on checkout.</li>
                <li>Discounts cannot be combined with other offers.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </AnimatedPage>
  )
}

export default Rewards
