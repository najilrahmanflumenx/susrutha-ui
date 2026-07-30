'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Award, Calendar, Languages, Stethoscope, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DoctorItem, fetchDoctorBySlug } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { formatCurrency } from '@/lib/utils';

export default function DoctorDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: doctor, loading } = useApiData<DoctorItem | null>(
    () => fetchDoctorBySlug(slug),
    null,
    [slug]
  );

  if (loading || !doctor) {
    return <div className="min-h-screen flex items-center justify-center">Loading Doctor Profile...</div>;
  }

  const name = doctor.name;
  const designation = doctor.designation || doctor.title;
  const specialization = doctor.specialization || doctor.specialties?.[0];
  const expYears = doctor.experienceYears;
  const photo = doctor.image || doctor.photoUrl || doctor.photo;
  const bio = doctor.bio;
  const fee = doctor.consultationFee;
  const specialties = doctor.specialties?.length ? doctor.specialties : [];
  const languages = doctor.languagesSpoken?.length ? doctor.languagesSpoken : [];
  const qualifications = Array.isArray(doctor.qualifications)
    ? doctor.qualifications
    : typeof doctor.qualifications === 'string'
      ? [doctor.qualifications]
      : [];

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24 pt-8">
      <div>
        <Link href="/doctors">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Physicians
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <Badge variant="gold" className="w-fit">{specialization}</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary">
            {name}
          </h1>
          <p className="text-bronze font-bold text-lg uppercase tracking-wider">
            {designation} • {expYears} Years Clinical Experience
          </p>

          <p className="font-sans text-text-secondary text-base leading-relaxed">
            {bio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-primary/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">QUALIFICATIONS</span>
              <div className="flex flex-col gap-2">
                {qualifications.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-primary font-semibold">
                    <Award className="w-4 h-4 text-gold shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">LANGUAGES SPOKEN</span>
              <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                <Languages className="w-4 h-4 text-gold shrink-0" />
                <span>{languages.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">CONSULTATION FEE</span>
              <span className="font-display text-2xl font-bold text-primary">{formatCurrency(fee || 0)}</span>
            </div>

            <Link href={`/booking?doctor=${encodeURIComponent(name)}`}>
              <Button variant="gold" size="lg" icon={<Calendar className="w-5 h-5" />}>
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
