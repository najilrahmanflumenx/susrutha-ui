'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getConditions } from '../../lib/api';
import { specialties } from '../../data/specialties';

export default function ConditionsPage() {
  const [conditionList, setConditionList] = useState<any[]>(
    specialties.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.shortName || s.name,
      tagline: s.tagline,
      meta: 'Speciality Pathway',
    }))
  );

  useEffect(() => {
    document.title = pageTitle('Conditions & Specialities');
    getConditions().then((apiConditions) => {
      if (apiConditions && Array.isArray(apiConditions) && apiConditions.length > 0) {
        const mapped = apiConditions.map((c: any) => ({
          id: c._id || c.slug,
          slug: c.slug,
          name: c.title || c.name,
          tagline: c.shortDescription || c.ayurvedicRootCause || c.tagline,
          meta: c.category || 'Speciality Pathway',
        }));
        setConditionList(mapped);
      }
    });
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Conditions"
        title="Clinical Conditions & Speciality Pathways"
        description="Ayurvedic root cause analysis, symptoms management, recommended panchakarma therapies, and consulting doctor details."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Conditions' }]} />
        {conditionList.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {conditionList.map((s) => (
              <CardLink key={s.id} to={`/conditions/${s.slug}`} title={s.name} description={s.tagline} meta={s.meta || 'Speciality pathway'} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Conditions Listed</h2>
            <p className="mt-2 text-sm text-sus-muted">No clinical condition pathways are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}


