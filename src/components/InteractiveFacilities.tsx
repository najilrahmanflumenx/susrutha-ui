'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from './ui';
import { getFacilities } from '../lib/api';

export default function InteractiveFacilities({ showCta = true }: { showCta?: boolean }) {
  const [facilitiesList, setFacilitiesList] = useState<any[]>([
    { id: 'f-1', title: 'Inpatient Rooms', detail: 'Economic to luxury options with TV, AC/Non-AC, WiFi on demand, hot water, attached bath.', image: '/images/hospital-room.jpg', points: ['40 Inpatient Beds', '24x7 Nursing', 'Dietary Service'] },
    { id: 'f-2', title: 'Panchakarma Suites', detail: 'Separate male and female therapy rooms with dedicated therapists trained in classical protocols.', image: '/images/hero-ayurveda.jpg', points: ['Male & Female Suites', 'Experienced Therapists', 'Medicated Oils'] },
    { id: 'f-3', title: 'Operation Theatre', detail: 'On-site OT supporting procedures including Kshara Sutra and related minor surgical care.', image: '/images/herbs-mortar.jpg', points: ['Kshara Sutra Unit', 'Sterile Environment', 'Minor Surgery'] },
    { id: 'f-4', title: 'Physiotherapy Unit', detail: 'Integrated rehabilitation support alongside Ayurvedic therapies for spine & joint recovery.', image: '/images/hospital-room.jpg', points: ['Rehab Equipment', 'Spine Mobility', 'Guided Exercises'] },
    { id: 'f-5', title: 'Ayur Village (Gramam)', detail: 'Four traditional Kerala cottages with private treatment rooms, ~20 km from airport.', image: '/images/ayur-village.jpg', points: ['Traditional Cottages', 'Private Therapy', 'Serene Setting'] },
  ]);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    getFacilities().then((apiFacs) => {
      if (apiFacs && Array.isArray(apiFacs) && apiFacs.length > 0) {
        const mapped = apiFacs.map((f: any, idx: number) => ({
          id: f._id || `f-${idx}`,
          title: f.title || f.name,
          detail: f.description || f.overview || 'Hospital infrastructure amenity.',
          image: f.photo || f.image || '/images/hospital-room.jpg',
          points: f.features || ['NABH Standards', 'Doctor Supervised'],
        }));
        setFacilitiesList(mapped);
      }
    });
  }, []);

  const current = facilitiesList[active] || facilitiesList[0];

  if (facilitiesList.length === 0) {
    return (
      <div className="rounded-2xl border border-sus-green/10 bg-white/50 p-8 text-center">
        <p className="text-sm text-sus-muted">No facility showcases currently listed in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
      <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-crimson-900 shadow-soft-lg shadow-crimson-900/20 border border-ochre/30">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.image}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-crimson-900/95 via-crimson-900/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-ochre-300 font-bold">Facility focus</p>
          <h3 className="mt-2 font-display text-3xl font-bold text-ivory-50">{current.title}</h3>
          <p className="mt-2 max-w-lg text-sm text-ochre-100/90 leading-relaxed">{current.detail}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {current.points.map((p: any) => (
              <li key={p} className="rounded-full border border-ochre/30 bg-crimson-900/60 backdrop-blur-md px-3 py-1 text-xs text-ivory-50">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <ul className="space-y-3">
          {facilitiesList.map((f: any, i: number) => {
            const isActive = i === active;
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    'w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 font-body',
                    isActive
                      ? 'border-[#FCAB28] bg-[#240809] text-white shadow-2xl backdrop-blur-2xl scale-[1.01]'
                      : 'border-ochre/25 bg-[#1A0707]/80 text-[#FDFBF7] hover:border-[#FCAB28]/50 hover:bg-[#240809]',
                  )}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={cn('text-lg font-bold font-display', isActive ? 'text-[#FCAB28]' : 'text-white')}>{f.title}</h3>
                      <p className="mt-1 text-sm text-ivory-200/90 leading-relaxed line-clamp-2">{f.detail}</p>
                    </div>
                    <span
                      className={cn(
                        'mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition-colors',
                        isActive ? 'bg-[#FCAB28]' : 'bg-white/20',
                      )}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        {showCta && (
          <div className="mt-6">
            <Button to="/facilities" variant="secondary">
              Full facilities guide
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
