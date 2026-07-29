'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-4 text-primary/40 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-surface-elevated border border-primary/15 rounded-2xl px-5 py-3.5 text-sm font-sans text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300',
              icon && 'pl-12',
              error && 'border-status-error focus:border-status-error focus:ring-status-error/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-status-error font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-surface-elevated border border-primary/15 rounded-2xl px-5 py-3.5 text-sm font-sans text-text-primary focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 appearance-none cursor-pointer',
            error && 'border-status-error',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-status-error font-medium">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
