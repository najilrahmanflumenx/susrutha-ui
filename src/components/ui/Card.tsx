'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'bordered' | 'dark';
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  hoverEffect = true,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-[32px] p-6 sm:p-8 transition-all duration-500 relative overflow-hidden';

  const variants = {
    default: 'bg-surface-card border border-primary/5 shadow-sm',
    glass: 'glass-panel shadow-glass',
    elevated: 'bg-surface-elevated border border-primary/10 shadow-glow-mahogany',
    bordered: 'bg-transparent border border-primary/20 hover:border-gold/60',
    dark: 'bg-primary text-surface border border-gold/20 shadow-xl',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverEffect && 'luxury-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
