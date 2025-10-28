import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Award, Users, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import MagneticButton from "@/components/MagneticButton";
import TrustChips from "@/components/TrustChips";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";
import { useCopy } from "@/copy/CopyProvider";
import { EditableText } from "@/components/EditableText";
import { FixcoFIcon } from "@/components/icons/FixcoFIcon";
import { AnimatedFixcoFIcon } from "@/components/icons/AnimatedFixcoFIcon";
import { useUnicornStudio } from "@/hooks/useUnicornStudio";

interface ParticleSystemProps {
  count?: number;
  speed?: number;
}

// PRO: Optimized CSS-based particle system (reduced DOM nodes for performance)
const ParticleSystemPRO = ({ count = 12, speed = 1 }: ParticleSystemProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full blur-[0.5px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ULTRA: WebGL-based particle system (will be lazy loaded)
const ParticleSystemULTRA = ({ count = 200, speed = 1 }: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2 * speed,
        vy: (Math.random() - 0.5) * 2 * speed,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: Math.random() * 3 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Create gradient with resolved CSS custom properties
      const gradient = ctx.createRadialGradient(
        canvas.offsetWidth / 2, canvas.offsetHeight / 2, 0,
        canvas.offsetWidth / 2, canvas.offsetHeight / 2, canvas.offsetWidth / 2
      );
      
      // Get computed CSS values and convert to proper color format
      const primaryHsl = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      const accentHsl = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      
      gradient.addColorStop(0, `hsl(${primaryHsl})`);
      gradient.addColorStop(1, `hsl(${accentHsl})`);
      
      particles.forEach(particle => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        
        // Reset if out of bounds or dead
        if (particle.x < 0 || particle.x > canvas.offsetWidth || 
            particle.y < 0 || particle.y > canvas.offsetHeight || 
            particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.offsetWidth;
          particle.y = Math.random() * canvas.offsetHeight;
          particle.life = 0;
        }
        
        // Draw particle
        const alpha = (1 - particle.life / particle.maxLife) * 0.6;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, speed]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

const HeroUltra = () => {
  const { ultraEnabled, capabilities } = useProgressiveEnhancement();
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useCopy();
  const unicornRef = useUnicornStudio('tVTHLQLXdvHumXA5lN2z', ultraEnabled && capabilities.prefersMotion);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Clear old hero content from localStorage on first load
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('hero-content-cleared');
    if (!hasCleared) {
      const store = localStorage.getItem('fixco-content-store');
      if (store) {
        try {
          const parsed = JSON.parse(store);
          let needsReload = false;
          
          if (parsed?.state?.content?.sv?.['hero-title']) {
            delete parsed.state.content.sv['hero-title'];
            needsReload = true;
          }
          if (parsed?.state?.content?.sv?.['hero-subtitle']) {
            delete parsed.state.content.sv['hero-subtitle'];
            needsReload = true;
          }
          if (parsed?.state?.content?.en?.['hero-title']) {
            delete parsed.state.content.en['hero-title'];
            needsReload = true;
          }
          if (parsed?.state?.content?.en?.['hero-subtitle']) {
            delete parsed.state.content.en['hero-subtitle'];
            needsReload = true;
          }
          
          if (needsReload) {
            localStorage.setItem('fixco-content-store', JSON.stringify(parsed));
            sessionStorage.setItem('hero-content-cleared', 'true');
            window.location.reload();
          }
        } catch (error) {
          console.error('Failed to clear hero content:', error);
        }
      }
      sessionStorage.setItem('hero-content-cleared', 'true');
    }
  }, []);

  const trustIndicators = [
    { icon: "image", src: "/assets/fixco-f-icon-new.png", fallback: "/assets/fixco-icon.webp", title: t('hero.trust_quality'), description: t('hero.trust_quality_desc') },
    { icon: Award, title: t('hero.trust_price'), description: t('hero.trust_price_desc') },
    { icon: Users, title: t('hero.trust_customers'), description: t('hero.trust_customers_desc') },
    { icon: MapPin, title: t('hero.trust_locations'), description: t('hero.trust_locations_desc') }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Background System - Progressive Enhancement */}
        <div className="absolute inset-0">
          {/* Base gradient (always visible) */}
          <div className="absolute inset-0 hero-background" />
          
          {/* UnicornStudio Animation - ULTRA only */}
          {ultraEnabled && capabilities.prefersMotion && (
            <div 
              ref={unicornRef}
              data-us-project="tVTHLQLXdvHumXA5lN2z"
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                filter: 'hue-rotate(20deg) saturate(1.3) brightness(1.1)',
                mixBlendMode: 'screen'
              }}
            />
          )}
          
        {/* Simplified F Watermark - Using static F icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div 
            className="absolute top-1/4 right-12 w-28 h-28 rotate-45 animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
            aria-hidden="true"
          >
            <FixcoFIcon className="w-full h-full" />
          </div>
          <div 
            className="absolute bottom-1/3 left-12 w-20 h-20 -rotate-6 animate-pulse"
            style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
            aria-hidden="true"
          >
            <FixcoFIcon className="w-full h-full" />
          </div>
        </div>
          
          {/* Animated gradients */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(147, 51, 234, 0.2) 0%, transparent 50%, rgba(236, 72, 153, 0.2) 100%)",
              "linear-gradient(225deg, rgba(147, 51, 234, 0.2) 0%, transparent 50%, rgba(236, 72, 153, 0.2) 100%)",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.2) 0%, transparent 50%, rgba(236, 72, 153, 0.2) 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Particle System - Progressive Enhancement */}
        {capabilities.prefersMotion && (
          <>
            {ultraEnabled ? (
              <ParticleSystemULTRA count={150} speed={0.5} />
            ) : (
              <ParticleSystemPRO count={12} speed={1} />
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <EditableText
              id="hero-title"
              initialContent={t('home.hero.title')}
              type="heading"
              as="h1"
              className="text-2xl sm:text-3xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6 px-2 text-foreground"
              placeholder="Klicka för att redigera rubrik"
            />
            
            <EditableText
              id="hero-subtitle"
              initialContent={t('home.hero.subtitle')}
              type="text"
              as="p"
              className="text-base md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4"
              placeholder="Klicka för att redigera undertext"
            />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <Link to={t('nav.home') === 'Home' ? '/en/contact' : '/kontakt'}>
                <MagneticButton className="bg-primary text-primary-foreground text-lg px-8 py-4">
                  {t('home.hero.primaryCta')}
                </MagneticButton>
              </Link>
              <Link to={t('nav.home') === 'Home' ? '/en/services' : '/tjanster'}>
                <MagneticButton
                  variant="outline"
                  className="text-lg px-8 py-4 border-primary/30 hover:bg-primary/10"
                >
                  {t('common.services')}
                </MagneticButton>
              </Link>
            </div>

            {/* Trust Indicators - 4 Column Grid */}
            <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch max-w-6xl mx-auto mb-8 px-4">
              {trustIndicators.map((item, index) => {
                return (
                  <div
                    key={item.title}
                    className="h-full"
                  >
              <div className="h-full rounded-xl bg-surface border border-border shadow-sm hover:shadow-md transition-shadow p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  {item.icon === "image" ? (
                    <AnimatedFixcoFIcon className="h-10 w-10" />
                  ) : (
                    (() => {
                      const IconComponent = item.icon as any;
                      return <IconComponent className="h-6 w-6 text-primary" />;
                    })()
                  )}
                </div>
                      <EditableText
                        id={`trust-${index}-title`}
                        initialContent={item.title}
                        type="heading"
                        as="h3"
                        className="font-bold text-sm mb-2"
                        placeholder="Redigera titel"
                      />
                      <EditableText
                        id={`trust-${index}-desc`}
                        initialContent={item.description}
                        type="text"
                        as="p"
                        className="text-xs text-muted-foreground"
                        placeholder="Redigera beskrivning"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Chips - All Visible */}
            <div className="max-w-4xl mx-auto">
              <TrustChips 
                variant="home" 
                showAll={true}
                className="flex flex-wrap items-center justify-center gap-3 pt-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroUltra;