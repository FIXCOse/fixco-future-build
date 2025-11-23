import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { RoughEase, ExpoScaleEase, SlowMo } from 'gsap/EasePack';

// Premium plugins (now included with Club GreenSock)
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { GSDevTools } from 'gsap/GSDevTools';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

/**
 * Initialize and register all free GSAP plugins
 * Call this once at app startup
 */
export const initGSAP = () => {
  // Register all plugins (free + premium)
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
    SlowMo,
    SplitText,
    DrawSVGPlugin,
    MorphSVGPlugin,
    ScrollSmoother,
    GSDevTools,
    CustomEase,
    ScrambleTextPlugin
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
export { SplitText, DrawSVGPlugin, MorphSVGPlugin, ScrollSmoother, GSDevTools, CustomEase, ScrambleTextPlugin };
