import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { RoughEase, ExpoScaleEase, SlowMo } from 'gsap/EasePack';

/**
 * Initialize and register all free GSAP plugins
 * Call this once at app startup
 */
export const initGSAP = () => {
  // Register all free plugins
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    Draggable,
    MotionPathPlugin,
    TextPlugin,
    Flip,
    Observer,
    RoughEase,
    ExpoScaleEase,
    SlowMo
  );

  // Configure ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    markers: false, // Set to true for debugging
  });

  console.log('✅ GSAP initialized with all free plugins');
};

// Export everything for use throughout the app
export { gsap, ScrollTrigger, ScrollToPlugin, Draggable, MotionPathPlugin, TextPlugin, Flip, Observer };
export { RoughEase, ExpoScaleEase, SlowMo };
