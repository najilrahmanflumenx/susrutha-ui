'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold tracking-wider transition-all duration-300 rounded-full active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary text-surface hover:bg-primary-light shadow-glow-mahogany hover:shadow-lg',
    secondary: 'bg-surface-elevated text-primary border border-primary/20 hover:bg-primary hover:text-surface',
    gold: 'bg-gold text-primary font-bold hover:bg-gold-light shadow-glow-gold hover:shadow-xl',
    outline: 'bg-transparent text-primary border border-primary/30 hover:border-gold hover:text-gold',
    ghost: 'bg-transparent text-primary hover:bg-primary/5 hover:text-gold',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-xs uppercase tracking-widest px-6 py-3 gap-2',
    lg: 'text-sm uppercase tracking-widest px-8 py-4 gap-3',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {!isLoading && icon && iconPosition === 'left' && <span className="text-current">{icon}</span>}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="text-current">{icon}</span>}
    </button>
  );
};
