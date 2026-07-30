import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle2, ChevronRight, ArrowLeft, CreditCard, Landmark, Truck, ShieldAlert } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import useCartStore from '../store/cartStore'
import useOrdersStore from '../store/ordersStore'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { submitOrder } from '../lib/api'
import { getFadeUp, getSpringScale } from '../motion/variants'
import toast from 'react-hot-toast'

const Checkout = () => {
  useDocumentTitle('Checkout')
  const { items, getCartTotal, clearCart, pickupMode, deliveryFee, eta, appliedPromo, discountRate } = useCartStore()
  const addOrder = useOrdersStore(state => state.addOrder)
  const navigate = useNavigate()
  const shouldReduce = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduce)
  const springScale = getSpringScale(shouldReduce)
  
  const [step, setStep] = useState(1) // 1: Order Review, 2: Guest Details, 3: Confirmation Success
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [brewStage, setBrewStage] = useState(0)

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setBrewStage((prev) => {
          if (prev < 4) {
            return prev + 1
          } else {
            clearInterval(interval)
            return prev
          }
        })
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [step])

  const subtotal = getCartTotal()
  const discount = Math.round(subtotal * discountRate)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal - discount + deliveryFee + tax

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    notes: ''
  })

  // If cart is empty and not on success step, redirect
  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      navigate('/cart')
    }
  }, [items, navigate, step])

  const handleSubmitDetails = (e) => {
    e.preventDefault()
    if (pickupMode === 'delivery' && !formData.address) {
      toast.error("Please enter a delivery address.")
      return
    }
    handlePlaceOrder()
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    
    // Construct order items string
    const orderItemsString = items.map(item => {
      const optionStr = item.options ? ` (${Object.values(item.options).join(', ')})` : ''
      return `${item.quantity}x ${item.name}${optionStr}`
    }).join('; ')

    const orderPayload = {
      customerName: formData.name,
      phone: formData.phone,
      address: pickupMode === 'delivery' ? formData.address : 'Store Pickup',
      items: orderItemsString,
      subtotal,
      deliveryFee,
      tax,
      total,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      mode: pickupMode
    }

    try {
      const result = await submitOrder(orderPayload)
      if (result.success) {
        setOrderId(result.orderRef)
        
        // Add to historical admin orders store
        addOrder({
          id: result.orderRef,
          customer: formData.name,
          items: orderItemsString,
          total: total,
          status: 'Pending',
          date: new Date().toLocaleString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          })
        })

        toast.success('Order placed successfully!', { icon: '🎉' })
        setStep(3)
        clearCart()
      }
    } catch (err) {
      toast.error('Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-display font-black text-chiya-ink mb-8">Checkout</h1>

        {/* Step Indicators */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`px-4 py-2 rounded-full font-bold border-2 border-chiya-ink transition ${step === 1 ? 'bg-chiya-orange text-white shadow-pop' : 'bg-white text-chiya-ink'}`}>
              1. Review Cart
            </span>
            <ChevronRight className="text-chiya-ink" size={20} />
            <span className={`px-4 py-2 rounded-full font-bold border-2 border-chiya-ink transition ${step === 2 ? 'bg-chiya-orange text-white shadow-pop' : 'bg-white text-chiya-ink'}`}>
              2. Delivery & Pay
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              {/* Order review details */}
              <div className="lg:col-span-2 bg-white border-2 border-chiya-ink rounded-card-lg p-6 shadow-pop">
                <h2 className="text-xl font-display font-black mb-6">Review Items</h2>
                <ul className="divide-y-2 divide-chiya-ink/5 space-y-4">
                  {items.map(item => (
                    <li key={item.cartItemId} className="flex justify-between items-center py-2">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl border-2 border-chiya-ink overflow-hidden shadow-sm shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-chiya-ink">{item.name}</p>
                          <p className="text-xs font-semibold text-chiya-ink/60 mt-1">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-display font-black text-chiya-ink">Rs. {item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total Card */}
              <div className="lg:col-span-1 bg-white border-2 border-chiya-ink rounded-card-lg p-6 shadow-pop space-y-6">
                <h3 className="text-lg font-display font-black">Fulfillment Summary</h3>
                <div className="space-y-3 font-sans font-bold text-chiya-ink/80 text-sm">
                  <div className="flex justify-between">
                    <span>Fulfillment Mode:</span>
                    <span className="text-chiya-orange capitalize">{pickupMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Time:</span>
                    <span>{eta}</span>
                  </div>
                  <div className="border-t border-dashed border-chiya-ink/20 pt-3 flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-2.5 rounded-xl border border-green-200">
                      <span>Promo Discount ({appliedPromo}):</span>
                      <span>- Rs. {discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>Rs. {tax}</span>
                  </div>
                  <div className="border-t-2 border-chiya-ink pt-4 flex justify-between items-center text-chiya-ink">
                    <span className="font-display font-black text-lg">Total:</span>
                    <span className="font-display font-black text-xl text-chiya-orange">Rs. {total}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full btn-primary py-3 justify-center text-base"
                >
                  Confirm Items <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
            >
              {/* Form Details */}
              <div className="bg-white border-2 border-chiya-ink rounded-card-lg p-8 shadow-pop">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-chiya-orange font-display font-bold mb-6 hover:underline"
                >
                  <ArrowLeft size={16} /> Back to order review
                </button>

                <h2 className="text-xl font-display font-black mb-6">Guest Contact Details</h2>
                
                <form onSubmit={handleSubmitDetails} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-chiya-ink mb-2">Full Name</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-orange/20 font-bold"
                      placeholder="Sabin khatri "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-chiya-ink mb-2">Phone Number</label>
                    <input 
                      type="tel" required
                      pattern="[0-9]{10}"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-orange/20 font-bold"
                      placeholder="98XXXXXXXX"
                    />
                  </div>

                  {pickupMode === 'delivery' && (
                    <div>
                      <label className="block text-sm font-bold text-chiya-ink mb-2">Delivery Address</label>
                      <textarea 
                        required rows="3"
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-orange/20 font-bold resize-none"
                        placeholder="Thamel Street, near Heritage Hotel..."
                      ></textarea>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-chiya-ink mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                        className={`py-3 rounded-xl border-2 border-chiya-ink font-display font-bold flex items-center justify-center gap-2 cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'bg-chiya-yellow text-chiya-ink shadow-pop' : 'bg-white'}`}
                      >
                        💵 Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'qr'})}
                        className={`py-3 rounded-xl border-2 border-chiya-ink font-display font-bold flex items-center justify-center gap-2 cursor-pointer transition ${formData.paymentMethod === 'qr' ? 'bg-chiya-yellow text-chiya-ink shadow-pop' : 'bg-white'}`}
                      >
                        🤳 Fonepay / QR Scan
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-chiya-ink mb-2">Special Instructions (Optional)</label>
                    <input 
                      type="text"
                      value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none font-bold"
                      placeholder="Less sugar, extra spicy, etc."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg justify-center shadow-pop mt-4"
                  >
                    {loading ? "Placing Order..." : `Place Order (Rs. ${total})`}
                  </button>
                </form>
              </div>

              {/* Summary details */}
              <div className="bg-chiya-ink text-white border-2 border-chiya-ink rounded-card-lg p-8 shadow-pop">
                <h2 className="text-xl font-display font-black mb-6 border-b border-white/20 pb-4">Checkout Summary</h2>
                
                <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                  {items.map(item => (
                    <div key={item.cartItemId} className="flex justify-between items-center text-sm font-sans font-semibold">
                      <div className="flex gap-2">
                        <span className="text-chiya-yellow font-bold">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-6 space-y-3 font-sans font-bold text-chiya-cream/80 text-sm">
                  <div className="flex justify-between">
                    <span>Fulfillment Mode:</span>
                    <span className="text-chiya-yellow capitalize">{pickupMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-chiya-yellow">
                      <span>Discount ({appliedPromo}):</span>
                      <span>- Rs. {discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>Rs. {tax}</span>
                  </div>
                  <div className="border-t border-white/20 pt-4 flex justify-between items-center text-white">
                    <span className="font-display font-black text-xl">Grand Total:</span>
                    <span className="font-display font-black text-2xl text-chiya-yellow">Rs. {total}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              variants={springScale}
              initial="hidden"
              animate="visible"
              className="bg-white border-2 border-chiya-ink p-10 rounded-card-lg shadow-pop text-center max-w-md w-full mx-auto"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
                className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500 shadow-pop"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2 className="text-3xl font-display font-black text-chiya-ink mb-4">Order Placed!</h2>
              <p className="text-chiya-ink/75 mb-6 font-sans font-medium">
                Thank you for your order, <span className="font-bold text-chiya-ink">{formData.name}</span>. We will prepare your tea items right away!
              </p>

              <div className="bg-chiya-cream p-4 rounded-xl border-2 border-dashed border-chiya-ink mb-6 text-sm">
                <p className="font-bold text-chiya-ink/80 mb-1">Order Reference</p>
                <p className="text-2xl font-display font-black text-chiya-orange">{orderId}</p>
              </div>

              {/* Live Brewing Progress Tracker */}
              <div className="bg-chiya-cream/30 border-2 border-chiya-ink rounded-3xl p-5 text-left mb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-display font-black uppercase text-chiya-ink/40 tracking-wider">Kitchen Status</span>
                  <span className="text-xs font-display font-black text-chiya-orange animate-pulse">
                    Stage {brewStage + 1} of 5
                  </span>
                </div>
                
                <div>
                  <h4 className="font-display font-black text-base text-chiya-ink">
                    {
                      [
                        'Order Received',
                        'Crushing Spices 🌶️',
                        'Slow Boiling ☕',
                        'Packing Order 📦',
                        pickupMode === 'pickup' ? 'Ready for Pickup! 🎉' : 'Out for Delivery! 🛵'
                      ][brewStage]
                    }
                  </h4>
                  <p className="text-xs font-sans font-medium text-chiya-ink/60 mt-0.5">
                    {
                      [
                        'Sent to Thamel kitchen, matching chef assigned.',
                        'Crushing fresh local ginger, cardamom & cloves.',
                        'Simmering tea leaves with fresh milk on active clay stove.',
                        'Sealing in hot eco-friendly cups and checking items.',
                        pickupMode === 'pickup' ? 'Grab it hot from the main counter!' : 'Our rider has picked it up and is on the way to you!'
                      ][brewStage]
                    }
                  </p>
                </div>

                {/* Progress bar split in 4 segments */}
                <div className="grid grid-cols-4 gap-1.5 h-2">
                  {[0, 1, 2, 3].map((stepIdx) => {
                    const isCompleted = brewStage > stepIdx
                    const isActive = brewStage === stepIdx
                    return (
                      <div key={stepIdx} className="bg-chiya-ink/10 h-full rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isCompleted ? 'bg-chiya-orange w-full' : isActive ? 'bg-gradient-to-r from-chiya-orange to-chiya-pink w-full animate-pulse' : 'w-0'}`} 
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <button 
                onClick={() => navigate('/')}
                className="btn-primary w-full py-3"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </AnimatedPage>
  )
}

export default Checkout
