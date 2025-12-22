import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface WaveDividerProps {
  variant?: 'wave' | 'curve' | 'layered' | 'mesh' | 'liquid' | 'aurora' | 'glow' | 'particles' | 'glass';
  flip?: boolean;
  colorFrom?: string;
  colorTo?: string;
  animated?: boolean;
  className?: string;
  height?: number;
  intensity?: 'subtle' | 'medium' | 'epic';
  glowColor?: string;
  interactive?: boolean;
}

// Epic liquid paths with more complexity
const liquidPaths = {
  layer1: {
    start: "M0,80 C100,60 200,100 350,70 C500,40 650,90 800,60 C950,30 1100,80 1200,50 L1200,150 L0,150 Z",
    end: "M0,60 C150,90 300,40 450,80 C600,120 750,50 900,90 C1050,130 1150,60 1200,80 L1200,150 L0,150 Z"
  },
  layer2: {
    start: "M0,90 C120,50 280,110 420,70 C560,30 700,100 840,60 C980,20 1120,90 1200,70 L1200,150 L0,150 Z",
    end: "M0,70 C180,110 320,50 480,100 C640,150 780,60 920,110 C1060,160 1160,80 1200,100 L1200,150 L0,150 Z"
  },
  layer3: {
    start: "M0,100 C140,70 300,120 460,80 C620,40 780,110 940,70 C1100,30 1180,100 1200,90 L1200,150 L0,150 Z",
    end: "M0,80 C200,120 360,60 540,110 C720,160 860,70 1020,120 C1140,150 1180,90 1200,110 L1200,150 L0,150 Z"
  },
  layer4: {
    start: "M0,110 C160,80 340,130 500,90 C660,50 820,120 980,80 C1100,50 1180,110 1200,100 L1200,150 L0,150 Z",
    end: "M0,90 C220,130 380,70 560,120 C740,170 900,80 1060,130 C1160,160 1190,100 1200,120 L1200,150 L0,150 Z"
  },
  layer5: {
    start: "M0,120 C180,90 360,140 540,100 C720,60 900,130 1060,90 C1140,60 1190,120 1200,110 L1200,150 L0,150 Z",
    end: "M0,100 C240,140 400,80 600,130 C800,180 960,90 1100,140 C1180,170 1200,110 1200,130 L1200,150 L0,150 Z"
  }
};

// Aurora wave paths
const auroraPaths = {
  wave1: {
    start: "M0,40 Q200,80 400,40 T800,60 T1200,40 L1200,150 L0,150 Z",
    end: "M0,60 Q200,20 400,60 T800,40 T1200,60 L1200,150 L0,150 Z"
  },
  wave2: {
    start: "M0,60 Q300,100 500,50 T900,80 T1200,60 L1200,150 L0,150 Z",
    end: "M0,80 Q300,40 500,80 T900,50 T1200,80 L1200,150 L0,150 Z"
  },
  wave3: {
    start: "M0,80 Q250,120 500,70 T850,100 T1200,80 L1200,150 L0,150 Z",
    end: "M0,100 Q250,60 500,100 T850,70 T1200,100 L1200,150 L0,150 Z"
  }
};

// Glow wave path
const glowPath = {
  start: "M0,50 C200,90 400,20 600,60 C800,100 1000,30 1200,70 L1200,150 L0,150 Z",
  end: "M0,70 C200,30 400,80 600,40 C800,0 1000,70 1200,30 L1200,150 L0,150 Z"
};

