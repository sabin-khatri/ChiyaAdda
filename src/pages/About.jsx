import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedPage from '../components/layout/AnimatedPage'
import { siteContent } from '../data/siteContent'
import { getFadeUp } from '../motion/variants'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Landmark, ArrowDown, MapPin, Compass } from 'lucide-react'

// Animated Counter Component
const ElevationCounter = ({ target }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(target)
    if (start === end) return

    const duration = 1200 // 1.2 seconds
    const totalSteps = 40
    const stepTime = duration / totalSteps
    const increment = Math.ceil(end / totalSteps)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [target])

  return <span className="font-mono font-black">{count.toLocaleString()}m</span>
}

const About = () => {
  useDocumentTitle('About Us')
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)

  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      id: 0,
      title: 'Ilam Tea Estates',
      altitude: 2100,
      role: 'Harvesting & Picking',
      desc: 'High up in the mist-covered hills of Eastern Nepal, our orthodox tea leaves are hand-picked at sunrise. The cool alpine climate gives the leaves their signature clean, floral notes.',
      icon: <Compass className="text-chiya-pink" size={24} />
    },
    {
      id: 1,
      title: 'Dharan Sorting Center',
      altitude: 350,
      role: 'Curing & Hand-Rolling',
      desc: 'The leaves travel down to the warm valley foothills where they are lightly bruised, oxidised, and slowly rolled on wooden tables to preserve the natural aromatic oils.',
      icon: <MapPin className="text-chiya-orange" size={24} />
    },
    {
      id: 2,
      title: 'Kathmandu Teahouse',
      altitude: 1400,
      role: 'Slow brewing & Spicing',
      desc: 'In Thamel, we boil these premium cured leaves in fresh milk, crushed organic cardamoms, cinnamon, and organic local honey to serve you the ultimate cup.',
      icon: <Landmark className="text-chiya-yellow" size={24} />
    }
  ]

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
            
            {/* Journey Grid */}
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

            {/* Interactive Altitude Story Map */}
            <div className="mb-24 border-t-4 border-chiya-ink/10 pt-16">
              <div className="text-center mb-12">
                <span className="text-xs font-display font-extrabold text-chiya-orange uppercase tracking-wider">Himalayan Sourcing Story</span>
                <h2 className="text-3xl font-display font-black text-chiya-ink mt-1">Altitude Map: Leaves to Cup</h2>
                <p className="text-chiya-ink/60 font-sans font-medium text-sm mt-2 max-w-md mx-auto">
                  Click on each processing hub to follow the journey and altitude elevation steps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {stages.map((stage) => {
                  const isActive = activeStage === stage.id
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStage(stage.id)}
                      className={`p-6 rounded-[2rem] border-2 border-chiya-ink text-left transition-all cursor-pointer flex flex-col justify-between shadow-[4px_4px_0px_0px_var(--color-ink)] hover:translate-y-[-2px] hover:shadow-pop ${isActive ? 'bg-white border-chiya-orange shadow-pop' : 'bg-white/40 border-chiya-ink/30 opacity-70'}`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className={`p-2.5 rounded-xl border border-chiya-ink ${isActive ? 'bg-chiya-cream' : 'bg-white/80'}`}>
                            {stage.icon}
                          </span>
                          <span className="text-xs font-mono font-black text-chiya-orange uppercase bg-chiya-orange/10 px-2 py-0.5 rounded-full">
                            Stage {stage.id + 1}
                          </span>
                        </div>
                        <h4 className="font-display font-black text-lg text-chiya-ink leading-tight mb-1">{stage.title}</h4>
                        <p className="text-xs font-display font-bold text-chiya-ink/50 uppercase tracking-wide mb-3">{stage.role}</p>
                        <p className="text-xs font-sans font-medium text-chiya-ink/70 leading-relaxed mb-4">{stage.desc}</p>
                      </div>

                      {/* Altitude Gauge */}
                      <div className="border-t border-chiya-ink/10 pt-3 flex justify-between items-center">
                        <span className="text-[10px] font-display font-extrabold uppercase text-chiya-ink/40">Elevation</span>
                        <span className="text-sm font-display font-black text-chiya-orange">
                          {isActive ? <ElevationCounter target={stage.altitude} /> : `${stage.altitude}m`}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
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
