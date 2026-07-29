'use client';

import { useEffect } from 'react';
import { ayurVillage } from '../../data/site';
import { Breadcrumbs, Button, PageHero, SectionHeading } from '../../components/ui';
import { pageTitle } from '../../lib/seo';

export default function AyurVillagePage() {
  useEffect(() => {
    document.title = pageTitle(ayurVillage.name);
  }, []);

  return (
    <div className="bg-[#120A0B] text-ivory-50 font-body min-h-screen">
      <PageHero
        eyebrow="Sanctuary Retreat"
        title={ayurVillage.name}
        description={`${ayurVillage.cottages} traditional Kerala eco-cottages with private treatment rooms — located ${ayurVillage.distance}.`}
      >
        <Button to="/package-enquiry" variant="primary">Enquire For a Sanctuary Stay</Button>
      </PageHero>
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Ayur Village Retreat' }]} />
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ochre/30 shadow-glass-dark">
            <img src={ayurVillage.image} alt="Traditional Kerala cottage in green sanctuary setting" className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHeading title="An Experience of Privacy, Deep Tranquillity & Restraint" description={ayurVillage.description} />
            <ul className="mt-8 grid sm:grid-cols-2 gap-3.5">
              {ayurVillage.features.map((f) => (
                <li key={f} className="rounded-2xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 px-5 py-3.5 text-sm font-semibold text-ivory-100 shadow-glass-dark">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-20">
          <SectionHeading eyebrow="Ideal Guest Profile" title="Who Thrives at the Gramam Sanctuary" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ayurVillage.idealFor.map((item) => (
              <div key={item} className="rounded-3xl bg-[#1C1214] text-ivory-50 p-7 shadow-glass-dark border border-ochre/30">
                <p className="font-display text-xl font-bold leading-snug text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-glass-dark text-ivory-50">
          <div>
            <h2 className="font-display text-3xl font-bold text-white">Plan Cottage-Based Clinical Care</h2>
            <p className="mt-2 text-ivory-200/90 max-w-xl text-base">Pair Ayur Village privacy with hospital clinical oversight. Package duration and therapy mix are physician-directed.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button to="/package-enquiry" variant="primary">Send Sanctuary Enquiry</Button>
            <Button to="/international-patients" variant="secondary">International Guidance</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

