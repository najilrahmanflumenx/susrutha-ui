'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  FlaskConical,
  BedDouble,
  MapPin,
  Plane,
  Globe2,
} from 'lucide-react';
import { brand, ayurVillage } from '../data/site';
import { ecosystemVerticals } from '../data/enrichment';
import { getDirectors } from '../data/doctors';
import { specialties } from '../data/specialties';
import { packages } from '../data/packages';
import { treatments } from '../data/treatments';
import { articles } from '../data/content';
import { AiSummary, Button, CardLink, FadeIn, SectionHeading, Stat } from '../components/ui';
import InteractiveTimeline from '../components/InteractiveTimeline';
import InteractiveFacilities from '../components/InteractiveFacilities';
import TestimonialCarousel from '../components/TestimonialCarousel';
import AppointmentHub from '../components/AppointmentHub';
import CinematicCursor from '../components/CinematicCursor';
import LenisProvider from '../components/LenisProvider';
import TabascoHero from '../components/TabascoHero';
import TabascoDocumentaryStory from '../components/TabascoDocumentaryStory';
import TreatmentGlassGrid from '../components/TreatmentGlassGrid';
import { orgSchema } from '../lib/seo';
import { getHomeData } from '../lib/api';

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!enabled) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, reduce]);
  return value;
}

function TrustCounters() {
  const [visible, setVisible] = useState(false);
  const yearsLineage = useCountUp(55, visible);
  const yearsInstitution = useCountUp(40, visible);
  const beds = useCountUp(40, visible);
  const branchesCount = useCountUp(2, visible);

  return (
    <div
      ref={(el) => {
        if (!el || visible) return;
        const io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
        io.observe(el);
      }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
    >
      <Stat value={`~${yearsLineage}`} label="Years family Ayurveda lineage (since 1970)" />
      <Stat value={`~${yearsInstitution}`} label="Years as Susrutha (since 1986)" />
      <Stat value={`${beds}`} label="Bed hospital strength" />
      <Stat value={`${branchesCount}`} label="Care locations + Ayur Village" />
    </div>
  );
}

function BotanicalHeroArt() {
  const reduce = useReducedMotion();
  return (
    <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[5/6] overflow-hidden rounded-[2rem] bg-crimson-900 shadow-soft-lg shadow-crimson-900/20 border border-ochre/30">
      <img
        src="/images/hero-ayurveda.jpg"
        alt="Calm Ayurvedic care setting with natural elements"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-crimson-900/90 via-crimson-900/30 to-transparent" />
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-6 top-10 h-28 w-28 rounded-full border border-ochre/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-8 top-16 h-16 w-16 rounded-full bg-ochre/25 blur-xl"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="font-display text-2xl font-bold text-ivory-50">Kerala Lineage. Clinical Excellence.</p>
        <p className="mt-2 text-sm text-ochre-100/90">NABH-accredited inpatient Ayurveda hospital at Kattakada, with city OP clinic at Kowdiar.</p>
      </div>
    </div>
  );
}

function PanchakarmaSteps() {
  const steps = treatments.find((t) => t.id === 'panchakarma')?.procedure || [];
  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {steps.map((step, i) => (
        <FadeIn key={step.step} delay={i * 0.05}>
          <li className="relative h-full rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-5 shadow-glass-dark hover:border-ochre transition-colors text-ivory-50 font-body">
            <span className="font-display text-3xl font-bold text-[#FFC86B]">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 text-lg font-bold text-white">{step.step}</h3>
            <p className="mt-2 text-sm text-ivory-200/90 leading-relaxed">{step.detail}</p>
          </li>
        </FadeIn>
      ))}
    </ol>
  );
}

