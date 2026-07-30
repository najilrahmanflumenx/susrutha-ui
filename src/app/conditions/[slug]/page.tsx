'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Stethoscope, CheckCircle2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchConditionBySlug, ConditionItem } from '@/lib/api';

function ConditionDetailSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="h-5 w-24 rounded-full bg-primary/10" />
      <div className="h-10 w-3/4 rounded-xl bg-primary/10" />
      <div className="h-4 w-48 rounded-full bg-primary/10" />
      <div className="aspect-[16/9] rounded-3xl bg-primary/10" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-4 rounded-full bg-primary/10 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

export default function ConditionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [condition, setCondition] = useState<ConditionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      const data = await fetchConditionBySlug(slug);
      setCondition(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  const fallbackImage = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-4xl mx-auto pb-24">
      {/* Back Button */}
      <div className="pt-8 mb-8">
        <Link href="/conditions">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            BACK TO CONDITIONS
          </Button>
        </Link>
      </div>

      {loading && <ConditionDetailSkeleton />}

      {!loading && !condition && (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">Condition details not found</p>
          <Link href="/conditions">
            <Button variant="gold">View All Conditions</Button>
          </Link>
        </div>
      )}

      {!loading && condition && (
        <article className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            {condition.category && (
              <div>
                <Badge variant="gold" icon={<Stethoscope className="w-3 h-3" />}>
                  {condition.category}
                </Badge>
              </div>
            )}
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-primary leading-tight">
              {condition.title}
            </h1>
            {condition.ayurvedicRootCause && (
              <div className="flex items-center gap-2 text-sm font-sans font-medium text-bronze bg-bronze/10 px-4 py-2 rounded-xl w-fit">
                <AlertCircle className="w-4 h-4 text-bronze" />
                <span>Ayurvedic Root Cause: <strong>{condition.ayurvedicRootCause}</strong></span>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={condition.coverImage || fallbackImage}
              alt={condition.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Short Overview */}
          {condition.shortDescription && (
            <p className="font-sans text-lg text-text-secondary leading-relaxed border-l-4 border-gold pl-6 italic">
              {condition.shortDescription}
            </p>
          )}

          {/* Symptoms */}
          {condition.symptoms && condition.symptoms.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-primary/10 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" /> Common Symptoms Addressed
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {condition.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-sans text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          {condition.fullDescription && (
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-2xl font-bold text-primary">Treatment Approach</h3>
              <div
                className="font-sans text-text-secondary leading-relaxed text-base prose max-w-none"
                dangerouslySetInnerHTML={{ __html: condition.fullDescription }}
              />
            </div>
          )}

          {/* Associated Treatments */}
          {condition.treatments && condition.treatments.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-primary">Recommended Ayurvedic Protocols</h3>
              <div className="flex flex-wrap gap-2">
                {condition.treatments.map((treatmentName, i) => (
                  <span
                    key={i}
                    className="bg-primary/5 text-primary text-xs font-sans font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-primary/10"
                  >
                    {treatmentName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Box */}
          <div className="mt-8 p-8 rounded-3xl bg-primary text-surface text-center flex flex-col items-center gap-4">
            <Sparkles className="w-8 h-8 text-gold" />
            <h3 className="font-display text-2xl font-bold">Seek Root-Cause Healing</h3>
            <p className="font-sans text-sm text-surface/70 max-w-md">
              Schedule a pulse diagnosis and personalized consultation with our expert physicians to treat {condition.title}.
            </p>
            <Link href={`/booking?condition=${encodeURIComponent(condition.title)}`}>
              <Button variant="gold" icon={<ArrowRight className="w-4 h-4" />}>
                BOOK CONSULTATION FOR {condition.title.toUpperCase()}
              </Button>
            </Link>
          </div>
        </article>
      )}
    </div>
  );
}