export const WaveDivider = ({
  variant = 'wave',
  flip = false,
  colorFrom = 'background',
  colorTo = 'muted',
  animated = true,
  className = '',
  height = 150,
  intensity = 'medium',
  glowColor = 'primary',
  interactive = false
}: WaveDividerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const particlesRef = useRef<SVGGElement>(null);

  // Animation speed based on intensity
  const speeds = {
    subtle: { morph: 8, parallax: 0.5 },
    medium: { morph: 5, parallax: 1 },
    epic: { morph: 3, parallax: 1.5 }
  };

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const speed = speeds[intensity];

      // Parallax effect
      gsap.to(containerRef.current, {
        yPercent: flip ? -10 * speed.parallax : 10 * speed.parallax,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // Liquid variant animations
      if (variant === 'liquid') {
        pathRefs.current.forEach((path, i) => {
          if (!path) return;
          const layerKey = `layer${i + 1}` as keyof typeof liquidPaths;
          const layer = liquidPaths[layerKey];
          if (layer) {
            gsap.to(path, {
              attr: { d: layer.end },
              duration: speed.morph + i * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.3
            });
          }
        });
      }

      // Aurora variant animations
      if (variant === 'aurora') {
        pathRefs.current.forEach((path, i) => {
          if (!path) return;
          const waveKey = `wave${i + 1}` as keyof typeof auroraPaths;
          const wave = auroraPaths[waveKey];
          if (wave) {
            gsap.to(path, {
              attr: { d: wave.end },
              duration: speed.morph + i * 0.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.4
            });
          }
        });
      }

      // Glow variant animation
      if (variant === 'glow') {
        const mainPath = pathRefs.current[0];
        const glowPath1 = pathRefs.current[1];
        const glowPath2 = pathRefs.current[2];
        
        if (mainPath) {
          gsap.to(mainPath, {
            attr: { d: glowPath.end },
            duration: speed.morph,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
        
        if (glowPath1) {
          gsap.to(glowPath1, {
            attr: { d: glowPath.end },
            duration: speed.morph,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          gsap.to(glowPath1, {
            opacity: 0.3,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
          });
        }
        
        if (glowPath2) {
          gsap.to(glowPath2, {
            attr: { d: glowPath.end },
            duration: speed.morph,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          gsap.to(glowPath2, {
            opacity: 0.15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
          });
        }
      }

      // Particles animation
      if (variant === 'particles' && particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('circle');
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: -80 - Math.random() * 40,
            x: `+=${Math.random() * 60 - 30}`,
            opacity: 0,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            delay: i * 0.15,
            ease: "power1.out"
          });
        });
      }

      // Glass blur animation
      if (variant === 'glass') {
        const mainPath = pathRefs.current[0];
        if (mainPath) {
          gsap.to(mainPath, {
            attr: { d: glowPath.end },
            duration: speed.morph * 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }

    }, containerRef);

    return () => ctx.revert();
  }, [animated, variant, flip, intensity]);

  // Interactive mouse effect
  useEffect(() => {
    if (!interactive || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      
      pathRefs.current.forEach((path, i) => {
        if (path) {
          gsap.to(path, {
            x: x * (20 + i * 5),
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    return () => containerRef.current?.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const getFillColor = (color: string) => {
    const colorMap: Record<string, string> = {
      background: 'hsl(var(--background))',
      surface: 'hsl(var(--surface))',
      'surface-2': 'hsl(var(--surface-2))',
      muted: 'hsl(var(--muted))',
      primary: 'hsl(var(--primary))',
      card: 'hsl(var(--card))'
    };
    return colorMap[color] || color;
  };

  const getGlowHSL = (color: string) => {
    if (color === 'primary') return 'var(--primary)';
    if (color === 'cyan') return '180 100% 50%';
    if (color === 'magenta') return '320 100% 60%';
    return 'var(--primary)';
  };

  const fillColor = getFillColor(colorTo);
  const bgColor = getFillColor(colorFrom);

  // Generate particles
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1200;
      const y = 100 + Math.random() * 50;
      const r = 2 + Math.random() * 4;
      particles.push(
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="hsl(var(--primary))"
          opacity={0.6 + Math.random() * 0.4}
        />
      );
    }
    return particles;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{ 
        height: `${height}px`,
        marginTop: flip ? 0 : `-${height / 3}px`,
        marginBottom: flip ? `-${height / 3}px` : 0,
        backgroundColor: bgColor,
        transform: flip ? 'scaleY(-1)' : 'none'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        <defs>
          {/* Aurora animated gradient */}
          <linearGradient id="aurora-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))">
              <animate attributeName="stop-color" 
                values="hsl(var(--primary));hsl(180 100% 50%);hsl(320 100% 60%);hsl(var(--primary))" 
                dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="33%" stopColor="hsl(180 100% 50%)">
              <animate attributeName="stop-color" 
                values="hsl(180 100% 50%);hsl(320 100% 60%);hsl(var(--primary));hsl(180 100% 50%)" 
                dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="66%" stopColor="hsl(320 100% 60%)">
              <animate attributeName="stop-color" 
                values="hsl(320 100% 60%);hsl(var(--primary));hsl(180 100% 50%);hsl(320 100% 60%)" 
                dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="hsl(var(--primary))">
              <animate attributeName="stop-color" 
                values="hsl(var(--primary));hsl(180 100% 50%);hsl(320 100% 60%);hsl(var(--primary))" 
                dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Liquid gradient */}
          <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="50%" stopColor="hsl(280 100% 70%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense glow filter */}
          <filter id="intense-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glass blur filter */}
          <filter id="glass-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          {/* Particle glow */}
          <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* LIQUID VARIANT */}
        {variant === 'liquid' && (
          <>
            <path
              ref={el => pathRefs.current[0] = el}
              d={liquidPaths.layer1.start}
              fill="url(#liquid-gradient)"
              fillOpacity="0.15"
              filter="url(#glass-blur)"
            />
            <path
              ref={el => pathRefs.current[1] = el}
              d={liquidPaths.layer2.start}
              fill="url(#liquid-gradient)"
              fillOpacity="0.25"
            />
            <path
              ref={el => pathRefs.current[2] = el}
              d={liquidPaths.layer3.start}
              fill="url(#liquid-gradient)"
              fillOpacity="0.4"
            />
            <path
              ref={el => pathRefs.current[3] = el}
              d={liquidPaths.layer4.start}
              fill="url(#liquid-gradient)"
              fillOpacity="0.6"
            />
            <path
              ref={el => pathRefs.current[4] = el}
              d={liquidPaths.layer5.start}
              fill={fillColor}
              fillOpacity="1"
            />
          </>
        )}

        {/* AURORA VARIANT */}
        {variant === 'aurora' && (
          <>
            {/* Glow background */}
            <path
              d={auroraPaths.wave1.start}
              fill="url(#aurora-gradient)"
              fillOpacity="0.2"
              filter="url(#intense-glow)"
            />
            {/* Wave layers */}
            <path
              ref={el => pathRefs.current[0] = el}
              d={auroraPaths.wave1.start}
              fill="url(#aurora-gradient)"
              fillOpacity="0.3"
            />
            <path
              ref={el => pathRefs.current[1] = el}
              d={auroraPaths.wave2.start}
              fill="url(#aurora-gradient)"
              fillOpacity="0.5"
            />
            <path
              ref={el => pathRefs.current[2] = el}
              d={auroraPaths.wave3.start}
              fill="url(#aurora-gradient)"
              fillOpacity="0.8"
            />
            {/* Solid base */}
            <path
              d="M0,120 L1200,120 L1200,150 L0,150 Z"
              fill={fillColor}
            />
          </>
        )}

        {/* GLOW VARIANT */}
        {variant === 'glow' && (
          <>
            {/* Outer glow */}
            <path
              ref={el => pathRefs.current[2] = el}
              d={glowPath.start}
              fill={`hsl(${getGlowHSL(glowColor)})`}
              fillOpacity="0.15"
              filter="url(#intense-glow)"
            />
            {/* Inner glow */}
            <path
              ref={el => pathRefs.current[1] = el}
              d={glowPath.start}
              fill={`hsl(${getGlowHSL(glowColor)})`}
              fillOpacity="0.4"
              filter="url(#glow-filter)"
            />
            {/* Main wave */}
            <path
              ref={el => pathRefs.current[0] = el}
              d={glowPath.start}
              fill={fillColor}
            />
            {/* Edge highlight */}
            <path
              d={glowPath.start}
              fill="none"
              stroke={`hsl(${getGlowHSL(glowColor)})`}
              strokeWidth="2"
              strokeOpacity="0.8"
              filter="url(#glow-filter)"
            />
          </>
        )}

        {/* PARTICLES VARIANT */}
        {variant === 'particles' && (
          <>
            {/* Base wave */}
            <path
              ref={el => pathRefs.current[0] = el}
              d={glowPath.start}
              fill={fillColor}
            />
            {/* Particle glow */}
            <g ref={particlesRef} filter="url(#particle-glow)">
              {generateParticles()}
            </g>
            {/* More visible particles on top */}
            <g ref={particlesRef}>
              {generateParticles()}
            </g>
          </>
        )}

        {/* GLASS VARIANT */}
        {variant === 'glass' && (
          <>
            {/* Blur background layer */}
            <rect
              x="0"
              y="0"
              width="1200"
              height="150"
              fill={fillColor}
              fillOpacity="0.3"
              filter="url(#glass-blur)"
            />
            {/* Frosted wave */}
            <path
              ref={el => pathRefs.current[0] = el}
              d={glowPath.start}
              fill={fillColor}
              fillOpacity="0.7"
              filter="url(#glass-blur)"
            />
            {/* Solid base */}
            <path
              d="M0,100 C200,80 400,120 600,90 C800,60 1000,110 1200,90 L1200,150 L0,150 Z"
              fill={fillColor}
            />
            {/* Glass highlight */}
            <path
              d="M0,60 C300,100 600,40 900,80 C1050,100 1150,60 1200,70 L1200,75 C1100,65 1000,90 850,75 C600,45 300,95 0,65 Z"
              fill="white"
              fillOpacity="0.1"
            />
          </>
        )}

        {/* FALLBACK for original variants */}
        {!['liquid', 'aurora', 'glow', 'particles', 'glass'].includes(variant) && (
          <path
            ref={el => pathRefs.current[0] = el}
            d={glowPath.start}
            fill={fillColor}
          />
        )}
      </svg>
    </div>
  );
};

export default WaveDivider;
