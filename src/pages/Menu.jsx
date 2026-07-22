import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus, Coffee, Sparkles } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import { menuCategories, menuItems } from '../data/mockMenu'
import useCartStore from '../store/cartStore'
import ItemCustomizerModal from '../components/ui/ItemCustomizerModal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getFadeUp, getCardHover } from '../motion/variants'
import toast from 'react-hot-toast'

const Menu = () => {
  useDocumentTitle('Our Menu')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const addItemToCart = useCartStore(state => state.addItem)
  const shouldReduceMotion = useReducedMotion()
  const fadeUp = getFadeUp(shouldReduceMotion)
  const cardHover = getCardHover(shouldReduceMotion)

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === activeCategory)

  const handleAddToCart = (itemWithOptions) => {
    addItemToCart(itemWithOptions)
    toast.success(`${itemWithOptions.name} added to cart!`, {
      icon: '🍵',
      style: { 
        borderRadius: '16px', 
        background: '#2B2118', 
        color: '#FFF6ED',
        border: '2px solid #2B2118',
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif'
      }
    })
  }

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-black text-chiya-ink mb-4"
          >
            Our Menu
          </motion.h1>
          <div className="w-24 h-1.5 bg-chiya-orange mx-auto rounded-full border border-chiya-ink mb-6"></div>
          <p className="text-chiya-ink/75 max-w-2xl mx-auto font-sans font-medium">
            Explore our curated range of authentic Himalayan teas, local coffees, and fresh homemade snacks.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2.5 rounded-full font-display font-bold border-2 border-chiya-ink transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_0px_var(--color-ink)] ${activeCategory === 'all' ? 'bg-chiya-orange text-white shadow-pop' : 'bg-white text-chiya-ink hover:bg-chiya-cream'}`}
          >
            All Items
          </button>
          {menuCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-display font-bold border-2 border-chiya-ink transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_0px_var(--color-ink)] ${activeCategory === category.id ? 'bg-chiya-orange text-white shadow-pop' : 'bg-white text-chiya-ink hover:bg-chiya-cream'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                custom={index}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={cardHover}
                layoutId={`item-card-${item.id}`}
                key={item.id}
                className="bg-white rounded-card-sm border-2 border-chiya-ink overflow-hidden shadow-pop hover:shadow-pop transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative border-b-2 border-chiya-ink bg-gray-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-display font-extrabold uppercase px-2 py-1 bg-chiya-yellow border border-chiya-ink rounded-full text-chiya-ink shadow-[1px_1px_0px_0px_rgba(43,33,24,1)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-display font-black text-chiya-ink leading-snug">{item.name}</h3>
                      <span className="font-display font-black text-chiya-orange whitespace-nowrap ml-2">Rs. {item.price}</span>
                    </div>
                    <p className="text-sm font-sans font-medium text-chiya-ink/70 leading-relaxed line-clamp-3">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => setSelectedItem(item)}
                    className="w-full btn-primary py-3 text-sm justify-center"
                  >
                    <Plus size={16} /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      <ItemCustomizerModal 
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />
    </AnimatedPage>
  )
}

export default Menu
