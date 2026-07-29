'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Breadcrumbs, Button, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getBranches } from '../../lib/api';

export default function BranchesPage() {
  const [branchList, setBranchList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = pageTitle('Branches');
    }
    getBranches().then((apiBranches) => {
      if (apiBranches && Array.isArray(apiBranches) && apiBranches.length > 0) {
        const mapped = apiBranches.map((b: any) => ({
          id: b._id || b.code,
          code: b.code,
          slug: b.slug || (b.code === 'KTK' || b.code === 'KATT' ? 'kattakada' : 'kowdiar'),
          name: b.name,
          type: b.type || (b.code === 'KTK' ? 'Inpatient Hospital Campus' : 'City OP Clinic'),
          address: b.address || 'Thiruvananthapuram, Kerala',
          description: b.tagline || 'Authentic Ayurveda care facility.',
          image: b.code === 'KTK' ? '/images/hero-ayurveda.jpg' : '/images/herbs-mortar.jpg',
          features: b.features || ['40 Beds', '24/7 Casualty', 'Panchakarma Suites'],
        }));
        setBranchList(mapped);
      }
    });
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Locations"
        title="Kattakada hospital & Kowdiar OP"
        description="Two access points in Thiruvananthapuram — full inpatient infrastructure at Kattakada, city outpatient convenience at Kowdiar."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Branches' }]} />
        {branchList.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2 font-body">
            {branchList.map((b) => (
              <article key={b.id} className="overflow-hidden rounded-[1.75rem] border border-ochre/30 bg-[#1C1214]/95 text-ivory-50 shadow-glass-dark">
                <div className="aspect-[16/9] overflow-hidden border-b border-ochre/20">
                  <img src={b.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#FFC86B] font-bold">{b.type}</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-white">{b.name}</h2>
                  <p className="mt-2 text-sm text-ivory-300/80">{b.address}</p>
                  <p className="mt-4 text-ivory-200/90 leading-relaxed font-body">{b.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 font-body">
                    {b.features.map((f: string) => (
                      <li key={f} className="rounded-full bg-ochre/20 border border-ochre/40 px-3 py-1 text-xs font-medium text-[#FFC86B]">{f}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button to={`/branches/${b.slug}`}>Branch details</Button>
                    <Button
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name + ' ' + b.address)}`}
                      variant="secondary"
                    >
                      Directions
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-8 text-center shadow-glass-dark text-ivory-50 font-body">
            <h2 className="font-display text-xl text-white font-bold">No Hospital Branches Found</h2>
            <p className="mt-2 text-sm text-ivory-200/90">No hospital branches are currently published in the database.</p>
          </div>
        )}
        <div className="mt-10 rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-glass-dark text-ivory-50 font-body">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Looking for cottage stays?</h3>
            <p className="text-sm text-ivory-200/90 mt-1">Susrutha Ayurveda Gramam — private cottages near the airport corridor.</p>
          </div>
          <Button to="/ayur-village" variant="secondary">Ayur Village</Button>
        </div>
      </div>
    </div>
  );
}
