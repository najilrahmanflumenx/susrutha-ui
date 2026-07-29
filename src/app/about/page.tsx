'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { brand, legacyFigures, principles } from '../../data/site';
import { ecosystemVerticals } from '../../data/enrichment';
import { getDirectors } from '../../data/doctors';
import { Breadcrumbs, Button, ConfirmSlot, PageHero, SectionHeading } from '../../components/ui';
import InteractiveTimeline from '../../components/InteractiveTimeline';
import { pageTitle } from '../../lib/seo';
import { ShieldCheck, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const directors = getDirectors();

  useEffect(() => {
    document.title = pageTitle('About & Heritage');
  }, []);

  return (
    <div className="bg-[#FDFBF7] text-ivory-900 font-body min-h-screen">
      <PageHero
        eyebrow="About Susrutha"
        title="A Lineage of Care, Institutionalised With Clinical Restraint."
        description={brand.legacyFraming}
      />
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'About & Heritage' }]} />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="prose-sus">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ivory-900 leading-snug">Heritage Narrative</h2>
            <p className="text-ivory-700 leading-relaxed text-base sm:text-lg">
              The story begins in 1970 with family clinic roots under founding visionaries including Sri P. Krishna Pillai
              (Late), an Ayurvedic physician. In 1986, Susrutha took institutional form at Kattakada with clinic and
              pharmacy — the name under which the work continues today.
            </p>
            <p className="text-ivory-700 leading-relaxed text-base sm:text-lg">
              Prof. Dr. Krishnankutty Nair (Late) became the leading light of the modern era: former Chairman & MD,
              with distinguished government service as HOD/Superintendent in Panchakarma at the Govt. Ayurveda
              Panchakarma Hospital, Trivandrum, and professorial roles across Agada Tantra, Roga Nidana, Kayachikitsa
              and Panchakarma.
            </p>
            <p className="text-ivory-700 leading-relaxed text-base sm:text-lg">
              Today the institute is guided by three directors — Dr. Krishnakumar K., Dr. Sreeja Krishna S., and Dr.
              Priyanka R. — carrying clinical, administrative and women’s-health leadership forward inside a 40-bed
              hospital framework.
            </p>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-ivory-300 border-t-2 border-t-ochre bg-white p-7 shadow-soft-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-crimson" />
                <h3 className="font-display text-2xl font-bold text-ivory-900">Founders</h3>
              </div>
              <ul className="space-y-2 text-sm text-ivory-700 font-medium">
                {legacyFigures.founders.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ochre" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-ivory-300 border-t-2 border-t-ochre bg-white p-7 shadow-soft-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-ochre" />
                <h3 className="font-display text-2xl font-bold text-ivory-900">{legacyFigures.patriarch.name}</h3>
              </div>
              <p className="text-sm text-ochre-800 font-semibold">{legacyFigures.patriarch.role}</p>
              <p className="mt-2 text-sm text-ivory-700 leading-relaxed">{legacyFigures.patriarch.roleInStory}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-ochre-800 font-bold">Focus areas noted in legacy records</p>
              <p className="mt-1 text-sm text-ivory-700 font-medium">{legacyFigures.patriarch.focus.join(' · ')}</p>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-ochre-800 font-bold mb-2">Recognitions & Honors</p>
                <div className="flex flex-wrap gap-2">
                  {legacyFigures.patriarch.awardsClaimed.map((a) => (
                    <span key={a} className="rounded-full bg-ochre-100/80 border border-ochre-300 px-3.5 py-1 text-xs font-semibold text-crimson">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="timeline" className="mt-20 scroll-mt-28">
          <SectionHeading eyebrow="Milestones" title="Interactive Heritage Timeline" description="Horizontal scroll, expandable cards and progress from 1970 to today." />
          <div className="mt-10">
            <InteractiveTimeline />
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#1E1B1B] text-ivory-50 p-8 sm:p-10 shadow-soft-md border border-ochre/30">
            <h2 className="font-display text-3xl font-bold text-ivory-50">Vision</h2>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">{brand.vision}</p>
          </div>
          <div className="rounded-3xl bg-white border border-ivory-300 border-t-2 border-t-ochre p-8 sm:p-10 shadow-soft-md">
            <h2 className="font-display text-3xl font-bold text-ivory-900">Mission</h2>
            <p className="mt-4 text-ivory-700 leading-relaxed text-base sm:text-lg">{brand.mission}</p>
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Principles" title="How We Choose to Practise" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-3xl border border-ivory-300 border-t-2 border-t-ochre bg-white p-7 shadow-soft-sm">
                <h3 className="font-display text-xl font-bold text-ivory-900">{p.title}</h3>
                <p className="mt-2 text-sm text-ivory-700 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Leadership" title="Senior Directors Continuing the Practice" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {directors.map((d) => (
              <Link key={d.id} href={`/doctors/${d.slug}`} className="group rounded-3xl border border-ivory-300 border-t-2 border-t-ochre bg-white p-7 shadow-soft-sm hover:border-ochre hover:shadow-soft-md transition-all">
                <h3 className="font-display text-2xl font-bold text-ivory-900 group-hover:text-crimson transition-colors">{d.name}</h3>
                <p className="text-sm font-bold text-ochre-800 mt-1">{d.qual}</p>
                <p className="mt-3 text-sm text-ivory-700">{d.role}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-crimson group-hover:text-ochre">
                  View Physician Profile <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Research & Verticals" title="Institute Beyond the Hospital Ward" description="GMP pharma, diagnostics, nursing education, charitable work and home consultation extend the clinical mission." />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {ecosystemVerticals.map((v) => (
              <Link key={v.id} href={`/ecosystem/${v.slug}`} className="group rounded-3xl border border-ivory-300 bg-white p-6 shadow-soft-sm hover:border-ochre transition-all">
                <h3 className="font-display text-lg font-bold text-ivory-900 group-hover:text-crimson transition-colors">{v.name}</h3>
                <p className="mt-1 text-sm text-ivory-700">{v.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Recognition" title="Affiliations & Credentials" />
          <div className="mt-6 space-y-4">
            <ConfirmSlot label="Institutional affiliations and memberships for public listing" />
            <ConfirmSlot label="Current regulatory / hospital registration display copy" />
            <Button to="/affiliations" variant="outline" className="mt-2">
              Affiliations Page
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

