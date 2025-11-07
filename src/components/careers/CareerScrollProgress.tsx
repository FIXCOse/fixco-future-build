import { motion, useScroll } from "framer-motion";

/**
 * Scroll progress indicator for the careers page
 * Shows a gradient bar at the top that fills as user scrolls
 */
export const CareerScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
