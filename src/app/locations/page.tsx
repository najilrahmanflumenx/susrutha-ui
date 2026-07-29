'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Loader2, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, Chip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LocationCardSkeleton } from '@/components/ui/Skeleton';
import { BranchItem, fetchBranches, MOCK_BRANCHES } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';

export default function LocationsPage() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    async function loadBranches() {
      setLoading(true);
      try {
        const res = await fetchBranches({
          page,
          limit: itemsPerPage,
          type: selectedFilter,
        });
        setBranches(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalCount(res.meta.total);
      } catch (err) {
        console.error('Error loading branches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBranches();
  }, [page, selectedFilter]);

  // Dynamic available categories / types extraction
  const availableTypes = useMemo(() => {
    return ['ALL', 'Inpatient Campus', 'Specialty Clinic'];
  }, []);

  const handleFilterChange = (type: string) => {
    setSelectedFilter(type);
    setPage(1);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<Sparkles className="w-3.5 h-3.5" />}>
          AUTHENTIC KERALA SANCTUARIES
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Hospital Campuses & Specialty Clinics
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          From our flagship 40-bed inpatient hospital campus in Kattakada to our premium city outpatient specialty centers across Kerala, experience authentic Ayurvedic medical care.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {availableTypes.map((type) => (
          <Chip
            key={type}
            active={selectedFilter === type}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </Chip>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LocationCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && (
        <>
          <div className="flex justify-between items-center border-b border-primary/10 pb-4">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
              Showing {totalCount} Medical Sanctuaries Across Kerala
            </span>
            <span className="text-xs font-sans text-text-muted">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch, idx) => {
              const id = branch.id || branch._id || `br-${idx}`;
              const name = branch.name || 'Susrutha Ayurvedic Center';
              const typeLabel = branch.type === 'INPATIENT_HOSPITAL' ? '40-Bed Inpatient Campus' : 'Outpatient Specialty Clinic';
              const image = branch.coverImage || (idx % 2 === 0
                ? 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80');
              const street = branch.address?.street || 'Thiruvananthapuram';
              const city = branch.address?.city || 'Kerala';
              const pincode = branch.address?.pincode || '';
              const fullAddress = `${street}, ${city} ${pincode}`;
              const phone = branch.contact?.phone?.join(', ') || '+91 96566 56736';
              const email = branch.contact?.email || 'info@susruthaayurveda.com';
              const timings = branch.opdTimings || '09:00 AM - 07:00 PM';
              const features = branch.features?.length ? branch.features : ['Panchakarma Cottages', 'OPD Consultations', 'Botanical Garden'];

              return (
                <Card key={id} variant="default" className="p-8 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all">
                  <div>
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="gold">{typeLabel}</Badge>
                      </div>
                    </div>

                    <h3 className="font-display text-3xl font-bold text-primary mb-2">{name}</h3>
                    <p className="text-bronze font-bold text-xs uppercase tracking-wider mb-6">
                      {branch.tagline || 'Authentic Kerala Ayurvedic Medicine'}
                    </p>

                    <div className="space-y-3 text-xs font-sans text-text-secondary mb-6 pt-4 border-t border-primary/10">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{fullAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gold shrink-0" />
                        <span>{phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gold shrink-0" />
                        <span>{email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold shrink-0" />
                        <span>{timings}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {features.map((feat, fIdx) => (
                        <span key={fIdx} className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-semibold">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link href={`/booking?branch=${encodeURIComponent(name)}`} className="w-full">
                      <Button variant="gold" className="w-full" icon={<Calendar className="w-4 h-4" />}>
                        BOOK AT THIS LOCATION
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
