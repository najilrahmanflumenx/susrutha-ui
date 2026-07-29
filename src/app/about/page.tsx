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
    <div className="bg-[#120A0B] text-ivory-50 font-body min-h-screen">
      <PageHero
        eyebrow="About Susrutha"
        title="A Lineage of Care, Institutionalised With Clinical Restraint."
        description={brand.legacyFraming}
      />
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'About & Heritage' }]} />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="font-body text-ivory-50">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-snug">Heritage Narrative</h2>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">
              The story begins in 1970 with family clinic roots under founding visionaries including Sri P. Krishna Pillai
              (Late), an Ayurvedic physician. In 1986, Susrutha took institutional form at Kattakada with clinic and
              pharmacy — the name under which the work continues today.
            </p>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">
              Prof. Dr. Krishnankutty Nair (Late) became the leading light of the modern era: former Chairman & MD,
              with distinguished government service as HOD/Superintendent in Panchakarma at the Govt. Ayurveda
              Panchakarma Hospital, Trivandrum, and professorial roles across Agada Tantra, Roga Nidana, Kayachikitsa
              and Panchakarma.
            </p>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">
              Today the institute is guided by three directors — Dr. Krishnakumar K., Dr. Sreeja Krishna S., and Dr.
              Priyanka R. — carrying clinical, administrative and women’s-health leadership forward inside a 40-bed
              hospital framework.
            </p>
          </div>
          <div className="space-y-6 font-body">
            <div className="rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-7 shadow-glass-dark text-ivory-50">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-[#FFC86B]" />
                <h3 className="font-display text-2xl font-bold text-white">Founders</h3>
              </div>
              <ul className="space-y-2 text-sm text-ivory-200/90 font-medium">
                {legacyFigures.founders.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFC86B]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-7 shadow-glass-dark text-ivory-50">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-[#FFC86B]" />
                <h3 className="font-display text-2xl font-bold text-white">{legacyFigures.patriarch.name}</h3>
              </div>
              <p className="text-sm text-[#FFC86B] font-bold">{legacyFigures.patriarch.role}</p>
              <p className="mt-2 text-sm text-ivory-200/90 leading-relaxed">{legacyFigures.patriarch.roleInStory}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Focus areas noted in legacy records</p>
              <p className="mt-1 text-sm text-ivory-200/90 font-medium">{legacyFigures.patriarch.focus.join(' · ')}</p>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold mb-2">Recognitions & Honors</p>
                <div className="flex flex-wrap gap-2">
                  {legacyFigures.patriarch.awardsClaimed.map((a) => (
                    <span key={a} className="rounded-full bg-ochre/20 border border-ochre/40 px-3.5 py-1 text-xs font-bold text-[#FFC86B]">
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

        <section className="mt-20 grid gap-8 lg:grid-cols-2 font-body">
          <div className="rounded-3xl bg-[#1C1214] text-ivory-50 p-8 sm:p-10 shadow-glass-dark border border-ochre/30">
            <h2 className="font-display text-3xl font-bold text-white">Vision</h2>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">{brand.vision}</p>
          </div>
          <div className="rounded-3xl bg-[#1C1214] border border-ochre/30 border-t-2 border-t-[#FFC86B] p-8 sm:p-10 shadow-glass-dark text-ivory-50">
            <h2 className="font-display text-3xl font-bold text-white">Mission</h2>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">{brand.mission}</p>
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Principles" title="How We Choose to Practise" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 font-body">
            {principles.map((p) => (
              <div key={p.title} className="rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-7 shadow-glass-dark text-ivory-50">
                <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-ivory-200/90 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Leadership" title="Senior Directors Continuing the Practice" />
          <div className="mt-8 grid gap-6 md:grid-cols-3 font-body">
            {directors.map((d) => (
              <Link key={d.id} href={`/doctors/${d.slug}`} className="group rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-7 shadow-glass-dark hover:border-ochre transition-all text-ivory-50">
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#FFC86B] transition-colors">{d.name}</h3>
                <p className="text-sm font-bold text-[#FFC86B] mt-1">{d.qual}</p>
                <p className="mt-3 text-sm text-ivory-200/90">{d.role}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#FFC86B] group-hover:text-white transition-colors">
                  View Physician Profile <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Research & Verticals" title="Institute Beyond the Hospital Ward" description="GMP pharma, diagnostics, nursing education, charitable work and home consultation extend the clinical mission." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 font-body">
            {ecosystemVerticals.map((v) => (
              <Link key={v.id} href={`/ecosystem/${v.slug}`} className="group rounded-3xl border border-ochre/30 bg-[#1C1214]/95 p-6 shadow-glass-dark hover:border-ochre transition-all text-ivory-50">
                <h3 className="font-display text-lg font-bold text-white group-hover:text-[#FFC86B] transition-colors">{v.name}</h3>
                <p className="mt-1 text-sm text-ivory-200/90">{v.tagline}</p>
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

