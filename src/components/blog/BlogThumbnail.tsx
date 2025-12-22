import fixcoLogo from '@/assets/fixco-logo-white.png';

interface BlogThumbnailProps {
  category: string;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  'rot-rut': 'ROT-AVDRAG',
  'renovering': 'RENOVERING',
  'tips': 'TIPS & RÅD',
  'nyheter': 'NYHETER',
  'guider': 'GUIDE',
  'energi': 'ENERGI',
  'brf': 'BRF-GUIDE',
  'lagstiftning': 'REGLER 2026',
  'marknad': 'MARKNAD',
};

const BlogThumbnail = ({ category, className = '' }: BlogThumbnailProps) => {
  const categoryLabel = categoryLabels[category] || category.toUpperCase();

  return (
    <div 
      className={`relative aspect-video overflow-hidden ${className}`}
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(271, 81%, 35%) 0%, hsl(271, 91%, 15%) 60%, hsl(271, 100%, 8%) 100%)',
      }}
    >
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 30%, hsl(271, 70%, 50%) 0%, transparent 50%)',
        }}
      />
      
      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <img 
          src={fixcoLogo} 
          alt="Fixco" 
          className="h-12 md:h-16 lg:h-20 w-auto mb-3 drop-shadow-2xl"
        />
        
        {/* Tagline */}
        <p className="text-white/70 text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-light">
          Din Helhetslösning
        </p>
        
        {/* Category label */}
        <div className="mt-auto">
          <span 
            className="text-white font-bold text-lg md:text-xl lg:text-2xl tracking-widest uppercase"
            style={{
              textShadow: '0 2px 20px rgba(139, 92, 246, 0.5)',
            }}
          >
            {categoryLabel}
          </span>
        </div>
      </div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
    </div>
  );
};

export default BlogThumbnail;
