import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedPage from '../components/layout/AnimatedPage'
import { siteContent } from '../data/siteContent'
import { getFadeUp, getCardHover } from '../motion/variants'
import useDocumentTitle from '../hooks/useDocumentTitle'

const Gallery = () => {
  useDocumentTitle('Our Gallery')
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)
  const cardHover = getCardHover(shouldReduceMotion)

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4"
          >
            Our Gallery
          </motion.h1>
          <div className="w-24 h-1.5 bg-chiya-pink mx-auto rounded-full border border-chiya-ink mb-6"></div>
          <p className="text-chiya-ink/75 max-w-2xl mx-auto font-sans font-medium">
            A vibrant glimpse into the cozy atmosphere, hand-crafted tea cups, and delightful treats at Chiya-Ghar.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {siteContent.galleryImages.map((img, index) => (
            <motion.div
              key={img.id}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={cardHover}
              className="break-inside-avoid rounded-card-sm border-2 border-chiya-ink overflow-hidden shadow-pop hover:shadow-pop transition-shadow duration-300 group cursor-pointer relative bg-white"
            >
              <div className="absolute inset-0 bg-chiya-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span className="text-white font-display font-black text-lg px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {img.alt}
                </span>
              </div>
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </AnimatedPage>
  )
}

export default Gallery
