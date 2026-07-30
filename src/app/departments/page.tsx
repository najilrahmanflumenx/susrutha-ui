'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
  Search,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { EmptyState, DepartmentCardSkeleton } from '@/components/ui/Skeleton';
import { DepartmentItem, fetchDepartments } from '@/lib/api';

export default function PublicDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchDepartments({ limit: 50 });
        setDepartments(data);
      } catch {
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDepts = useMemo(() => {
    return departments.filter((dept) => {
      const matchSearch =
        !searchTerm.trim() ||
        (dept.title || dept.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.tagline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.overview || dept.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });
  }, [departments, searchTerm]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Header Section */}
      <div className="relative pt-32 sm:pt-36 pb-16 px-6 sm:px-12 md:px-20 overflow-hidden border-b border-primary/10 bg-gradient-to-b from-primary/5 via-surface to-surface">
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <Badge variant="gold" className="px-4 py-1.5 shadow-sm text-xs font-sans tracking-widest uppercase" icon={<Sparkles className="w-4 h-4" />}>
            EXCELLENCE IN AYURVEDIC MEDICINE
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
            Specialty Clinical Departments
          </h1>
          <p className="font-sans text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Discover our specialized Ayurvedic medical divisions, led by senior physicians and backed by over five decades of classical research & inpatient care.
          </p>

          {/* Live Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search departments by name, code, or clinical focus..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-card border border-primary/15 font-sans text-sm text-primary placeholder:text-text-muted shadow-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DepartmentCardSkeleton />
            <DepartmentCardSkeleton />
            <DepartmentCardSkeleton />
          </div>
        ) : filteredDepts.length === 0 ? (
          <EmptyState
            title="No Specialty Departments Found"
            message={
              searchTerm
                ? `No clinical department matching "${searchTerm}". Try resetting your search.`
                : 'Specialty clinical departments are being updated. Please check back shortly.'
            }
            action={
              searchTerm ? (
                <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                  Reset Search
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDepts.map((dept) => {
              const heroImg = dept.image || dept.coverImage;
              return (
                <Card
                  key={dept._id || dept.id || dept.slug}
                  variant="glass"
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/15 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-surface-card"
                >
                  <div>
                    {/* Hero Image Container */}
                    {heroImg ? (
                      <div className="h-52 w-full overflow-hidden relative">
                        <img
                          src={heroImg}
                          alt={dept.title || dept.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                        {dept.code && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-gold text-[11px] font-mono font-bold uppercase tracking-wider border border-gold/30 shadow-md">
                              {dept.code}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-36 w-full bg-gradient-to-br from-primary/10 via-surface-elevated to-primary/5 flex items-center justify-center border-b border-primary/10 relative">
                        <Activity className="w-10 h-10 text-gold/60" />
                        {dept.code && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-gold text-[11px] font-mono font-bold uppercase tracking-wider border border-gold/30 shadow-md">
                              {dept.code}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Stethoscope className="w-4 h-4 text-gold shrink-0" />
                          <h3 className="font-display text-2xl font-bold text-primary group-hover:text-gold transition-colors">
                            {dept.title || dept.name}
                          </h3>
                        </div>

                        {dept.tagline && (
                          <p className="text-xs font-sans font-semibold text-gold-dark uppercase tracking-wider">
                            {dept.tagline}
                          </p>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-sans text-text-secondary leading-relaxed line-clamp-3">
                        {dept.overview || dept.description}
                      </p>

                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 pt-0 space-y-2 border-t border-primary/10 mt-4">
                    <Link href={`/doctors?category=${encodeURIComponent(dept.title || dept.name || 'ALL')}`} className="block">
                      <Button variant="gold" size="sm" className="w-full justify-center text-xs font-bold tracking-wider uppercase" icon={<Users className="w-4 h-4" />}>
                        CONSULT SPECIALISTS
                      </Button>
                    </Link>
                    <Link href="/booking" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-text-secondary hover:text-primary" icon={<Calendar className="w-3.5 h-3.5" />}>
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
