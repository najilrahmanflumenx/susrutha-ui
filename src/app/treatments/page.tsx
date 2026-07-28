'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getTreatments } from '../../lib/api';

export default function TreatmentsPage() {
  const [treatmentList, setTreatmentList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Treatments & Therapies');
    getTreatments().then((apiTxs) => {
      if (apiTxs && Array.isArray(apiTxs) && apiTxs.length > 0) {
        const mapped = apiTxs.map((t: any) => ({
          id: t._id || t.slug,
          slug: t.slug,
          name: t.title || t.name,
          aiSummary: t.shortDescription || t.fullDescription || t.aiSummary,
          category: t.category || 'Panchakarma Therapy',
          image: t.coverImage || t.image || '/images/treatment-placeholder.jpg',
        }));
        setTreatmentList(mapped);
      }
    });
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Therapies"
        title="Classical Ayurvedic Therapies & Procedures"
        description="Detailed clinical overview, indications, procedure steps, safety guidelines, and consulting specialist doctor assignments for each therapy."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Treatments' }]} />
        {treatmentList.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treatmentList.map((t) => (
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
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Therapies Listed</h2>
            <p className="mt-2 text-sm text-sus-muted">No treatments or therapies are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}


