'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Award, ChevronRight, Loader2, Sparkles, ChevronLeft, Search, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { DoctorItem, fetchDoctors } from '@/lib/api';
import { DoctorCarousel } from '@/components/doctors/DoctorCarousel';
import { DoctorCardSkeleton } from '@/components/ui/Skeleton';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    async function loadDoctors() {
      setLoading(true);
      try {
        const fetched = await fetchDoctors();
        setDoctors(fetched);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  // Dynamically extract unique available departments / specialties case-insensitively
  const availableCategories = useMemo(() => {
    if (!doctors || doctors.length === 0) return ['ALL'];
    const categoryMap = new Map<string, string>(); // lowercase -> display title

    doctors.forEach((doc) => {
      // Check department title if populated object or string
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

  // Filter doctors based on selected department chip and search input
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Category filter match
      if (selectedCategory !== 'ALL') {
        const filterKey = selectedCategory.toLowerCase();
        let docDept = '';
        if (typeof doc.departmentId === 'object' && doc.departmentId !== null) {
          docDept = ((doc.departmentId as any).title || '').toLowerCase();
        }
        const docSpec = (doc.specialization || '').toLowerCase();
        const docSpecialties = (doc.specialties || []).map((s) => s.toLowerCase());

        const matchesCat =
          docDept.includes(filterKey) ||
          docSpec.includes(filterKey) ||
          docSpecialties.some((s) => s.includes(filterKey));

        if (!matchesCat) return false;
      }

      // Search term match
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nameMatch = doc.name.toLowerCase().includes(q);
        const desigMatch = (doc.designation || '').toLowerCase().includes(q);
        const specMatch = (doc.specialization || '').toLowerCase().includes(q);
        if (!nameMatch && !desigMatch && !specMatch) return false;
      }

      return true;
    });
  }, [doctors, selectedCategory, searchTerm]);

  // Handle filter change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  // Pagination for grid mode
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / limit));
  const paginatedDoctors = filteredDoctors.slice((page - 1) * limit, page * limit);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
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
              Found {filteredDoctors.length} Expert Physicians
            </span>
            {viewMode === 'grid' && (
              <span className="text-xs font-sans text-text-muted">
                Page {page} of {totalPages}
              </span>
            )}
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <p className="font-display text-xl font-bold text-primary mb-2">No Physicians Match Your Filter</p>
              <p className="text-sm font-sans">Try selecting &quot;ALL&quot; or clearing your search term.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchTerm('');
                }}
              >
                RESET ALL FILTERS
              </Button>
            </div>
          ) : viewMode === 'carousel' ? (
            /* CAROUSEL SHOWCASE VIEW */
            <DoctorCarousel doctors={filteredDoctors} autoPlayInterval={4000} />
          ) : (
            /* GRID CATALOG VIEW */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {paginatedDoctors.map((doctor, idx) => {
                  const id = doctor.id || doctor._id || `doc-${idx}`;
                  const slug = doctor.slug || id;
                  const name = doctor.name || 'Ayurvedic Physician';
                  const designation = doctor.designation || doctor.title || 'Senior Consultant';
                  const specialization = doctor.specialization || (doctor.specialties ? doctor.specialties[0] : 'Kayachikitsa');
                  const expYears = doctor.experienceYears || 15;
                  const photo = doctor.photoUrl || doctor.photo || doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80';
                  const bio = doctor.bio || 'Expert physician committed to holistic patient wellness and classical Panchakarma care.';
                  const qualifications = Array.isArray(doctor.qualifications)
                    ? doctor.qualifications
                    : typeof doctor.qualifications === 'string'
                      ? [doctor.qualifications]
                      : ['BAMS', 'MD (Ayurveda)'];

                  return (
                    <Card key={id} variant="default" className="flex flex-col justify-between p-8 group shadow-sm hover:shadow-xl transition-all">
                      <div>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <Badge variant="gold" className="mb-3">{specialization}</Badge>
                        <h3 className="font-display text-3xl font-bold text-primary mb-1">
                          <Link href={`/doctors/${slug}`} className="hover:underline">
                            {name}
                          </Link>
                        </h3>
                        <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze block mb-4">
                          {designation} • {expYears} Years Exp.
                        </span>
                        <p className="font-sans text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                          {bio}
                        </p>

                        <div className="space-y-2 mb-6 pt-4 border-t border-primary/10">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-text-muted block">
                            QUALIFICATIONS
                          </span>
                          {qualifications.map((q, qIdx) => (
                            <div key={qIdx} className="flex items-center gap-2 text-xs font-sans text-text-primary">
                              <Award className="w-4 h-4 text-gold shrink-0" />
                              <span>{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link href={`/booking?doctor=${encodeURIComponent(name)}`}>
                        <Button variant="gold" className="w-full" icon={<ChevronRight className="w-4 h-4" />}>
                          SCHEDULE CONSULTATION
                        </Button>
                      </Link>
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
      )}
    </div>
  );
}
