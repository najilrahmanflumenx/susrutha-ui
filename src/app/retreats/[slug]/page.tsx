'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Clock,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CarePackageItem, fetchCarePackageBySlug } from '@/lib/api';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';

export default function RetreatDetailPage() {
  const params = useParams();
  const [pkg, setPkg] = useState<CarePackageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const rawSlug = (params?.slug as string) || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '');
    if (rawSlug) setSlug(rawSlug);
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    async function loadPackage() {
      setLoading(true);
      try {
        const data = await fetchCarePackageBySlug(slug);
        setPkg(data);
      } catch (err) {
        setPkg(null);
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center py-20 text-primary">
        <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
        <span className="font-sans text-sm font-medium">Loading package details...</span>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="px-6 max-w-4xl mx-auto py-20 text-center flex flex-col items-center gap-6">
        <Sparkles className="w-12 h-12 text-gold opacity-40" />
        <h1 className="font-display text-3xl font-bold text-primary">Retreat Package Not Found</h1>
        <p className="font-sans text-text-secondary text-sm max-w-md">
          The requested Ayurvedic care package or retreat sanctuary could not be located. It may have been renamed or moved.
        </p>
        <Link href="/retreats">
          <Button variant="gold" icon={<ArrowLeft className="w-4 h-4" />}>
            BACK TO RETREATS & PACKAGES
          </Button>
        </Link>
      </div>
    );
  }

  const id = pkg.id || pkg._id || '';
  const price = pkg.price;
  const duration = pkg.durationDays ? `${pkg.durationDays}-Day Retreat` : null;

  const rawImages = [
    pkg.image,
    pkg.bannerImage,
    pkg.coverImage,
    ...(Array.isArray(pkg.galleryImages) ? pkg.galleryImages : []),
  ].filter((img): img is string => Boolean(img && typeof img === 'string'));

  const resolvedImages = Array.from(new Set(rawImages.map((url) => resolveImageUrl(url)))).filter(Boolean);
  const activeImage = resolvedImages[activeImageIndex] || resolvedImages[0] || '';

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-6xl mx-auto flex flex-col gap-10 py-10 pb-24">
      {/* Back Link */}
      <div>
        <Link
          href="/retreats"
          className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-gold hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Retreats</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cover Image & Quick Highlights */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-primary/10">
            {activeImage ? (
              <img src={activeImage} alt={pkg.title} className="w-full h-full object-cover transition-all duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <span className="text-text-muted text-xs font-sans">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            {duration && (
              <div className="absolute top-4 left-4 z-10">
                <span className="backdrop-blur-md bg-black/60 text-gold text-xs font-sans font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-gold/40 shadow-lg">
                  {duration}
                </span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {resolvedImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
              {resolvedImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-gold scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Booking Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-bronze block mb-2">
              SANCTUARY CARE PACKAGE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary leading-tight mb-4">
              {pkg.title}
            </h1>
            {pkg.subtitle && (
              <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6">
                {pkg.subtitle}
              </p>
            )}
          </div>

          <Card variant="bordered" className="p-6 flex flex-col gap-4 border border-gold/30 shadow-xl rounded-3xl bg-surface-card">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted block">
                  ALL-INCLUSIVE SANCTUARY STAY
                </span>
                {price != null ? (
                  <span className="font-display text-3xl font-bold text-primary">{formatCurrency(price)}</span>
                ) : (
                  <span className="font-display text-xl font-bold text-primary">Custom Quote</span>
                )}
              </div>
              <ShieldCheck className="w-8 h-8 text-gold" />
            </div>

            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              Includes full physician consultations, custom Panchakarma therapies, organic Ayurvedic meals, and private inpatient suite stay.
            </p>

            <Link href={`/booking?package=${encodeURIComponent(id)}`} className="w-full">
              <Button variant="gold" size="lg" className="w-full justify-center" icon={<Calendar className="w-4 h-4" />}>
                RESERVE THIS PACKAGE
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Package Description & Inclusions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-primary/10">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {pkg.overview && (
            <div>
              <h2 className="font-display text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-gold" />
                <span>Overview & Healing Intent</span>
              </h2>
              <div className="font-sans text-text-secondary text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {pkg.overview}
              </div>
            </div>
          )}

          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span>Package Inclusions & Benefits</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="font-sans text-xs font-semibold text-primary leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card variant="default" className="p-6 flex flex-col gap-4 rounded-3xl border border-primary/10 bg-surface-card">
            <h3 className="font-display text-lg font-bold text-primary border-b border-primary/10 pb-3">
              Sanctuary Experience
            </h3>
            <div className="space-y-3 text-xs font-sans text-text-secondary">
              <div className="flex justify-between items-center py-1 border-b border-primary/5">
                <span>Duration</span>
                <span className="font-bold text-primary">{pkg.durationDays ? `${pkg.durationDays} Days` : 'Flexible'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-primary/5">
                <span>Physician Care</span>
                <span className="font-bold text-primary">Daily Consultations</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-primary/5">
                <span>Dietary Plan</span>
                <span className="font-bold text-primary">Pure Organic Sattvic</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Accommodation</span>
                <span className="font-bold text-primary">Private Suite / Cottage</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
