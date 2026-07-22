import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

// Custom SVGs for Social Icons since lucide-react removed brand icons
const Facebook = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const Instagram = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)

const Twitter = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
)

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <footer className="bg-primary-900 text-primary-50 pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          
          <motion.div className="col-span-1 md:col-span-1" variants={itemVariants}>
            <h3 className="text-2xl font-serif font-bold text-primary-200 mb-6">Chiya-Ghar</h3>
            <p className="text-primary-100/80 mb-6">
              Experience the authentic taste of Nepali tea and delicacies in a warm, welcoming environment.
            </p>
            <div className="flex space-x-4">
              <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" className="text-primary-200 hover:text-white transition bg-primary-800 p-2 rounded-full hover:bg-primary-700">
                <Facebook size={20} />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" className="text-primary-200 hover:text-white transition bg-primary-800 p-2 rounded-full hover:bg-primary-700">
                <Instagram size={20} />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href="#" className="text-primary-200 hover:text-white transition bg-primary-800 p-2 rounded-full hover:bg-primary-700">
                <Twitter size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-white font-display">Quick Links</h4>
            <ul className="space-y-3 font-bold">
              <li><Link to="/" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block">Home</Link></li>
              <li><Link to="/menu" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block">Menu</Link></li>
              <li><Link to="/booking" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block">Book a Table</Link></li>
              <li><Link to="/brew" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block">Brew Lab</Link></li>
              <li><Link to="/rewards" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block text-chiya-yellow animate-pulse">Rewards</Link></li>
              <li><Link to="/about" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block">About Us</Link></li>
              <li><Link to="/gallery" className="text-chiya-cream/80 hover:text-chiya-yellow hover:pl-2 transition-all inline-block">Gallery</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-100/80 group">
                <MapPin size={20} className="shrink-0 mt-1 text-primary-300 group-hover:text-white transition-colors" />
                <span>Thamel Marg, Kathmandu<br/>Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-primary-100/80 group">
                <Phone size={20} className="shrink-0 text-primary-300 group-hover:text-white transition-colors" />
                <span>+977 1-4212345</span>
              </li>
              <li className="flex items-center gap-3 text-primary-100/80 group">
                <Mail size={20} className="shrink-0 text-primary-300 group-hover:text-white transition-colors" />
                <span>hello@chiyaghar.com</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-white">Opening Hours</h4>
            <ul className="space-y-3 text-primary-100/80">
              <li className="flex justify-between border-b border-primary-800 pb-2">
                <span>Sunday - Thursday:</span>
                <span className="font-medium text-white">7:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-primary-800 pb-2">
                <span>Friday - Saturday:</span>
                <span className="font-medium text-white">7:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </motion.div>
          
        </motion.div>
        
        <motion.div 
          className="border-t border-primary-800 mt-12 pt-8 text-center text-primary-100/60 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p>&copy; {new Date().getFullYear()} Chiya-Ghar. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
