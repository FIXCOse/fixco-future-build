import { ReactNode } from 'react';

interface SimplifiedSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Simplified section wrapper that reduces DOM depth
 * by removing unnecessary div nesting
 */
export const SimplifiedSection = ({ children, className = '' }: SimplifiedSectionProps) => {
  return (
    <section className={className}>
      {children}
    </section>
  );
};
