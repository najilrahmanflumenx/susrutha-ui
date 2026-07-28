'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs, PageHero, SectionHeading } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getEcosystem } from '../../lib/api';

export default function EcosystemPage() {
  const [verticals, setVerticals] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Ecosystem');
    getEcosystem().then((apiEco) => {
      if (apiEco && Array.isArray(apiEco) && apiEco.length > 0) {
        const mapped = apiEco.map((v: any) => ({
          id: v._id || v.slug,
          slug: v.slug,
          shortName: v.title || v.name || v.shortName,
          tagline: v.tagline || v.description || 'Susrutha Ayurvedic Ecosystem Pillar',
          year: v.year || '2008',
        }));
        setVerticals(mapped);
      }
    });
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Ecosystem"
        title="Verticals Beyond a Single Hospital Door"
        description="Pharma manufacturing, herbal garden research, academy, medi-tech labs, and charitable trust — each an integral pillar of Susrutha."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Ecosystem' }]} />
        <SectionHeading
          title="Explore each vertical"
          description="Dedicated pages include services, FAQs, maps, galleries and enquiry forms for institutional clarity."
        />
        {verticals.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {verticals.map((v) => (
              <Link
                key={v.id}
                href={`/ecosystem/${v.slug}`}
                className="group flex h-full flex-col rounded-[1.5rem] border border-sus-green/10 bg-white p-6 hover:border-sus-green/30 hover:-translate-y-1 transition-all"
              >
                {v.year && <p className="text-xs uppercase tracking-[0.16em] text-sus-gold">Since {v.year}</p>}
                <h2 className="mt-2 font-display text-2xl text-sus-green-deep">{v.shortName}</h2>
                <p className="mt-2 text-sm text-sus-muted flex-1 leading-relaxed">{v.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sus-green">
                  Open page <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Ecosystem Pillars Listed</h2>
            <p className="mt-2 text-sm text-sus-muted">No ecosystem pillars are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}


