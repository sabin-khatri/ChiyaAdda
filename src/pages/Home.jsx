import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Coffee, Clock, Heart } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import { menuItems } from '../data/mockMenu'
import { siteContent } from '../data/siteContent'
import { getFadeUp, getCardHover } from '../motion/variants'
import useDocumentTitle from '../hooks/useDocumentTitle'

const Home = () => {
  useDocumentTitle('Home')
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)
  const cardHover = getCardHover(shouldReduceMotion)

  const popularItems = menuItems.filter(item => item.popular).slice(0, 3)

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-chiya-cream">
        {/* Decorative background blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-chiya-pink/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-chiya-yellow/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="text-left space-y-6 max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex py-1.5 px-4 rounded-full bg-chiya-pink text-white border-2 border-chiya-ink text-xs font-display font-extrabold tracking-widest uppercase shadow-pop"
              >
                {siteContent.hero.welcomeBadge}
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-5xl md:text-7xl font-display font-black text-chiya-ink leading-tight"
              >
                A Sip of <span className="bg-gradient-to-r from-chiya-orange to-chiya-pink bg-clip-text text-transparent">{siteContent.hero.title.split(' ')[2] || 'Tradition'}</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl font-medium text-chiya-ink/75 leading-relaxed font-sans"
              >
                {siteContent.hero.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link to="/menu" className="btn-primary px-8 py-4 text-base shadow-pop">
                  {siteContent.hero.exploreBtn} <Coffee size={18} />
                </Link>
                <Link to="/about" className="btn-outline px-8 py-4 text-base shadow-pop">
                  {siteContent.hero.storyBtn}
                </Link>
              </motion.div>
            </div>

            {/* Right Column: High-Fidelity Layered Graphics */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
              className="relative w-full h-[450px] lg:h-[500px] flex items-center justify-center"
            >
              {/* Main Image Card (Tilted) */}
              <div className="w-[300px] h-[380px] md:w-[320px] md:h-[420px] rounded-card-lg border-4 border-chiya-ink overflow-hidden shadow-pop rotate-[-4deg] bg-white relative z-10 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/chiya_hero.jpg" 
                  alt="Nepali Masala Tea" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Floating Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="absolute top-12 right-6 md:right-12 z-20 bg-white border-2 border-chiya-ink rounded-card-sm p-4 shadow-pop rotate-[6deg] max-w-[200px]"
              >
                <div className="flex gap-1 text-chiya-yellow mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                </div>
                <p className="text-xs font-display font-black text-chiya-ink">"Best Masala Chiya in town! Authentic spices."</p>
                <p className="text-[10px] font-bold text-chiya-orange mt-2">- Aarav T.</p>
              </motion.div>

              {/* Floating Tea Badge */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-10 left-6 md:left-12 z-20 w-24 h-24 bg-chiya-yellow border-2 border-chiya-ink rounded-full flex flex-col items-center justify-center text-center shadow-pop"
              >
                <span className="text-[9px] font-display font-black uppercase tracking-wider text-chiya-ink">Himalayan</span>
                <span className="text-base font-display font-black text-chiya-orange">100%</span>
                <span className="text-[9px] font-display font-black uppercase tracking-wider text-chiya-ink">Organic</span>
              </motion.div>
            </motion.div>

          </div>
        </div>
        
        {/* Transition to next section */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              whileHover={cardHover}
              className="text-center p-8 rounded-card-lg bg-chiya-cream/50 border-2 border-chiya-ink shadow-pop transition-all duration-300"
            >
              <div className="mx-auto bg-chiya-yellow w-16 h-16 flex items-center justify-center rounded-full mb-6 text-chiya-ink border-2 border-chiya-ink shadow-pop">
                <Coffee size={32} />
              </div>
              <h3 className="text-xl font-display font-black text-chiya-ink mb-3">Premium Leaves</h3>
              <p className="text-chiya-ink/75 font-sans font-medium">Hand-picked orthodox tea leaves from the finest organic gardens of Ilam, Nepal.</p>
            </motion.div>
            <motion.div 
              whileHover={cardHover}
              className="text-center p-8 rounded-card-lg bg-chiya-cream/50 border-2 border-chiya-ink shadow-pop transition-all duration-300"
            >
              <div className="mx-auto bg-chiya-pink w-16 h-16 flex items-center justify-center rounded-full mb-6 text-white border-2 border-chiya-ink shadow-pop">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-display font-black text-chiya-ink mb-3">Made with Love</h3>
              <p className="text-chiya-ink/75 font-sans font-medium">Every aromatic cup is slow-brewed using traditional methods and authentic mountain spices.</p>
            </motion.div>
            <motion.div 
              whileHover={cardHover}
              className="text-center p-8 rounded-card-lg bg-chiya-cream/50 border-2 border-chiya-ink shadow-pop transition-all duration-300"
            >
              <div className="mx-auto bg-chiya-teal w-16 h-16 flex items-center justify-center rounded-full mb-6 text-white border-2 border-chiya-ink shadow-pop">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-display font-black text-chiya-ink mb-3">Freshly Prepared</h3>
              <p className="text-chiya-ink/75 font-sans font-medium">Hot and fresh Himalayan snacks prepared daily to perfectly complement your hot tea.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-20 bg-chiya-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black text-chiya-ink mb-4">Customer Favorites</h2>
            <div className="w-24 h-1.5 bg-chiya-orange mx-auto rounded-full border border-chiya-ink"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularItems.map((item, index) => (
              <motion.div 
                key={item.id}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={cardHover}
                className="bg-white rounded-card-lg overflow-hidden border-2 border-chiya-ink shadow-pop hover:shadow-pop transition-all duration-300"
              >
                <div className="h-64 overflow-hidden relative border-b-2 border-chiya-ink">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-chiya-yellow border-2 border-chiya-ink px-3 py-1 rounded-full font-bold text-chiya-ink shadow-pop">
                    Rs. {item.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-black text-chiya-ink mb-2">{item.name}</h3>
                  <p className="text-chiya-ink/75 mb-6 h-12 overflow-hidden font-sans font-medium">{item.description}</p>
                  <Link to={`/menu?category=${item.categoryId}`} className="text-chiya-orange font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Order Now <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/menu" className="btn-outline inline-flex">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white border-y-2 border-chiya-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black text-chiya-ink mb-4">What Our Guests Say</h2>
            <div className="w-24 h-1.5 bg-chiya-pink mx-auto rounded-full border border-chiya-ink"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteContent.testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx}
                custom={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={cardHover}
                className="bg-chiya-cream/60 border-2 border-chiya-ink p-8 rounded-card-lg text-center relative shadow-pop"
              >
                <div className="text-chiya-pink mb-4 flex justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                  </svg>
                </div>
                <p className="text-chiya-ink/80 italic mb-6 font-sans font-medium">"{testimonial.review}"</p>
                <h4 className="font-display font-black text-chiya-ink">{testimonial.name}</h4>
                <p className="text-sm text-chiya-ink/60 font-bold">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-chiya-ink text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-black text-chiya-yellow mb-6">Join Our Tea Club</h2>
            <p className="text-chiya-cream/80 mb-10 text-lg font-medium font-sans">Subscribe to get special offers, free giveaways, and once-in-a-lifetime tea deals.</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-6 py-4 rounded-full text-chiya-ink w-full sm:w-96 focus:outline-none focus:ring-4 focus:ring-chiya-orange border-2 border-chiya-ink bg-white font-bold"
                required
              />
              <button className="bg-chiya-orange hover:bg-chiya-pink text-white font-extrabold px-8 py-4 rounded-full border-2 border-chiya-ink shadow-pop transition-all cursor-pointer">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  )
}

export default Home
