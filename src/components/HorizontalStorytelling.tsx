'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Flame, HeartPulse, Droplets, Smile } from 'lucide-react';

const stages = [
  {
    step: '01',
    icon: Leaf,
    title: 'Ancient Vedic Lineage',
    subtitle: '5000 Years of Sacred Healing Wisdom',
    description: 'Rooted in the timeless Atharvaveda and Susrutha Samhita, passing uninterrupted through documented Vaidya lineages.',
    image: '/images/hero-ayurveda.jpg',
    tag: 'Heritage',
  },
  {
    step: '02',
    icon: Flame,
    title: 'Organically Cultivated Herbs',
    subtitle: 'Purity in Every Herbal Formulation',
    description: 'Freshly harvested herbs from pristine Western Ghats forests, prepared in strict accord with classical Rasashastra standards.',
    image: '/images/panchakarma.jpg',
    tag: 'Alchemy',
  },
  {
    step: '03',
    icon: Droplets,
    title: 'Medicated Oil Preparation',
    subtitle: 'Classical Taila Paka Vidhi',
    description: 'Slow-decocted medicated oils brewed over woodfires for days to infuse organic lipid layers with biological active compounds.',
    image: '/images/kerala-nature.jpg',
    tag: 'Therapeutics',
  },
  {
    step: '04',
    icon: HeartPulse,
    title: 'Nadi Pariksha Diagnosis',
    subtitle: 'Precision Prakriti & Dosha Mapping',
    description: 'Comprehensive pulse evaluation by senior Ayurvedic directors to pinpoint root imbalances across Vata, Pitta, and Kapha.',
    image: '/images/doctor-portrait.jpg',
    tag: 'Diagnostics',
  },
  {
    step: '05',
    icon: ShieldCheck,
    title: 'Panchakarma Detoxification',
    subtitle: '5-Stage Clinical Purification',
    description: 'Supervised Abhyangam, Shirodhara, and Vasti procedures in specialized male and female therapy suites.',
    image: '/images/panchakarma.jpg',
    tag: 'Purification',
  },
  {
    step: '06',
    icon: Smile,
    title: 'Rasayana Rejuvenation',
    subtitle: 'Cellular Restoration & Longevity',
    description: 'Post-cure dietary regimen, herbal tonic supplementation, and yoga to lock in immunity and vitality.',
    image: '/images/hero-ayurveda.jpg',
    tag: 'Recovery',
  },
];

export default function HorizontalStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const index = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      setActiveStage(index);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-[#120A0B] text-ivory-50">
      {/* Sticky Fullscreen Storytelling Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Visual Layer with Smooth Crossfade */}
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.step}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeStage === idx ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={stage.image} alt={stage.title} className="h-full w-full object-cover opacity-20 filter blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120A0B] via-[#120A0B]/80 to-[#120A0B]/40" />
          </motion.div>
        ))}

        {/* Content Container */}
        <div className="container-wide section-pad relative z-10 grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Progress Timeline */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-ochre/40 bg-ochre-900/40 px-3.5 py-1 text-xs font-bold text-ochre-200 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-ochre" /> Healing Arc Journey
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ivory-50 leading-tight">
              The Path to Wholeness
            </h2>
            <p className="text-sm text-ivory-200/80 leading-relaxed">
              Scroll through the stages of authentic Ayurvedic restoration, from ancient Vedic principles to complete Rasayana recovery.
            </p>

            {/* Stage Indicators */}
            <div className="space-y-3 pt-4">
              {stages.map((st, i) => (
                <div
                  key={st.step}
                  className={`flex items-center gap-4 cursor-pointer transition-all ${
                    activeStage === i ? 'text-ochre opacity-100 font-bold translate-x-2' : 'text-ivory-300/50 hover:text-ivory-200'
                  }`}
                  onClick={() => setActiveStage(i)}
                >
                  <span className="text-xs font-mono">{st.step}</span>
                  <div className={`h-0.5 transition-all ${activeStage === i ? 'w-12 bg-ochre' : 'w-4 bg-ivory-300/30'}`} />
                  <span className="text-sm">{st.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Card Card Showcase */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-ochre/30 bg-[#1C1214]/80 backdrop-blur-xl p-8 sm:p-12 shadow-soft-lg grid gap-8 md:grid-cols-2 items-center"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-display font-bold text-ochre/40">{stages[activeStage].step}</span>
                  <span className="rounded-full bg-ochre/20 px-3 py-1 text-xs font-semibold text-ochre">
                    {stages[activeStage].tag}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ivory-50">
                  {stages[activeStage].title}
                </h3>
                <p className="text-sm font-semibold text-ochre-200">
                  {stages[activeStage].subtitle}
                </p>
                <p className="text-sm text-ivory-200/90 leading-relaxed">
                  {stages[activeStage].description}
                </p>
              </div>

              <div className="relative aspect-square overflow-hidden rounded-2xl border border-ochre/30 shadow-spa-glow">
                <img
                  src={stages[activeStage].image}
                  alt={stages[activeStage].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120A0B]/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
