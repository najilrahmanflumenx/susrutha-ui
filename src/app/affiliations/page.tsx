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
          <div className="grid gap-4 md:grid-cols-2 font-body">
            {affiliationsList.map((item: any, idx: number) => (
              <div key={item._id || idx} className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-6 shadow-glass-dark hover:border-ochre transition-all text-ivory-50">
                {item.logoUrl && (
                  <img src={item.logoUrl} alt={item.title} className="h-12 w-auto object-contain mb-3" />
                )}
                <span className="inline-block rounded-full bg-ochre/20 border border-ochre/40 px-3 py-1 text-[11px] font-bold text-[#FFC86B] uppercase tracking-wider mb-2">
                  {item.category || 'Accreditation'}
                </span>
                <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                {item.issuingBody && <p className="text-sm font-medium text-ivory-100 mt-1">Issued by: {item.issuingBody}</p>}
                {item.description && <p className="text-sm text-ivory-200/90 mt-2 line-clamp-3 leading-relaxed">{item.description}</p>}
                {item.validityYear && <p className="text-xs text-[#FFC86B] font-bold mt-3">Valid: {item.validityYear}</p>}
                {item.certificateUrl && (
                  <a href={item.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-bold text-[#FFC86B] hover:underline">
                    View Certificate →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-8 text-center shadow-glass-dark text-ivory-50 font-body">
            <h2 className="font-display text-xl font-bold text-white">No Affiliations Listed</h2>
            <p className="mt-2 text-sm text-ivory-200/90">No accreditation certificates or institutional affiliations are currently published in the database.</p>
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

