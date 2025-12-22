import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface WaveDividerProps {
  flip?: boolean;
  colorFrom?: string;
  colorTo?: string;
  animated?: boolean;
  className?: string;
  height?: number;
  particleCount?: number;
}

const wavePath = {
  start: "M0,50 C200,90 400,20 600,60 C800,100 1000,30 1200,70 L1200,150 L0,150 Z",
  end: "M0,70 C200,30 400,80 600,40 C800,0 1000,70 1200,30 L1200,150 L0,150 Z"
};

export const WaveDivider = ({
  flip = false,
  colorFrom = 'transparent',
  colorTo = 'transparent',
  animated = true,
  className = '',
  height = 150,
  particleCount = 40
}: WaveDividerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect
      gsap.to(containerRef.current, {
        yPercent: flip ? -10 : 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // Wave morph animation
      if (pathRef.current) {
        gsap.to(pathRef.current, {
          attr: { d: wavePath.end },
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Particles animation
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('circle');
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: -100 - Math.random() * 60,
            x: `+=${Math.random() * 80 - 40}`,
            opacity: 0,
            duration: 2.5 + Math.random() * 2.5,
            repeat: -1,
            delay: i * 0.1,
            ease: "power1.out"
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animated, flip]);

  const getFillColor = (color: string) => {
    if (color === 'transparent') return 'transparent';
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

  // Generate particles along the wave
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 1200;
      const y = 80 + Math.random() * 60;
      const r = 2 + Math.random() * 5;
      const opacity = 0.4 + Math.random() * 0.6;
      particles.push(
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="hsl(var(--primary))"
          opacity={opacity}
        />
      );
    }
    return particles;
  };

  const bgColor = getFillColor(colorFrom);

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
          {/* Particle glow filter */}
          <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Invisible wave path for morphing reference */}
        <path
          ref={pathRef}
          d={wavePath.start}
          fill="transparent"
        />

        {/* Glowing particles */}
        <g ref={particlesRef} filter="url(#particle-glow)">
          {generateParticles()}
        </g>
      </svg>
    </div>
  );
};
