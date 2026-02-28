import React from 'react';
import { useCopy } from '@/copy/CopyProvider';

interface AnswerCapsuleProps {
  serviceName: string;
  areaName?: string;
  priceRange: string;
  priceAfterDeduction: string;
  taxDeduction: 'ROT' | 'RUT';
  phone?: string;
}

export const AnswerCapsule: React.FC<AnswerCapsuleProps> = ({
  serviceName,
  areaName,
  priceRange,
  priceAfterDeduction,
  taxDeduction,
  phone = '+46-70-123-45-67'
}) => {
  const { t, locale } = useCopy();
  const location = areaName 
    ? ` ${locale === 'en' ? 'in' : 'i'} ${areaName}` 
    : locale === 'en' ? ' in Uppsala and Stockholm' : ' i Uppsala och Stockholm';
  
  const deductionLabel = locale === 'en' ? `${taxDeduction} deduction (30% discount)` : `${taxDeduction}-avdrag (30% rabatt)`;
  const payOnly = locale === 'en' ? 'you only pay' : 'betalar du endast';
  const quoteTime = locale === 'en' ? '– quote within 24 hours, free home visit.' : '– offert inom 24 timmar, gratis hembesök.';
  
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
        <strong>{serviceName}{location}</strong> {t('answer.costsPerHour')} {priceRange} {locale === 'en' ? 'per hour' : 'per timme'}. 
        {t('answer.withDeduction')} {deductionLabel} {payOnly} {priceAfterDeduction}. 
        {t('answer.allCraftsmen')} 
        {t('answer.bookVia')} {phone} {quoteTime}
      </p>
    </div>
  );
};

export default AnswerCapsule;
