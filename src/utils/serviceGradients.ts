// Smart hem-inspirerade färger för olika tjänstekategorier
export const getGradientForService = (slug: string): string => {
  const gradients: Record<string, string> = {
    'el': 'bg-gradient-to-r from-yellow-400 to-orange-500',
    'elektriker': 'bg-gradient-to-r from-yellow-400 to-orange-500',
    'elinstallation': 'bg-gradient-to-r from-yellow-400 to-orange-500',
    'vvs': 'bg-gradient-to-r from-blue-400 to-cyan-500',
    'badrumsrenovering': 'bg-gradient-to-r from-blue-400 to-cyan-500',
    'snickeri': 'bg-gradient-to-r from-amber-500 to-orange-600',
    'snickare': 'bg-gradient-to-r from-amber-500 to-orange-600',
    'koksrenovering': 'bg-gradient-to-r from-amber-500 to-orange-600',
    'altanbygge': 'bg-gradient-to-r from-amber-500 to-orange-600',
    'malare': 'bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-600',
    'malning': 'bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-600',
    'fasadmalning': 'bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-600',
    'inomhusmalning': 'bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 to-purple-600',
    'montering': 'bg-gradient-to-r from-purple-500 to-violet-600',
    'koksmontering': 'bg-gradient-to-r from-purple-500 to-violet-600',
    'mobelmontering': 'bg-gradient-to-r from-purple-500 to-violet-600',
    'tradgard': 'bg-gradient-to-r from-green-400 to-lime-500',
    'stadning': 'bg-gradient-to-r from-pink-400 to-rose-500',
    'markarbeten': 'bg-gradient-to-r from-stone-500 to-amber-600',
    'tekniska-installationer': 'bg-gradient-to-r from-slate-500 to-gray-600',
    'flytt': 'bg-gradient-to-r from-red-400 to-pink-500',
    'dorrlas': 'bg-gradient-to-r from-slate-400 to-gray-500',
    'golvlaggning': 'bg-gradient-to-r from-amber-600 to-yellow-700',
    'golv': 'bg-gradient-to-r from-amber-600 to-yellow-700',
  };
  
  return gradients[slug] || 'bg-gradient-to-r from-gray-400 to-gray-500';
};

// Full CSS gradient strings for hero backgrounds (inline style, like HeroV3)
export const getHeroGradientStyle = (slug: string): string => {
  const gradients: Record<string, string> = {
    'el': 'linear-gradient(135deg, #d97706 0%, #b45309 25%, #f59e0b 50%, #c2410c 75%, #d97706 100%)',
    'elektriker': 'linear-gradient(135deg, #d97706 0%, #b45309 25%, #f59e0b 50%, #c2410c 75%, #d97706 100%)',
    'elinstallation': 'linear-gradient(135deg, #d97706 0%, #b45309 25%, #f59e0b 50%, #c2410c 75%, #d97706 100%)',
    'vvs': 'linear-gradient(135deg, #0284c7 0%, #0369a1 25%, #06b6d4 50%, #0e7490 75%, #0284c7 100%)',
    'badrumsrenovering': 'linear-gradient(135deg, #0284c7 0%, #0369a1 25%, #06b6d4 50%, #0e7490 75%, #0284c7 100%)',
    'snickare': 'linear-gradient(135deg, #d97706 0%, #92400e 25%, #f59e0b 50%, #b45309 75%, #d97706 100%)',
    'snickeri': 'linear-gradient(135deg, #d97706 0%, #92400e 25%, #f59e0b 50%, #b45309 75%, #d97706 100%)',
    'koksrenovering': 'linear-gradient(135deg, #d97706 0%, #92400e 25%, #f59e0b 50%, #b45309 75%, #d97706 100%)',
    'altanbygge': 'linear-gradient(135deg, #d97706 0%, #92400e 25%, #f59e0b 50%, #b45309 75%, #d97706 100%)',
    'malare': 'linear-gradient(135deg, #06b6d4 0%, #db2777 25%, #eab308 50%, #9333ea 75%, #06b6d4 100%)',
    'malning': 'linear-gradient(135deg, #06b6d4 0%, #db2777 25%, #eab308 50%, #9333ea 75%, #06b6d4 100%)',
    'fasadmalning': 'linear-gradient(135deg, #06b6d4 0%, #db2777 25%, #eab308 50%, #9333ea 75%, #06b6d4 100%)',
    'inomhusmalning': 'linear-gradient(135deg, #06b6d4 0%, #db2777 25%, #eab308 50%, #9333ea 75%, #06b6d4 100%)',
    'montering': 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 25%, #8b5cf6 50%, #6d28d9 75%, #7c3aed 100%)',
    'koksmontering': 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 25%, #8b5cf6 50%, #6d28d9 75%, #7c3aed 100%)',
    'mobelmontering': 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 25%, #8b5cf6 50%, #6d28d9 75%, #7c3aed 100%)',
    'tradgard': 'linear-gradient(135deg, #16a34a 0%, #15803d 25%, #84cc16 50%, #166534 75%, #16a34a 100%)',
    'stadning': 'linear-gradient(135deg, #ec4899 0%, #be185d 25%, #f472b6 50%, #9d174d 75%, #ec4899 100%)',
    'markarbeten': 'linear-gradient(135deg, #78716c 0%, #57534e 25%, #d97706 50%, #44403c 75%, #78716c 100%)',
    'tekniska-installationer': 'linear-gradient(135deg, #64748b 0%, #475569 25%, #94a3b8 50%, #334155 75%, #64748b 100%)',
    'flytt': 'linear-gradient(135deg, #ef4444 0%, #b91c1c 25%, #f472b6 50%, #991b1b 75%, #ef4444 100%)',
    'dorrlas': 'linear-gradient(135deg, #64748b 0%, #475569 25%, #94a3b8 50%, #334155 75%, #64748b 100%)',
    'golvlaggning': 'linear-gradient(135deg, #d97706 0%, #78350f 25%, #b45309 50%, #92400e 75%, #d97706 100%)',
    'golv': 'linear-gradient(135deg, #d97706 0%, #78350f 25%, #b45309 50%, #92400e 75%, #d97706 100%)',
  };
  
  return gradients[slug] || 'linear-gradient(135deg, #592db5 0%, #3d1a7a 25%, #7d40ff 50%, #4a2490 75%, #592db5 100%)';
};
