'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full glass-panel bg-surface-card rounded-[28px] sm:rounded-[36px] border border-gold/30 shadow-2xl p-5 sm:p-8 z-10 animate-scale-up max-h-[90vh] overflow-y-auto',
          maxWidths[maxWidth]
        )}
      >
        <div className="flex items-center justify-between pb-6 border-b border-primary/10">
          {title && (
            <h3 className="font-display text-2xl font-semibold text-primary">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
};
