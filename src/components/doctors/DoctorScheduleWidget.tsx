'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { DOCTORS_SCHEDULE } from '@/data/susruthaData';
import { Badge } from '@/components/ui/Badge';

export function DoctorScheduleWidget() {
  const [selectedCenter, setSelectedCenter] = useState<'All' | 'Kattakada' | 'Kowdiar'>('All');

  const filteredSchedule = DOCTORS_SCHEDULE.filter((doc) => {
    if (selectedCenter === 'All') return true;
    if (doc.center === 'Both') return true;
    return doc.center === selectedCenter;
  });

  return (
    <div className="bg-surface-card border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header & Center Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-primary/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-gold" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-gold">
              OPD CONSULTING HOURS
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-primary">
            Senior Physician Availability Schedule
          </h3>
          <p className="text-xs sm:text-sm font-sans text-text-secondary mt-1">
            Consultations available at Kattakada Main Hospital & Kowdiar Satellite OP Outlet.
          </p>
        </div>

        {/* Center Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-surface-elevated p-1.5 rounded-full border border-primary/10 text-xs font-sans font-bold">
          {(['All', 'Kattakada', 'Kowdiar'] as const).map((center) => (
            <button
              key={center}
              onClick={() => setSelectedCenter(center)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCenter === center
                  ? 'bg-gold text-white shadow-md'
                  : 'text-primary hover:bg-primary/5'
              }`}
            >
              {center === 'All' ? 'All Centers' : center}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchedule.map((doc, idx) => (
          <div
            key={idx}
            className="group relative bg-surface-elevated border border-primary/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-display text-lg font-bold text-primary group-hover:text-gold transition-colors">
                    {doc.name}
                  </h4>
                  <p className="text-xs font-sans text-bronze font-medium mt-0.5">
                    {doc.designation}
                  </p>
                </div>
                <Badge
                  variant={doc.center === 'Kattakada' ? 'mahogany' : doc.center === 'Kowdiar' ? 'gold' : 'bronze'}
                  className="text-[10px] uppercase shrink-0"
                >
                  {doc.center}
                </Badge>
              </div>

              <p className="text-xs font-sans text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                {doc.qualifications}
              </p>

              <div className="space-y-2 border-t border-primary/5 pt-3 text-xs font-sans text-primary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="font-semibold">{doc.availableDays}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-3.5 h-3.5 text-bronze shrink-0" />
                  <span>{doc.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-primary/5 flex items-center justify-between gap-2">
              <span className="text-[11px] font-sans text-text-secondary flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold" />
                {doc.center === 'Kowdiar' ? 'Kowdiar Outlet' : doc.center === 'Kattakada' ? 'Kattakada Hospital' : 'Both Centers'}
              </span>

              <Link
                href={`/booking?doctor=${encodeURIComponent(doc.name)}`}
                className="inline-flex items-center gap-1 text-xs font-sans font-bold text-gold hover:text-primary transition-colors"
              >
                <span>Book Slot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
