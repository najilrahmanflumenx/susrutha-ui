'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getConditions } from '../../lib/api';

export default function ConditionsPage() {
  const [conditionList, setConditionList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Conditions & Specialities');
    getConditions().then((apiConditions) => {
      if (apiConditions && Array.isArray(apiConditions)) {
        const mapped = apiConditions.map((c: any) => ({
          id: c._id || c.slug,
          slug: c.slug,
          name: c.title || c.name,
          tagline: c.shortDescription || c.ayurvedicRootCause || c.tagline,
          meta: c.category || 'Speciality Pathway',
        }));
        setConditionList(mapped);
      } else {
        setConditionList([]);
      }
    }).catch(() => setConditionList([]));
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
          <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-8 text-center shadow-glass-dark text-ivory-50 font-body">
            <h2 className="font-display text-xl font-bold text-white">No Conditions Listed</h2>
            <p className="mt-2 text-sm text-ivory-200/90">No clinical condition pathways are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}


