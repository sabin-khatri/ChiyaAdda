import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, Clock, CheckCircle2, ChevronRight, ArrowLeft, Map } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import { getAvailableSlots, submitTableBooking } from '../lib/api'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getFadeUp, getSpringScale } from '../motion/variants'
import { useReducedMotion } from 'framer-motion'
import toast from 'react-hot-toast'

const Booking = () => {
  useDocumentTitle('Book a Table')
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)
  const springScale = getSpringScale(shouldReduceMotion)

  const [step, setStep] = useState(1) // 1: Date & Guests, 2: Time Slots & Contact, 3: Success
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    guests: '2',
    selectedTable: '',
    timeSlot: '',
    name: '',
    phone: '',
    requests: ''
  })
  
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  const tables = [
    { id: 'T1', name: 'Table 1 (Couple Corner)', capacity: 2, desc: 'Cozy side window' },
    { id: 'T2', name: 'Table 2 (Lounge Sofa)', capacity: 4, desc: 'By the tea bookshelf' },
    { id: 'T3', name: 'Table 3 (Family Dining)', capacity: 6, desc: 'Spacious central hall' },
    { id: 'T4', name: 'Table 4 (Bar Counter)', capacity: 2, desc: 'High stools, brewer view' },
    { id: 'T5', name: 'Table 5 (Garden Patio)', capacity: 4, desc: 'Sunlight outdoor patio' },
    { id: 'T6', name: 'Table 6 (Private Cabin)', capacity: 6, desc: 'Quiet partitioned alcove' }
  ]

  // Fetch slots when date changes
  useEffect(() => {
    if (step === 2) {
      setLoadingSlots(true)
      getAvailableSlots(formData.date)
        .then(res => {
          setSlots(res)
          setLoadingSlots(false)
        })
        .catch(() => {
          toast.error("Failed to load time slots.")
          setLoadingSlots(false)
        })
    }
  }, [formData.date, step])

  const handleNextStep = () => {
    if (!formData.date || !formData.guests) {
      toast.error("Please fill in date and number of guests.")
      return
    }
    if (!formData.selectedTable) {
      toast.error("Please select a table from the floor map.")
      return
    }
    
    // Validate table capacity against party size
    const chosenTable = tables.find(t => t.id === formData.selectedTable)
    const partySize = parseInt(formData.guests)
    if (chosenTable && partySize > chosenTable.capacity) {
      toast.error(`Table ${chosenTable.id} only fits up to ${chosenTable.capacity} guests. Please select a larger table or decrease guests.`, { icon: '⚠️' })
      return
    }

    setStep(2)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!formData.timeSlot) {
      toast.error("Please select a time slot.")
      return
    }
    if (!formData.name || !formData.phone) {
      toast.error("Please enter name and phone number.")
      return
    }

    setSubmitting(true)
    try {
      const res = await submitTableBooking(formData)
      if (res.success) {
        setBookingRef(res.bookingRef)
        setStep(3)
        toast.success("Table booked successfully!", { icon: '🎉' })
      }
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  const getTableName = (tableId) => {
    const table = tables.find(t => t.id === tableId)
    return table ? table.name : tableId
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4">Book a Table</h1>
          <p className="text-chiya-ink/75 max-w-lg mx-auto font-sans font-medium">
            Skip the queue and secure the best spot in the house for premium tea and conversation.
          </p>
        </div>

        {/* Step Indicators */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`px-4 py-2 rounded-full font-bold border-2 border-chiya-ink transition ${step === 1 ? 'bg-chiya-orange text-white shadow-pop' : 'bg-white text-chiya-ink'}`}>
              1. Details & Table
            </span>
            <ChevronRight className="text-chiya-ink" size={20} />
            <span className={`px-4 py-2 rounded-full font-bold border-2 border-chiya-ink transition ${step === 2 ? 'bg-chiya-orange text-white shadow-pop' : 'bg-white text-chiya-ink'}`}>
              2. Slot & Contact
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
              className="bg-white rounded-card-lg border-2 border-chiya-ink p-8 shadow-pop space-y-8"
            >
              <h2 className="text-2xl font-display font-black text-chiya-ink flex items-center gap-2">
                <Calendar size={24} className="text-chiya-orange" /> Choose Date & Party Size
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display font-extrabold uppercase text-chiya-ink/60 mb-2">Select Date</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-pink/20 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-display font-extrabold uppercase text-chiya-ink/60 mb-2">Number of Guests</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {['1', '2', '4', '6', '8'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, guests: num })}
                          className={`py-3 rounded-xl border-2 border-chiya-ink transition-all font-bold text-sm ${formData.guests === num ? 'bg-chiya-yellow text-chiya-ink shadow-[2px_2px_0px_0px_rgba(43,33,24,1)]' : 'bg-white text-chiya-ink'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2D Interactive Seat Selector Map */}
                <div className="border-t-2 border-chiya-ink/10 pt-6">
                  <h3 className="text-lg font-display font-black text-chiya-ink mb-4 flex items-center gap-2">
                    <Map size={20} className="text-chiya-pink" /> 2D Tea House Floor Plan
                  </h3>
                  <div className="bg-chiya-cream border-2 border-chiya-ink rounded-card-sm p-6 grid grid-cols-2 gap-4">
                    {tables.map((table) => {
                      const isSelected = formData.selectedTable === table.id
                      const tooSmall = parseInt(formData.guests) > table.capacity
                      return (
                        <button
                          type="button"
                          key={table.id}
                          onClick={() => setFormData({ ...formData, selectedTable: table.id })}
                          className={`p-4 rounded-xl border-2 border-chiya-ink text-left transition cursor-pointer ${isSelected ? 'bg-chiya-orange text-white shadow-pop' : tooSmall ? 'bg-gray-100 text-gray-400 border-dashed border-gray-300 opacity-60' : 'bg-white text-chiya-ink hover:bg-chiya-yellow/10 hover:shadow-pop transition-all'}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-display font-black text-sm">{table.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-chiya-ink ${isSelected ? 'bg-white text-chiya-ink' : 'bg-chiya-cream'}`}>
                              Up to {table.capacity} Seats
                            </span>
                          </div>
                          <p className="text-xs font-display font-bold leading-tight mb-1">{table.name}</p>
                          <p className={`text-[10px] font-sans font-medium ${isSelected ? 'text-white/80' : 'text-chiya-ink/60'}`}>{table.desc}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full btn-primary py-4 text-lg justify-center mt-4"
                >
                  Find Available Slots <ChevronRight size={20} />
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
              className="bg-white rounded-card-lg border-2 border-chiya-ink p-8 shadow-pop"
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-chiya-orange font-bold mb-6 hover:underline"
              >
                <ArrowLeft size={16} /> Back to details
              </button>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-display font-black text-chiya-ink mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-chiya-orange" /> Select Time Slot
                  </h3>
                  
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-8 h-8 border-4 border-chiya-orange/30 border-t-chiya-orange rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setFormData({ ...formData, timeSlot: slot.time })}
                          className={`py-3 rounded-xl border-2 border-chiya-ink transition-all font-bold text-sm ${formData.timeSlot === slot.time ? 'bg-chiya-pink text-white shadow-pop' : slot.available ? 'bg-white text-chiya-ink hover:bg-chiya-cream' : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'}`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-chiya-ink/10 pt-6 space-y-4">
                  <h3 className="text-lg font-display font-black text-chiya-ink mb-2">Contact Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-chiya-ink mb-2">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rabin Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-orange/20 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-chiya-ink mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none focus:ring-4 focus:ring-chiya-orange/20 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-chiya-ink mb-2">Special Requests (Optional)</label>
                    <input
                      type="text"
                      placeholder="Window seat preference, child high-chair, quiet corner..."
                      value={formData.requests}
                      onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-4 text-lg justify-center mt-4"
                >
                  {submitting ? "Booking Table..." : "Confirm Table Booking"}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={springScale}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-card-lg border-2 border-chiya-ink p-10 text-center shadow-pop max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
                className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500 shadow-pop"
              >
                <CheckCircle2 size={48} />
              </motion.div>

              <h2 className="text-3xl font-display font-black text-chiya-ink mb-4">Table Confirmed!</h2>
              
              <div className="bg-chiya-cream p-4 rounded-xl border-2 border-dashed border-chiya-ink mb-6 text-sm">
                <p className="font-bold text-chiya-ink/80 mb-1">Booking Reference</p>
                <p className="text-2xl font-display font-black text-chiya-orange">{bookingRef}</p>
              </div>

              <div className="text-left bg-gray-50 p-5 rounded-xl border-2 border-chiya-ink mb-8 space-y-2 text-sm font-bold text-chiya-ink">
                <p>👤 <span className="font-normal">Guest:</span> {formData.name}</p>
                <p>👥 <span className="font-normal">Party:</span> {formData.guests} Guests</p>
                <p>🪑 <span className="font-normal">Table:</span> {getTableName(formData.selectedTable)}</p>
                <p>📅 <span className="font-normal">Date:</span> {formData.date}</p>
                <p>⏰ <span className="font-normal">Time:</span> {formData.timeSlot}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full btn-primary py-3 justify-center"
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

export default Booking
