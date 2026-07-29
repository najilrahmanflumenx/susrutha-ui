'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex border-b border-primary/10 gap-2 overflow-x-auto scrollbar-hide', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-6 py-3.5 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 relative border-b-2 whitespace-nowrap',
              isActive
                ? 'text-primary border-gold font-bold'
                : 'text-text-secondary border-transparent hover:text-primary'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-[10px]',
                  isActive ? 'bg-gold text-primary font-bold' : 'bg-surface-elevated text-text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
