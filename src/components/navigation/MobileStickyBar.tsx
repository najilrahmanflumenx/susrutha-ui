'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
      <div className="flex items-center justify-between gap-2 p-2 rounded-full bg-primary/95 text-white border border-gold/40 shadow-2xl backdrop-blur-xl">
        {/* Call Button */}
        <a
          href="tel:+919656656736"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-sand text-xs font-sans font-bold transition-all"
        >
          <Phone className="w-3.5 h-3.5 text-gold" />
          <span>Call Us</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919656656736?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20Susrutha%20Ayurveda%20Hospital%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-sand text-xs font-sans font-bold transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp</span>
        </a>

        {/* Book Button */}
        <Link
          href="/booking"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-gold hover:bg-amber-600 text-white text-xs font-sans font-bold shadow-md transition-all"
        >
          <Calendar className="w-3.5 h-3.5 text-white" />
          <span>Book</span>
        </Link>
      </div>
    </div>
  );
}
