'use client';

import { useEffect, useState } from 'react';
import { verticals } from '../../data/site';
import { Breadcrumbs, Button, PageHero, SectionHeading } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getAffiliations } from '../../lib/api';

export default function AffiliationsPage() {
  const [affiliationsList, setAffiliationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = pageTitle('Affiliations');
    getAffiliations().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setAffiliationsList(data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHero eyebrow="Trust" title="Affiliations & recognition" description="We list verified institutional certifications, accreditations, and professional memberships." />
      <div className="container-wide section-pad py-12 max-w-4xl space-y-6">
        <Breadcrumbs items={[{ label: 'Affiliations' }]} />

        {affiliationsList.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {affiliationsList.map((item: any, idx: number) => (
              <div key={item._id || idx} className="rounded-2xl border border-sus-green/10 bg-white p-6 shadow-sm hover:border-sus-green/25 transition-all">
                {item.logoUrl && (
                  <img src={item.logoUrl} alt={item.title} className="h-12 w-auto object-contain mb-3" />
                )}
                <span className="inline-block rounded-full bg-sus-cream px-3 py-1 text-[11px] font-medium text-sus-gold uppercase tracking-wider mb-2">
                  {item.category || 'Accreditation'}
                </span>
                <h3 className="font-display text-xl text-sus-green-deep">{item.title}</h3>
                {item.issuingBody && <p className="text-sm font-medium text-sus-ink/80 mt-1">Issued by: {item.issuingBody}</p>}
                {item.description && <p className="text-sm text-sus-muted mt-2 line-clamp-3">{item.description}</p>}
                {item.validityYear && <p className="text-xs text-sus-green font-medium mt-3">Valid: {item.validityYear}</p>}
                {item.certificateUrl && (
                  <a href={item.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-semibold text-sus-green hover:underline">
                    View Certificate →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Affiliations Listed</h2>
            <p className="mt-2 text-sm text-sus-muted">No accreditation certificates or institutional affiliations are currently published in the database.</p>
          </div>
        )}

        <div className="mt-8">
          <SectionHeading title="Related verticals" />
          <ul className="mt-4 space-y-2">
            {verticals.map((v) => (
              <li key={v.name} className="text-sm text-sus-muted">
                <span className="text-sus-green-deep font-medium">{v.name}</span> — {v.detail}
              </li>
            ))}
          </ul>
        </div>
        <Button to="/ecosystem" variant="secondary">Ecosystem pages</Button>
      </div>
    </div>
  );
}

