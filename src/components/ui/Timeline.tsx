'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface Step {
  number: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  steps: Step[];
  activeStep?: number;
  onStepClick?: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  steps,
  activeStep = 0,
  onStepClick,
}) => {
  return (
    <div className="relative w-full overflow-x-auto py-8 scrollbar-hide">
      <div className="flex min-w-[800px] justify-between items-start relative px-4">
        {/* Horizontal Connector Line */}
        <div className="absolute top-12 left-10 right-10 h-0.5 bg-primary/10 -z-0" />

        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => onStepClick && onStepClick(idx)}
              className={cn(
                'relative z-10 flex flex-col items-center max-w-[220px] text-center group cursor-pointer transition-all duration-300',
                isActive && 'scale-105'
              )}
            >
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center mb-6 border transition-all duration-500 shadow-md',
                  isActive
                    ? 'bg-primary text-gold border-gold shadow-glow-gold scale-110'
                    : 'bg-surface-elevated text-primary border-primary/20 group-hover:bg-primary group-hover:text-surface'
                )}
              >
                {step.icon || <span className="font-display font-bold text-lg">{step.number}</span>}
              </div>

              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-bronze mb-2">
                STEP {step.number}
              </span>
              <h4 className="font-display text-xl font-bold text-primary mb-2">
                {step.title}
              </h4>
              <p className="text-xs font-sans text-text-secondary leading-relaxed line-clamp-3">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
