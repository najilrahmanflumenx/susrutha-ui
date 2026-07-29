'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import InteractiveFacilities from '../../components/InteractiveFacilities';
import { Breadcrumbs, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';

export default function FacilitiesPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = pageTitle('Facilities');
    }
  }, []);

  return (
    <div className="font-body min-h-screen bg-[#120A0B] text-[#FDFBF7]">
      <PageHero
        eyebrow="Infrastructure"
        title="Facilities that support classical care"
        description="Interactive showcase — hover or click a facility to change the large image and highlight the active card."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Facilities' }]} />
        <InteractiveFacilities showCta={false} />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <img src="/images/hospital-room.jpg" alt="Patient room" className="rounded-3xl aspect-[4/3] object-cover w-full border border-ochre/30 shadow-2xl" />
          <img src="/images/yoga-hall.jpg" alt="Yoga practice space" className="rounded-3xl aspect-[4/3] object-cover w-full border border-ochre/30 shadow-2xl" />
          <img src="/images/panchakarma.jpg" alt="Therapy setting" className="rounded-3xl aspect-[4/3] object-cover w-full border border-ochre/30 shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
