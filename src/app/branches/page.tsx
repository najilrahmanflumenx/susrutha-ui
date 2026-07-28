'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, Button, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getBranches } from '../../lib/api';

export default function BranchesPage() {
  const [branchList, setBranchList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Branches');
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
          image: b.code === 'KTK' ? '/images/hero-home.jpg' : '/images/ayurveda-herbs.jpg',
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
          <div className="grid gap-8 lg:grid-cols-2">
            {branchList.map((b) => (
              <article key={b.id} className="overflow-hidden rounded-[1.75rem] border border-sus-green/10 bg-white">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={b.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-sus-gold">{b.type}</p>
                  <h2 className="mt-2 font-display text-3xl text-sus-green-deep">{b.name}</h2>
                  <p className="mt-2 text-sm text-sus-muted">{b.address}</p>
                  <p className="mt-4 text-sus-muted leading-relaxed">{b.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {b.features.map((f: string) => (
                      <li key={f} className="rounded-full bg-sus-sand/70 px-3 py-1 text-xs text-sus-green-deep">{f}</li>
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
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Hospital Branches Found</h2>
            <p className="mt-2 text-sm text-sus-muted">No hospital branches are currently published in the database.</p>
          </div>
        )}
        <div className="mt-10 rounded-2xl border border-sus-green/10 bg-sus-sand/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-sus-green-deep">Looking for cottage stays?</h3>
            <p className="text-sm text-sus-muted mt-1">Susrutha Ayurveda Gramam — private cottages near the airport corridor.</p>
          </div>
          <Button to="/ayur-village" variant="secondary">Ayur Village</Button>
        </div>
      </div>
    </div>
  );
}
