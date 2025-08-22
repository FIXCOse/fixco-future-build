import { useEffect, useRef } from "react";

const HeroMotion = () => {
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

    // Particle system for gradient noise effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      hue: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 300 + 100,
        maxLife: Math.random() * 300 + 100,
        hue: Math.random() * 60 + 280 // Purple to pink range
      };
    };

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.offsetWidth * 0.3, canvas.offsetHeight * 0.3, 0,
        canvas.offsetWidth * 0.7, canvas.offsetHeight * 0.7, Math.max(canvas.offsetWidth, canvas.offsetHeight)
      );
      
      gradient.addColorStop(0, `hsla(280, 100%, 60%, 0.03)`);
      gradient.addColorStop(0.5, `hsla(320, 100%, 65%, 0.02)`);
      gradient.addColorStop(1, `hsla(280, 100%, 60%, 0.01)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx + Math.sin(time * 0.01 + particle.x * 0.01) * 0.1;
        particle.y += particle.vy + Math.cos(time * 0.01 + particle.y * 0.01) * 0.1;
        
        // Update life
        particle.life--;
        
        // Reset particle if dead or out of bounds
        if (particle.life <= 0 || 
            particle.x < -10 || particle.x > canvas.offsetWidth + 10 ||
            particle.y < -10 || particle.y > canvas.offsetHeight + 10) {
          particles[index] = createParticle();
          return;
        }
        
        // Calculate alpha based on life
        const alpha = (particle.life / particle.maxLife) * 0.3;
        
        // Create radial gradient for each particle
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, 20
        );
        
        particleGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${alpha})`);
        particleGradient.addColorStop(1, `hsla(${particle.hue}, 100%, 70%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 20, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add connecting lines between nearby particles
      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach(particle2 => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const alpha = (1 - distance / 100) * 0.1;
            ctx.strokeStyle = `hsla(300, 100%, 70%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        mixBlendMode: 'screen',
        opacity: 0.7
      }}
    />
  );
};

export default HeroMotion;