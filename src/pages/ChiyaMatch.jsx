/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Heart, Sparkles, ShoppingCart, ArrowRight, RefreshCw, Star, Info } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'
import { menuItems } from '../data/mockMenu'

const ChiyaMatch = () => {
  useDocumentTitle('Chiya Matcher')
  const navigate = useNavigate()
  const addItem = useCartStore(state => state.addItem)
  const shouldReduce = useReducedMotion()

  const [step, setStep] = useState(0) // 0: Start, 1: Vibe, 2: Flavor, 3: Snack, 4: Result
  const [answers, setAnswers] = useState({
    vibe: '',
    flavor: '',
    snack: ''
  })

  // Quiz content
  const questions = [
    {
      key: 'vibe',
      title: 'What describes your current energy vibe?',
      subtitle: 'Tell us how you are feeling right now.',
      options: [
        { value: 'stressed', label: '🧠 Overworked / Stressed', desc: 'Need deep focus or decompression' },
        { value: 'sleepy', label: '💤 Sleepy / Low Energy', desc: 'Need a powerful kick of energy' },
        { value: 'chill', label: '🍃 Cozy / Chilling', desc: 'Just want to relax and vibe' },
        { value: 'sick', label: '🌧️ Under the weather', desc: 'Need warmth and healthy comfort' }
      ]
    },
    {
      key: 'flavor',
      title: 'Choose a flavor profile that hits the spot:',
      subtitle: 'Which taste buds are we catering to today?',
      options: [
        { value: 'spicy', label: '🌶️ Spicy & Aromatic', desc: 'Bold cloves, cardamom, ginger' },
        { value: 'sweet', label: '🥛 Rich, Sweet & Creamy', desc: 'Steamed milk and local honey' },
        { value: 'sour', label: '🍋 Zesty, Sour & Fresh', desc: 'Immunity boosting citrus kick' },
        { value: 'clean', label: '☕ Clean & Straightforward', desc: 'Pure black orthodox tea leaves' }
      ]
    },
    {
      key: 'snack',
      title: 'Pick your ultimate tea-time sidekick:',
      subtitle: 'A tea without a snack is just warm water.',
      options: [
        { value: 'momo', label: '🥟 Juicy Chicken Momo', desc: 'JUICY steamed momos with hot chutney' },
        { value: 'samosa', label: '🥔 Crispy Veg Samosa', desc: 'Crispy pastry with spiced potato filling' },
        { value: 'fries', label: '🍟 Crispy French Fries', desc: 'Classic golden fries with dip' },
        { value: 'none', label: '🚫 Just The Liquid Vibe', desc: 'No snacks, strictly liquid courage' }
      ]
    }
  ]

  const selectOption = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }))
    setStep(prev => prev + 1)
  }

  // Calculate Result Pairing
  const getPairingResult = () => {
    let teaId = 1 // Default Masala Chiya
    let snackId = 8 // Default Chicken Momo
    let title = 'The Kathmandu Hustler'
    let description = 'You need focus, stamina, and standard Nepali energy to conquer your day. Classic Masala Chiya keeps your brain sharp, and Chicken Momos keep you moving!'
    let stats = { caffeine: 90, sweetness: 50, spice: 80, comfort: 70 }

    const { vibe, flavor, snack } = answers

    // Vibe rules
    if (vibe === 'sleepy') {
      teaId = 3 // Kalo Chiya (strong black tea)
      title = 'The Midnight Coder'
      stats.caffeine = 100
      stats.spice = 20
    } else if (vibe === 'chill') {
      teaId = 2 // Dudh Chiya
      title = 'The Basantapur Chiller'
      stats.comfort = 100
      stats.sweetness = 80
    } else if (vibe === 'sick') {
      teaId = 4 // Lemon Ginger
      title = 'The Cozy Recovery Pack'
      stats.comfort = 95
      stats.spice = 70
      stats.caffeine = 30
    }

    // Flavor rules override
    if (flavor === 'sweet') {
      teaId = 5 // Honey Lemon Ginger
      stats.sweetness = 90
    } else if (flavor === 'spicy') {
      teaId = 1 // Masala Chiya
      stats.spice = 95
    }

    // Snack rules
    if (snack === 'samosa') {
      snackId = 11
    } else if (snack === 'fries') {
      snackId = 12
    } else if (snack === 'none') {
      snackId = null
    }

    const tea = menuItems.find(item => item.id === teaId)
    const snackObj = snackId ? menuItems.find(item => item.id === snackId) : null

    return { title, description, tea, snack: snackObj, stats }
  }

  const result = step === 4 ? getPairingResult() : null

  const handleAddPairing = () => {
    if (!result) return
    
    // Add tea to cart
    addItem(result.tea, { temp: 'Hot', sugar: '50%', milk: 'Regular' })
    
    // Add snack if chosen
    if (result.snack) {
      addItem(result.snack, { portion: 'Full', spice: 'Medium', dip: 'Tomato Chutney' })
    }

    toast.success('Added your personality pairing to the cart!', { icon: '🛍️' })
    navigate('/cart')
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-display font-black text-chiya-ink mb-3 flex items-center justify-center gap-2">
            <Sparkles className="text-chiya-pink animate-pulse" size={32} /> Chiya Matcher
          </h1>
          <p className="text-chiya-ink/70 text-sm font-sans font-medium">
            Find your perfect tea & snack match based on your current vibe.
          </p>
        </div>

        {/* Step Indicator */}
        {step > 0 && step < 4 && (
          <div className="w-full bg-chiya-ink/10 h-2.5 rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="bg-chiya-orange h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-chiya-ink rounded-[2.5rem] p-10 text-center shadow-[8px_8px_0px_0px_var(--color-ink)]"
            >
              <div className="w-24 h-24 bg-chiya-pink/10 border-2 border-chiya-pink text-chiya-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-pop animate-bounce">
                <Heart size={44} />
              </div>
              <h2 className="text-3xl font-display font-black text-chiya-ink mb-4">Discover Your Tea Alter-Ego</h2>
              <p className="text-chiya-ink/75 max-w-md mx-auto mb-8 font-sans font-medium text-sm leading-relaxed">
                Take our ultra-fast 3-question vibe test and get a custom curated Himalayan tea & snack pairing tailored directly to your mood.
              </p>
              <button
                onClick={() => setStep(1)}
                className="btn-primary py-4 px-10 text-lg shadow-[4px_4px_0px_0px_var(--color-ink)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                Let's Play <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step > 0 && step < 4 && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="bg-white border-4 border-chiya-ink rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_var(--color-ink)]"
            >
              <span className="text-xs font-display font-extrabold text-chiya-pink uppercase tracking-widest block mb-1">
                Question {step} of 3
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-chiya-ink mb-1 leading-snug">
                {questions[step - 1].title}
              </h2>
              <p className="text-xs font-sans font-bold text-chiya-ink/50 mb-6 uppercase tracking-wide">
                {questions[step - 1].subtitle}
              </p>

              <div className="space-y-3">
                {questions[step - 1].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => selectOption(questions[step - 1].key, opt.value)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-chiya-ink hover:border-chiya-orange hover:bg-chiya-orange/5 bg-white text-chiya-ink shadow-[3px_3px_0px_0px_var(--color-ink)] hover:shadow-pop transition-all flex flex-col justify-center cursor-pointer group"
                  >
                    <span className="font-display font-black text-base group-hover:text-chiya-orange transition-colors">
                      {opt.label}
                    </span>
                    <span className="text-xs font-sans font-medium text-chiya-ink/60 mt-1">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Main Result Card */}
              <div className="bg-white border-4 border-chiya-ink rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_var(--color-ink)] text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-chiya-pink text-white font-display font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 border border-chiya-ink rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                  <Star size={10} /> 100% Match
                </div>

                <span className="text-xs font-display font-extrabold text-chiya-orange uppercase tracking-widest block mb-1">
                  Your Match Alter-Ego
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-black text-chiya-ink mb-3">
                  {result.title}
                </h2>
                <p className="text-sm font-sans font-medium text-chiya-ink/70 max-w-lg mx-auto mb-8 leading-relaxed">
                  {result.description}
                </p>

                {/* Match Items Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                  {/* Item 1: Tea */}
                  <div className="bg-chiya-cream border-2 border-chiya-ink rounded-2xl p-4 flex flex-col items-center">
                    <img 
                      src={result.tea.image} 
                      alt={result.tea.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-chiya-ink mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    />
                    <span className="text-[9px] font-display font-black text-chiya-orange uppercase">Drink Match</span>
                    <h4 className="font-display font-black text-sm text-chiya-ink text-center leading-snug mt-0.5">{result.tea.name}</h4>
                  </div>

                  {/* Item 2: Food (if any) */}
                  {result.snack ? (
                    <div className="bg-chiya-cream border-2 border-chiya-ink rounded-2xl p-4 flex flex-col items-center">
                      <img 
                        src={result.snack.image} 
                        alt={result.snack.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-chiya-ink mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                      />
                      <span className="text-[9px] font-display font-black text-chiya-orange uppercase">Snack Match</span>
                      <h4 className="font-display font-black text-sm text-chiya-ink text-center leading-snug mt-0.5">{result.snack.name}</h4>
                    </div>
                  ) : (
                    <div className="bg-chiya-cream/40 border-2 border-dashed border-chiya-ink/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-display font-extrabold text-chiya-ink/40">Liquid Diet Vibe</p>
                      <p className="text-[10px] font-sans font-medium text-chiya-ink/30 mt-1">No snack pairing needed today.</p>
                    </div>
                  )}
                </div>

                {/* Personality Metrics */}
                <div className="border-t-2 border-chiya-ink/10 pt-6 max-w-md mx-auto space-y-3">
                  <h4 className="text-xs font-display font-extrabold uppercase text-chiya-ink/45 text-left tracking-wider">
                    Pairing Profile Stats
                  </h4>
                  {Object.entries(result.stats).map(([stat, val]) => (
                    <div key={stat} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-display font-bold text-left capitalize text-chiya-ink/80">{stat}</span>
                      <div className="flex-1 bg-chiya-ink/5 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="bg-gradient-to-r from-chiya-orange to-chiya-pink h-full rounded-full"
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-chiya-ink/60">{val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Panel */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddPairing}
                  className="flex-1 btn-primary py-4 text-base shadow-[4px_4px_0px_0px_var(--color-ink)] hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add Entire Pairing to Cart
                </button>
                
                <button
                  onClick={() => {
                    setAnswers({ vibe: '', flavor: '', snack: '' })
                    setStep(0)
                  }}
                  className="btn-outline py-4 px-6 text-base shadow-[4px_4px_0px_0px_var(--color-ink)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Retake Test
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AnimatedPage>
  )
}

export default ChiyaMatch
