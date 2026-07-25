import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedPage from '../components/layout/AnimatedPage'
import { siteContent } from '../data/siteContent'
import { getFadeUp } from '../motion/variants'
import useDocumentTitle from '../hooks/useDocumentTitle'

const About = () => {
  useDocumentTitle('About Us')
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream">
      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-chiya-ink/50 to-chiya-ink/90 z-10" />
        <img 
          src="/images/about.png" 
          alt="Tea leaves brewing" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-black mb-4 drop-shadow-md"
          >
            {siteContent.about.heroTitle}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '120px' }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1.5 bg-chiya-orange mx-auto rounded-full border border-chiya-ink"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-chiya-ink">
            
            <motion.p 
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-2xl font-display font-bold text-center mb-16 leading-relaxed border-l-4 border-chiya-pink pl-4 italic text-chiya-ink/90"
            >
              "{siteContent.about.tagline}"
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-card-lg border-2 border-chiya-ink shadow-pop overflow-hidden"
              >
                <img 
                  src="/images/about1.jpg" 
                  alt="Making traditional tea" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-display font-black text-chiya-ink mb-6">
                  {siteContent.about.journeyTitle}
                </h2>
                <p className="mb-4 font-sans font-medium text-chiya-ink/80 leading-relaxed">
                  {siteContent.about.journeyParagraph1}
                </p>
                <p className="font-sans font-medium text-chiya-ink/80 leading-relaxed">
                  {siteContent.about.journeyParagraph2}
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-chiya-yellow p-10 rounded-card-lg border-2 border-chiya-ink shadow-pop text-center"
            >
              <h2 className="text-3xl font-display font-black text-chiya-ink mb-6">
                {siteContent.about.promiseTitle}
              </h2>
              <p className="mb-0 font-sans font-bold text-chiya-ink/95 leading-relaxed">
                {siteContent.about.promiseText}
              </p>
            </motion.div>
            
          </div>
        </div>
      </section>
    </AnimatedPage>
  )
}

export default About
