// Centralized Framer Motion variants for Chiyaghar
// Supports reduced motion defaults

export const getFadeUp = (shouldReduce = false) => ({
  hidden: { 
    opacity: 0, 
    y: shouldReduce ? 0 : 25 
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: custom * 0.1
    }
  })
});

export const getCardHover = (shouldReduce = false) => {
  if (shouldReduce) return {};
  return {
    scale: 1.03,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  };
};

export const getDrawerSlide = (shouldReduce = false) => ({
  hidden: { 
    x: shouldReduce ? 0 : "100%", 
    opacity: shouldReduce ? 0 : 1 
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 350, 
      damping: 35 
    }
  },
  exit: { 
    x: shouldReduce ? 0 : "100%", 
    opacity: shouldReduce ? 0 : 0,
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    }
  }
});

export const getSpringScale = (shouldReduce = false) => ({
  hidden: { 
    scale: shouldReduce ? 1 : 0, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  }
});

export const getBadgeBump = (shouldReduce = false) => {
  if (shouldReduce) return {};
  return {
    scale: [1, 1.3, 1],
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  };
};
