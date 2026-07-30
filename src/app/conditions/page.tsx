'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Stethoscope, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { fetchConditions, ConditionItem } from '@/lib/api';

function ConditionCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 rounded-3xl bg-surface-card border border-primary/10 p-6">
      <div className="aspect-[4/3] rounded-2xl bg-primary/10" />
      <div className="h-3 w-24 rounded-full bg-primary/10" />
      <div className="h-6 w-4/5 rounded-full bg-primary/10" />
      <div className="h-4 w-full rounded-full bg-primary/10" />
      <div className="h-4 w-2/3 rounded-full bg-primary/10" />
    </div>
  );
}

export default function ConditionsPage() {
  const [conditions, setConditions] = useState<ConditionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchConditions({ page, limit: itemsPerPage, category: selectedFilter });
        setConditions(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || res.data.length);
      } catch {
        setConditions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, selectedFilter]);

  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    conditions.forEach((c) => {
      const cat = (c.category || '').trim();
      if (cat) cats.set(cat.toLowerCase(), cat.charAt(0).toUpperCase() + cat.slice(1));
    });
    return ['ALL', ...Array.from(cats.values())];
  }, [conditions]);

  const handleFilter = (cat: string) => {
    setSelectedFilter(cat);
    setPage(1);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<Stethoscope className="w-3.5 h-3.5" />}>
          CONDITIONS WE TREAT
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Heal From Within
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Rooted in 5,000 years of classical Ayurveda, our physicians provide evidence-backed protocols for chronic, lifestyle, and degenerative conditions — treating the root cause, not just symptoms.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            active={selectedFilter.toLowerCase() === cat.toLowerCase()}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => <ConditionCardSkeleton key={i} />)}
        </div>
      )}

      {/* Count */}
      {!loading && (
        <div className="flex justify-between items-center border-b border-primary/10 pb-4">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
            {totalCount} Conditions
          </span>
          <span className="text-xs font-sans text-text-muted">Page {page} of {totalPages}</span>
        </div>
      )}

      {/* Grid */}
      {!loading && conditions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {conditions.map((condition, idx) => {
            const id = condition.id || condition._id || `cond-${idx}`;
            const slug = condition.slug || id;

            return (
              <Card key={id} variant="default" className="flex flex-col group shadow-sm hover:shadow-xl transition-all">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-slate-100">
                  {condition.coverImage ? (
                    <img
                      src={condition.coverImage}
                      alt={condition.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <span className="text-text-muted text-xs font-sans">No image</span>
                    </div>
                  )}
                  {condition.category && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="gold">{condition.category}</Badge>
                    </div>
                  )}
                </div>

                {condition.category && (
                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze mb-2 block">
                    {condition.category}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-primary mb-2">
                  <Link href={`/conditions/${slug}`} className="hover:underline">
                    {condition.title}
                  </Link>
                </h3>

                {condition.ayurvedicRootCause && (
                  <p className="font-sans text-xs text-text-muted mb-3 italic">
                    Root Cause: {condition.ayurvedicRootCause}
                  </p>
                )}

                {condition.shortDescription && (
                  <p className="font-sans text-text-secondary text-sm leading-relaxed mb-5 line-clamp-3">
                    {condition.shortDescription}
                  </p>
                )}

                {/* Symptoms preview */}
                {condition.symptoms && condition.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {condition.symptoms.slice(0, 3).map((sym, i) => (
                      <span key={i} className="bg-primary/5 text-primary text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border border-primary/10">
                        {sym}
                      </span>
                    ))}
                    {condition.symptoms.length > 3 && (
                      <span className="text-[10px] font-sans text-text-muted">+{condition.symptoms.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-primary/10 flex items-center justify-between">
                  <Link href={`/conditions/${slug}`}>
                    <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                      LEARN MORE
                    </Button>
                  </Link>
                  <Link href={`/booking?condition=${encodeURIComponent(condition.title)}`}>
                    <Button variant="gold" size="sm">
                      CONSULT
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && conditions.length === 0 && (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No conditions listed yet</p>
          <p className="font-sans text-text-muted text-sm">Our team is compiling treatment protocols. Please check back soon.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8 border-t border-primary/10">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} icon={<ChevronLeft className="w-4 h-4" />}>
            PREVIOUS
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg font-sans text-xs font-bold transition-all ${
                page === i + 1 ? 'bg-gold text-white shadow-md' : 'bg-surface-card text-primary border border-primary/10 hover:bg-primary/5'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} icon={<ChevronRight className="w-4 h-4" />}>
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}
