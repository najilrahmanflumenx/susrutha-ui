'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero, Pagination, SkeletonCard } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getTreatments } from '../../lib/api';
import { treatments } from '../../data/treatments';
import { Sparkles, Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function TreatmentsPage() {
  const localTreatmentList = treatments.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    aiSummary: t.aiSummary,
    category: t.category,
    image: t.image || '/images/hero-ayurveda.jpg',
  }));
  const [treatmentList, setTreatmentList] = useState<any[]>(localTreatmentList);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = pageTitle('Treatments & Therapies');
    }
    setLoading(true);
    getTreatments({ category: selectedCategory !== 'all' ? selectedCategory : undefined })
      .then((apiTxs) => {
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
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Dynamically derive unique categories from actual treatment data (case-insensitive deduplicated)
  const categories = [
    'all',
    ...Array.from(
      new Map(
        treatmentList.map((t) => [t.category.toLowerCase(), t.category])
      ).values()
    ),
  ];

  const filteredList =
    selectedCategory === 'all'
      ? treatmentList
      : treatmentList.filter(
          (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="font-body min-h-screen bg-[#120A0B] text-[#FDFBF7]">
      <PageHero
        eyebrow="Therapies & Protocols"
        title="Classical Ayurvedic Therapies & Procedures"
        description="Detailed clinical overview, indications, procedure steps, safety guidelines, and consulting specialist doctor assignments for each therapy."
      />
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Treatments & Therapies' }]} />

        {/* Category Filter Tabs */}
        <div className="my-8 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFC86B] mr-2">
            <Filter className="h-4 w-4 text-[#FFC86B]" /> Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`rounded-full px-5 py-2 text-xs font-bold capitalize transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#FFC86B] text-[#120A0B] shadow-ochre-glow'
                  : 'bg-[#1C1214] border border-ochre/30 text-white hover:border-[#FFC86B] hover:text-[#FFC86B]'
              }`}
            >
              {cat === 'all' ? 'All Therapies' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : paginatedList.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedList.map((t) => (
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-ochre/30 bg-[#1C1214]/95 p-12 text-center shadow-glass-dark text-ivory-50 font-body">
            <Sparkles className="h-8 w-8 text-[#FFC86B] mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-white">No Therapies Found</h2>
            <p className="mt-2 text-sm text-ivory-200/90">No therapies match the selected category criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}



