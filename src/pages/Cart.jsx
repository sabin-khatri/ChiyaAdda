import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck, Store } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useCartStore from '../store/cartStore'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getFadeUp } from '../motion/variants'
import { getCustomizationSchema, formatOptionsSummary } from '../data/customizationSchemas'

const Cart = () => {
  useDocumentTitle('Your Cart')
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getCartTotal, 
    pickupMode, 
    deliveryFee, 
    eta, 
    setPickupMode,
    appliedPromo,
    discountRate
  } = useCartStore()
  
  const navigate = useNavigate()
  const shouldReduce = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduce)
  const total = getCartTotal()
  const discount = Math.round(total * discountRate)

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-display font-black text-chiya-ink mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white border-2 border-chiya-ink rounded-card-lg p-12 text-center shadow-pop"
          >
            <div className="w-24 h-24 bg-chiya-orange/10 border-2 border-chiya-ink rounded-full flex items-center justify-center mx-auto mb-6 shadow-pop">
              <svg className="w-12 h-12 text-chiya-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-black text-chiya-ink mb-4">Your cart is empty</h2>
            <p className="text-chiya-ink/75 mb-8 font-sans font-medium">Looks like you haven't added any delicious teas or snacks yet.</p>
            <Link to="/menu" className="btn-primary inline-flex">
              <ArrowLeft size={18} /> Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-chiya-ink rounded-card-lg shadow-pop overflow-hidden">
                <ul className="divide-y-2 divide-chiya-ink/10">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.li 
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 flex items-center sm:items-start gap-4 sm:gap-6 bg-white"
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-card-sm border-2 border-chiya-ink overflow-hidden shadow-pop">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="text-lg font-display font-black text-chiya-ink">{item.name}</h3>
                              {item.options && (() => {
                                const schema = getCustomizationSchema(item)
                                const summary = formatOptionsSummary(item.options, schema)
                                return (
                                  <p className="text-xs font-bold text-chiya-ink/65 mt-1.5 flex gap-1 flex-wrap">
                                    {(summary.length ? summary : Object.entries(item.options).map(([k, v]) => ({ key: k, label: k, value: v }))).map(({ key, label, value }) => (
                                      <span key={key} className="bg-chiya-cream border border-chiya-ink/20 px-2 py-0.5 rounded text-[10px]">
                                        {label}: {value}
                                      </span>
                                    ))}
                                  </p>
                                )
                              })()}
                            </div>
                            <button 
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-chiya-pink hover:text-red-600 p-1 cursor-pointer transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                          
                          <p className="text-chiya-orange font-display font-black mb-4">Rs. {item.price}</p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 border-chiya-ink rounded-xl bg-white overflow-hidden shadow-[2px_2px_0px_0px_rgba(43,33,24,1)]">
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="px-3 py-1.5 text-chiya-ink hover:bg-chiya-cream transition font-extrabold cursor-pointer"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-4 py-1.5 font-display font-extrabold border-x-2 border-chiya-ink min-w-[2.5rem] text-center text-sm text-chiya-ink">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="px-3 py-1.5 text-chiya-ink hover:bg-chiya-cream transition font-extrabold cursor-pointer"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="font-display font-black text-chiya-ink ml-auto hidden sm:inline">
                              Rs. {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-chiya-ink rounded-card-lg shadow-pop p-6 sticky top-28 space-y-6">
                <h3 className="text-xl font-display font-black text-chiya-ink border-b-2 border-chiya-ink/10 pb-4">Order Summary</h3>
                
                {/* Pickup/Delivery Toggle */}
                <div>
                  <label className="block text-xs font-display font-extrabold uppercase text-chiya-ink/60 mb-2">Fulfillment Mode</label>
                  <div className="grid grid-cols-2 gap-2 border-2 border-chiya-ink p-1 rounded-2xl bg-chiya-cream">
                    <button
                      onClick={() => setPickupMode('pickup')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-bold text-xs cursor-pointer transition ${pickupMode === 'pickup' ? 'bg-chiya-orange text-white border-2 border-chiya-ink shadow-pop' : 'text-chiya-ink'}`}
                    >
                      <Store size={14} /> Pickup
                    </button>
                    <button
                      onClick={() => setPickupMode('delivery')}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-bold text-xs cursor-pointer transition ${pickupMode === 'delivery' ? 'bg-chiya-orange text-white border-2 border-chiya-ink shadow-pop' : 'text-chiya-ink'}`}
                    >
                      <Truck size={14} /> Delivery
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-chiya-yellow/10 border-2 border-chiya-ink p-4 rounded-2xl flex items-center justify-between text-sm font-bold text-chiya-ink">
                  <span>Estimated Time:</span>
                  <span className="text-chiya-orange font-display font-black">{eta}</span>
                </div>
                
                <div className="space-y-4 font-sans font-bold text-chiya-ink/80 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-chiya-ink">Rs. {total}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-2.5 rounded-xl border border-green-200">
                      <span>Promo Discount ({appliedPromo})</span>
                      <span>- Rs. {discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-chiya-ink">Rs. {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="text-chiya-ink">Rs. {Math.round(total * 0.1)}</span>
                  </div>
                  <div className="border-t-2 border-chiya-ink pt-4 flex justify-between items-center text-chiya-ink">
                    <span className="font-display font-black text-lg">Total</span>
                    <span className="font-display font-black text-2xl text-chiya-orange">
                      Rs. {total - discount + deliveryFee + Math.round(total * 0.1)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base cursor-pointer shadow-pop"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                
                <Link to="/menu" className="w-full text-center block text-chiya-orange font-display font-bold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  )
}

export default Cart
