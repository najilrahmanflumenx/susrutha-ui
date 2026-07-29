'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getTreatments } from '../../lib/api';
import { treatments } from '../../data/treatments';
import { Sparkles, Filter } from 'lucide-react';

export default function TreatmentsPage() {
  const [treatmentList, setTreatmentList] = useState<any[]>(
    treatments.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      aiSummary: t.aiSummary,
      category: t.category,
      image: t.image || '/images/hero-ayurveda.jpg',
    }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = pageTitle('Treatments & Therapies');
    }
    getTreatments().then((apiTxs) => {
      if (apiTxs && Array.isArray(apiTxs) && apiTxs.length > 0) {
        const mapped = apiTxs.map((t: any) => ({
          id: t._id || t.slug,
          slug: t.slug,
          name: t.title || t.name,
          aiSummary: t.shortDescription || t.fullDescription || t.aiSummary,
          category: t.category || 'Panchakarma Therapy',
          image: t.coverImage || t.image || '/images/hero-ayurveda.jpg',
        }));
        setTreatmentList(mapped);
      }
    });
  }, []);

  const categories = ['all', 'Panchakarma', 'Spine & Joint', 'Rasayana & Immunity', 'Ayurvedic Wellness'];

  const filteredList = selectedCategory === 'all'
    ? treatmentList
    : treatmentList.filter((t) => {
        const query = selectedCategory.toLowerCase().split(' ')[0];
        return (
          t.category.toLowerCase().includes(query) ||
          t.name.toLowerCase().includes(query) ||
          t.aiSummary.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query)
        );
      });

  return (
    <div style={{ backgroundColor: '#160506', color: '#FDFBF7' }} className="font-body min-h-screen">
      <PageHero
        eyebrow="Therapies & Protocols"
        title="Classical Ayurvedic Therapies & Procedures"
        description="Detailed clinical overview, indications, procedure steps, safety guidelines, and consulting specialist doctor assignments for each therapy."
      />
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Treatments & Therapies' }]} />

        {/* Category Filter Tabs */}
        <div className="my-8 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FCAB28] mr-2">
            <Filter className="h-4 w-4 text-[#FCAB28]" /> Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-bold capitalize transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#FCAB28] text-[#160506] shadow-ochre-glow'
                  : 'bg-[#240809] border border-ochre/30 text-white hover:border-[#FCAB28] hover:text-[#FCAB28]'
              }`}
            >
              {cat === 'all' ? 'All Therapies' : cat}
            </button>
          ))}
        </div>

        {filteredList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((t) => (
              <CardLink
                key={t.id}
                to={`/treatments/${t.slug}`}
                title={t.name}
                description={t.aiSummary}
                meta={t.category}
                image={t.image}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-ivory-300 bg-white p-12 text-center">
            <Sparkles className="h-8 w-8 text-ochre mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-ivory-900">No Therapies Found</h2>
            <p className="mt-2 text-sm text-ivory-700">No therapies match the selected category criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}



