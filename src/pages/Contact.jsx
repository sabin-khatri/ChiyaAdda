/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import { siteContent } from '../data/siteContent'
import useDocumentTitle from '../hooks/useDocumentTitle'

const Contact = () => {
  useDocumentTitle('Contact Us')
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const subject = formData.get('subject')
    const message = formData.get('message')
    const body = `From: ${name} (${email})\n\n${message}`
    window.location.href = `mailto:${siteContent.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4"
          >
            Get in Touch
          </motion.h1>
          <p className="text-chiya-ink/70 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our menu, reservations, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-5"
          >
            <div className="bg-white p-6 sm:p-7 rounded-card-lg border-2 border-chiya-ink shadow-pop hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-chiya-yellow text-chiya-ink rounded-full flex items-center justify-center mb-5 border-2 border-chiya-ink">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-display font-black mb-2">Visit Us</h3>
              <p className="text-chiya-ink/70">{siteContent.contact.address}</p>
            </div>
            
            <div className="bg-white p-6 sm:p-7 rounded-card-lg border-2 border-chiya-ink shadow-pop hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-chiya-pink text-white rounded-full flex items-center justify-center mb-5 border-2 border-chiya-ink">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-display font-black mb-2">Call Us</h3>
              <p className="text-chiya-ink/70"><a className="hover:text-chiya-orange" href={`tel:${siteContent.contact.phone.replaceAll(' ', '')}`}>{siteContent.contact.phone}</a><br/><a className="hover:text-chiya-orange" href={`tel:${siteContent.contact.phoneAlt.replaceAll(' ', '')}`}>{siteContent.contact.phoneAlt}</a></p>
            </div>
            
            <div className="bg-white p-6 sm:p-7 rounded-card-lg border-2 border-chiya-ink shadow-pop hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-chiya-teal text-chiya-ink rounded-full flex items-center justify-center mb-5 border-2 border-chiya-ink">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-display font-black mb-2">Opening Hours</h3>
              <p className="text-chiya-ink/70">{siteContent.contact.hoursWeekday}<br/>{siteContent.contact.hoursWeekend}</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-card-lg border-2 border-chiya-ink shadow-pop p-6 sm:p-10 h-full">
              <h2 className="text-2xl font-display font-black mb-3">Send us a message</h2>
              <p className="text-sm text-chiya-ink/60 mb-7">Submitting opens your email app with your message ready to send.</p>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-bold text-chiya-ink mb-2">Your Name</label>
                    <input id="contact-name" name="name" type="text" autoComplete="name" required className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink/15 bg-chiya-cream/40 focus:ring-2 focus:ring-chiya-orange/30 focus:border-chiya-orange outline-none transition" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-bold text-chiya-ink mb-2">Email Address</label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" required className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink/15 bg-chiya-cream/40 focus:ring-2 focus:ring-chiya-orange/30 focus:border-chiya-orange outline-none transition" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-bold text-chiya-ink mb-2">Subject</label>
                  <input id="contact-subject" name="subject" type="text" required className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink/15 bg-chiya-cream/40 focus:ring-2 focus:ring-chiya-orange/30 focus:border-chiya-orange outline-none transition" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-bold text-chiya-ink mb-2">Message</label>
                  <textarea id="contact-message" name="message" rows="5" required className="w-full px-4 py-3 rounded-xl border-2 border-chiya-ink/15 bg-chiya-cream/40 focus:ring-2 focus:ring-chiya-orange/30 focus:border-chiya-orange outline-none transition resize-y" placeholder="Write your message..." />
                </div>
                <button className="btn-primary flex items-center justify-center gap-2 py-3 px-8">
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </AnimatedPage>
  )
}

export default Contact
