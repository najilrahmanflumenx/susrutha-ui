'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Globe, Sparkles, Building2, CheckCircle2, ArrowRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { fetchEcosystemPillars, EcosystemItem } from '@/lib/api';
import { RoomFacilitiesGrid } from '@/components/facilities/RoomFacilitiesGrid';

export default function PublicEcosystemPage() {
  const [pillars, setPillars] = useState<EcosystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('ALL');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchEcosystemPillars();
      setPillars(data);
      setLoading(false);
    }
    load();
  }, []);

  const unitTypes = useMemo(() => {
    const set = new Set<string>();
    pillars.forEach((p) => {
      if (p.pillarType) set.add(p.pillarType);
    });
    return ['ALL', ...Array.from(set)];
  }, [pillars]);

  const filteredPillars = useMemo(() => {
    if (selectedUnit.toUpperCase() === 'ALL') return pillars;
    return pillars.filter((p) => (p.pillarType || '').toLowerCase() === selectedUnit.toLowerCase());
  }, [pillars, selectedUnit]);

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <Badge variant="gold" className="mb-4" icon={<Globe className="w-3.5 h-3.5" />}>
          CAMPUS ECOSYSTEM & SPECIALITY FACILITIES
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Our Integrated Sanctuary
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Explore our Medicinal Herbal Gardens, GMP Herbal Pharmacy, Clinical Research Labs, Ayurveda Academy, and specialized hospital facilities.
        </p>
      </div>

      {/* Filter Chips */}
      {unitTypes.length > 1 && (
        <div className="flex justify-center items-center gap-2.5 flex-wrap">
          {unitTypes.map((unit) => (
            <Chip
              key={unit}
              active={selectedUnit.toLowerCase() === unit.toLowerCase()}
              onClick={() => setSelectedUnit(unit)}
            >
              {unit === 'ALL' ? 'All Facility Units' : unit}
            </Chip>
          ))}
        </div>
      )}

      {/* Grid List */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-3xl h-80" />
          ))}
        </div>
      )}

      {!loading && filteredPillars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPillars.map((item, idx) => {
            return (
              <Card
                key={item.id || item._id || idx}
                variant="default"
                className="flex flex-col justify-between overflow-hidden p-0 border border-primary/10 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-[16/10] bg-primary/5 overflow-hidden">
                  <img
                    src={
                      item.coverImage ||
                      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest bg-primary/90 text-gold px-3 py-1 rounded-full backdrop-blur-md border border-gold/30 flex items-center gap-1.5 shadow-lg">
                      <Tag className="w-3 h-3" />
                      {item.pillarType || 'Specialized Facility'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-3 flex-grow">
                  <h3 className="font-display text-2xl font-bold text-primary group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  {item.tagline && (
                    <p className="font-sans text-xs font-bold text-bronze uppercase tracking-wider">
                      {item.tagline}
                    </p>
                  )}
                  <p className="font-sans text-text-secondary text-sm leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-primary/5 mt-auto flex items-center justify-between">
                  <Link href="/contact" className="w-full">
                    <Button variant="outline" size="sm" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                      INQUIRE ABOUT THIS FACILITY
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filteredPillars.length === 0 && (
        <div className="text-center py-16 bg-surface-card rounded-3xl border border-primary/10">
          <p className="font-sans text-text-secondary text-sm">No specialized facility units found.</p>
        </div>
      )}

      {/* Inpatient Room Accommodations & Ayur Village Section */}
      <div className="pt-12 border-t border-primary/10">
        <RoomFacilitiesGrid />
      </div>
    </div>
  );
}
