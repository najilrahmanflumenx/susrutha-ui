'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSpecialtyBySlug } from '../../../data/specialties';
import { AiSummary, Breadcrumbs, Button, FaqList, PageHero } from '../../../components/ui';
import { pageTitle, faqSchema } from '../../../lib/seo';
import { getConditionBySlug as fetchConditionApi } from '../../../lib/api';

export default function ConditionDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [condition, setCondition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchConditionApi(slug).then((apiCond) => {
        if (apiCond) {
          setCondition({
            id: apiCond._id || apiCond.slug,
            slug: apiCond.slug,
            name: apiCond.title || apiCond.name,
            shortName: apiCond.title || apiCond.name,
            tagline: apiCond.shortDescription || apiCond.ayurvedicRootCause || 'Speciality Clinical Pathway',
            aiSummary: apiCond.shortDescription || apiCond.fullDescription || 'Clinical condition overview and Ayurvedic management pathway.',
            overview: apiCond.fullDescription || apiCond.shortDescription || 'Diagnostic assessment and holistic management of acute and chronic symptoms.',
            ayurvedicView: apiCond.ayurvedicRootCause || 'Root cause diagnostics examining Vata, Pitta, and Kapha dosha imbalances.',
            symptoms: apiCond.symptoms || ['Joint stiffness', 'Localized pain', 'Reduced mobility'],
            approach: [
              'Detailed Prakriti & Vikriti Ayurvedic examination',
              'Customized Panchakarma therapy course prescription',
              'Internal classical Ayurvedic herbal medicine formulation',
              'Lifestyle and dietary pathya-apathya guidance',
            ],
            whoNeeds: ['Patients seeking non-invasive chronic pain management', 'Rehabilitation post-acute episode'],
            faqs: apiCond.faqs && apiCond.faqs.length > 0
              ? apiCond.faqs.map((f: any) => ({ q: f.question || f.q, a: f.answer || f.a }))
              : [
                  { q: 'What is the first step in care?', a: 'Schedule an outpatient consultation at Kattakada or Kowdiar branch for clinical diagnosis.' },
                  { q: 'Are treatments covered under IPD stay?', a: 'Yes, inpatient hospital care packages are structured based on severity.' },
                ],
            leadDoctorIds: apiCond.specialistDoctorIds || [],
            relatedPackageIds: apiCond.recommendedPackageIds || [],
            relatedTreatmentIds: apiCond.recommendedTreatmentIds || [],
          });
        } else {
          const fallback = getSpecialtyBySlug(slug);
          if (fallback) setCondition(fallback);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!condition) return;
    document.title = pageTitle(condition.name);
    document.getElementById('schema-faq-cond')?.remove();
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'schema-faq-cond';
    el.text = JSON.stringify(faqSchema(condition.faqs));
    document.head.appendChild(el);
  }, [condition]);

  if (!condition) {
    if (loading) {
      return (
        <div className="container-wide section-pad py-20 text-center">
          <p className="text-sus-muted">Loading condition details...</p>
        </div>
      );
    }
    return (
      <div className="container-wide section-pad py-20">
        <h1 className="font-display text-3xl">Condition page not found</h1>
        <p className="text-sus-muted mt-2">The requested clinical condition is not available in the database.</p>
        <Button to="/conditions" className="mt-6">All conditions</Button>
      </div>
    );
  }

  const docs: any[] = [];
  const pkgs: any[] = [];
  const txs: any[] = [];

  return (
    <div>
      <PageHero eyebrow="Condition pathway" title={condition.name} description={condition.tagline}>
        <Button to="/book">Consult a physician</Button>
      </PageHero>
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Conditions', to: '/conditions' }, { label: condition.shortName }]} />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <AiSummary text={condition.aiSummary} reviewedBy={docs[0]?.name} />
            <section className="font-body text-ivory-100">
              <h2 className="font-display text-3xl text-white font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-ivory-200/90">{condition.overview}</p>
              <h2 className="font-display text-3xl text-white font-bold mt-8">Ayurvedic understanding</h2>
              <p className="mt-3 leading-relaxed text-ivory-200/90">{condition.ayurvedicView}</p>
            </section>

            <section>
              <h2 className="font-display text-3xl text-white font-bold">Symptoms often discussed</h2>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 font-body">
                {condition.symptoms.map((s: any) => (
                  <li key={s} className="rounded-xl bg-[#1C1214]/95 border border-ochre/30 px-4 py-3 text-sm text-ivory-100 shadow-glass-dark">{s}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-3xl text-white font-bold">How Susrutha approaches it</h2>
              <ol className="mt-4 space-y-3 font-body">
                {condition.approach.map((a: any, i: number) => (
                  <li key={a} className="flex gap-3 text-ivory-200/90">
                    <span className="font-display text-xl text-[#FFC86B] font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="font-display text-3xl text-white font-bold mb-4">Related treatments</h2>
              <div className="flex flex-wrap gap-2 font-body">
                {txs.map((t: any) => t && (
                  <Link key={t.id} href={`/treatments/${t.slug}`} className="rounded-full border border-ochre/30 px-3 py-1.5 text-sm text-[#FFC86B] hover:bg-white/10 transition-colors">
                    {t.name}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl text-sus-green-deep mb-4">FAQ</h2>
              <FaqList items={condition.faqs} />
            </section>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-sus-green/10 bg-white p-5">
              <p className="text-xs uppercase tracking-wider text-sus-gold">Who often seeks care</p>
              <ul className="mt-2 space-y-2 text-sm text-sus-muted list-disc pl-5">
                {condition.whoNeeds.map((w: any) => <li key={w}>{w}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-sus-green/10 bg-white p-5">
              <p className="text-xs uppercase tracking-wider text-sus-gold">Relevant doctors</p>
              <ul className="mt-2 space-y-2">
                {docs.map((d) => (
                  <li key={d.id}>
                    <Link href={`/doctors/${d.slug}`} className="text-sm font-medium text-sus-green hover:underline">{d.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            {pkgs.length > 0 && (
              <div className="rounded-2xl border border-sus-green/10 bg-white p-5">
                <p className="text-xs uppercase tracking-wider text-sus-gold">Related packages</p>
                <ul className="mt-2 space-y-2">
                  {pkgs.map((p) => (
                    <li key={p.id}>
                      <Link href={`/packages/${p.slug}`} className="text-sm font-medium text-sus-green hover:underline">{p.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button to="/book" className="w-full">Request consultation</Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
