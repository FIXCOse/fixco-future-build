import { Variants } from "framer-motion";

/**
 * Reusable animation variants for scroll-triggered animations
 * Optimized for 60 FPS performance with GPU-accelerated transforms
 */

// Container animations with staggered children
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

// Standard item animations (fade + slide up + blur)
export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] // easeOutCubic
    }
  }
};

// Slide from left
export const slideFromLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    filter: "blur(5px)"
  },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Slide from right
export const slideFromRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 50,
    filter: "blur(5px)"
  },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Scale up animation (for cards and featured content)
export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] // Spring easing
    }
  }
};

// 3D rotation effect (for profession cards)
export const rotateIn: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -15,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Flip animation (for quiz cards)
export const flipIn: Variants = {
  hidden: { 
    opacity: 0, 
    rotateY: -90,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    rotateY: 0,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const flipOut: Variants = {
  exit: { 
    opacity: 0, 
    rotateY: 90,
    scale: 0.8,
    transition: { 
      duration: 0.4,
      ease: [0.55, 0.09, 0.68, 0.53] // easeInCubic
    }
  }
};

// Burst animation (for success states)
export const burstIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5,
    rotate: -10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: { 
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1], // Spring
      delay: 0.2
    }
  }
};

// Viewport configuration for optimal scroll triggers
export const viewportConfig = {
  once: true,
  margin: "-100px 0px -100px 0px",
  amount: 0.3 as const
};

// Aggressive viewport (earlier trigger)
export const viewportEarly = {
  once: true,
  margin: "-50px 0px -50px 0px",
  amount: 0.2 as const
};

// Viewport for hero sections (immediate)
export const viewportImmediate = {
  once: true,
  margin: "0px",
  amount: 0.1 as const
};
