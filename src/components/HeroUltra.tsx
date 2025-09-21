import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Phone, Award, Users, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import MagneticButton from "@/components/MagneticButton";
import TrustChips from "@/components/TrustChips";
import useProgressiveEnhancement from "@/hooks/useProgressiveEnhancement";

interface ParticleSystemProps {
  count?: number;
  speed?: number;
}

// PRO: CSS-based particle system (lightweight)
const ParticleSystemPRO = ({ count = 50, speed = 1 }: ParticleSystemProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
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

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const trustIndicators = [
    { icon: "image", src: "/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png", title: "Fixco Kvalitet", description: "Vårt löfte till dig" },
    { icon: Award, title: "Lägst pris (ROT)", description: "480 kr/h efter ROT-avdrag" },
    { icon: Users, title: "2000+ kunder", description: "Genomsnittligt betyg 4.9/5" },
    { icon: MapPin, title: "Uppsala & Stockholm", description: "Nationellt vid större projekt" }
  ];

  return (
    <section className="relative min-h-screen flex items-start md:items-center justify-center overflow-hidden pt-[calc(64px+5rem)] md:pt-0">
        {/* Background System - Progressive Enhancement */}
        <div className="absolute inset-0">
          {/* Base gradient (always visible) */}
          <div className="absolute inset-0 hero-background" />
          
        {/* F Watermark Background Elements - More Visible */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute top-16 left-8 w-32 h-32 object-contain rotate-12 opacity-40 animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute bottom-16 right-8 w-24 h-24 object-contain -rotate-12 opacity-30 animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute top-1/4 right-12 w-28 h-28 object-contain rotate-45 opacity-25 animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
          <img 
            src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
            alt="" 
            className="absolute bottom-1/3 left-12 w-20 h-20 object-contain -rotate-6 opacity-35 animate-pulse"
            style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
          />
        </div>
          
          {/* PRO: Enhanced gradients */}
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
              <ParticleSystemPRO count={30} speed={1} />
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight mb-6 px-2"
              animate={ultraEnabled && capabilities.prefersMotion ? {
                textShadow: [
                  "0 0 0px hsl(var(--primary))",
                  "0 0 20px hsl(var(--primary) / 0.3)",
                  "0 0 0px hsl(var(--primary))"
                ]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="gradient-text">Fixco</span> löser allt inom{" "}
              <br />
              <motion.span 
                className="gradient-text"
                animate={ultraEnabled ? { 
                  scale: [1, 1.02, 1],
                  rotate: [0, 0.5, 0] 
                } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                hem & byggnad
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Snabbare, billigare och mer professionellt än konkurrenterna. 
              <span className="text-primary font-semibold"> Start inom {'< 5 dagar'}, 50% rabatt med ROT.</span>
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/kontakt">
                <MagneticButton
                  className="gradient-primary text-primary-foreground text-lg px-8 py-4 shadow-premium hover:shadow-glow"
                >
                  Begär offert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
              <Link to="/tjanster">
                <MagneticButton
                  variant="outline"
                  className="text-lg px-8 py-4 border-primary/30 hover:bg-primary/10 backdrop-blur-sm"
                >
                  Se våra tjänster
                  <ChevronRight className="ml-2 h-5 w-5" />
                </MagneticButton>
              </Link>
            </motion.div>

            {/* Trust Indicators - Horizontal Layout */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto mb-8 px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {trustIndicators.map((item, index) => {
                return (
                  <motion.div
                    key={item.title}
                    className="card-service p-6 text-center backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                    whileHover={ultraEnabled ? { 
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 20px 40px rgba(139, 69, 19, 0.2)"
                    } : { scale: 1.02 }}
                  >
                    <div className="w-12 h-12 mx-auto gradient-primary-subtle rounded-xl flex items-center justify-center mb-4">
                      {item.icon === "image" ? (
                        <img 
                          src={item.src} 
                          alt="Fixco Brand" 
                          className="h-8 w-8 object-contain opacity-90"
                        />
                      ) : (
                        (() => {
                          const IconComponent = item.icon as any;
                          return <IconComponent className="h-6 w-6 text-primary" />;
                        })()
                      )}
                    </div>
                    <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Trust Chips - All Visible */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <TrustChips 
                variant="home" 
                showAll={true}
                className="flex flex-wrap items-center justify-center gap-3 pt-4"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
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