export default function HomePage() {
  const [directorsList, setDirectorsList] = useState<any[]>(getDirectors());
  const [packageList, setPackageList] = useState<any[]>(packages.slice(0, 4).map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    durationLabel: p.durationLabel,
  })));
  const [conditionsList, setConditionsList] = useState<any[]>(specialties.map(s => ({
    id: s.id,
    slug: s.slug,
    name: s.shortName || s.name,
    tagline: s.tagline,
  })));

  useEffect(() => {
    document.title = `${brand.commonName} — Authentic Kerala Ayurveda Hospital · Trivandrum`;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(orgSchema());
    script.id = 'schema-org';
    document.getElementById('schema-org')?.remove();
    document.head.appendChild(script);

    // Fetch live backend data asynchronously
    getHomeData().then((homeData) => {
      if (homeData) {
        if (homeData.doctors && homeData.doctors.length > 0) {
          const apiDirectors = homeData.doctors.filter((d: any) => d.isDirector);
          if (apiDirectors.length > 0) {
            setDirectorsList(apiDirectors.map((d: any) => ({
              id: d._id || d.slug,
              slug: d.slug,
              name: d.name,
              qual: d.qualifications || 'BAMS',
              role: d.designation || 'Director & Senior Physician',
              image: d.photo || '/images/doctor-portrait.jpg',
              availability: typeof d.availability === 'string' ? d.availability : 'Mon - Sat (OPD)',
              pillars: d.specialties || ['General Ayurveda'],
            })));
          }
        }
        if (homeData.packages && homeData.packages.length > 0) {
          setPackageList(homeData.packages.slice(0, 4).map((p: any) => ({
            id: p._id || p.slug,
            slug: p.slug,
            name: p.title || p.name,
            summary: p.subtitle || p.overview || p.summary,
            durationLabel: `${p.durationDays || 7} Days Programme`,
          })));
        }
        if (homeData.conditions && homeData.conditions.length > 0) {
          setConditionsList(homeData.conditions.map((c: any) => ({
            id: c._id || c.slug,
            slug: c.slug,
            name: c.title || c.name,
            tagline: c.shortDescription || c.category || 'Speciality Pathway',
          })));
        }
      }
    });
  }, []);

  return (
    <LenisProvider>
      <div className="relative bg-[#120A0B] text-ivory-50 overflow-x-hidden selection:bg-ochre/30 selection:text-white font-body">

        {/* Custom Interactive Leaf Pointer */}
        <CinematicCursor />

        {/* 1. Fullscreen 4K Video Hero */}
        <TabascoHero />

        {/* 2. Signature Therapies (Primary Clinical Intent) */}
        <section className="container-wide section-pad py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
            <SectionHeading
              eyebrow="Signature Therapies"
              title="Panchakarma & Clinical Pathways"
              description="Supervised purificatory sequences, spine rehabilitation, and Rasayana vitality programmes delivered in dedicated male and female therapy suites."
            />
            <Button to="/treatments" variant="outline">
              All Therapies
            </Button>
          </div>
          <TreatmentGlassGrid />
        </section>

        {/* 3. Trust & Heritage Counter Ribbon */}
        <section className="relative overflow-hidden bg-[#120A0B] text-white border-t border-b border-ochre/40 py-16 font-body">
          <div className="absolute inset-0 botanical-pattern opacity-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-ochre/20 blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-crimson/25 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="container-wide section-pad relative z-10">
            <TrustCounters />
            <div className="mt-10 pt-6 border-t border-ochre/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-[#FDFBF7] max-w-3xl leading-relaxed font-body">
                <span className="font-bold text-[#FFC86B]">Authentic clinical care:</span> We lead with family lineage and institutional age separately — delivering transparent, research-backed Panchakarma therapeutics.
              </p>
              <div className="inline-flex items-center gap-2.5 shrink-0">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#FCAB28]/15 border border-[#FCAB28]/50 text-[#FFC86B] font-mono text-[9px] font-black uppercase">
                  ✓
                </div>
                <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#FFC86B] font-display">
                  NABH Accredited Hospital
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Structured Care Packages */}
        <section className="bg-[#120A0B] border-b border-ochre/25">
          <div className="container-wide section-pad py-20">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
              <SectionHeading
                eyebrow="Care Packages"
                title="Structured Programmes With Clear Intent"
                description="Twelve real packages — from Tekky occupational care to 16-day hospital programmes. Tariffs on enquiry."
              />
              <Button to="/packages" variant="outline">
                View All Packages
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {packageList.map((p) => (
                <CardLink
                  key={p.id}
                  to={`/packages/${p.slug}`}
                  title={p.name}
                  description={p.summary}
                  meta={p.durationLabel}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Hospital Infrastructure & Facilities Showcase */}
        <section className="container-wide section-pad py-20">
          <SectionHeading
            eyebrow="Facilities"
            title="Infrastructure That Lets Classical Care Breathe."
            description="Hover or select a facility — the showcase image and details update with a calm transition."
          />
          <div className="mt-10">
            <InteractiveFacilities />
          </div>
        </section>



        {/* 7. Tabasco 8-Scene Video-Driven Documentary Arc */}
        <TabascoDocumentaryStory />

        {/* 8. Legacy & Milestones Timeline */}
        <section className="container-wide section-pad py-20">
          <SectionHeading
            eyebrow="Legacy"
            title="1970 → Today"
            description="Interactive milestones — scroll, expand and follow the institutional arc without myth-making."
          />
          <div className="mt-10">
            <InteractiveTimeline compact />
          </div>
          <Button to="/about#timeline" variant="ghost" className="mt-6 !px-0 text-[#FFC86B] font-bold">
            Full heritage narrative <ArrowRight className="h-4 w-4" />
          </Button>
        </section>



      <section className="bg-[#1C1214] text-ivory-50 border-y border-ochre/30">
        <div className="container-wide section-pad py-16">
          <SectionHeading
            light
            eyebrow="Ecosystem"
            title="More Than a Single Hospital Door"
            description="Each vertical opens a dedicated page with services, map, gallery and enquiry."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystemVerticals.map((v) => (
              <Link
                key={v.id}
                href={`/ecosystem/${v.slug}`}
                className="group rounded-2xl border border-ochre/20 bg-white/5 p-5 hover:bg-white/10 transition-colors shadow-glass-dark"
              >
                <h3 className="font-display text-xl font-bold text-ivory-50">{v.shortName}</h3>
                <p className="mt-2 text-sm text-ivory-200/80">{v.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FFC86B] hover:text-white">
                  Open vertical <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button to="/ecosystem" variant="secondary">
              Ecosystem Index
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/kerala-nature.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#120A0B]/90" />
        </div>
        <div className="container-wide section-pad relative py-20 text-ivory-50">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#FFC86B] font-bold inline-flex items-center gap-2">
                <Globe2 className="h-4 w-4" /> International Patients
              </p>
              <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold text-balance leading-tight">
                Kerala Medical Travel, Planned With Hospital Honesty.
              </h2>
              <p className="mt-5 text-ivory-200/90 leading-relaxed max-w-xl">
                Airport-aware logistics, Ayur Village privacy ~20 km from Trivandrum International Airport, visa and interpreter coordination on enquiry, and packages directed by physicians — not spa scripts.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/international-patients" variant="secondary">
                  Open Travel Guide
                </Button>
                <Button to="/package-enquiry" variant="outline">
                  Package Enquiry
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Plane, t: 'Airport assistance', d: 'Realistic arrival-to-admission timing' },
                { icon: BedDouble, t: 'Ayur Village stay', d: `${ayurVillage.cottages} private cottages` },
                { icon: ShieldCheck, t: 'Visa guidance', d: 'Case-by-case documentation support' },
                { icon: Leaf, t: 'Package planning', d: '5 to 16-day clinical programmes' },
              ].map((item) => (
                <div key={item.t} className="rounded-2xl border border-ochre/30 bg-[#1C1214]/90 backdrop-blur-md p-5 shadow-glass-dark">
                  <item.icon className="h-5 w-5 text-[#FFC86B]" />
                  <h3 className="mt-3 font-display text-xl font-bold text-ivory-50">{item.t}</h3>
                  <p className="mt-1 text-sm text-ivory-200/80">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide section-pad py-20 bg-[#120A0B]">
        <SectionHeading
          eyebrow="Patient Voices"
          title="Stories in Motion"
          description="Glass cards, auto-scroll carousel, pause on hover — click any story for the full narrative."
        />
        <div className="mt-10">
          <TestimonialCarousel />
        </div>
      </section>

      <section className="bg-[#120A0B] border-t border-ochre/25">
        <div className="container-wide section-pad py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
            <SectionHeading
              eyebrow="Knowledge Centre"
              title="Clinical Writing With Senior Physician Bylines"
              description="Articles carry doctor bylines, clinical overviews, and patient FAQs — built for comprehensive understanding."
            />
            <Button to="/knowledge" variant="outline">
              Browse Articles
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {articles.map((a) => (
              <CardLink key={a.id} to={`/knowledge/${a.slug}`} title={a.title} description={a.excerpt} meta={a.readTime} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ochre/25 bg-[#120A0B]">
        <div className="container-wide section-pad py-20">
          <SectionHeading
            eyebrow="Care Desk"
            title="Book Appointment · Package Enquiry · Contact · Feedback"
            description="Direct consultation booking & package planning with Susrutha’s clinical team — with location details and quick actions."
          />
          <div className="mt-10">
            <AppointmentHub />
          </div>
        </div>
      </section>
    </div>
    </LenisProvider>
  );
}

