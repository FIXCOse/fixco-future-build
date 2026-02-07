import React from 'react';

interface AnswerCapsuleProps {
  serviceName: string;
  areaName?: string;
  priceRange: string;
  priceAfterDeduction: string;
  taxDeduction: 'ROT' | 'RUT';
  phone?: string;
}

/**
 * AnswerCapsule - Optimerad för AI Overviews
 * 40-60 ord som AI-system kan extrahera som "featured snippet"
 */
export const AnswerCapsule: React.FC<AnswerCapsuleProps> = ({
  serviceName,
  areaName,
  priceRange,
  priceAfterDeduction,
  taxDeduction,
  phone = '+46-70-123-45-67'
}) => {
  const location = areaName ? ` i ${areaName}` : ' i Uppsala och Stockholm';
  
  return (
    <div 
      className="answer-capsule speakable-intro bg-muted/30 p-4 rounded-lg border border-border/50 mb-6"
      itemScope 
      itemType="https://schema.org/Answer"
    >
      <p 
        className="text-base leading-relaxed text-foreground/90"
        itemProp="text"
      >
        <strong>{serviceName}{location}</strong> kostar {priceRange} per timme. 
        Med {taxDeduction}-avdrag (30% rabatt) betalar du endast {priceAfterDeduction}. 
        Alla hantverkare har F-skatt och är försäkrade. 
        Boka via Fixco på {phone} – offert inom 24 timmar, gratis hembesök.
      </p>
    </div>
  );
};

export default AnswerCapsule;
