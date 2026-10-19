import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import { siteContent } from '../data/siteContent'
import { getFadeUp, getCardHover } from '../motion/variants'
import useDocumentTitle from '../hooks/useDocumentTitle'

const Gallery = () => {
  useDocumentTitle('Our Gallery')
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)
  const cardHover = getCardHover(shouldReduceMotion)
  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    if (activeImage === null) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveImage(null)
      if (event.key === 'ArrowRight') setActiveImage((index) => (index + 1) % siteContent.galleryImages.length)
      if (event.key === 'ArrowLeft') setActiveImage((index) => (index - 1 + siteContent.galleryImages.length) % siteContent.galleryImages.length)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeImage])

  const showNext = (event) => {
    event?.stopPropagation()
    setActiveImage((index) => (index + 1) % siteContent.galleryImages.length)
  }
  const showPrevious = (event) => {
    event?.stopPropagation()
    setActiveImage((index) => (index - 1 + siteContent.galleryImages.length) % siteContent.galleryImages.length)
  }

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
            <motion.button
              key={img.id}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`View image: ${img.alt}`}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={cardHover}
              className="w-full text-left appearance-none p-0 break-inside-avoid rounded-card-sm border-2 border-chiya-ink overflow-hidden shadow-pop hover:shadow-pop transition-shadow duration-300 group cursor-pointer relative bg-white"
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
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {activeImage !== null && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Gallery image viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImage(null)}
              className="fixed inset-0 z-[100] bg-chiya-ink/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
            >
              <button type="button" onClick={() => setActiveImage(null)} aria-label="Close image viewer" className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                <X size={24} />
              </button>
              <button type="button" onClick={showPrevious} aria-label="Previous image" className="absolute left-3 sm:left-8 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronLeft size={28} />
              </button>
              <motion.figure
                key={activeImage}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={(event) => event.stopPropagation()}
                className="max-w-5xl max-h-full flex flex-col items-center gap-4"
              >
                <img
                  src={siteContent.galleryImages[activeImage].src}
                  alt={siteContent.galleryImages[activeImage].alt}
                  className="max-h-[78vh] max-w-full object-contain rounded-2xl border-2 border-white/20 shadow-2xl"
                />
                <figcaption className="text-white text-center font-display font-bold">
                  {siteContent.galleryImages[activeImage].alt}
                  <span className="block text-white/60 text-xs font-sans mt-1">{activeImage + 1} / {siteContent.galleryImages.length} · Use arrow keys to browse</span>
                </figcaption>
              </motion.figure>
              <button type="button" onClick={showNext} aria-label="Next image" className="absolute right-3 sm:right-8 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronRight size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AnimatedPage>
  )
}

export default Gallery
