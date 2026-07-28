'use client';

import { useEffect } from 'react';
import InteractiveFacilities from '../../components/InteractiveFacilities';
import { Breadcrumbs, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';

export default function FacilitiesPage() {
  useEffect(() => {
    document.title = pageTitle('Facilities');
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Infrastructure"
        title="Facilities that support classical care"
        description="Interactive showcase — hover or click a facility to change the large image and highlight the active card."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Facilities' }]} />
        <InteractiveFacilities showCta={false} />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <img src="/images/hospital-room.jpg" alt="Patient room" className="rounded-2xl aspect-[4/3] object-cover w-full" />
          <img src="/images/yoga-hall.jpg" alt="Yoga practice space" className="rounded-2xl aspect-[4/3] object-cover w-full" />
          <img src="/images/panchakarma.jpg" alt="Therapy setting" className="rounded-2xl aspect-[4/3] object-cover w-full" />
        </div>
      </div>
    </div>
  );
}
