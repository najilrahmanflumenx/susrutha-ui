'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Flower,
  Brain,
  Droplets,
  Heart,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { Modal } from '@/components/ui/Modal';
import { fetchTreatmentsList, fetchDoctorsList, fetchSiteSettings, TreatmentItem, DoctorItem } from '@/lib/api';
import { DoctorCarousel } from '@/components/doctors/DoctorCarousel';
import { useApiData } from '@/hooks/useApiData';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [selectedStep, setSelectedStep] = useState(0);
  const { data: treatments } = useApiData<TreatmentItem[]>(fetchTreatmentsList, []);
  const { data: doctors } = useApiData<DoctorItem[]>(fetchDoctorsList, []);
  const { data: siteSettings } = useApiData<Record<string, any>>(fetchSiteSettings, {});
  const [activeTreatmentModal, setActiveTreatmentModal] = useState<TreatmentItem | null>(null);

  const heroSettings = siteSettings?.HERO || {};

  const timelineSteps = [
    {
      number: '01',
      title: 'Deep Consultation',
      subtitle: 'Prakriti Mapping',
      description: 'A comprehensive pulse-reading (Nadi Pariksha) and diagnostic exploration to determine your unique Vata-Pitta-Kapha constitution.',
      icon: <Flower className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'Precision Diagnosis',
      subtitle: 'Healing Roadmap',
      description: 'Synthesizing ancient Ayurvedic pathology with modern clinical biomarker analysis to target root-cause imbalances.',
      icon: <Brain className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'Synchronized Rituals',
      subtitle: 'Cellular Cleansing',
      description: 'Curated bio-purification therapies including Shirodhara, Abhyanga, and custom herbal steam infusions.',
      icon: <Droplets className="w-6 h-6" />
    },
    {
      number: '04',
      title: 'Lifelong Vitality',
      subtitle: 'Integration & Rejuvenation',
      description: 'Sustainable dietetics, seasonal rasayana formulations, and daily routine protocols to maintain optimal health.',
      icon: <Heart className="w-6 h-6" />
    }
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-36 pb-20 overflow-hidden">
      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-12 text-center pt-8">
        {/* Dynamic Hero Cover Image Background if provided */}
        {heroSettings.bgImageUrl && (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${heroSettings.bgImageUrl})` }}
          />
        )}
        {/* Ambient Gradient Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold/10 rounded-full blur-[140px]" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <Badge variant="gold" icon={<Sparkles className="w-3.5 h-3.5" />} className="mb-6 animate-fade-in text-[10px] sm:text-xs">
            {heroSettings.badgeText || 'ESTABLISHED 1970 • 55 YEARS OF EXCELLENCE'}
          </Badge>

          <h1 className="font-display text-3xl xs:text-4xl sm:text-7xl lg:text-8xl font-medium text-primary mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05] tracking-tight">
            {heroSettings.highlightTitle || 'Ancient Wisdom.'}<br />
            <span className="italic font-light gold-gradient-text">
              {heroSettings.headline || 'Modern Healing.'}
            </span>
          </h1>

          <p className="font-sans text-base sm:text-xl text-text-secondary mb-12 max-w-2xl leading-relaxed">
            {heroSettings.subtitle || 'Susrutha embodies the intersection of authentic 55-year Ayurvedic medical mastery and ultra-luxury hospitality, offering transformative journeys for body, mind, and spirit.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link href={heroSettings.ctaLink || '/booking'} className="w-full sm:w-auto">
              <Button variant="gold" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                {heroSettings.ctaText || 'START YOUR JOURNEY'}
              </Button>
            </Link>
            <Link href={heroSettings.secondaryCtaLink || '/treatments'} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" icon={<Play className="w-4 h-4 fill-current" />}>
                {heroSettings.secondaryCtaText || 'EXPLORE RITUALS'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: HERITAGE & LEGACY */}
      <section className="px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <Badge variant="mahogany" className="mb-4">OUR HERITAGE</Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-primary mb-6 leading-tight">
              Fifty-Five Years of Timeless Tradition
            </h2>
            <p className="font-sans text-text-secondary text-base sm:text-lg mb-8 leading-relaxed">
              Founded in 1970 by Dr. Ananda Varma, Susrutha has evolved from an ancestral apothecary into a world-leading medical sanctuary. Our lineage is built on three generations of clinical rigor, botanical purity, and multi-generational trust.
            </p>

            <div className="grid grid-cols-2 gap-8 w-full mb-10 pt-4 border-t border-primary/10">
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-1">1970</div>
                <div className="text-xs font-sans font-bold uppercase tracking-widest text-bronze">FOUNDING YEAR</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-1">120K+</div>
                <div className="text-xs font-sans font-bold uppercase tracking-widest text-bronze">HEALED SOULS</div>
              </div>
            </div>

            <Link href="/heritage">
              <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                LEARN ABOUT OUR ROOTS
              </Button>
            </Link>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl border-4 border-surface-card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI8LVoaxSDbPGCljdyi2UpRyIkg-0862ktNI6Y2SdqNsw4Sgvi1AJq8ujtcgj2egMs-Zs-TBqpjg2TvwM6huvkciV7wbhqKQ3qmP525wcTHWf68BSuAZLzWSPky9k1auH_nkk8LlIjquAznsvHR0uVoFBA2amOUIFNhZFTXE8tYFMhFtP8v5H6AxKnaZy6XEqmMQD5V_Au1ILVIFlJALfa9lXcz4yj2RBQ8qfrvznRRnvwFPF1OwYtdPKMeyx16424BhNrTM4FDgH5"
                alt="Ayurvedic Master sorting herbs"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Quote Badge */}
            <div className="absolute -bottom-8 -left-6 sm:-left-8 glass-panel bg-surface-card rounded-3xl p-6 sm:p-8 max-w-sm shadow-2xl border border-gold/30 hidden sm:block">
              <p className="font-display text-lg italic text-primary leading-snug">
                &quot;Health is not merely the absence of disease, but the vibrant presence of bodily vitality and inner bliss.&quot;
              </p>
              <span className="block mt-3 text-xs font-sans font-bold text-bronze uppercase tracking-wider">
                — Dr. Ananda Varma, Founder
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HEALING JOURNEY TIMELINE */}
      <section className="px-6 sm:px-12 md:px-20 bg-surface-elevated py-24 border-y border-primary/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Badge variant="gold" className="mb-4">THE SUSRUTHA METHOD</Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-primary mb-6">
            The Path to Wholeness
          </h2>
          <p className="font-sans text-text-secondary max-w-xl text-base mb-12">
            Every guest undergoes a structured 4-step diagnostic and therapeutic journey tailored precisely to their metabolic blueprint.
          </p>

          <Timeline steps={timelineSteps} activeStep={selectedStep} onStepClick={(idx) => setSelectedStep(idx)} />

          <Card variant="glass" className="mt-8 max-w-2xl text-left border-gold/30">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="gold">STEP {timelineSteps[selectedStep].number}</Badge>
              <h4 className="font-display text-2xl font-bold text-primary">
                {timelineSteps[selectedStep].title}
              </h4>
            </div>
            <p className="font-sans text-text-secondary text-sm leading-relaxed">
              {timelineSteps[selectedStep].description}
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 4: SIGNATURE HEALING RITUALS */}
      <section className="px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
            <div>
              <Badge variant="mahogany" className="mb-3">CURATED THERAPIES</Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-primary">
                Signature Healing Rituals
              </h2>
            </div>
            <Link href="/treatments">
              <Button variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                VIEW ALL TREATMENTS
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {treatments.slice(0, 3).map((treatment, idx) => {
              const id = treatment.id || treatment._id || `tr-${idx}`;
              const title = treatment.title || treatment.name || 'Ayurvedic Treatment';
              const image = treatment.image || treatment.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80';
              const price = treatment.price || 3500;
              const duration = treatment.duration || `${treatment.durationMinutes || 60} Mins`;
              const desc = treatment.description || treatment.shortDescription || 'Authentic classical Ayurvedic treatment.';
              const dosha = treatment.dosha || 'Vedic Protocol';

              return (
                <Card
                  key={id}
                  variant="default"
                  className="group cursor-pointer flex flex-col justify-between border-primary/10 hover:border-gold/50"
                  onClick={() => setActiveTreatmentModal(treatment)}
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="gold">{dosha}</Badge>
                      </div>
                    </div>

                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze mb-2 block">
                      {treatment.category || 'Therapy'}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-primary mb-3">
                      {title}
                    </h3>
                    <p className="font-sans text-text-secondary text-sm line-clamp-2 leading-relaxed mb-6">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-primary/10 flex items-center justify-between text-xs font-sans font-semibold text-primary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gold" /> {duration}
                    </span>
                    <span className="font-display text-lg font-bold text-primary">
                      {formatCurrency(price)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE US (BENTO GRID) */}
      <section className="px-6 sm:px-12 md:px-20 bg-primary text-surface py-24 rounded-[48px] mx-4 sm:mx-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <Badge variant="gold" className="mb-4">THE SUSRUTHA DIFFERENCE</Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-surface mb-6">
              Crafting an Ecosystem of Total Wellness
            </h2>
            <p className="font-sans text-surface/70 text-base">
              We blend ancient clinical protocols with modern luxury hospitality to restore harmony to your mind, body, and soul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel-dark p-8 rounded-[32px] flex flex-col justify-between hover:border-gold transition-all">
              <ShieldCheck className="w-10 h-10 text-gold mb-6" />
              <div>
                <h4 className="font-display text-2xl font-bold text-surface mb-3">Evidence-Based</h4>
                <p className="font-sans text-surface/70 text-xs leading-relaxed">
                  Integrating clinical pulse diagnostics with contemporary medical research for verifiable outcomes.
                </p>
              </div>
            </div>

            <div className="glass-panel-dark p-8 rounded-[32px] flex flex-col justify-between hover:border-gold transition-all">
              <Sparkles className="w-10 h-10 text-gold mb-6" />
              <div>
                <h4 className="font-display text-2xl font-bold text-surface mb-3">Pure Sourcing</h4>
                <p className="font-sans text-surface/70 text-xs leading-relaxed">
                  100% organic, hand-harvested medicinal herbs distilled from our private Himalayan botanical gardens.
                </p>
              </div>
            </div>

            <div className="glass-panel-dark p-8 rounded-[32px] flex flex-col justify-between hover:border-gold transition-all">
              <Award className="w-10 h-10 text-gold mb-6" />
              <div>
                <h4 className="font-display text-2xl font-bold text-surface mb-3">Ultra-Luxury</h4>
                <p className="font-sans text-surface/70 text-xs leading-relaxed">
                  Peaceful sanctuary retreats crafted with natural stone, wood, and serene architectural design.
                </p>
              </div>
            </div>

            <div className="glass-panel-dark p-8 rounded-[32px] flex flex-col justify-between hover:border-gold transition-all">
              <Heart className="w-10 h-10 text-gold mb-6" />
              <div>
                <h4 className="font-display text-2xl font-bold text-surface mb-3">Master Lineage</h4>
                <p className="font-sans text-surface/70 text-xs leading-relaxed">
                  55+ years of accumulated medicinal wisdom passed through three generations of master physicians.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MEET OUR DOCTORS */}
      <section className="px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="mahogany" className="mb-3">MEDICAL LEADERSHIP</Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-primary mb-4">
              The Custodians of Wisdom
            </h2>
            <p className="font-sans text-text-secondary text-sm">
              Meet our team of world-renowned Ayurvedic physicians dedicated to your personal health transformation.
            </p>
          </div>

          <DoctorCarousel doctors={doctors} autoPlayInterval={4000} />
        </div>
      </section>

      {/* TREATMENT DETAIL MODAL */}
      {activeTreatmentModal && (
        <Modal
          isOpen={!!activeTreatmentModal}
          onClose={() => setActiveTreatmentModal(null)}
          title={activeTreatmentModal.title || activeTreatmentModal.name || 'Therapy Detail'}
          maxWidth="xl"
        >
          <div className="flex flex-col gap-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <img
                src={activeTreatmentModal.image || activeTreatmentModal.coverImage || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80'}
                alt={activeTreatmentModal.title || activeTreatmentModal.name || 'Treatment'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze">
                  {activeTreatmentModal.category || 'Panchakarma'}
                </span>
                <div className="font-display text-2xl font-bold text-primary">
                  {formatCurrency(activeTreatmentModal.price || 3500)}
                </div>
              </div>
              <Badge variant="gold">{activeTreatmentModal.duration || `${activeTreatmentModal.durationMinutes || 60} Mins`}</Badge>
            </div>

            <p className="font-sans text-text-secondary text-sm leading-relaxed">
              {activeTreatmentModal.description || activeTreatmentModal.fullDescription || activeTreatmentModal.shortDescription}
            </p>

            <div>
              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-primary mb-3">
                KEY THERAPEUTIC BENEFITS
              </h5>
              <div className="space-y-2">
                {(activeTreatmentModal.benefits || ['Cellular Detoxification', 'Nervous System Relaxation', 'Metabolic Reset']).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-sans text-text-primary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-primary/10 flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setActiveTreatmentModal(null)}>
                CLOSE
              </Button>
              <Link href={`/booking?treatment=${encodeURIComponent(activeTreatmentModal.title || activeTreatmentModal.name || '')}`}>
                <Button variant="gold" icon={<ArrowRight className="w-4 h-4" />}>
                  BOOK THIS RITUAL
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
