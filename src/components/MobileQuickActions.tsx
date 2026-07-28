'use client';

import Link from 'next/link';
import { CalendarHeart, Phone, MessageCircle, AlertTriangle, MapPin } from 'lucide-react';
import { brand, branches } from '../data/site';

export default function MobileQuickActions() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-sus-green/10 bg-sus-cream/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5 text-[10px]">
        <Link href="/book" className="flex flex-col items-center gap-1 py-2.5 text-sus-green-deep">
          <CalendarHeart className="h-5 w-5" /> Book
        </Link>
        <a href={`tel:${brand.contact.mobileTel}`} className="flex flex-col items-center gap-1 py-2.5 text-sus-green-deep">
          <Phone className="h-5 w-5" /> Call
        </a>
        <a
          href={brand.contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-sus-green-deep"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
        <a href={`tel:${brand.contact.emergency[0].replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 py-2.5 text-sus-terracotta">
          <AlertTriangle className="h-5 w-5" /> Emergency
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${branches[0].mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-2.5 text-sus-green-deep"
        >
          <MapPin className="h-5 w-5" /> Directions
        </a>
      </div>
    </div>
  );
}
