'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, Button, CardLink, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getPackages } from '../../lib/api';

export default function PackagesPage() {
  const [packageList, setPackageList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Care Packages');
    getPackages().then((apiPkgs) => {
      if (apiPkgs && Array.isArray(apiPkgs) && apiPkgs.length > 0) {
        const mapped = apiPkgs.map((p: any) => ({
          id: p._id || p.slug,
          slug: p.slug,
          name: p.title || p.name,
          summary: p.subtitle || p.overview || p.summary,
          durationLabel: `${p.durationDays || 7} Days Programme`,
        }));
        setPackageList(mapped);
      }
    });
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Packages"
        title="Structured Care Programmes"
        description="From occupational Tekky care to 14/21-day hospital programmes and specialty pathways. Clinical Ayurvedic care tailored to your needs."
      >
        <Button to="/package-enquiry">Enquire about a package</Button>
      </PageHero>
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Packages' }]} />
        {packageList.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packageList.map((p) => (
              <CardLink
                key={p.id}
                to={`/packages/${p.slug}`}
                title={p.name}
                description={p.summary}
                meta={p.durationLabel}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Care Packages Listed</h2>
            <p className="mt-2 text-sm text-sus-muted">No care packages are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}


