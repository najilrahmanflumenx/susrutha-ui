'use client';

export const dynamic = 'force-dynamic';

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
              ? apiTx.procedureSteps.map((item: any, i: number) => {
                  if (typeof item === 'object' && item !== null) {
                    return {
                      step: typeof item.step === 'string' ? item.step : `Phase ${i + 1}`,
                      detail: typeof item.detail === 'string' ? item.detail : (typeof item.step === 'string' ? item.step : String(item)),
                    };
                  }
                  return { step: `Phase ${i + 1}`, detail: String(item) };
                })
              : [
                  { step: 'Snehan (Oliation)', detail: 'Application of warm medicated herbal oil to prepare tissues.' },
                  { step: 'Swedana (Sudation)', detail: 'Herbal steam therapy to loosen deep-seated toxins.' },
                  { step: 'Main Procedure', detail: 'Core therapeutic procedure administered by trained therapists.' },
                  { step: 'Paschat Karma (Aftercare)', detail: 'Post-treatment rest, warm bath, and soothing dietary regimen.' },
                ],
            benefits: Array.isArray(apiTx.benefits) ? apiTx.benefits.map((b: any) => typeof b === 'string' ? b : (b.detail || b.title || String(b))) : ['Relieves muscle stiffness', 'Improves blood circulation', 'Promotes deep relaxation'],
            whoNeeds: Array.isArray(apiTx.indications) ? apiTx.indications.map((b: any) => typeof b === 'string' ? b : (b.detail || b.title || String(b))) : ['Chronic pain', 'Vata imbalances', 'Stress and fatigue'],
            preparation: ['Fast 2 hours prior to therapy', 'Inform doctor of any active allergies'],
            aftercare: ['Drink warm water post-treatment', 'Avoid cold winds and direct fan exposure'],
            safety: ['Supervised by BAMS physicians', 'Therapy discontinued if fever occurs'],
            avoid: Array.isArray(apiTx.contraindications) ? apiTx.contraindications.map((b: any) => typeof b === 'string' ? b : (b.detail || b.title || String(b))) : ['Acute fever', 'Severe skin infections', 'Indigestion'],
            faqs: [
              { q: 'Is a doctor consultation mandatory before treatment?', a: 'Yes, all therapies are prescribed following a detailed physician diagnostic examination.' },
              { q: 'What is the recommended duration?', a: `${apiTx.recommendedDays || 7} consecutive days for optimal clinical results.` },
            ],
            duration: `${apiTx.durationMinutes || 60} Minutes Session (${apiTx.recommendedDays || 7} Days Course)`,
            conditions: Array.isArray(apiTx.indications) ? apiTx.indications.map((b: any) => typeof b === 'string' ? b : String(b)) : ['Arthritis', 'Panchakarma Detox', 'Stress Relief'],
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
    if (!treatment || typeof window === 'undefined') return;
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
        <div className="container-wide section-pad py-20 text-center font-body min-h-screen bg-[#120A0B] text-[#FDFBF7]">
          <p className="text-[#FFC86B]">Loading therapy details...</p>
        </div>
      );
    }
    return (
      <div className="container-wide section-pad py-20 font-body min-h-screen bg-[#120A0B] text-[#FDFBF7]">
        <h1 className="font-display text-3xl font-bold text-white">Treatment not found</h1>
        <p className="text-ivory-300 mt-2">The requested therapy procedure is not available in the database.</p>
        <Button to="/treatments" className="mt-6">All treatments</Button>
      </div>
    );
  }

  const docs: any[] = [];
  return (
    <div className="font-body min-h-screen bg-[#120A0B] text-[#FDFBF7]">
      <PageHero eyebrow={treatment.category} title={treatment.name} description={treatment.malayalam ? `${treatment.malayalam} · Physician-directed therapy` : 'Physician-directed therapy'}>
        <Button to="/book" variant="primary">Book consultation</Button>
      </PageHero>
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Treatments', to: '/treatments' }, { label: treatment.name }]} />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <AiSummary text={treatment.aiSummary} reviewedBy={docs[0]?.name} />
            <section className="prose-sus">
              <h2 className="font-display text-3xl font-bold text-white">What it is</h2>
              <p className="text-ivory-200/90 leading-relaxed text-base sm:text-lg">{treatment.overview}</p>
            </section>

            <section>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Procedure Sequence</h2>
              <ol className="grid gap-4 sm:grid-cols-2">
                {treatment.procedure.map((step: any, i: number) => {
                  const stepTitle = typeof step === 'string' ? `Phase ${i + 1}` : (typeof step?.step === 'string' ? step.step : `Phase ${i + 1}`);
                  const stepDetail = typeof step === 'string' ? step : (typeof step?.detail === 'string' ? step.detail : (typeof step?.step === 'string' ? step.step : ''));
                  return (
                    <li key={i} className="rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-6 shadow-2xl backdrop-blur-2xl">
                      <span className="text-xs text-[#FFC86B] font-bold uppercase tracking-wider">Phase {i + 1}</span>
                      <h3 className="mt-1 font-display text-xl font-bold text-white">{stepTitle}</h3>
                      <p className="mt-2 text-sm text-ivory-200/90 leading-relaxed font-body">{stepDetail}</p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-ochre/30 bg-[#1C1214]/95 p-6 shadow-2xl backdrop-blur-2xl">
                <h2 className="font-display text-2xl font-bold text-white">Clinical Benefits</h2>
                <ul className="mt-3 space-y-2 text-sm text-ivory-200/90 list-disc pl-5">
                  {treatment.benefits.map((b: any, idx: number) => <li key={idx}>{typeof b === 'string' ? b : String(b)}</li>)}
                </ul>
              </div>
              <div className="rounded-3xl border border-ochre/30 bg-[#1C1214]/95 p-6 shadow-2xl backdrop-blur-2xl">
                <h2 className="font-display text-2xl font-bold text-white">Who May Need It</h2>
                <ul className="mt-3 space-y-2 text-sm text-ivory-200/90 list-disc pl-5">
                  {treatment.whoNeeds.map((b: any, idx: number) => <li key={idx}>{typeof b === 'string' ? b : String(b)}</li>)}
                </ul>
              </div>
            </section>

            <section className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-[#240809]/90 border border-ochre/30 border-t-2 border-t-[#FCAB28] p-6 shadow-2xl backdrop-blur-2xl">
                <h3 className="font-display text-xl font-bold text-white">Preparation Protocol</h3>
                <ul className="mt-3 space-y-1 text-sm text-ivory-200/90 list-disc pl-5">
                  {treatment.preparation.map((x: any, idx: number) => <li key={idx}>{typeof x === 'string' ? x : String(x)}</li>)}
                </ul>
              </div>
              <div className="rounded-3xl bg-[#240809]/90 border border-ochre/30 border-t-2 border-t-[#FCAB28] p-6 shadow-2xl backdrop-blur-2xl">
                <h3 className="font-display text-xl font-bold text-white">Recovery & Aftercare</h3>
                <ul className="mt-3 space-y-1 text-sm text-ivory-200/90 list-disc pl-5">
                  {treatment.aftercare.map((x: any, idx: number) => <li key={idx}>{typeof x === 'string' ? x : String(x)}</li>)}
                </ul>
              </div>
            </section>

            <section className="rounded-3xl border border-ochre/40 bg-[#240809]/90 p-7 shadow-2xl backdrop-blur-2xl">
              <h2 className="font-display text-2xl font-bold text-white">Safety & Contraindications</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-6 text-sm text-ivory-200">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#FCAB28] mb-2">Physician Safety Directives</p>
                  <ul className="space-y-1 list-disc pl-5 font-medium">{treatment.safety.map((x: any, idx: number) => <li key={idx}>{typeof x === 'string' ? x : String(x)}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-[#C22626] mb-2">Use Caution / Contraindications</p>
                  <ul className="space-y-1 list-disc pl-5 font-medium">{treatment.avoid.map((x: any, idx: number) => <li key={idx}>{typeof x === 'string' ? x : String(x)}</li>)}</ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <FaqList items={treatment.faqs} />
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-ochre/30 border-t-2 border-t-[#FCAB28] bg-[#240809]/90 p-6 shadow-2xl backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-wider font-bold text-[#FCAB28]">Session Duration & Course</p>
              <p className="mt-2 text-sm text-white font-bold leading-relaxed">{treatment.duration}</p>
            </div>
            <div className="rounded-3xl border border-ochre/30 bg-[#240809]/90 p-6 shadow-2xl backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-wider font-bold text-[#FCAB28]">Target Clinical Conditions</p>
              <ul className="mt-3 space-y-1 text-sm text-ivory-200/90">
                {treatment.conditions.map((c: any, idx: number) => <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FCAB28]" />
                  <span>{typeof c === 'string' ? c : String(c)}</span>
                </li>)}
              </ul>
            </div>
            <div className="rounded-3xl border border-ochre/30 bg-[#240809]/90 p-6 shadow-2xl backdrop-blur-2xl">
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
