'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  link?: string;
  isEnabled?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = 'Authentic Kerala Panchakarma Admissions Open — 40-Bed Sanctuary at Kattakada',
  link = '/packages',
  isEnabled = true,
}) => {
  if (!isEnabled || !text) return null;

  return (
    <div className="bg-primary border-b border-gold/30 text-surface text-xs font-medium py-2 px-4 text-center relative z-50 overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[11px]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          ANNOUNCEMENT
        </span>
        <span className="text-surface/90 text-xs truncate max-w-xl">{text}</span>
        {link && (
          <Link
            href={link}
            className="inline-flex items-center gap-1 text-gold hover:text-white font-semibold transition-colors text-xs underline underline-offset-2"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
