import React from 'react'
import { m } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { getPageTransition } from '../motion/variants'

const AnimatedPage = ({ children, className = '' }) => {
  const shouldReduce = useReducedMotion()
  const variants = getPageTransition(shouldReduce)

  return (
    <m.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </m.div>
  )
}

export default AnimatedPage
