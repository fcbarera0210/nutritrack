'use client';

import { useEffect, useState } from 'react';

interface FloatingFoodProps {
  emoji: string;
  className?: string;
  delay?: number;
}

export function FloatingFood({ emoji, className = '', delay = 0 }: FloatingFoodProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!isVisible) return null;
  
  return (
    <div
      className={`
        animate-float
        text-4xl
        opacity-60
        select-none
        pointer-events-none
        ${className}
      `}
      role="presentation"
    >
      {emoji}
    </div>
  );
}

