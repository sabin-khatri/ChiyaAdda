// Lightweight motion presets — tuned for 60fps feel

export const getFadeUp = (shouldReduce = false) => ({
  hidden: { opacity: 0, y: shouldReduce ? 0 : 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 28,
      mass: 0.6,
      delay: shouldReduce ? 0 : i * 0.05,
    },
  }),
})

export const getStaggerContainer = (shouldReduce = false) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: shouldReduce ? 0 : 0.06,
      delayChildren: shouldReduce ? 0 : 0.04,
    },
  },
})

export const getCardHover = (shouldReduce = false) => {
  if (shouldReduce) return {}
  return {
    y: -6,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  }
}

export const getDrawerSlide = (shouldReduce = false) => ({
  hidden: { x: shouldReduce ? 0 : '100%', opacity: shouldReduce ? 0 : 1 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 380, damping: 32 },
  },
  exit: {
    x: shouldReduce ? 0 : '100%',
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
})

export const getSpringScale = (shouldReduce = false) => ({
  hidden: { scale: shouldReduce ? 1 : 0.92, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 420, damping: 26 },
  },
  exit: {
    scale: shouldReduce ? 1 : 0.96,
    opacity: 0,
    transition: { duration: 0.15 },
  },
})

export const getModalBackdrop = (shouldReduce = false) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: shouldReduce ? 0 : 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
})

export const getModalSheet = (shouldReduce = false) => ({
  hidden: { y: shouldReduce ? 0 : '100%', opacity: shouldReduce ? 0 : 1 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 380, damping: 34 },
  },
  exit: {
    y: shouldReduce ? 0 : '100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
})

export const getBadgeBump = (shouldReduce = false) => {
  if (shouldReduce) return {}
  return {
    scale: [1, 1.25, 1],
    transition: { type: 'spring', stiffness: 500, damping: 12 },
  }
}

export const getPageTransition = (shouldReduce = false) => ({
  initial: { opacity: 0, y: shouldReduce ? 0 : 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 30, mass: 0.7 },
  },
  exit: {
    opacity: 0,
    y: shouldReduce ? 0 : -8,
    transition: { duration: 0.15 },
  },
})
