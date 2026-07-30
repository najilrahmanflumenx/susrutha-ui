'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ArrowRight, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { CarePackageItem, fetchCarePackages } from '@/lib/api';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';

export default function RetreatsPage() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [packages, setPackages] = useState<CarePackageItem[]>([]);
  const [allPackages, setAllPackages] = useState<CarePackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch all packages once on mount to derive unique duration chips
  useEffect(() => {
    async function loadAllPackages() {
      try {
        const res = await fetchCarePackages({ page: 1, limit: 1000 });
        setAllPackages(res.data);
      } catch {
        setAllPackages([]);
      }
    }
    loadAllPackages();
  }, []);

  useEffect(() => {
    async function loadPackages() {
      setLoading(true);
      try {
        const res = await fetchCarePackages({
          page,
          limit: itemsPerPage,
          days: selectedFilter,
        });
        setPackages(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || res.data.length);
      } catch (err) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, [page, selectedFilter]);

  const filteredPackages = useMemo(() => {
    if (selectedFilter === 'ALL') return packages;
    const numDays = parseInt(selectedFilter.replace(/\D/g, ''), 10);
    if (!isNaN(numDays)) {
      return packages.filter(
        (pkg) => pkg.durationDays === numDays || pkg.title.toLowerCase().includes(`${numDays}-day`)
      );
    }
    return packages;
  }, [packages, selectedFilter]);

  // Derive unique duration chips from actual fetched data
  const availableFilters = useMemo(() => {
    const daysSet = new Set<number>();
    allPackages.forEach((pkg) => {
      if (pkg.durationDays) daysSet.add(pkg.durationDays);
    });
    const sorted = Array.from(daysSet).sort((a, b) => a - b);
    return ['ALL', ...sorted.map((d) => `${d}-Day`)];
  }, [allPackages]);


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
              Showing {filteredPackages.length} Curated Care Packages
            </span>
            <span className="text-xs font-sans text-text-muted">
              Page {page} of {totalPages}
            </span>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredPackages.map((retreat, idx) => {
              const id = retreat.id || retreat._id || `pkg-${idx}`;
              const title = retreat.title;
              const duration = retreat.durationDays ? `${retreat.durationDays}-Day Retreat` : null;
              const price = retreat.price;
              const overview = retreat.overview || retreat.subtitle;
              const inclusions = retreat.inclusions;
              const rawImg = retreat.image || retreat.bannerImage || retreat.coverImage || (Array.isArray(retreat.galleryImages) ? retreat.galleryImages[0] : '');
              const image = resolveImageUrl(rawImg);

              return (
                <Card key={id} variant="default" className="flex flex-col justify-between p-8 group shadow-sm hover:shadow-xl transition-all">
                  <div>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                      {image ? (
                        <img src={image} alt={title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <span className="text-text-muted text-xs font-sans">No image</span>
                        </div>
                      )}
                      {duration && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="gold">{duration}</Badge>
                        </div>
                      )}
                    </div>
                    {title && <h3 className="font-display text-3xl font-bold text-primary mb-3">{title}</h3>}
                    {overview && (
                      <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                        {overview}
                      </p>
                    )}
                    {inclusions && inclusions.length > 0 && (
                      <div className="space-y-2 mb-8 pt-4 border-t border-primary/10">
                        {inclusions.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-sans text-text-primary">
                            <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-primary/10 flex items-center justify-between">
                    {price != null ? (
                      <div>
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted block">
                          ALL-INCLUSIVE STAY
                        </span>
                        <span className="font-display text-2xl font-bold text-primary">{formatCurrency(price)}</span>
                      </div>
                    ) : <div />}
                    <Link href={`/booking?package=${encodeURIComponent(retreat._id || retreat.id || id)}`}>
                      <Button variant="gold" icon={<ArrowRight className="w-4 h-4" />}>
                        RESERVE PACKAGE
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <Sparkles className="w-12 h-12 text-gold opacity-40" />
              <p className="font-display text-2xl text-primary/50">No {selectedFilter} packages found</p>
              <p className="font-sans text-text-muted text-sm">Try selecting a different duration or click &quot;ALL&quot; to view all retreats.</p>
              <Button variant="gold" onClick={() => setSelectedFilter('ALL')}>
                VIEW ALL RETREATS
              </Button>
            </div>
          )}

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
