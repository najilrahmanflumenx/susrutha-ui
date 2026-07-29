'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTreatmentBySlug } from '../../../data/treatments';
import { AiSummary, Breadcrumbs, Button, FaqList, PageHero } from '../../../components/ui';
import { pageTitle, faqSchema } from '../../../lib/seo';
import { getTreatmentBySlug as fetchTreatmentApi } from '../../../lib/api';

export default function TreatmentDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [treatment, setTreatment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchTreatmentApi(slug).then((apiTx) => {
        if (apiTx) {
          setTreatment({
            id: apiTx._id || apiTx.slug,
            slug: apiTx.slug,
            name: apiTx.title || apiTx.name,
            category: apiTx.category || 'Panchakarma Therapy',
            malayalam: 'ആയുർവേദ ചികിത്സ',
            aiSummary: apiTx.shortDescription || apiTx.fullDescription || 'Therapeutic Ayurvedic procedure.',
            overview: apiTx.fullDescription || apiTx.shortDescription || 'Classical Panchakarma therapy performed under medical supervision.',
            procedure: (apiTx.procedureSteps && apiTx.procedureSteps.length > 0)
              ? apiTx.procedureSteps.map((step: string, i: number) => ({ step: `Phase ${i + 1}`, detail: step }))
              : [
                  { step: 'Snehan (Oliation)', detail: 'Application of warm medicated herbal oil to prepare tissues.' },
                  { step: 'Swedana (Sudation)', detail: 'Herbal steam therapy to loosen deep-seated toxins.' },
                  { step: 'Main Procedure', detail: 'Core therapeutic procedure administered by trained therapists.' },
                  { step: 'Paschat Karma (Aftercare)', detail: 'Post-treatment rest, warm bath, and soothing dietary regimen.' },
                ],
            benefits: apiTx.benefits || ['Relieves muscle stiffness', 'Improves blood circulation', 'Promotes deep relaxation'],
            whoNeeds: apiTx.indications || ['Chronic pain', 'Vata imbalances', 'Stress and fatigue'],
            preparation: ['Fast 2 hours prior to therapy', 'Inform doctor of any active allergies'],
            aftercare: ['Drink warm water post-treatment', 'Avoid cold winds and direct fan exposure'],
            safety: ['Supervised by BAMS physicians', 'Therapy discontinued if fever occurs'],
            avoid: apiTx.contraindications || ['Acute fever', 'Severe skin infections', 'Indigestion'],
            faqs: [
              { q: 'Is a doctor consultation mandatory before treatment?', a: 'Yes, all therapies are prescribed following a detailed physician diagnostic examination.' },
              { q: 'What is the recommended duration?', a: `${apiTx.recommendedDays || 7} consecutive days for optimal clinical results.` },
            ],
            duration: `${apiTx.durationMinutes || 60} Minutes Session (${apiTx.recommendedDays || 7} Days Course)`,
            conditions: apiTx.indications || ['Arthritis', 'Panchakarma Detox', 'Stress Relief'],
            doctorIds: apiTx.doctorIds || [],
            relatedPackageIds: [],
          });
        } else {
          const fallback = getTreatmentBySlug(slug);
          if (fallback) setTreatment(fallback);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!treatment) return;
    document.title = pageTitle(treatment.name);
    document.getElementById('schema-faq-tx')?.remove();
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'schema-faq-tx';
    el.text = JSON.stringify(faqSchema(treatment.faqs));
    document.head.appendChild(el);
  }, [treatment]);

  if (!treatment) {
    if (loading) {
      return (
        <div className="container-wide section-pad py-20 text-center">
          <p className="text-sus-muted">Loading therapy details...</p>
        </div>
      );
    }
    return (
      <div className="container-wide section-pad py-20">
        <h1 className="font-display text-3xl">Treatment not found</h1>
        <p className="text-sus-muted mt-2">The requested therapy procedure is not available in the database.</p>
        <Button to="/treatments" className="mt-6">All treatments</Button>
      </div>
    );
  }

  const docs: any[] = [];
  return (
    <div className="bg-[#FDFBF7] text-ivory-900 font-body min-h-screen">
      <PageHero eyebrow={treatment.category} title={treatment.name} description={treatment.malayalam ? `${treatment.malayalam} · Physician-directed therapy` : 'Physician-directed therapy'}>
        <Button to="/book" variant="primary">Book consultation</Button>
      </PageHero>
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Treatments', to: '/treatments' }, { label: treatment.name }]} />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <AiSummary text={treatment.aiSummary} reviewedBy={docs[0]?.name} />
            <section className="prose-sus">
              <h2 className="font-display text-3xl font-bold text-ivory-900">What it is</h2>
              <p className="text-ivory-700 leading-relaxed text-base sm:text-lg">{treatment.overview}</p>
            </section>

            <section>
              <h2 className="font-display text-3xl font-bold text-ivory-900 mb-6">Procedure Sequence</h2>
              <ol className="grid gap-4 sm:grid-cols-2">
                {treatment.procedure.map((step: any, i: number) => (
                  <li key={step.step} className="rounded-3xl border border-ivory-300 border-t-2 border-t-ochre bg-white p-6 shadow-soft-sm">
                    <span className="text-xs text-ochre-800 font-bold uppercase tracking-wider">Phase {i + 1}</span>
                    <h3 className="mt-1 font-display text-xl font-bold text-ivory-900">{step.step}</h3>
                    <p className="mt-2 text-sm text-ivory-700 leading-relaxed">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-ivory-300 bg-white p-6 shadow-soft-sm">
                <h2 className="font-display text-2xl font-bold text-ivory-900">Clinical Benefits</h2>
                <ul className="mt-3 space-y-2 text-sm text-ivory-700 list-disc pl-5">
                  {treatment.benefits.map((b: any) => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <div className="rounded-3xl border border-ivory-300 bg-white p-6 shadow-soft-sm">
                <h2 className="font-display text-2xl font-bold text-ivory-900">Who May Need It</h2>
                <ul className="mt-3 space-y-2 text-sm text-ivory-700 list-disc pl-5">
                  {treatment.whoNeeds.map((b: any) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </section>

            <section className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-ivory-300 border-t-2 border-t-ochre p-6 shadow-soft-sm">
                <h3 className="font-display text-xl font-bold text-ivory-900">Preparation Protocol</h3>
                <ul className="mt-3 space-y-1 text-sm text-ivory-700 list-disc pl-5">
                  {treatment.preparation.map((x: any) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="rounded-3xl bg-white border border-ivory-300 border-t-2 border-t-ochre p-6 shadow-soft-sm">
                <h3 className="font-display text-xl font-bold text-ivory-900">Recovery & Aftercare</h3>
                <ul className="mt-3 space-y-1 text-sm text-ivory-700 list-disc pl-5">
                  {treatment.aftercare.map((x: any) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </section>

            <section className="rounded-3xl border border-ochre/40 bg-ochre-50/70 p-7 shadow-soft-sm">
              <h2 className="font-display text-2xl font-bold text-ivory-900">Safety & Contraindications</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-6 text-sm text-ivory-800">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-ochre-800 mb-2">Physician Safety Directives</p>
                  <ul className="space-y-1 list-disc pl-5 font-medium">{treatment.safety.map((x: any) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-crimson mb-2">Use Caution / Contraindications</p>
                  <ul className="space-y-1 list-disc pl-5 font-medium">{treatment.avoid.map((x: any) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl font-bold text-ivory-900 mb-6">Frequently Asked Questions</h2>
              <FaqList items={treatment.faqs} />
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-ivory-300 border-t-2 border-t-ochre bg-white p-6 shadow-soft-sm">
              <p className="text-xs uppercase tracking-wider font-bold text-ochre-800">Session Duration & Course</p>
              <p className="mt-2 text-sm text-ivory-900 font-bold leading-relaxed">{treatment.duration}</p>
            </div>
            <div className="rounded-3xl border border-ivory-300 bg-white p-6 shadow-soft-sm">
              <p className="text-xs uppercase tracking-wider font-bold text-ochre-800">Target Clinical Conditions</p>
              <ul className="mt-3 space-y-1 text-sm text-ivory-700">
                {treatment.conditions.map((c: any) => <li key={c} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
                  <span>{c}</span>
                </li>)}
              </ul>
            </div>
            <div className="rounded-3xl border border-ivory-300 bg-white p-6 shadow-soft-sm">
              <Button to="/book" variant="primary" className="w-full">
                Book Consultation
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
