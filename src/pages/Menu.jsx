import React, { useState, memo, useCallback } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AnimatedPage from '../components/layout/AnimatedPage'
import { menuCategories, menuItems } from '../data/mockMenu'
import useCartStore from '../store/cartStore'
import ItemCustomizerModal from '../components/ui/ItemCustomizerModal'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getFadeUp, getStaggerContainer, getCardHover } from '../motion/variants'
import toast from 'react-hot-toast'

const MenuCard = memo(function MenuCard({ item, index, onSelect, shouldReduce }) {
  const fadeUp = getFadeUp(shouldReduce)
  const cardHover = getCardHover(shouldReduce)

  return (
    <m.article
      layout
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      whileHover={cardHover}
      className="bg-white rounded-card-sm border-2 border-chiya-ink overflow-hidden shadow-pop group flex flex-col justify-between will-change-transform"
    >
      <div>
        <div className="h-44 sm:h-48 overflow-hidden relative border-b-2 border-chiya-ink bg-gray-50">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {item.popular && (
            <m.span
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18, delay: index * 0.05 + 0.2 }}
              className="absolute top-2 right-2 text-[9px] font-display font-extrabold uppercase px-2 py-0.5 bg-chiya-pink text-white border border-chiya-ink rounded-full"
            >
              Popular
            </m.span>
          )}
          {item.tags?.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-display font-extrabold uppercase px-1.5 py-0.5 bg-chiya-yellow border border-chiya-ink rounded-full text-chiya-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-display font-black text-chiya-ink leading-snug">{item.name}</h3>
            <m.span
              key={item.price}
              className="font-display font-black text-chiya-orange whitespace-nowrap text-sm sm:text-base"
            >
              Rs. {item.price}
            </m.span>
          </div>
          <p className="text-xs sm:text-sm font-sans font-medium text-chiya-ink/65 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
      </div>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <m.button
          whileTap={shouldReduce ? undefined : { scale: 0.97 }}
          onClick={() => onSelect(item)}
          className="w-full btn-primary py-2.5 sm:py-3 text-sm justify-center"
        >
          <Plus size={16} /> Customize & Add
        </m.button>
      </div>
    </m.article>
  )
})

const Menu = () => {
  useDocumentTitle('Our Menu')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const addItemToCart = useCartStore((state) => state.addItem)
  const shouldReduce = useReducedMotion()
  const stagger = getStaggerContainer(shouldReduce)

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.categoryId === activeCategory)

  const handleSelectItem = useCallback((item) => setSelectedItem(item), [])
  const handleCloseModal = useCallback(() => setSelectedItem(null), [])

  const handleAddToCart = useCallback((itemWithOptions, quantity = 1) => {
    addItemToCart(itemWithOptions, quantity)
    const qtyLabel = quantity > 1 ? `${quantity}× ` : ''
    toast.success(`${qtyLabel}${itemWithOptions.name} added!`, {
      icon: '🍵',
      duration: 2000,
      style: {
        borderRadius: '12px',
        background: '#2B2118',
        color: '#FFF6ED',
        border: '2px solid #2B2118',
        fontWeight: 'bold',
        fontSize: '13px',
      },
    })
  }, [addItemToCart])

  const categories = [{ id: 'all', name: 'All Items' }, ...menuCategories]

  return (
    <AnimatedPage className="min-h-screen bg-chiya-cream pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.header
          initial={{ opacity: 0, y: shouldReduce ? 0 : -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-chiya-ink mb-3">
            Our Menu
          </h1>
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
            className="w-20 h-1 bg-chiya-orange mx-auto rounded-full border border-chiya-ink mb-4 origin-center"
          />
          <p className="text-chiya-ink/75 max-w-2xl mx-auto font-sans font-medium text-sm sm:text-base">
            Authentic Himalayan teas, local coffees & homemade snacks.
          </p>
        </m.header>

        <div className="mb-6 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-3 sm:flex-wrap sm:justify-center overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const active = activeCategory === cat.id
              return (
                <m.button
                  key={cat.id}
                  layout
                  onClick={() => setActiveCategory(cat.id)}
                  whileTap={shouldReduce ? undefined : { scale: 0.95 }}
                  className={`relative shrink-0 px-4 py-2 rounded-full font-display font-bold text-xs sm:text-sm border-2 border-chiya-ink cursor-pointer transition-colors ${
                    active ? 'text-white' : 'bg-white text-chiya-ink hover:bg-chiya-cream'
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId="menu-category-pill"
                      className="absolute inset-0 bg-chiya-orange rounded-full border-2 border-chiya-ink shadow-pop -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {cat.name}
                </m.button>
              )
            })}
          </div>
        </div>

        <m.div
          layout
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                onSelect={handleSelectItem}
                shouldReduce={shouldReduce}
              />
            ))}
          </AnimatePresence>
        </m.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ItemCustomizerModal
            isOpen={!!selectedItem}
            item={selectedItem}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  )
}

export default Menu
