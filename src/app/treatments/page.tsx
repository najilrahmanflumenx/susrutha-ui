'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { TreatmentCardSkeleton } from '@/components/ui/Skeleton';
import { fetchTreatments, TreatmentItem } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function TreatmentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [allTreatmentsForCategories, setAllTreatmentsForCategories] = useState<TreatmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  // Baseline load for category chips
  useEffect(() => {
    async function loadCategoriesBaseline() {
      try {
        const res = await fetchTreatments({ limit: 100 });
        setAllTreatmentsForCategories(res.data);
      } catch (e) {}
    }
    loadCategoriesBaseline();
  }, []);

  // Server-side paginated API fetch
  useEffect(() => {
    async function loadTreatments() {
      setLoading(true);
      try {
        const res = await fetchTreatments({
          page,
          limit: itemsPerPage,
          category: selectedFilter,
        });
        setTreatments(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalCount(res.meta.total);
      } catch (err) {
        console.error('Error fetching treatments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTreatments();
  }, [page, selectedFilter]);

  // Dynamically extract and merge unique categories case-insensitively from available data
  const availableCategories = useMemo(() => {
    const sourceList = allTreatmentsForCategories.length > 0 ? allTreatmentsForCategories : treatments;
    if (!sourceList || sourceList.length === 0) return ['ALL'];

    const categoryMap = new Map<string, string>();
    sourceList.forEach((t) => {
      const cat = (t.category || t.dosha || '').trim();
      if (cat) {
        const lowerKey = cat.toLowerCase();
        if (!categoryMap.has(lowerKey)) {
          const cleanDisplay = cat.charAt(0).toUpperCase() + cat.slice(1);
          categoryMap.set(lowerKey, cleanDisplay);
        }
      }
    });

    return ['ALL', ...Array.from(categoryMap.values())];
  }, [allTreatmentsForCategories, treatments]);

  const handleFilterChange = (cat: string) => {
    setSelectedFilter(cat);
    setPage(1);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<Sparkles className="w-3.5 h-3.5" />}>
          AUTHENTIC AYURVEDIC THERAPIES
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Signature Healing Rituals
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Every therapy at Susrutha is prescribed by our senior physicians and prepared fresh using 100% organic botanical oils, rare herbs, and authentic Vedic protocols.
        </p>
      </div>

      {/* Dynamic Available Categories Filter Chips */}
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {availableCategories.map((cat) => (
          <Chip
            key={cat}
            active={selectedFilter.toLowerCase() === cat.toLowerCase()}
            onClick={() => handleFilterChange(cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Loading state with Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TreatmentCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results Header */}
      {!loading && (
        <div className="flex justify-between items-center border-b border-primary/10 pb-4">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
            Showing {totalCount} Available Therapies
          </span>
          <span className="text-xs font-sans text-text-muted">
            Page {page} of {totalPages}
          </span>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {treatments.map((treatment, idx) => {
            const id = treatment.id || treatment._id || `tr-${idx}`;
            const slug = treatment.slug || id;
            const title = treatment.title || treatment.name || 'Ayurvedic Treatment';
            const image = treatment.image || treatment.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80';
            const price = treatment.price || 3500;
            const desc = treatment.description || treatment.shortDescription || 'Authentic classical Ayurvedic treatment.';
            const dosha = treatment.dosha || treatment.category || 'Vedic Protocol';

            return (
              <Card key={id} variant="default" className="flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all">
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="gold">{dosha}</Badge>
                    </div>
                  </div>

                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze mb-2 block">
                    {treatment.category || 'Therapy'}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-primary mb-3">
                    <Link href={`/treatments/${slug}`} className="hover:underline">
                      {title}
                    </Link>
                  </h3>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted block">
                      INVESTMENT
                    </span>
                    <span className="font-display text-xl font-bold text-primary">
                      {formatCurrency(price)}
                    </span>
                  </div>
                  <Link href={`/booking?treatment=${encodeURIComponent(title)}`}>
                    <Button variant="gold" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                      RESERVE
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
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
    </div>
  );
}
