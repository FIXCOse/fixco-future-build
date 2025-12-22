import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface WaveDividerProps {
  variant?: 'wave' | 'curve' | 'layered' | 'mesh';
  flip?: boolean;
  colorFrom?: string;
  colorTo?: string;
  animated?: boolean;
  className?: string;
  height?: number;
}

// SVG path definitions for different variants
const wavePaths = {
  wave: {
    start: "M0,60 C150,100 350,0 600,50 C850,100 1050,10 1200,60 L1200,120 L0,120 Z",
    end: "M0,50 C200,10 400,90 600,60 C800,30 1000,100 1200,50 L1200,120 L0,120 Z"
  },
  curve: {
    start: "M0,80 Q600,0 1200,80 L1200,120 L0,120 Z",
    end: "M0,60 Q600,40 1200,60 L1200,120 L0,120 Z"
  },
  layered: {
    layer1: "M0,90 C300,60 600,100 900,70 C1050,55 1150,85 1200,90 L1200,120 L0,120 Z",
    layer2: "M0,70 C200,90 500,50 750,80 C950,100 1100,60 1200,70 L1200,120 L0,120 Z",
    layer3: "M0,50 C150,80 400,30 650,60 C900,90 1100,40 1200,50 L1200,120 L0,120 Z"
  },
  mesh: {
    start: "M0,40 C100,80 200,20 350,60 C500,100 650,30 800,70 C950,110 1100,50 1200,40 L1200,120 L0,120 Z",
    end: "M0,60 C150,20 300,90 450,50 C600,10 750,80 900,40 C1050,0 1150,70 1200,60 L1200,120 L0,120 Z"
  }
};

export const WaveDivider = ({
  variant = 'wave',
  flip = false,
  colorFrom = 'background',
  colorTo = 'muted',
  animated = true,
  className = '',
  height = 120
}: WaveDividerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.to(containerRef.current, {
        yPercent: flip ? -15 : 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // Wave morphing animation
      if (variant === 'wave' && pathRef.current) {
        gsap.to(pathRef.current, {
          attr: { d: wavePaths.wave.end },
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (variant === 'curve' && pathRef.current) {
        gsap.to(pathRef.current, {
          attr: { d: wavePaths.curve.end },
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (variant === 'mesh' && pathRef.current) {
        gsap.to(pathRef.current, {
          attr: { d: wavePaths.mesh.end },
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Layered animation - each layer moves independently
      if (variant === 'layered') {
        if (pathRef.current) {
          gsap.to(pathRef.current, {
            x: 20,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
        if (path2Ref.current) {
          gsap.to(path2Ref.current, {
            x: -15,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
        if (path3Ref.current) {
          gsap.to(path3Ref.current, {
            x: 10,
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animated, variant, flip]);

  // Get fill color based on semantic token
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

  const fillColor = getFillColor(colorTo);
  const bgColor = getFillColor(colorFrom);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden pointer-events-none ${className}`}
      style={{ 
        height: `${height}px`,
        marginTop: flip ? 0 : `-${height / 2}px`,
        marginBottom: flip ? `-${height / 2}px` : 0,
        backgroundColor: bgColor,
        transform: flip ? 'scaleY(-1)' : 'none'
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`wave-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(200 100% 50%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(320 100% 65%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {variant === 'layered' ? (
          <>
            {/* Layer 1 - Deepest, most transparent */}
            <path
              ref={pathRef}
              d={wavePaths.layered.layer1}
              fill={fillColor}
              fillOpacity="0.3"
            />
            {/* Layer 2 - Middle */}
            <path
              ref={path2Ref}
              d={wavePaths.layered.layer2}
              fill={fillColor}
              fillOpacity="0.5"
            />
            {/* Layer 3 - Front, solid */}
            <path
              ref={path3Ref}
              d={wavePaths.layered.layer3}
              fill={fillColor}
              fillOpacity="1"
            />
          </>
        ) : variant === 'mesh' ? (
          <>
            {/* Mesh background glow */}
            <path
              d={wavePaths.mesh.start}
              fill={`url(#wave-gradient-${variant})`}
              fillOpacity="0.6"
            />
            {/* Main mesh path */}
            <path
              ref={pathRef}
              d={wavePaths.mesh.start}
              fill={fillColor}
            />
          </>
        ) : (
          /* Simple wave or curve */
          <path
            ref={pathRef}
            d={variant === 'wave' ? wavePaths.wave.start : wavePaths.curve.start}
            fill={fillColor}
          />
        )}
      </svg>
    </div>
  );
};

export default WaveDivider;
