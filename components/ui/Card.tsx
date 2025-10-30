import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  shadow = true,
  onClick,
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowStyle = shadow ? 'shadow-md hover:shadow-xl transition-shadow duration-200' : 'shadow-sm';
  const cursorStyle = onClick ? 'cursor-pointer active:scale-95 transition-transform' : '';
  
  return (
    <div
      className={`
        card rounded-lg
        ${paddingStyles[padding]}
        ${shadowStyle}
        ${cursorStyle}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

