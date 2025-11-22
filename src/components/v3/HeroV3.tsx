import GradientButton from "@/components/GradientButton";
import { Star } from "lucide-react";
import logoBauhaus from "@/assets/bauhaus-logo-red.png";
import logoByggmax from "@/assets/byggmax-logo-red.png";
import logoKRauta from "@/assets/rauta-logo-white.png";
import logoLimont from "@/assets/limont-logo-white.png";
import logoNordgren from "@/assets/nordgren-logo-white.png";
import logoFixco from "@/assets/fixco-logo-white.png";

const HeroV3 = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '980px' }}>
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 animate-gradient-shift" 
        style={{ 
          backgroundImage: 'linear-gradient(135deg, #592db5 0%, #3d1a7a 25%, #7d40ff 50%, #4a2490 75%, #592db5 100%)',
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep purple glow - top */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#592db5] opacity-30 blur-[150px] rounded-full" />
        {/* Bright purple glow - center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7d40ff] opacity-35 blur-[180px] rounded-full" />
        {/* Light purple accent - bottom right */}
        <div className="absolute bottom-32 right-1/4 w-[450px] h-[450px] bg-[#9d6fff] opacity-25 blur-[130px] rounded-full" />
        {/* Deep purple glow - bottom left */}
        <div className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-[#4a2490] opacity-20 blur-[100px] rounded-full" />
      </div>

      {/* Right Shade Overlay */}
      <div className="absolute top-0 bottom-0 right-0 w-[16.875rem] bg-gradient-to-l from-[#0a0a0a] from-60% to-transparent 2xl:right-[-1%] md:w-[16.875rem] max-md:w-[8.125rem] max-[479px]:right-[-10%]" />
      
      {/* Content Area */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 -mt-20 px-6">
        <div className="flex flex-col items-center gap-6 max-w-5xl">
          {/* Fixco Logo */}
          <div className="mb-4">
            <img 
              src={logoFixco} 
              alt="Fixco" 
              className="h-12 md:h-16 w-auto mx-auto opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
          
          <h1 className="font-heading text-xl font-bold text-[#fafafa] text-center leading-[120%] mb-1">
            Sveriges Ledande Hantverkare
          </h1>
          <div className="flex items-center justify-center gap-1 mb-6">
            <span className="text-sm text-[#fbfaf6] tracking-wide">4.9</span>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
            ))}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#fafafa] text-center leading-[120%]">
            <span className="font-brand italic">Bygg- & fastighetstjänster</span> för privat, BRF & företag
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#fafafa] opacity-90 text-center max-w-3xl leading-relaxed">
            Expertlösningar för alla fastighetsbehov – från el till målning. Fast pris. ROT/RUT garanterat. Gratis offert inom 24h.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <GradientButton>
            Begär Kostnadsfri Offert
          </GradientButton>
          <GradientButton>
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

export default HeroV3;
