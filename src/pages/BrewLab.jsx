import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Info, Coffee, HelpCircle, RotateCcw } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useDocumentTitle from '../hooks/useDocumentTitle'
import toast from 'react-hot-toast'

const BrewLab = () => {
  useDocumentTitle('Chiya Brew Lab')
  const shouldReduce = useReducedMotion()

  const [steepTime, setSteepTime] = useState(3) // minutes: 1 to 10
  const [milkLevel, setMilkLevel] = useState(40) // percentage: 0 to 80
  const [sugarLevel, setSugarLevel] = useState(50) // percentage: 0 to 100
  const [spices, setSpices] = useState({
    ginger: true,
    cardamom: true,
    cinnamon: false,
    cloves: false
  })
  
  const [tasteResult, setTasteResult] = useState(null)

  const handleSpiceToggle = (spice) => {
    setSpices(prev => ({ ...prev, [spice]: !prev[spice] }))
  }

  const handleTaste = () => {
    // Generate fun tasting descriptions based on user settings
    let name = "Perfect Masala Chiya"
    let desc = "Balanced, spiced, and creamy. Tastes exactly like a warm evening in Thamel."
    let rating = "⭐⭐⭐⭐⭐ (Perfect)"

    if (milkLevel === 0) {
      if (steepTime > 6) {
        name = "Yeti Black Brew"
        desc = "Extremely strong, black orthodox tea. Bitter, rich, and spice-heavy. Will give you enough energy to climb Mount Everest!"
        rating = "⭐⭐⭐⭐ (Strong & Bold)"
      } else {
        name = "Pure Himalayan Orthodox"
        desc = "Clear, clean, and floral. Best for appreciating the delicate notes of Ilam tea leaves."
        rating = "⭐⭐⭐⭐ (Pure)"
      }
    } else if (milkLevel > 60) {
      if (sugarLevel > 70) {
        name = "Sweet Milk Candy Chiya"
        desc = "Extremely sweet and milky. More like dessert than tea, but highly addictive!"
        rating = "⭐⭐⭐ (Sugar Rush)"
      } else {
        name = "Muted Cream Tea"
        desc = "Very heavy on the milk, dampening the bold flavor of the spices."
        rating = "⭐⭐⭐ (Creamy)"
      }
    } else if (steepTime < 2) {
      name = "Diluted Dudh Chiya"
      desc = "Weak tea base. Tastes like warm spiced milk with only a hint of tea leaves."
      rating = "⭐⭐ (Under-brewed)"
    } else if (spices.ginger && !spices.cardamom && !spices.cinnamon && !spices.cloves) {
      name = "Ginger Punch Chiya"
      desc = "Spicy ginger throat-soother. Excellent for rainy days and sore throats."
      rating = "⭐⭐⭐⭐ (Spicy)"
    }

    setTasteResult({ name, desc, rating })
    toast('Tasting completed!', { icon: '👅' })
  }

  const handleReset = () => {
    setSteepTime(3)
    setMilkLevel(40)
    setSugarLevel(50)
    setSpices({ ginger: true, cardamom: true, cinnamon: false, cloves: false })
    setTasteResult(null)
  }

  // Calculate tea color based on steep time and milk level
  // Steep time: makes it darker (brown/black)
  // Milk level: blends it with white
  const getTeaColor = () => {
    // base color representing black tea strength (darker as steep time increases)
    const baseRed = Math.max(78 - steepTime * 5, 30)
    const baseGreen = Math.max(26 - steepTime * 2, 10)
    const baseBlue = Math.max(15 - steepTime, 5)

    // Milk blend: blend (baseRed, baseGreen, baseBlue) with white (255, 248, 240)
    const milkFactor = milkLevel / 100 // 0 to 0.8
    const r = Math.round(baseRed * (1 - milkFactor) + 255 * milkFactor)
    const g = Math.round(baseGreen * (1 - milkFactor) + 248 * milkFactor)
    const b = Math.round(baseBlue * (1 - milkFactor) + 240 * milkFactor)

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4 flex items-center justify-center gap-2">
            <Flame className="text-chiya-orange animate-pulse" size={32} /> Chiya Brew Lab
          </h1>
          <p className="text-chiya-ink/75 max-w-lg mx-auto font-sans font-medium">
            Tinker with brewing configurations to simulate color, steam, and flavor. Try to brew the perfect cup!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Visual Cup Simulator */}
          <div className="bg-white border-2 border-chiya-ink rounded-card-lg p-8 shadow-pop flex flex-col items-center relative">
            <div className="absolute top-4 right-4">
              <button 
                onClick={handleReset} 
                className="p-2 border-2 border-chiya-ink rounded-full bg-white hover:bg-chiya-cream transition shadow-pop cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Steam animation container */}
            <div className="h-20 flex justify-center items-end gap-2 mb-2 w-40 overflow-hidden relative">
              {!shouldReduce && Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-12 bg-chiya-ink/5 rounded-full blur-md"
                  initial={{ y: 20, opacity: 0, scaleX: 1 }}
                  animate={{ 
                    y: -50, 
                    opacity: [0, 0.4, 0],
                    scaleX: [1, 1.5, 1],
                    x: [0, Math.sin(i) * 15, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.6,
                    ease: 'easeInOut' 
                  }}
                />
              ))}
            </div>

            {/* Cup visual */}
            <div className="relative flex flex-col items-center">
              {/* Cup handle */}
              <div className="absolute top-10 -right-8 w-12 h-16 border-4 border-chiya-ink rounded-r-full bg-transparent z-0" />

              {/* Cup body */}
              <div className="w-48 h-36 border-4 border-chiya-ink rounded-b-[40px] bg-white relative overflow-hidden z-10 shadow-md">
                
                {/* Tea Liquid */}
                <div 
                  className="absolute bottom-0 left-0 w-full transition-all duration-500 ease-out"
                  style={{ 
                    height: '75%', 
                    backgroundColor: getTeaColor() 
                  }}
                >
                  {/* Bubbles / Froth */}
                  {milkLevel > 0 && (
                    <div className="absolute top-0 left-0 w-full h-2 bg-white/35 blur-sm flex justify-around">
                      <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                      <span className="w-1 h-1 bg-white rounded-full opacity-80" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Saucer */}
              <div className="w-56 h-4 bg-chiya-ink border-2 border-chiya-ink rounded-full mt-2 z-10" />
            </div>

            {/* Taste Result Card */}
            {tasteResult ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-2 border-chiya-ink rounded-2xl p-5 bg-chiya-yellow text-left w-full shadow-pop"
              >
                <p className="text-[10px] font-display font-extrabold uppercase text-chiya-ink/50 mb-1">Tasting Profile</p>
                <h3 className="text-lg font-display font-black text-chiya-ink mb-2">☕ {tasteResult.name}</h3>
                <p className="text-sm font-sans font-medium text-chiya-ink/80 mb-4">{tasteResult.desc}</p>
                <p className="text-xs font-bold text-chiya-orange">Rating: {tasteResult.rating}</p>
              </motion.div>
            ) : (
              <div className="mt-8 text-center py-6 text-chiya-ink/50 font-sans font-bold text-sm flex items-center gap-1">
                <Info size={16} /> Tune the settings and click Taste Brew below!
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="bg-white border-2 border-chiya-ink rounded-card-lg p-6 shadow-pop space-y-6">
            <h3 className="text-xl font-display font-black text-chiya-ink border-b-2 border-chiya-ink/10 pb-4">Brew Controls</h3>

            {/* Steep Time Slider */}
            <div>
              <div className="flex justify-between font-display font-bold text-sm mb-2">
                <span>Steep Time (Tea Strength)</span>
                <span className="text-chiya-orange">{steepTime} Mins</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={steepTime} onChange={(e) => setSteepTime(parseInt(e.target.value))}
                className="w-full accent-chiya-orange"
              />
            </div>

            {/* Milk Ratio Slider */}
            <div>
              <div className="flex justify-between font-display font-bold text-sm mb-2">
                <span>Milk Ratio</span>
                <span className="text-chiya-pink">{milkLevel}%</span>
              </div>
              <input 
                type="range" min="0" max="80" 
                value={milkLevel} onChange={(e) => setMilkLevel(parseInt(e.target.value))}
                className="w-full accent-chiya-pink"
              />
            </div>

            {/* Sugar Slider */}
            <div>
              <div className="flex justify-between font-display font-bold text-sm mb-2">
                <span>Sweetness</span>
                <span className="text-chiya-yellow">{sugarLevel}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={sugarLevel} onChange={(e) => setSugarLevel(parseInt(e.target.value))}
                className="w-full accent-chiya-yellow"
              />
            </div>

            {/* Spice selection */}
            <div>
              <label className="block text-sm font-display font-bold text-chiya-ink mb-3">Spices Selection</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(spices).map((spice) => (
                  <button
                    key={spice}
                    type="button"
                    onClick={() => handleSpiceToggle(spice)}
                    className={`py-2 rounded-xl border-2 border-chiya-ink font-display font-bold text-xs uppercase cursor-pointer transition ${spices[spice] ? 'bg-chiya-yellow text-chiya-ink shadow-[2px_2px_0px_0px_rgba(43,33,24,1)]' : 'bg-white text-gray-500'}`}
                  >
                    {spice}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTaste}
              className="w-full btn-primary py-3.5 text-base shadow-pop cursor-pointer mt-4"
            >
              Taste Brew <Coffee size={16} />
            </button>
          </div>

        </div>

      </div>
    </AnimatedPage>
  )
}

export default BrewLab
