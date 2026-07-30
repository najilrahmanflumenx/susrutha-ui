'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Award, ChevronRight, Loader2, Sparkles, ChevronLeft, Search, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { DoctorItem, fetchDoctors } from '@/lib/api';
import { DoctorCarousel } from '@/components/doctors/DoctorCarousel';
import { DoctorCardSkeleton, EmptyState } from '@/components/ui/Skeleton';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Server-Side Paginated API Fetch on page / filter / search change
  useEffect(() => {
    async function loadDoctors() {
      setLoading(true);
      try {
        const res = await fetchDoctors({
          page,
          limit,
          category: selectedCategory,
          search: searchTerm,
        });
        setDoctors(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotalCount(res.meta.total || res.data.length);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, [page, selectedCategory, searchTerm]);

  // Available categories derived dynamically from fetched items
  const availableCategories = useMemo(() => {
    if (!doctors || doctors.length === 0) return ['ALL'];
    const categoryMap = new Map<string, string>(); // lowercase -> display title

    doctors.forEach((doc) => {
      let deptName = '';
      if (typeof doc.departmentId === 'object' && doc.departmentId !== null) {
        deptName = (doc.departmentId as any).title || '';
      } else if (doc.specialization) {
        deptName = doc.specialization;
      } else if (doc.specialties && doc.specialties.length > 0) {
        deptName = doc.specialties[0];
      }

      if (deptName.trim()) {
        const lowerKey = deptName.trim().toLowerCase();
        if (!categoryMap.has(lowerKey)) {
          categoryMap.set(lowerKey, deptName.trim());
        }
      }
    });

    return ['ALL', ...Array.from(categoryMap.values())];
  }, [doctors]);

  // Handle filter change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-10 pb-24">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="mahogany" className="mb-4" icon={<Sparkles className="w-3.5 h-3.5" />}>
          EVIDENCE-BASED AYURVEDIC MEDICINE
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Our Senior Physicians
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Every doctor at Susrutha holds advanced postgraduate medical degrees (MD/MS/PhD) in Ayurveda combined with decades of clinical experience in root-cause healing.
        </p>
      </div>

      {/* TOP FILTERS & SEARCH CONTROL BAR */}
      <div className="flex flex-col gap-6 pt-4 border-t border-primary/10">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-bronze" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search physician by name, specialty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-primary/20 bg-surface-card text-sm font-sans text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
              View Mode:
            </span>
            <div className="flex items-center gap-1 bg-surface-card p-1 rounded-full border border-primary/10">
              <button
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans font-bold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-gold text-white shadow-md'
                    : 'text-primary hover:bg-primary/5'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Carousel Showcase</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gold text-white shadow-md'
                    : 'text-primary hover:bg-primary/5'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Catalog</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Department / Specialty Filter Chips */}
        <div className="flex justify-center items-center gap-2.5 flex-wrap pt-2">
          {availableCategories.map((cat) => (
            <Chip
              key={cat}
              active={selectedCategory.toLowerCase() === cat.toLowerCase()}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </Chip>
          ))}
        </div>
      </div>

      {/* Loading state with Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* SINGLE COHESIVE MAIN DISPLAY AREA */}
      {!loading && (
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
              Found {totalCount} Expert Physicians
            </span>
            <span className="text-xs font-sans text-text-muted">
              Page {page} of {totalPages}
            </span>
          </div>

          {doctors.length === 0 ? (
            <EmptyState
              title="No Physicians Found"
              description="Try resetting filters or clearing the search term."
              action={<Button variant="outline" size="sm" onClick={() => { setSelectedCategory('ALL'); setSearchTerm(''); setPage(1); }}>RESET ALL FILTERS</Button>}
            />
          ) : viewMode === 'carousel' ? (
            /* CAROUSEL SHOWCASE VIEW */
            <DoctorCarousel doctors={doctors} autoPlayInterval={4000} />
          ) : (
            /* GRID CATALOG VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {doctors.map((doctor, idx) => {
                const id = doctor.id || doctor._id || `doc-${idx}`;
                const slug = doctor.slug || id;
                const name = doctor.name;
                const designation = doctor.designation || doctor.title;
                const specialization = doctor.specialization || doctor.specialties?.[0];
                const expYears = doctor.experienceYears;
                const photo = doctor.photoUrl || doctor.photo || doctor.image;
                const bio = doctor.bio;
                const qualifications = Array.isArray(doctor.qualifications)
                  ? doctor.qualifications
                  : typeof doctor.qualifications === 'string'
                    ? [doctor.qualifications]
                    : [];

                return (
                  <Card key={id} variant="default" className="flex flex-col justify-between p-8 group shadow-sm hover:shadow-xl transition-all">
                    <div>
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                        {photo ? (
                          <img
                            src={photo}
                            alt={name || ''}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <span className="text-text-muted text-xs font-sans">No photo</span>
                          </div>
                        )}
                      </div>
                      {specialization && <Badge variant="gold" className="mb-3">{specialization}</Badge>}
                      <h3 className="font-display text-3xl font-bold text-primary mb-1">
                        <Link href={`/doctors/${slug}`} className="hover:underline">
                          {name}
                        </Link>
                      </h3>
                      {(designation || expYears != null) && (
                        <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze block mb-4">
                          {[designation, expYears != null ? `${expYears} Years Exp.` : null].filter(Boolean).join(' • ')}
                        </span>
                      )}
                      {bio && (
                        <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                          {bio}
                        </p>
                      )}

                      {qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {qualifications.map((q, qIdx) => (
                            <div key={qIdx} className="text-[11px] font-sans font-semibold px-2.5 py-1 rounded-md bg-surface-dark/5 text-primary border border-primary/10">
                              {q}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link href={`/booking?doctor=${encodeURIComponent(name || '')}`}>
                      <Button variant="gold" className="w-full" icon={<ChevronRight className="w-4 h-4" />}>
                        SCHEDULE CONSULTATION
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination Controls Footer */}
          <div className="flex flex-col items-center justify-center gap-4 pt-8 border-t border-primary/10 mt-8">
            <div className="text-xs font-sans font-semibold text-text-secondary uppercase tracking-wider">
              Showing {totalCount > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, totalCount)} of {totalCount} Doctors
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  PREVIOUS
                </Button>
                <div className="flex items-center gap-1.5">
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
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  NEXT
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
