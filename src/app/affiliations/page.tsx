'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, ExternalLink, Sparkles, Search, Building } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { fetchAffiliations, AffiliationItem } from '@/lib/api';

export default function AffiliationsPage() {
  const [affiliations, setAffiliations] = useState<AffiliationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAffiliations({ limit: 100 });
      setAffiliations(data);
      setLoading(false);
    }
    load();
  }, []);

  const types = useMemo(() => {
    const set = new Set<string>();
    affiliations.forEach((a) => {
      if (a.type) set.add(a.type);
    });
    return ['ALL', ...Array.from(set)];
  }, [affiliations]);

  const filtered = useMemo(() => {
    return affiliations.filter((item) => {
      const matchesType = selectedType === 'ALL' || item.type?.toLowerCase() === selectedType.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [affiliations, selectedType, searchTerm]);

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<Award className="w-3.5 h-3.5" />}>
          TRUST & EXCELLENCE
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Accreditations & Partners
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Susrutha Institute is proud to be accredited and affiliated with leading national medical boards, research institutes, and global healthcare organizations.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Type Filter */}
        {types.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            {types.map((type) => (
              <Chip
                key={type}
                active={selectedType.toLowerCase() === type.toLowerCase()}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Chip>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-card border border-primary/15 rounded-full pl-10 pr-4 py-2 text-xs font-sans text-primary focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-2xl h-40" />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => {
            const id = item.id || item._id || `aff-${idx}`;
            return (
              <Card key={id} variant="default" className="flex flex-col justify-between p-6 hover:shadow-lg transition-all border-primary/10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    {item.type && (
                      <Badge variant="gold" className="text-[10px]">
                        {item.type}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-primary leading-snug">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="font-sans text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.website && (
                  <div className="mt-4 pt-3 border-t border-primary/10 flex justify-end">
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-bronze hover:text-primary transition-colors"
                    >
                      <span>VISIT WEBSITE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No affiliations found</p>
          <p className="font-sans text-text-muted text-sm">Try clearing your search query.</p>
        </div>
      )}
    </div>
  );
}
