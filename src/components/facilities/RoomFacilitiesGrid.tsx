'use client';

import React from 'react';
import Link from 'next/link';
import { Bed, Tv, Wifi, Thermometer, Coffee, Sparkles, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface RoomFacility {
  id: string;
  name: string;
  category: 'Suite' | 'Deluxe AC' | 'Standard Non-AC' | 'Ayur Village Cottage';
  tagline: string;
  description: string;
  amenities: string[];
  image: string;
  idealFor: string;
}

const ROOM_CATEGORIES: RoomFacility[] = [
  {
    id: 'executive-suite',
    name: 'Executive Panchakarma Suite',
    category: 'Suite',
    tagline: 'Ultra-Luxury Private Inpatient Sanctuary',
    description: 'Spacious multi-room suite with private attached Panchakarma therapy unit, patient lounge, personal attendant bed, and panoramic garden views.',
    amenities: [
      'Private Attached Panchakarma Therapy Room',
      'Individual Air Conditioning & Climate Control',
      'High-Speed Wi-Fi & Smart Entertainment System',
      '24/7 Solar Hot Water & En-Suite Bath',
      'Dedicated Bystander / Attender Bed',
      'Personalized Organic Pathya Diet Service',
    ],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    idealFor: 'International Patients, Long-Stay Panchakarma (14-21 Days), VIP Retreats',
  },
  {
    id: 'deluxe-ac',
    name: 'Deluxe AC Room',
    category: 'Deluxe AC',
    tagline: 'Modern Clinical Comfort & Climate Control',
    description: 'Elegantly furnished private AC room equipped with patient bed, bystander couch, television, and direct access to floor treatment units.',
    amenities: [
      'Split Air-Conditioning System',
      'Complimentary High-Speed Wi-Fi',
      'Flat-Screen Cable TV',
      'Attached Bathroom with Hot Water',
      'Bystander Sofa / Bed',
      'Daily Ayurvedic Doctor Visits',
    ],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    idealFor: 'Spine Care, Post-Natal Recovery & 7-Day Detox Stays',
  },
  {
    id: 'standard-room',
    name: 'Standard Non-AC Room',
    category: 'Standard Non-AC',
    tagline: 'Authentic Traditional Healing Ambience',
    description: 'Naturally ventilated, peaceful room designed according to Vastu principles, promoting natural air flow during Panchakarma detox.',
    amenities: [
      'Natural Cross-Ventilation & Fan',
      'Clean En-suite Sanitation',
      'Attender Accommodation Chair/Bed',
      '24/7 Filtered Drinking Water',
      'Nurse Call Bell System',
      'Daily Linen & Housekeeping',
    ],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
    idealFor: 'Budget-Conscious Inpatients & Classic Detox Treatments',
  },
  {
    id: 'ayur-village',
    name: 'Susrutha Ayur Village Cottage',
    category: 'Ayur Village Cottage',
    tagline: 'Eco-Friendly Heritage Healing Cottages',
    description: 'Independent traditional Kerala-style terracotta cottages surrounded by medicinal herb gardens and peaceful nature.',
    amenities: [
      'Traditional Kerala Architecture & Woodwork',
      'Private Veranda Facing Herbal Garden',
      'Attached Therapy Room Access',
      'Organic Farm-to-Table Diet',
      'Dedicated Panchakarma Therapist Team',
      'Quiet Environment for Yoga & Meditation',
    ],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    idealFor: 'Rejuvenation Retreats, Stress Management & Holistic Healing',
  },
];

export function RoomFacilitiesGrid() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="gold" className="mb-3" icon={<Bed className="w-3.5 h-3.5" />}>
          INPATIENT ACCOMMODATIONS
        </Badge>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold text-primary mb-4">
          Hospital Rooms & Ayur Village Facilities
        </h2>
        <p className="font-sans text-text-secondary text-sm sm:text-base leading-relaxed">
          Designed to foster deep rest and bio-purification, combining clinical hygiene with authentic Kerala warmth.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ROOM_CATEGORIES.map((room) => (
          <div
            key={room.id}
            className="group bg-surface-card border border-primary/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/9] overflow-hidden bg-primary/5">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="mahogany" className="backdrop-blur-md">
                    {room.category}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-gold block mb-1">
                  {room.tagline}
                </span>
                <h3 className="font-display text-2xl font-bold text-primary mb-3">
                  {room.name}
                </h3>
                <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6">
                  {room.description}
                </p>

                {/* Amenities Checklist */}
                <div className="space-y-2 mb-6 border-t border-primary/10 pt-4">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-primary mb-3">
                    Room Amenities & Inclusions:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-text-primary">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span className="leading-tight">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-elevated p-3.5 rounded-xl border border-primary/5 text-xs font-sans text-text-secondary">
                  <span className="font-bold text-primary">Ideal For: </span>
                  {room.idealFor}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 sm:p-8 pt-0">
              <Link href={`/booking?room=${encodeURIComponent(room.name)}`}>
                <Button variant="gold" className="w-full" icon={<ChevronRight className="w-4 h-4" />}>
                  INQUIRE ROOM AVAILABILITY
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
