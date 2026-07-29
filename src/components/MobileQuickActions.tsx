'use client';

import Link from 'next/link';
import { CalendarHeart, Phone, MessageCircle, AlertTriangle, MapPin } from 'lucide-react';
import { brand, branches } from '../data/site';

export default function MobileQuickActions() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-ochre/30 bg-[#1C1214]/95 backdrop-blur-xl shadow-glass-dark md:hidden">
      <div className="grid grid-cols-5 text-[10px]">
        <Link href="/book" className="flex flex-col items-center gap-1 py-2.5 text-[#FFC86B] font-bold hover:bg-white/10 transition-colors">
          <CalendarHeart className="h-5 w-5 text-[#FFC86B]" /> Book
        </Link>
        <a href={`tel:${brand.contact.mobileTel}`} className="flex flex-col items-center gap-1 py-2.5 text-ivory-100 font-medium hover:bg-white/10 transition-colors">
          <Phone className="h-5 w-5 text-[#FFC86B]" /> Call
        </a>
        <a
          href={brand.contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-emerald-400 font-medium hover:bg-white/10 transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-emerald-400" /> WhatsApp
        </a>
        <a href={`tel:${brand.contact.emergency[0].replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 py-2.5 text-red-400 font-semibold hover:bg-white/10 transition-colors">
          <AlertTriangle className="h-5 w-5 text-red-400" /> Emergency
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${branches[0].mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-ivory-100 font-medium hover:bg-white/10 transition-colors"
        >
          <MapPin className="h-5 w-5 text-[#FFC86B]" /> Maps
        </a>
      </div>
    </div>
  );
}

