'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Flame, HeartPulse, Droplets, Smile, ShieldCheck, Sun } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const documentaryScenes = [
  {
    chapter: 'CHAPTER 01',
    title: 'The Origin of Ayurveda',
    tagline: '5,000 Years of Sacred Vedic Wisdom',
    description: 'Born in the ancient Vedic era, Ayurveda is the science of life (Ayus) and knowledge (Veda) — passing uninterrupted through documented Vaidya lineages in Kerala.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-warm-sunlight-shining-through-green-leaves-41556-large.mp4',
    poster: '/images/hero-ayurveda.jpg',
    icon: Leaf,
  },
  {
    chapter: 'CHAPTER 02',
    title: 'The Medicinal Forest',
    tagline: 'Pristine Bio-Flora of the Western Ghats',
    description: 'Deep in the tropical forest mist, sacred plants absorb sunlight, soil minerals, and pure mountain streams to develop high biological potency.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-sunlight-shining-through-forest-trees-41558-large.mp4',
    poster: '/images/kerala-nature.jpg',
    icon: Sun,
  },
  {
    chapter: 'CHAPTER 03',
    title: 'Sacred Ancient Herbs',
    tagline: 'Tulsi, Neem, Turmeric & Classical Botanicals',
    description: 'Organically harvested leaves, roots, and barks selected according to seasonal potency (Ritu Charya) to formulate classical remedies.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-green-leaves-with-drops-of-water-41555-large.mp4',
    poster: '/images/panchakarma.jpg',
    icon: Sparkles,
  },
  {
    chapter: 'CHAPTER 04',
    title: 'Medicated Oil Preparation',
    tagline: 'Classical Taila Paka Vidhi Brews',
    description: 'Decocted for days over controlled woodfires in copper vessels, embedding biological actives deep into organic lipid carriers.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-warm-sunlight-shining-through-green-leaves-41556-large.mp4',
    poster: '/images/hero-ayurveda.jpg',
    icon: Flame,
  },
  {
    chapter: 'CHAPTER 05',
    title: 'Nadi Pariksha Diagnosis',
    tagline: 'Precision Pulse & Prakriti Mapping',
    description: 'Senior Ayurvedic physicians evaluate the radial pulse to decode unique Vata, Pitta, and Kapha constitution and root metabolic imbalances.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-sunlight-shining-through-forest-trees-41558-large.mp4',
    poster: '/images/doctor-portrait.jpg',
    icon: HeartPulse,
  },
  {
    chapter: 'CHAPTER 06',
    title: 'Healing Therapies',
    tagline: 'Supervised Panchakarma Purification',
    description: 'Classical Abhyangam, Shirodhara, and Vasti administered by certified therapists in dedicated male and female treatment suites.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-green-leaves-with-drops-of-water-41555-large.mp4',
    poster: '/images/panchakarma.jpg',
    icon: Droplets,
  },
  {
    chapter: 'CHAPTER 07',
    title: 'Inpatient Recovery Sanctuary',
    tagline: '40-Bed Wards & Private Ayur Village Cottages',
    description: 'A serene healing retreat in Kattakada where post-treatment rest, organic dietary regimens, and daily physician monitoring restore resilience.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-warm-sunlight-shining-through-green-leaves-41556-large.mp4',
    poster: '/images/kerala-nature.jpg',
    icon: ShieldCheck,
  },
  {
    chapter: 'CHAPTER 08',
    title: 'Radiant Healthy Living',
    tagline: 'Cellular Rasayana & Enduring Vitality',
    description: 'Achieving permanent equilibrium of mind, body, and spirit — returning to life with renewed clarity, strength, and immune longevity.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-sunlight-shining-through-forest-trees-41558-large.mp4',
    poster: '/images/hero-ayurveda.jpg',
    icon: Smile,
  },
];

export default function TabascoDocumentaryStory() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=1600',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.min(
            documentaryScenes.length - 1,
            Math.floor(self.progress * documentaryScenes.length)
          );
          setActiveScene(index);
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  const current = documentaryScenes[activeScene];
  const IconComp = current.icon;

  return (
    <section
      ref={triggerRef}
      style={{ backgroundColor: '#160506', color: '#FFFFFF' }}
      className="relative w-full overflow-hidden font-body py-0"
    >
      <div className="relative w-full min-h-screen flex items-center justify-center py-6 sm:py-10">
        {/* Looping Scene Background Videos with Smooth Crossfade */}
        {documentaryScenes.map((scene, idx) => (
          <motion.div
            key={scene.chapter}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: activeScene === idx ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-30 scale-105"
              poster={scene.poster}
            >
              <source src={scene.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#160506] via-[#160506]/85 to-transparent" />
          </motion.div>
        ))}

        {/* Content Overlay Grid */}
        <div className="container-wide section-pad relative z-10 grid gap-8 lg:gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Documentary Index & Navigation */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#FCAB28] shadow-ochre-glow shrink-0" />
              <span className="text-xs uppercase tracking-[0.28em] font-extrabold text-[#FCAB28] font-display">
                The Documentary Arc
              </span>
              <span className="h-px w-8 bg-gradient-to-r from-[#FCAB28]/60 to-transparent" />
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              A Journey Through Classical Healing.
            </h2>
            <p className="text-sm sm:text-base text-ivory-200 leading-relaxed font-light">
              Scroll to unfold the 8 chapters of authentic Kerala Ayurveda — from ancient roots to full Rasayana recovery.
            </p>

            {/* Chapter List */}
            <div className="space-y-2 pt-2">
              {documentaryScenes.map((sc, i) => (
                <div
                  key={sc.chapter}
                  onClick={() => setActiveScene(i)}
                  className={`flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                    activeScene === i
                      ? 'text-ochre-400 font-bold translate-x-2'
                      : 'text-ivory-300/40 hover:text-ivory-200'
                  }`}
                >
                  <span className="text-xs font-mono tracking-widest">{sc.chapter}</span>
                  <div className={`h-0.5 transition-all duration-300 ${activeScene === i ? 'w-10 bg-ochre-400' : 'w-3 bg-ivory-300/20'}`} />
                  <span className="text-sm font-medium">{sc.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Documentary Feature Card */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundColor: '#280A0C', borderColor: 'rgba(252, 171, 40, 0.4)' }}
              className="rounded-3xl border backdrop-blur-xl p-6 sm:p-10 shadow-2xl grid gap-6 md:grid-cols-2 items-center"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-ochre-300">
                    {current.chapter}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ochre/20 text-ochre-400">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {current.title}
                </h3>
                <p className="text-sm font-semibold text-ochre-200">
                  {current.tagline}
                </p>
                <p className="text-sm text-ivory-200 leading-relaxed font-light">
                  {current.description}
                </p>
              </div>

              {/* Scene Frame */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ochre/40 shadow-ochre-glow bg-[#1E0507]">
                <img
                  src={current.poster}
                  alt={current.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-ayurveda.jpg';
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#160506]/80 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
