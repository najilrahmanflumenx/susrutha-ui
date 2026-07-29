'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchTreatmentBySlug, TreatmentItem } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { formatCurrency } from '@/lib/utils';

export default function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  const { data: treatment, loading } = useApiData<TreatmentItem | null>(
    () => fetchTreatmentBySlug(slug),
    null,
    [slug]
  );

  if (loading || !treatment) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const title = treatment.title || treatment.name || 'Ayurvedic Treatment';
  const category = treatment.category || 'Panchakarma';
  const duration = treatment.duration || `${treatment.durationMinutes || 60} Mins`;
  const price = treatment.price || 3500;
  const desc = treatment.fullDescription || treatment.description || treatment.shortDescription || 'Authentic classical Ayurvedic treatment.';
  const image = treatment.image || treatment.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80';
  const benefits = treatment.benefits?.length ? treatment.benefits : ['Cellular Detoxification', 'Deep Nervous Relaxation', 'Vitality Reset'];
  const indications = treatment.indications?.length ? treatment.indications : ['Chronic Stress', 'Insomnia', 'Fatigue', 'Joint Pain'];

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24 pt-8">
      {/* Back Button */}
      <div>
        <Link href="/treatments">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Therapies
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-6 left-6">
            <Badge variant="gold">{category}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Badge variant="gold" className="w-fit">{treatment.dosha || 'Vedic Protocol'}</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary">
            {title}
          </h1>
          <p className="font-sans text-text-secondary text-base leading-relaxed">
            {desc}
          </p>

          <div className="flex items-center gap-6 py-4 border-y border-primary/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">DURATION</span>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-primary/10" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-1">INVESTMENT</span>
              <span className="font-display text-2xl font-bold text-primary">{formatCurrency(price)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href={`/booking?treatment=${encodeURIComponent(title)}`} className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full" icon={<Calendar className="w-5 h-5" />}>
                Book Consultation & Therapy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indications & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <Card variant="glass" className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-bronze" />
            <h3 className="font-display text-2xl font-bold text-primary">Key Benefits</h3>
          </div>
          <ul className="flex flex-col gap-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="glass" className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-bronze" />
            <h3 className="font-display text-2xl font-bold text-primary">Recommended For</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {indications.map((ind, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-semibold">
                {ind}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
