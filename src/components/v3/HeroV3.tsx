import React, { useRef, useEffect } from "react";
import GradientButton from "@/components/GradientButton";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";
import { Star } from "lucide-react";
import { useContentStore } from "@/stores/contentStore";
import { gsap, SplitText } from "@/lib/gsap";
import logoBauhaus from "@/assets/bauhaus-logo-red.png";
import logoByggmax from "@/assets/byggmax-logo-red.png";
import logoKRauta from "@/assets/rauta-logo-white.png";
import logoLimont from "@/assets/limont-logo-white.png";
import logoNordgren from "@/assets/nordgren-logo-white.png";
import logoFixco from "@/assets/fixco-logo-white.png";

const HeroV3 = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLHeadingElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const { isHydrated } = useContentStore();

  useEffect(() => {
    if (!isHydrated) return;

    let ctx: gsap.Context | null = null;
    let isMounted = true;

    // Fallback: Visa element om animering misslyckas efter 2 sekunder
    const fallbackTimer = setTimeout(() => {
      [eyebrowRef, starsRef, paragraphRef, buttonsRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'none';
        }
      });
    }, 2000);

    // Wait for fonts to load before SplitText to avoid layout shifts
    document.fonts.ready.then(() => {
      if (!isMounted) return; // Avbryt om komponenten unmountat
      
      clearTimeout(fallbackTimer); // Rensa fallback om fonts laddade

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.1 });

        // 1. Animate eyebrow text
        if (eyebrowRef.current) {
          tl.from(eyebrowRef.current, {
            autoAlpha: 0,
            x: -30,
            duration: 0.6,
            ease: "power2.out"
          });
        }

        // 2. Stagger stars (med null-check för children)
        if (starsRef.current && starsRef.current.children.length > 0) {
          tl.from(starsRef.current.children, {
            autoAlpha: 0,
            scale: 0,
            duration: 0.3,
            stagger: 0.1,
            ease: "back.out(1.7)"
          }, "-=0.3");
        }

        // 3. SplitText animation on headline (fonts are now loaded)
        if (headlineRef.current) {
          const split = new SplitText(headlineRef.current, { 
            type: "chars,words",
            charsClass: "split-char",
            wordsClass: "split-word"
          });

          tl.from(split.chars, {
            autoAlpha: 0,
            y: 50,
            rotationX: -90,
            rotationY: 20,
            scale: 0.8,
            duration: 0.8,
            stagger: 0.03,
            ease: "back.out(1.7)"
          }, "-=0.2");
        }

        // 4. Animate paragraph
        if (paragraphRef.current) {
          tl.from(paragraphRef.current, {
            autoAlpha: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.4");
        }

        // 5. Animate buttons (med null-check för children)
        if (buttonsRef.current && buttonsRef.current.children.length > 0) {
          tl.from(buttonsRef.current.children, {
            autoAlpha: 0,
            scale: 0.8,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.7)",
            clearProps: "transform"
          }, "-=0.3");
        }
      }, heroRef);
    });

    // KORREKT: Cleanup returneras direkt från useEffect
    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      if (ctx) ctx.revert();
    };
  }, [isHydrated]);

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden h-[85vh] min-h-[650px] max-h-[850px]">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 animate-gradient-shift" 
        style={{ 
          backgroundImage: 'linear-gradient(135deg, #592db5 0%, #3d1a7a 25%, #7d40ff 50%, #4a2490 75%, #592db5 100%)',
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Glow Effects - Reduced blur for performance, CSS animations instead of GSAP */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep purple glow - top */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#592db5] opacity-30 blur-3xl rounded-full animate-float-slow" />
        {/* Bright purple glow - center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#7d40ff] opacity-35 blur-3xl rounded-full animate-float-medium" />
        {/* Light purple accent - bottom right */}
        <div className="absolute bottom-32 right-1/4 w-64 h-64 bg-[#9d6fff] opacity-25 blur-2xl rounded-full animate-float-fast" />
        {/* Deep purple glow - bottom left */}
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-[#4a2490] opacity-20 blur-2xl rounded-full animate-float-reverse" />
      </div>

      {/* Fixco Logo - Absolute positioned with fade-in animation */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-8 md:py-10 z-[99] pointer-events-none animate-logo-fade-in">
        <div className="pointer-events-auto">
          <a href="/" className="inline-block max-w-full transition-transform duration-300 hover:scale-105 no-underline">
            <img 
              src={logoFixco} 
              loading="lazy"
              alt="Fixco" 
              className="max-h-12 md:max-h-24 w-auto block"
            />
          </a>
        </div>
      </div>

      {/* Content Area */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 -mt-20 px-6">
        <div className="flex flex-col items-center gap-6 max-w-5xl">
          
          <h1 ref={eyebrowRef} className="font-heading text-xl font-bold text-[#fafafa] text-center leading-[120%] mb-1">
            Sveriges Ledande Hantverkare
          </h1>
          <div ref={starsRef} className="flex items-center justify-center gap-1 mb-6">
            <span className="text-sm text-[#fbfaf6] tracking-wide">4.9</span>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
            ))}
          </div>
          <h1 ref={headlineRef} className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#fafafa] text-center leading-[120%]">
            <span className="font-brand italic">Bygg- & fastighetstjänster</span> för privat, BRF & företag
          </h1>
          <p ref={paragraphRef} className="text-lg md:text-xl lg:text-2xl text-[#fafafa] opacity-90 text-center max-w-3xl leading-relaxed">
            Expertlösningar för alla fastighetsbehov – från el till målning. Fast pris. ROT/RUT garanterat. Gratis offert inom 24h.
          </p>
        </div>
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 items-center">
          <GradientButton onClick={() => openServiceRequestModal({ showCategories: true })}>
            Begär Kostnadsfri Offert
          </GradientButton>
          <GradientButton href="/tjanster">
            Våra Tjänster
          </GradientButton>
        </div>
        
        {/* Client Logos Section */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="relative w-full max-w-5xl overflow-hidden">
            {/* Scrolling logos container */}
            <div className="flex gap-12 md:gap-16 animate-scroll">
              {/* First set of logos */}
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoBauhaus} 
                  alt="BAUHAUS" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoByggmax} 
                  alt="BYGGMAX" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity scale-90"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoKRauta} 
                  alt="K-Rauta" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity scale-110"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoLimont} 
                  alt="Limont Entreprenad" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity scale-125"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoNordgren} 
                  alt="Nordgren & Partners" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity brightness-0 invert scale-100"
                />
              </div>
              
              {/* Duplicate set of logos for seamless loop */}
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoBauhaus} 
                  alt="BAUHAUS" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoByggmax} 
                  alt="BYGGMAX" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity scale-90"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoKRauta} 
                  alt="K-Rauta" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity scale-110"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoLimont} 
                  alt="Limont Entreprenad" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity scale-125"
                />
              </div>
              <div className="h-6 md:h-8 flex items-center shrink-0">
                <img 
                  loading="lazy" 
                  src={logoNordgren} 
                  alt="Nordgren & Partners" 
                  className="h-full w-auto opacity-60 hover:opacity-100 transition-opacity brightness-0 invert scale-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroV3);
