'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, FolderOpen } from 'lucide-react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-primary/10 dark:bg-slate-800/60 rounded-2xl',
        className
      )}
    />
  );
};

export const DoctorCardSkeleton: React.FC = () => {
  return (
    <div className="p-8 rounded-3xl border border-primary/10 bg-surface-card flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-3/4 h-8 rounded-xl" />
        <Skeleton className="w-1/2 h-4 rounded-lg" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <Skeleton className="w-full h-10 rounded-xl" />
    </div>
  );
};

export const TreatmentCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl border border-primary/10 bg-surface-card flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-4/5 h-7 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
      <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
        <Skeleton className="w-24 h-8 rounded-lg" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const DepartmentCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl border border-primary/10 bg-surface-card flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-full h-48 rounded-2xl" />
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-3/4 h-7 rounded-xl" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <Skeleton className="w-full h-10 rounded-xl" />
    </div>
  );
};

export const LocationCardSkeleton: React.FC = () => {
  return (
    <div className="p-8 rounded-3xl border border-primary/10 bg-surface-card flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-full aspect-[16/9] rounded-2xl" />
        <Skeleton className="w-2/3 h-8 rounded-xl" />
        <Skeleton className="w-full h-16 rounded-xl" />
      </div>
      <Skeleton className="w-full h-11 rounded-xl" />
    </div>
  );
};

export const LoadingState: React.FC<{ text?: string }> = ({
  text = 'Loading wellness experience...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4 text-center">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-gold animate-spin flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-gold animate-pulse" />
      </div>
      <span className="text-xs font-sans font-bold uppercase tracking-widest text-text-secondary">
        {text}
      </span>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description,
  message = 'There are currently no items to display in this view.',
  action,
}) => {
  const displayMsg = description || message;
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-[32px] border border-primary/10">
      <div className="w-16 h-16 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-primary/60" />
      </div>
      <h4 className="font-display text-xl font-bold text-primary mb-2">
        {title}
      </h4>
      <p className="text-sm font-sans text-text-secondary max-w-sm mb-6">
        {displayMsg}
      </p>
      {action}
    </div>
  );
};
