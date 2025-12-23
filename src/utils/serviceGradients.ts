// Smart hem-inspirerade färger för olika tjänstekategorier
export const getGradientForService = (slug: string): string => {
  const gradients: Record<string, string> = {
    'el': 'bg-gradient-to-r from-yellow-400 to-orange-500', // Gul-orange (elektricitet)
    'vvs': 'bg-gradient-to-r from-blue-400 to-cyan-500', // Blå-cyan (vatten)
    'snickeri': 'bg-gradient-to-r from-amber-500 to-orange-600', // Amber-orange (trä)
    'malare': 'bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-600', // Färgpalett (turkos-rosa-gul-lila)
    'montering': 'bg-gradient-to-r from-purple-500 to-violet-600', // Lila-violet
    'tradgard': 'bg-gradient-to-r from-green-400 to-lime-500', // Grön-lime (natur)
    'stadning': 'bg-gradient-to-r from-pink-400 to-rose-500', // Rosa-rose
    'markarbeten': 'bg-gradient-to-r from-stone-500 to-amber-600', // Sten-amber (jord)
    'tekniska-installationer': 'bg-gradient-to-r from-slate-500 to-gray-600', // Grå-silver (tech)
    'flytt': 'bg-gradient-to-r from-red-400 to-pink-500' // Röd-rosa (energi/rörelse)
  };
  
  return gradients[slug] || 'bg-gradient-to-r from-gray-400 to-gray-500';
};
