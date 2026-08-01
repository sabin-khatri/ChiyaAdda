import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Check, Minus, Plus } from 'lucide-react'
import {
  getCustomizationSchema,
  getDefaultOptions,
  calculateCustomizedPrice,
} from '../../data/customizationSchemas'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import { getModalBackdrop, getModalSheet, getFadeUp } from '../../motion/variants'

const layoutWrap = {
  row: 'flex flex-wrap gap-1',
  'grid-2': 'flex flex-wrap gap-1',
  'grid-3': 'flex flex-wrap gap-1',
  'grid-4': 'flex flex-wrap gap-1',
}

const OptionRow = memo(function OptionRow({ group, value, onChange, index, shouldReduce }) {
  const fadeUp = getFadeUp(shouldReduce)
  const wrap = layoutWrap[group.layout] ?? layoutWrap.row

  return (
    <m.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-2 sm:gap-3 py-2 border-b border-chiya-ink/8 last:border-0"
    >
      <div className="w-[4.5rem] sm:w-20 shrink-0 pt-1.5">
        <span className="text-[10px] sm:text-[11px] font-display font-extrabold uppercase tracking-wide text-chiya-ink/55 leading-tight block">
          <span aria-hidden className="mr-0.5">{group.icon}</span>
          {group.shortLabel ?? group.label}
        </span>
      </div>
      <div className={wrap} role="group" aria-label={group.label}>
        {group.choices.map((choice) => {
          const selected = value === choice.value
          return (
            <m.button
              key={choice.value}
              type="button"
              onClick={() => onChange(group.id, choice.value)}
              whileTap={shouldReduce ? undefined : { scale: 0.94 }}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg border font-display font-bold text-[11px] sm:text-xs leading-tight cursor-pointer min-h-[32px] transition-colors ${
                selected
                  ? 'border-chiya-orange bg-chiya-orange text-white shadow-[1px_1px_0px_0px_var(--color-ink)]'
                  : 'border-chiya-ink/15 bg-white text-chiya-ink/70 hover:border-chiya-ink/35 hover:text-chiya-ink'
              }`}
            >
              {choice.shortLabel ?? choice.label}
              {choice.priceModifier > 0 && (
                <span className={`ml-0.5 font-sans font-semibold ${selected ? 'text-white/85' : 'text-chiya-orange'}`}>
                  +{choice.priceModifier}
                </span>
              )}
            </m.button>
          )
        })}
      </div>
    </m.div>
  )
})

const ItemCustomizerModal = ({ isOpen, onClose, item, onAddToCart }) => {
  const shouldReduce = useReducedMotion()
  const schema = useMemo(() => getCustomizationSchema(item), [item])
  const backdrop = getModalBackdrop(shouldReduce)
  const sheet = getModalSheet(shouldReduce)

  const [options, setOptions] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (item && schema) {
      setOptions(getDefaultOptions(schema))
      setQuantity(1)
      setIsAdded(false)
    }
  }, [item, schema])

  const handleOptionChange = useCallback((groupId, value) => {
    setOptions((prev) => ({ ...prev, [groupId]: value }))
  }, [])

  if (!item || !schema) return null

  const unitPrice = calculateCustomizedPrice(item.price, options, schema)
  const totalPrice = unitPrice * quantity

  const handleAdd = () => {
    onAddToCart({
      ...item,
      price: unitPrice,
      options,
      customizationId: item.customizationId ?? schema.label,
    }, quantity)

    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      onClose()
    }, 850)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <m.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-chiya-ink/60"
          />

          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customizer-title"
            variants={sheet}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full sm:max-w-xl bg-white border-4 border-chiya-ink shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden safe-bottom rounded-t-2xl sm:rounded-2xl"
            style={{ maxHeight: 'min(100dvh, 640px)' }}
          >
            <div className="flex items-center gap-3 p-3 sm:p-4 border-b-2 border-chiya-ink shrink-0 bg-chiya-cream">
              <m.img
                initial={shouldReduce ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                src={item.image}
                alt=""
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-chiya-ink object-cover shrink-0"
                loading="eager"
                decoding="async"
              />
              <div className="flex-1 min-w-0 pr-8">
                <h3 id="customizer-title" className="font-display font-black text-chiya-ink text-sm sm:text-base leading-tight truncate">
                  {item.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-chiya-ink/55 font-sans mt-0.5">
                  Base Rs. {item.price}
                  <span className="mx-1.5 text-chiya-ink/25">·</span>
                  <m.span
                    key={totalPrice}
                    initial={shouldReduce ? false : { scale: 1.15 }}
                    animate={{ scale: 1 }}
                    className="text-chiya-orange font-display font-bold inline-block"
                  >
                    Total Rs. {totalPrice}
                  </m.span>
                </p>
              </div>
              <button
                onClick={onClose}
                type="button"
                aria-label="Close"
                className="absolute top-3 right-3 p-1.5 rounded-full border-2 border-chiya-ink/20 hover:bg-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-3 sm:px-4 py-1 sm:py-2 shrink-0">
              {schema.groups.map((group, index) => (
                <OptionRow
                  key={group.id}
                  group={group}
                  value={options[group.id]}
                  onChange={handleOptionChange}
                  index={index}
                  shouldReduce={shouldReduce}
                />
              ))}

              <m.div
                custom={schema.groups.length}
                variants={getFadeUp(shouldReduce)}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 sm:gap-3 py-2"
              >
                <span className="w-[4.5rem] sm:w-20 shrink-0 text-[10px] sm:text-[11px] font-display font-extrabold uppercase tracking-wide text-chiya-ink/55">
                  Qty
                </span>
                <div className="flex items-center border-2 border-chiya-ink rounded-lg overflow-hidden bg-white shadow-[1px_1px_0px_0px_rgba(43,33,24,1)]">
                  <m.button
                    type="button"
                    whileTap={shouldReduce ? undefined : { scale: 0.9 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-2.5 py-1.5 text-chiya-ink hover:bg-chiya-cream transition cursor-pointer disabled:opacity-40 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </m.button>
                  <m.span
                    key={quantity}
                    initial={shouldReduce ? false : { y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-3 py-1.5 font-display font-extrabold border-x-2 border-chiya-ink min-w-[2.25rem] text-center text-sm text-chiya-ink"
                  >
                    {quantity}
                  </m.span>
                  <m.button
                    type="button"
                    whileTap={shouldReduce ? undefined : { scale: 0.9 }}
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="px-2.5 py-1.5 text-chiya-ink hover:bg-chiya-cream transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </m.button>
                </div>
                {quantity > 1 && (
                  <span className="text-[10px] font-sans text-chiya-ink/50">Rs.{unitPrice} ea</span>
                )}
              </m.div>
            </div>

            <div className="p-3 sm:p-4 border-t-2 border-chiya-ink bg-chiya-cream shrink-0">
              <m.button
                onClick={handleAdd}
                type="button"
                whileTap={shouldReduce ? undefined : { scale: 0.98 }}
                animate={isAdded ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                className={`w-full py-3 rounded-xl border-2 border-chiya-ink font-display font-bold flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(43,33,24,1)] cursor-pointer min-h-[44px] text-sm sm:text-base active:translate-y-px active:shadow-none transition-colors ${
                  isAdded
                    ? 'bg-green-500 text-white border-green-600 shadow-none'
                    : 'bg-chiya-orange text-white hover:brightness-105'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <m.span
                      key="added"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} /> Added to Cart!
                    </m.span>
                  ) : (
                    <m.span
                      key="add"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Add to Cart — Rs. {totalPrice}
                    </m.span>
                  )}
                </AnimatePresence>
              </m.button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default memo(ItemCustomizerModal)
