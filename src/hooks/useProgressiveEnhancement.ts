import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isDesktop: boolean;
  hasModernGPU: boolean;
  hasWideBand: boolean;
  prefersMotion: boolean;
  screenWidth: number;
  canUseWebGL: boolean;
}

interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  isThrottled: boolean;
}

interface ProgressiveEnhancementState {
  ultraEnabled: boolean;
  proEnabled: boolean;
  fallbackReason?: string;
  capabilities: DeviceCapabilities;
  performance: PerformanceMetrics;
}

const useProgressiveEnhancement = () => {
  const [state, setState] = useState<ProgressiveEnhancementState>({
    ultraEnabled: false,
    proEnabled: true,
    capabilities: {
      isDesktop: false,
      hasModernGPU: false,
      hasWideBand: false,
      prefersMotion: false,
      screenWidth: 0,
      canUseWebGL: false,
    },
    performance: {
      fps: 60,
      frameDrops: 0,
      isThrottled: false,
    }
  });

  // Feature flag from env or remote config
  const getFeatureFlag = () => {
    try {
      // Check localStorage for override
      const override = localStorage.getItem('fixco-ultra-override');
      if (override !== null) return override === 'true';
      
      // Check URL param for testing
      const urlParams = new URLSearchParams(window.location.search);
      const urlOverride = urlParams.get('ultraUI');
      if (urlOverride !== null) return urlOverride === 'true';
      
      // Default to environment variable or true
      return process.env.REACT_APP_ULTRA_UI !== 'false';
    } catch {
      return true;
    }
  };

  // Device capability detection
  const detectCapabilities = (): DeviceCapabilities => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    // GPU detection
    let hasModernGPU = false;
    if (gl) {
      try {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? 
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '' : '';
        
        hasModernGPU = !renderer.toLowerCase().includes('software') && 
                      !renderer.toLowerCase().includes('swiftshader');
      } catch {
        hasModernGPU = !!gl;
      }
    }

    // Connection detection  
    const connection = (navigator as any).connection || (navigator as any).mozConnection;
    const hasWideBand = !connection || 
                       connection.effectiveType === '4g' || 
                       connection.downlink > 1.5;

    // Motion preference
    const prefersMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Device type detection
    const isDesktop = window.innerWidth >= 1200 && 
                     !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return {
      isDesktop,
      hasModernGPU,
      hasWideBand,
      prefersMotion,
      screenWidth: window.innerWidth,
      canUseWebGL: !!gl
    };
  };

  // FPS monitoring for auto-degradation
  const startPerformanceMonitoring = () => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;
    let frameDrops = 0;
    let lowFpsCount = 0;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        
        // Count frame drops
        if (fps < 55) {
          frameDrops++;
          lowFpsCount++;
        } else {
          lowFpsCount = 0;
        }
        
        // Auto-degrade after 3 seconds of low FPS
        if (lowFpsCount >= 3 && state.ultraEnabled) {
          setState(prev => ({
            ...prev,
            ultraEnabled: false,
            fallbackReason: 'performance_degradation',
            performance: { fps, frameDrops, isThrottled: true }
          }));
          
          // Log degradation for analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ultra_mode_degraded', {
              reason: 'low_fps',
              final_fps: fps,
              frame_drops: frameDrops
            });
          }
          
          return; // Stop monitoring
        }
        
        setState(prev => ({
          ...prev,
          performance: { fps, frameDrops, isThrottled: lowFpsCount > 0 }
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  };

  // Initialize on mount
  useEffect(() => {
    const capabilities = detectCapabilities();
    const featureFlagEnabled = getFeatureFlag();
    
    // Determine if ULTRA should be enabled
    const shouldEnableUltra = 
      featureFlagEnabled &&
      capabilities.isDesktop &&
      capabilities.hasModernGPU &&
      capabilities.hasWideBand &&
      capabilities.prefersMotion &&
      capabilities.screenWidth >= 1200 &&
      capabilities.canUseWebGL;

    setState(prev => ({
      ...prev,
      capabilities,
      ultraEnabled: shouldEnableUltra,
      fallbackReason: !shouldEnableUltra ? 'device_capabilities' : undefined
    }));

    // Start performance monitoring if ULTRA is enabled
    if (shouldEnableUltra) {
      // Delay monitoring to let the page settle
      setTimeout(startPerformanceMonitoring, 2000);
    }

    // Log activation for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'progressive_enhancement_init', {
        ultra_enabled: shouldEnableUltra,
        is_desktop: capabilities.isDesktop,
        has_modern_gpu: capabilities.hasModernGPU,
        prefers_motion: capabilities.prefersMotion,
        screen_width: capabilities.screenWidth,
        fallback_reason: !shouldEnableUltra ? 'device_capabilities' : null
      });
    }

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      if (newWidth < 1200 && state.ultraEnabled) {
        setState(prev => ({
          ...prev,
          ultraEnabled: false,
          fallbackReason: 'screen_size',
          capabilities: { ...prev.capabilities, screenWidth: newWidth }
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manual override functions for testing
  const forceUltra = () => {
    localStorage.setItem('fixco-ultra-override', 'true');
    window.location.reload();
  };

  const forcePro = () => {
    localStorage.setItem('fixco-ultra-override', 'false'); 
    window.location.reload();
  };

  const clearOverride = () => {
    localStorage.removeItem('fixco-ultra-override');
    window.location.reload();
  };

  return {
    ...state,
    // Utility functions
    forceUltra,
    forcePro, 
    clearOverride,
    // Loading states for lazy imports
    loadUltraComponents: async () => {
      if (!state.ultraEnabled) return null;
      
      try {
        // For now, return null as Three.js will be added later
        // This allows the component to work without Three.js dependency
        console.log('ULTRA components would be loaded here');
        return null;
      } catch (error) {
        console.warn('Failed to load ULTRA components, falling back to PRO:', error);
        setState(prev => ({
          ...prev,
          ultraEnabled: false,
          fallbackReason: 'component_load_error'
        }));
        return null;
      }
    }
  };
};

export default useProgressiveEnhancement;
export type { ProgressiveEnhancementState, DeviceCapabilities, PerformanceMetrics };