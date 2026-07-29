'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ArrowRight, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { CarePackageItem, fetchCarePackages } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function RetreatsPage() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [packages, setPackages] = useState<CarePackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fallbackRetreats: CarePackageItem[] = [
    {
      id: 'ret-1',
      title: '7-Day Panchakarma Purification',
      slug: '7-day-panchakarma-purification',
      subtitle: 'Complete 5-Phase Body & Mind Detoxification',
      durationDays: 7,
      overview: 'An immersive 7-day cellular cleansing retreat nestled in our peaceful hospital sanctuary in Kattakada.',
      inclusions: [
        'Daily Physician Pulse Diagnostics',
        'Custom Sattvic Meals by Executive Chefs',
        'Morning Pranayama & Yoga sessions',
        'Private Inpatient Cottage Accommodation'
      ],
      price: 45000
    },
    {
      id: 'ret-2',
      title: '14-Day Rasayana Rejuvenation',
      slug: '14-day-rasayana-rejuvenation',
      subtitle: 'Long-term Immunity & Vitality Regeneration',
      durationDays: 14,
      overview: 'Deep Panchakarma bio-purification and Rasayana anti-aging protocol surrounded by lush medicinal botanical gardens.',
      inclusions: [
        'Complete 5-Phase Panchakarma Therapy',
        'Private Ayurvedic Herbalist Consultations',
        'Herbal Steam & Kayakalpa Treatments',
        'Executive Inpatient Pavilion Stay'
      ],
      price: 85000
    }
  ];

  useEffect(() => {
    async function loadPackages() {
      setLoading(true);
      try {
        const res = await fetchCarePackages({
          page,
          limit: itemsPerPage,
          category: selectedFilter,
        });
        setPackages(res.data.length > 0 ? res.data : fallbackRetreats);
        setTotalPages(res.meta.totalPages);
        setTotalCount(res.meta.total || res.data.length);
      } catch (err) {
        setPackages(fallbackRetreats);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, [page, selectedFilter]);

  // Extract unique duration / category chips dynamically
  const availableFilters = useMemo(() => {
    return ['ALL', '7-Day', '14-Day', '21-Day'];
  }, []);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setPage(1);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<Sparkles className="w-3.5 h-3.5" />}>
          IMMERSIVE WELLNESS SANCTUARIES
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Sanctuary Retreats & Care Packages
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Escape modern stress and enter an architectural oasis designed specifically for deep mental silence, cellular regeneration, and holistic healing.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {availableFilters.map((f) => (
          <Chip
            key={f}
            active={selectedFilter === f}
            onClick={() => handleFilterChange(f)}
          >
            {f}
          </Chip>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20 text-primary">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <span className="ml-3 font-sans text-sm font-medium">Loading care packages...</span>
        </div>
      )}

      {!loading && (
        <>
          <div className="flex justify-between items-center border-b border-primary/10 pb-4">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
              Showing {totalCount} Curated Care Packages
            </span>
            <span className="text-xs font-sans text-text-muted">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {packages.map((retreat, idx) => {
              const id = retreat.id || retreat._id || `pkg-${idx}`;
              const title = retreat.title || 'Inpatient Ayurveda Package';
              const duration = retreat.durationDays ? `${retreat.durationDays}-Day Retreat` : '7-Day Sanctuary';
              const price = retreat.price || 45000;
              const overview = retreat.overview || retreat.subtitle || 'Authentic inpatient Ayurveda therapy program.';
              const inclusions = retreat.inclusions?.length ? retreat.inclusions : [
                'Daily Doctor Diagnostics & Pulse Reading',
                'Sattvic Diet & Organic Cuisine',
                'Herbal Steam & Oil Therapies',
                'Luxury Cottage Accommodation'
              ];
              const image = retreat.bannerImage || (idx % 2 === 0
                ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80');

              return (
                <Card key={id} variant="default" className="flex flex-col justify-between p-8 group shadow-sm hover:shadow-xl transition-all">
                  <div>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="gold">{duration}</Badge>
                      </div>
                    </div>
                    <h3 className="font-display text-3xl font-bold text-primary mb-3">{title}</h3>
                    <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                      {overview}
                    </p>
                    <div className="space-y-2 mb-8 pt-4 border-t border-primary/10">
                      {inclusions.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-sans text-text-primary">
                          <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-primary/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted block">
                        ALL-INCLUSIVE STAY
                      </span>
                      <span className="font-display text-2xl font-bold text-primary">{formatCurrency(price)}</span>
                    </div>
                    <Link href={`/booking?package=${encodeURIComponent(title)}`}>
                      <Button variant="gold" icon={<ArrowRight className="w-4 h-4" />}>
                        RESERVE STAY
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                PREVIOUS
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg font-sans text-xs font-bold transition-all ${
                      page === i + 1
                        ? 'bg-gold text-white shadow-md'
                        : 'bg-surface-card text-primary border border-primary/10 hover:bg-primary/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                NEXT
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
