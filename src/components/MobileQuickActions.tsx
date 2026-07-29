'use client';

import Link from 'next/link';
import { CalendarHeart, Phone, MessageCircle, AlertTriangle, MapPin } from 'lucide-react';
import { brand, branches } from '../data/site';

export default function MobileQuickActions() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-ivory-200 bg-white/95 backdrop-blur shadow-soft-lg md:hidden">
      <div className="grid grid-cols-5 text-[10px]">
        <Link href="/book" className="flex flex-col items-center gap-1 py-2.5 text-crimson font-medium hover:bg-crimson-50 transition-colors">
          <CalendarHeart className="h-5 w-5" /> Book
        </Link>
        <a href={`tel:${brand.contact.mobileTel}`} className="flex flex-col items-center gap-1 py-2.5 text-ivory-900 font-medium hover:bg-ivory-100 transition-colors">
          <Phone className="h-5 w-5 text-ochre-700" /> Call
        </a>
        <a
          href={brand.contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
        <a href={`tel:${brand.contact.emergency[0].replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 py-2.5 text-crimson-600 font-semibold hover:bg-crimson-50 transition-colors">
          <AlertTriangle className="h-5 w-5 text-crimson-600" /> Emergency
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${branches[0].mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-ivory-900 font-medium hover:bg-ivory-100 transition-colors"
        >
          <MapPin className="h-5 w-5 text-ochre-700" /> Maps
        </a>
      </div>
    </div>
  );
}
