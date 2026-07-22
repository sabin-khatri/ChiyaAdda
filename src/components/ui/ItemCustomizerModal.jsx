/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { getSpringScale } from '../../motion/variants'

const ItemCustomizerModal = ({ isOpen, onClose, item, onAddToCart }) => {
  if (!item) return null

  const shouldReduce = useReducedMotion()
  const springScale = getSpringScale(shouldReduce)

  // Default options
  const [options, setOptions] = useState({
    sugar: '100%',
    milk: 'Regular',
    temp: 'Hot'
  })

  const [isAdded, setIsAdded] = useState(false)

  const handleOptionChange = (category, value) => {
    setOptions(prev => ({ ...prev, [category]: value }))
  }

  const handleAdd = () => {
    onAddToCart({ ...item, options })
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      onClose()
      // Reset options for next time
      setOptions({ sugar: '100%', milk: 'Regular', temp: 'Hot' })
    }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-chiya-ink/50 backdrop-blur-sm"
          />
          
          <motion.div 
            layoutId={`item-card-${item.id}`}
            className="bg-white rounded-card-lg border-4 border-chiya-ink shadow-pop w-full max-w-md overflow-hidden relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/85 hover:bg-chiya-cream rounded-full border-2 border-chiya-ink text-chiya-ink transition z-20 backdrop-blur cursor-pointer shadow-pop"
            >
              <X size={18} />
            </button>

            <div className="h-48 relative border-b-2 border-chiya-ink">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-chiya-ink/90 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-display font-black text-white">{item.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Temperature */}
              <div>
                <h4 className="font-display font-bold text-chiya-ink mb-3 text-xs uppercase tracking-wider">Temperature</h4>
                <div className="flex gap-3">
                  {['Hot', 'Iced'].map(temp => (
                    <button
                      key={temp}
                      onClick={() => handleOptionChange('temp', temp)}
                      className={`flex-1 py-2 rounded-xl border-2 font-display font-bold transition-all ${options.temp === temp ? 'border-chiya-orange bg-chiya-orange/10 text-chiya-orange shadow-[2px_2px_0px_0px_rgba(43,33,24,1)]' : 'border-gray-200 text-gray-500 hover:border-chiya-ink'}`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sugar Level */}
              <div>
                <h4 className="font-display font-bold text-chiya-ink mb-3 text-xs uppercase tracking-wider">Sugar Level</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['0%', '25%', '50%', '100%'].map(level => (
                    <button
                      key={level}
                      onClick={() => handleOptionChange('sugar', level)}
                      className={`py-2 rounded-xl border-2 font-display font-bold text-sm transition-all ${options.sugar === level ? 'border-chiya-orange bg-chiya-orange/10 text-chiya-orange shadow-[2px_2px_0px_0px_rgba(43,33,24,1)]' : 'border-gray-200 text-gray-500 hover:border-chiya-ink'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Type (only show if it's tea or coffee) */}
              {(item.categoryId === 'tea' || item.categoryId === 'coffee') && (
                <div>
                  <h4 className="font-display font-bold text-chiya-ink mb-3 text-xs uppercase tracking-wider">Milk Type</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Regular', 'Oat', 'Almond', 'Soy'].map(milk => (
                      <button
                        key={milk}
                        onClick={() => handleOptionChange('milk', milk)}
                        className={`py-2 rounded-xl border-2 font-display font-bold transition-all ${options.milk === milk ? 'border-chiya-orange bg-chiya-orange/10 text-chiya-orange shadow-[2px_2px_0px_0px_rgba(43,33,24,1)]' : 'border-gray-200 text-gray-500 hover:border-chiya-ink'}`}
                      >
                        {milk}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t-2 border-chiya-ink bg-chiya-cream flex items-center justify-between">
              <span className="text-xl font-display font-black text-chiya-ink">Rs. {item.price}</span>
              <button 
                onClick={handleAdd}
                className={`px-8 py-3 rounded-xl border-2 border-chiya-ink font-display font-bold flex items-center gap-2 transition-all shadow-pop cursor-pointer ${isAdded ? 'bg-green-500 text-white' : 'bg-chiya-orange text-white hover:bg-chiya-pink'}`}
              >
                {isAdded ? <><Check size={20} /> Added!</> : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ItemCustomizerModal
