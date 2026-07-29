'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'gold' | 'mahogany' | 'bronze' | 'success' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  children,
  icon,
  className,
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase';

  const variants = {
    gold: 'bg-gold/15 text-gold-dark border border-gold/40',
    mahogany: 'bg-primary/10 text-primary border border-primary/30',
    bronze: 'bg-bronze/15 text-bronze-dark border border-bronze/40',
    success: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 border border-amber-500/30',
    error: 'bg-rose-500/15 text-rose-700 border border-rose-500/30',
    neutral: 'bg-surface-container text-text-secondary border border-primary/10',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </span>
  );
};

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onClick,
  children,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-5 py-2 rounded-full text-xs font-sans font-semibold tracking-wider transition-all duration-300 border cursor-pointer active:scale-95',
        active
          ? 'bg-primary text-gold border-gold shadow-glow-gold'
          : 'bg-surface-elevated text-text-secondary border-primary/10 hover:border-gold/50 hover:text-primary',
        className
      )}
    >
      {children}
    </button>
  );
};
