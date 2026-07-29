'use client';

import { useEffect } from 'react';
import AppointmentHub from '../../components/AppointmentHub';
import { Breadcrumbs, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { brand } from '../../data/site';

export default function ContactPage() {
  useEffect(() => {
    document.title = pageTitle('Contact');
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Talk to Susrutha"
        description={`Forms, branch cards, emergency lines and quick actions · ${brand.contact.email}`}
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <div className="mb-8 rounded-2xl border border-crimson-500/40 bg-[#1C1214]/95 p-6 shadow-glass-dark text-ivory-50 font-body">
          <h2 className="font-display text-2xl font-bold text-white">Emergency</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {brand.contact.emergency.map((n) => (
              <a key={n} href={`tel:${n.replace(/\s/g, '')}`} className="text-lg font-bold text-red-400 hover:underline">
                {n}
              </a>
            ))}
          </div>
        </div>
        <AppointmentHub defaultTab="contact" />
      </div>
    </div>
  );
}
