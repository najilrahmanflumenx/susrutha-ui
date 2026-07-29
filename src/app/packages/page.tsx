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
    <div className="bg-[#120A0B] text-ivory-50 font-body min-h-screen">
      <PageHero
        eyebrow="Curative & Rejuvenation Programmes"
        title="Structured Care & Recovery Packages"
        description="From occupational spinal wellness to 14/21-day inpatient Panchakarma and Rasayana vitality stays. Classical Ayurvedic care tailored to your needs."
      >
        <Button to="/package-enquiry" variant="primary">Enquire About a Package</Button>
      </PageHero>
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Care Packages' }]} />
        {packageList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-3xl border border-ochre/30 bg-[#1C1214]/95 p-12 text-center shadow-glass-dark text-ivory-50">
            <h2 className="font-display text-2xl font-bold text-white">No Care Packages Listed</h2>
            <p className="mt-2 text-sm text-ivory-200/90">No care packages are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}



