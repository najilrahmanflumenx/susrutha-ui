'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'up',
  icon,
  subtitle,
  className,
}) => {
  return (
    <div
      className={cn(
        'glass-panel p-6 rounded-[28px] border border-primary/10 flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-text-secondary">
          {title}
        </span>
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div>
        <div className="font-display text-3xl font-bold text-primary mb-1">
          {value}
        </div>
        <div className="flex items-center gap-2 text-xs font-sans">
          {trend && (
            <span
              className={cn(
                'font-bold px-2 py-0.5 rounded-full text-[10px]',
                trendDirection === 'up' && 'bg-emerald-500/15 text-emerald-700',
                trendDirection === 'down' && 'bg-rose-500/15 text-rose-700',
                trendDirection === 'neutral' && 'bg-surface-elevated text-text-secondary'
              )}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-text-muted">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};
