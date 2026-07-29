'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPackageBySlug } from '../../../data/packages';
import { AiSummary, Breadcrumbs, Button, FaqList, PageHero } from '../../../components/ui';
import { pageTitle, faqSchema } from '../../../lib/seo';
import { getPackageBySlug as fetchPackageApi } from '../../../lib/api';

export default function PackageDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPackageApi(slug).then((apiPkg) => {
        if (apiPkg) {
          setPkg({
            id: apiPkg._id || apiPkg.slug,
            slug: apiPkg.slug,
            name: apiPkg.title || apiPkg.name,
            durationLabel: `${apiPkg.durationDays || 7} Days Hospital Care`,
            summary: apiPkg.overview || apiPkg.subtitle || 'Ayurvedic Treatment Package',
            whoFor: apiPkg.targetAilments || ['Inpatient Panchakarma Detoxification'],
            included: apiPkg.inclusions || ['Physician Consultations', 'Daily Panchakarma Therapies', 'Ayurvedic IPD Diet'],
            dayFlow: ['Morning Doctor Rounds & Assessment', 'Custom Therapy Session', 'Dietary Nutrition & Rest', 'Evening Vital Check'],
            focus: 'Authentic Kerala Panchakarma treatment protocols under doctor supervision.',
            faqs: [
              { q: 'Is accommodation included?', a: 'Yes, cottage or hospital room stay is included in this package.' },
              { q: 'Can I customize the treatment duration?', a: 'Duration is decided by senior physicians after initial diagnostic examination.' },
            ],
            priceNote: apiPkg.price ? `₹${apiPkg.price.toLocaleString('en-IN')} (Includes Stay & Care)` : 'Tariff on enquiry based on room type selection',
            addOns: ['Diagnostic Lab Tests', 'Specialty Medicine Prescriptions'],
          });
        } else {
          const fallback = getPackageBySlug(slug);
          if (fallback) setPkg(fallback);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!pkg) return;
    document.title = pageTitle(pkg.name);
    document.getElementById('schema-faq-pkg')?.remove();
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'schema-faq-pkg';
    el.text = JSON.stringify(faqSchema(pkg.faqs));
    document.head.appendChild(el);
  }, [pkg]);

  if (!pkg) {
    if (loading) {
      return (
        <div className="container-wide section-pad py-20 text-center">
          <p className="text-sus-muted">Loading care package details...</p>
        </div>
      );
    }
    return (
      <div className="container-wide section-pad py-20">
        <h1 className="font-display text-3xl">Package not found</h1>
        <p className="text-sus-muted mt-2">The requested care package is not available in the database.</p>
        <Button to="/packages" className="mt-6">All packages</Button>
      </div>
    );
  }

  const specs: any[] = [];
  const txs: any[] = [];

  return (
    <div>
      <PageHero eyebrow="Care package" title={pkg.name} description={pkg.durationLabel}>
        <Button to={`/package-enquiry?package=${pkg.slug}`}>Enquire now</Button>
      </PageHero>
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Packages', to: '/packages' }, { label: pkg.name }]} />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <AiSummary text={pkg.summary} />
            <section>
              <h2 className="font-display text-3xl text-sus-green-deep">Who it is for</h2>
              <ul className="mt-4 space-y-2 text-sus-muted list-disc pl-5">
                {pkg.whoFor.map((w: any) => <li key={w}>{w}</li>)}
              </ul>
            </section>
            <section>
              <h2 className="font-display text-3xl text-white font-bold">What is included</h2>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 font-body">
                {pkg.included.map((item: any) => (
                  <li key={item} className="rounded-xl border border-ochre/30 bg-[#1C1214]/95 px-4 py-3 text-sm text-ivory-100 shadow-glass-dark">{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-display text-3xl text-white font-bold">Typical flow</h2>
              <ol className="mt-4 space-y-3 font-body">
                {pkg.dayFlow.map((d: any, i: number) => (
                  <li key={d} className="flex gap-3">
                    <span className="font-display text-xl text-[#FFC86B] font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-ivory-200/90 leading-relaxed">{d}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="font-display text-3xl text-white font-bold">Educational focus</h2>
              <p className="mt-3 text-ivory-200/90 leading-relaxed font-body">{pkg.focus}</p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-white font-bold mb-4">FAQ</h2>
              <FaqList items={pkg.faqs} />
            </section>
          </div>
          <aside className="space-y-5 font-body">
            <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-5 shadow-glass-dark text-ivory-50">
              <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Investment</p>
              <p className="mt-2 text-white font-medium">{pkg.priceNote}</p>
            </div>
            <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-5 shadow-glass-dark text-ivory-50">
              <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Add-ons</p>
              <ul className="mt-2 space-y-1 text-sm text-ivory-200/90 list-disc pl-5">
                {pkg.addOns.map((a: any) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            {specs.length > 0 && (
              <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-5 shadow-glass-dark text-ivory-50">
                <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Related conditions</p>
                <ul className="mt-2 space-y-1">
                  {specs.map((s) => (
                    <li key={s.id}><Link href={`/conditions/${s.slug}`} className="text-sm text-[#FFC86B] hover:underline">{s.shortName}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {txs.length > 0 && (
              <div className="rounded-2xl border border-sus-green/10 bg-white p-5">
                <p className="text-xs uppercase tracking-wider text-sus-gold">Therapies often involved</p>
                <ul className="mt-2 space-y-1">
                  {txs.map((t) => t && (
                    <li key={t.id}><Link href={`/treatments/${t.slug}`} className="text-sm text-sus-green hover:underline">{t.name}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            <Button to={`/package-enquiry?package=${pkg.slug}`} className="w-full">Send enquiry</Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
